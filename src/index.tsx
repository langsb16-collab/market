import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  GITHUB_TOKEN: string
  GIST_ID: string
}

const app = new Hono<{ Bindings: Bindings }>()

const GIST_FILENAME = 'eventbet-issues.json'

// ===== PATCH START: Gist helpers (add above routes) =====
type GistIssuesData = { version: number; updatedAt: string; items: any[] }

function nowIso() {
  return new Date().toISOString()
}

function toNum(v: any, fallback = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function requireEnv(c: any) {
  const token = c.env.GITHUB_TOKEN
  const gistId = c.env.GIST_ID
  if (!token) throw new Error('GITHUB_TOKEN not configured')
  if (!gistId) throw new Error('GIST_ID not configured')
  return { token, gistId }
}

/**
 * Read issues JSON from Gist via GitHub API (supports private gist & consistent schema)
 * Keeps your existing schema: { version, updatedAt, items }
 */
async function readGistIssues(c: any): Promise<GistIssuesData> {
  const { token, gistId } = requireEnv(c)

  const r = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      Authorization: `token ${token}`,
      'User-Agent': 'cashiq-worker',
      Accept: 'application/vnd.github+json',
    },
  })

  // 기존 동작 유지: 실패하면 빈 배열 반환
  if (!r.ok) return { version: 1, updatedAt: nowIso(), items: [] }

  const gist = (await r.json()) as any
  const file = gist?.files?.[GIST_FILENAME]
  const content = file?.content

  if (!content) return { version: 1, updatedAt: nowIso(), items: [] }

  try {
    const parsed = JSON.parse(content)
    // 과거 호환: 배열만 저장된 경우
    if (Array.isArray(parsed)) {
      return { version: 1, updatedAt: nowIso(), items: parsed }
    }
    // 현재 스키마
    return {
      version: toNum(parsed?.version, 1),
      updatedAt: parsed?.updatedAt || nowIso(),
      items: Array.isArray(parsed?.items) ? parsed.items : [],
    }
  } catch {
    return { version: 1, updatedAt: nowIso(), items: [] }
  }
}

/**
 * Write issues JSON to Gist via GitHub API (PATCH)
 */
async function writeGistIssues(c: any, data: GistIssuesData): Promise<void> {
  const { token, gistId } = requireEnv(c)

  const body = {
    files: {
      [GIST_FILENAME]: {
        content: JSON.stringify(
          {
            version: toNum(data.version, 1),
            updatedAt: data.updatedAt || nowIso(),
            items: Array.isArray(data.items) ? data.items : [],
          },
          null,
          2
        ),
      },
    },
  }

  const r = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `token ${token}`,
      'User-Agent': 'cashiq-worker',
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
    },
    body: JSON.stringify(body),
  })

  if (!r.ok) {
    const t = await r.text().catch(() => '')
    throw new Error(`GitHub Gist write failed: ${r.status} ${t}`)
  }
}
// ===== PATCH END: Gist helpers =====

// CORS for API
app.use('/api/*', cors())

// Serve static files - MUST be before API routes to ensure proper file serving
app.get('/static/*', serveStatic({ root: './' }))
app.get('/admin/*', serveStatic({ root: './' }))

// ===== PATCH: replace GET /api/issues =====
app.get('/api/issues', async (c) => {
  try {
    const data = await readGistIssues(c)
    return c.json({ success: true, issues: data.items || [] })
  } catch (error) {
    // 기존 정책 유지
    return c.json({ success: true, issues: [] })
  }
})

// ===== PATCH: POST /api/issues with yes_bet/no_bet support =====
app.post('/api/issues', async (c) => {
  try {
    const body = await c.req.json()
    
    // 1) 기존 데이터 로드
    const data = await readGistIssues(c)
    const items = data.items || []
    
    // 2) 새 이슈 만들기
    const initial_usdt = toNum(body.initial_usdt ?? body.initialBet ?? 60, 60)
    const yes_bet = toNum(body.yes_bet, Math.floor(initial_usdt * 0.5))
    const no_bet = toNum(body.no_bet, Math.floor(initial_usdt * 0.5))
    
    const newIssue = {
      id: `iss_${Date.now()}`,
      title_ko: body.title_ko || '',
      title_en: body.title_en || '',
      title_zh: body.title_zh || '',
      title_ja: body.title_ja || '',
      category: body.category || 'politics',
      initial_usdt,
      yes_bet,
      no_bet,
      expire_days: body.expire_days || 7,
      expire_date: new Date(Date.now() + (body.expire_days || 7) * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      createdAt: nowIso(),
      updatedAt: nowIso()
    }
    
    // 3) items에 추가
    const nextItems = [newIssue, ...items]
    
    // 4) Gist 저장
    await writeGistIssues(c, {
      version: toNum(data.version, 1) + 1,
      updatedAt: nowIso(),
      items: nextItems,
    })
    
    // 5) 응답 (형식 유지)
    return c.json({ success: true, issue: newIssue })
  } catch (error: any) {
    return c.json({ success: false, error: error?.message || String(error) }, 500)
  }
})

// ===== PATCH: replace PUT /api/issues/:id body =====
app.put('/api/issues/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    const payload = await c.req.json().catch(() => ({}))

    const data = await readGistIssues(c)
    const items = data.items || []

    const idx = items.findIndex((x: any) => x?.id === id)
    if (idx === -1) return c.json({ success: false, error: 'Not found' }, 404)

    const prev = items[idx]

    // ✅ 필요한 필드만 안전하게 갱신 (원하면 추가 가능)
    const next = {
      ...prev,
      category: payload.category ?? payload.categoryKey ?? payload.category_slug ?? prev.category,
      title_ko: payload.title_ko ?? prev.title_ko,
      title_en: payload.title_en ?? prev.title_en,
      title_zh: payload.title_zh ?? prev.title_zh,
      title_ja: payload.title_ja ?? prev.title_ja,
      expire_date: payload.expire_date ?? payload.resolve_date ?? prev.expire_date,
      initial_usdt: payload.initial_usdt !== undefined ? toNum(payload.initial_usdt, prev.initial_usdt ?? 60) : (prev.initial_usdt ?? 60),
      yes_bet: payload.yes_bet !== undefined ? toNum(payload.yes_bet, prev.yes_bet ?? 0) : (prev.yes_bet ?? 0),
      no_bet: payload.no_bet !== undefined ? toNum(payload.no_bet, prev.no_bet ?? 0) : (prev.no_bet ?? 0),
      updatedAt: nowIso(),
    }

    const nextItems = [...items]
    nextItems[idx] = next

    await writeGistIssues(c, {
      version: toNum(data.version, 1) + 1,
      updatedAt: nowIso(),
      items: nextItems,
    })

    return c.json({ success: true, issue: next })
  } catch (error: any) {
    return c.json({ success: false, error: error?.message || String(error) }, 500)
  }
})

// ===== PATCH: add DELETE /api/issues/:id =====
app.delete('/api/issues/:id', async (c) => {
  try {
    const id = c.req.param('id')

    const data = await readGistIssues(c)
    const items = data.items || []

    const before = items.length
    const nextItems = items.filter((x: any) => x?.id !== id)

    if (nextItems.length === before) {
      return c.json({ success: false, error: 'Not found' }, 404)
    }

    await writeGistIssues(c, {
      version: toNum(data.version, 1) + 1,
      updatedAt: nowIso(),
      items: nextItems,
    })

    return c.json({ success: true, deletedId: id })
  } catch (error: any) {
    return c.json({ success: false, error: error?.message || String(error) }, 500)
  }
})

// Batch POST (기존 로직 유지하되 헬퍼 사용)
app.post('/api/issues/batch', async (c) => {
  try {
    const body = await c.req.json()
    const { issues: batchIssues } = body
    
    if (!Array.isArray(batchIssues) || batchIssues.length === 0) {
      return c.json({ success: false, error: 'Invalid batch data' }, 400)
    }
    
    const data = await readGistIssues(c)
    const items = data.items || []
    
    const newIssues = batchIssues.map((issue: any) => {
      const initial_usdt = toNum(issue.initial_usdt, 100000)
      const yes_bet = toNum(issue.yes_bet, Math.floor(initial_usdt * 0.5))
      const no_bet = toNum(issue.no_bet, Math.floor(initial_usdt * 0.5))
      
      return {
        id: `iss_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        title_ko: issue.title_ko || '',
        title_en: issue.title_en || '',
        title_zh: issue.title_zh || '',
        title_ja: issue.title_ja || '',
        category: issue.category || 'politics',
        initial_usdt,
        yes_bet,
        no_bet,
        expire_days: issue.expire_days || 25,
        expire_date: new Date(Date.now() + (issue.expire_days || 25) * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        createdAt: nowIso(),
        updatedAt: nowIso()
      }
    })
    
    const nextItems = [...newIssues, ...items]
    
    await writeGistIssues(c, {
      version: toNum(data.version, 1) + 1,
      updatedAt: nowIso(),
      items: nextItems,
    })
    
    return c.json({ success: true, count: newIssues.length })
  } catch (error: any) {
    return c.json({ success: false, error: error?.message || String(error) }, 500)
  }
})

// Serve static files - fallback for other paths
app.use('/*', serveStatic({ root: './' }))

export default app
