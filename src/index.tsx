import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// Helper functions
function nowIso() {
  return new Date().toISOString()
}

function toNum(v: any, fallback = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

// CORS for API
app.use('/api/*', cors())

// API routes only - no static file handling in Worker

// GET /api/issues - Fetch all issues with outcomes
app.get('/api/issues', async (c) => {
  try {
    const db = c.env.DB
    
    // Fetch all active issues
    const { results } = await db.prepare(`
      SELECT * FROM issues 
      WHERE status = 'active' 
      ORDER BY created_at DESC
    `).all()
    
    // Add outcomes to each issue
    const issues = results.map((issue: any) => {
      const totalBet = (issue.yes_bet || 0) + (issue.no_bet || 0)
      const probYes = totalBet > 0 ? issue.yes_bet / totalBet : 0.5
      const probNo = totalBet > 0 ? issue.no_bet / totalBet : 0.5
      
      return {
        ...issue,
        outcomes: [
          {
            id: `${issue.id}_yes`,
            name_ko: '예',
            name_en: 'Yes',
            name_zh: '是',
            name_ja: 'はい',
            name: '예',
            probability: probYes,
            total_bets: issue.yes_bet || 0
          },
          {
            id: `${issue.id}_no`,
            name_ko: '아니오',
            name_en: 'No',
            name_zh: '否',
            name_ja: 'いいえ',
            name: '아니오',
            probability: probNo,
            total_bets: issue.no_bet || 0
          }
        ]
      }
    })
    
    return c.json({ success: true, issues })
  } catch (error: any) {
    console.error('Error fetching issues:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// POST /api/issues - Create new issue
app.post('/api/issues', async (c) => {
  try {
    const body = await c.req.json()
    const db = c.env.DB
    
    // Calculate values
    const initial_usdt = toNum(body.initial_usdt ?? 60, 60)
    const randomYesRatio = body.yes_bet === undefined ? (0.3 + Math.random() * 0.4) : 0.5
    const yes_bet = toNum(body.yes_bet, Math.floor(initial_usdt * randomYesRatio))
    const no_bet = toNum(body.no_bet, initial_usdt - yes_bet)
    const totalBet = yes_bet + no_bet
    const probYes = totalBet > 0 ? yes_bet / totalBet : 0.5
    const probNo = totalBet > 0 ? no_bet / totalBet : 0.5
    
    const id = `iss_${Date.now()}`
    const expire_days = toNum(body.expire_days, 7)
    const expire_date = new Date(Date.now() + expire_days * 24 * 60 * 60 * 1000).toISOString()
    const total_volume = initial_usdt * 10000
    const participants = Math.floor(initial_usdt * 100 + Math.random() * 100)
    
    // Insert into D1
    await db.prepare(`
      INSERT INTO issues (
        id, title_ko, title_en, title_zh, title_ja,
        description_ko, description_en, description_zh, description_ja,
        resolution_criteria_ko, resolution_criteria_en, resolution_criteria_zh, resolution_criteria_ja,
        category, category_slug, initial_usdt, yes_bet, no_bet,
        expire_days, expire_date, end_date, status, created_at, updated_at,
        total_volume, participants
      ) VALUES (
        ?1, ?2, ?3, ?4, ?5,
        ?6, ?7, ?8, ?9,
        ?10, ?11, ?12, ?13,
        ?14, ?15, ?16, ?17, ?18,
        ?19, ?20, ?21, ?22, ?23, ?24,
        ?25, ?26
      )
    `).bind(
      id,
      body.title_ko || '',
      body.title_en || '',
      body.title_zh || '',
      body.title_ja || '',
      body.description_ko || '',
      body.description_en || '',
      body.description_zh || '',
      body.description_ja || '',
      body.resolution_criteria_ko || '공식 결과 확인',
      body.resolution_criteria_en || 'Verify official result',
      body.resolution_criteria_zh || '确认官方结果',
      body.resolution_criteria_ja || '公式結果確認',
      body.category || 'politics',
      body.category || 'politics',
      initial_usdt,
      yes_bet,
      no_bet,
      expire_days,
      expire_date,
      expire_date,
      'active',
      nowIso(),
      nowIso(),
      total_volume,
      participants
    ).run()
    
    // Return created issue with outcomes
    const newIssue = {
      id,
      title_ko: body.title_ko || '',
      title_en: body.title_en || '',
      title_zh: body.title_zh || '',
      title_ja: body.title_ja || '',
      description_ko: body.description_ko || '',
      description_en: body.description_en || '',
      description_zh: body.description_zh || '',
      description_ja: body.description_ja || '',
      resolution_criteria_ko: body.resolution_criteria_ko || '공식 결과 확인',
      resolution_criteria_en: body.resolution_criteria_en || 'Verify official result',
      resolution_criteria_zh: body.resolution_criteria_zh || '确认官方结果',
      resolution_criteria_ja: body.resolution_criteria_ja || '公式結果確認',
      category: body.category || 'politics',
      category_id: 0,
      category_slug: body.category || 'politics',
      initial_usdt,
      yes_bet,
      no_bet,
      expire_days,
      expire_date,
      end_date: expire_date,
      status: 'active',
      created_at: nowIso(),
      updated_at: nowIso(),
      total_volume,
      participants,
      outcomes: [
        {
          id: `${id}_yes`,
          name_ko: '예',
          name_en: 'Yes',
          name_zh: '是',
          name_ja: 'はい',
          name: '예',
          probability: probYes,
          total_bets: yes_bet
        },
        {
          id: `${id}_no`,
          name_ko: '아니오',
          name_en: 'No',
          name_zh: '否',
          name_ja: 'いいえ',
          name: '아니오',
          probability: probNo,
          total_bets: no_bet
        }
      ]
    }
    
    return c.json({ success: true, issue: newIssue })
  } catch (error: any) {
    console.error('Error creating issue:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// PATCH /api/issues/:id - Update issue
app.patch('/api/issues/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const db = c.env.DB
    
    // Calculate values
    const initial_usdt = toNum(body.initial_usdt ?? 60, 60)
    const yes_bet = toNum(body.yes_bet, initial_usdt * 0.5)
    const no_bet = toNum(body.no_bet, initial_usdt - yes_bet)
    const totalBet = yes_bet + no_bet
    const probYes = totalBet > 0 ? yes_bet / totalBet : 0.5
    const probNo = totalBet > 0 ? no_bet / totalBet : 0.5
    
    const expire_days = toNum(body.expire_days, 7)
    const expire_date = new Date(Date.now() + expire_days * 24 * 60 * 60 * 1000).toISOString()
    const total_volume = initial_usdt * 10000
    const participants = Math.floor(initial_usdt * 100 + Math.random() * 100)
    
    // Update in D1
    await db.prepare(`
      UPDATE issues SET
        title_ko = ?1,
        title_en = ?2,
        title_zh = ?3,
        title_ja = ?4,
        category = ?5,
        category_slug = ?6,
        initial_usdt = ?7,
        yes_bet = ?8,
        no_bet = ?9,
        expire_days = ?10,
        expire_date = ?11,
        end_date = ?12,
        updated_at = ?13,
        total_volume = ?14,
        participants = ?15
      WHERE id = ?16
    `).bind(
      body.title_ko || '',
      body.title_en || '',
      body.title_zh || '',
      body.title_ja || '',
      body.category || 'politics',
      body.category || 'politics',
      initial_usdt,
      yes_bet,
      no_bet,
      expire_days,
      expire_date,
      expire_date,
      nowIso(),
      total_volume,
      participants,
      id
    ).run()
    
    // Return updated issue with outcomes
    const updatedIssue = {
      id,
      title_ko: body.title_ko || '',
      title_en: body.title_en || '',
      title_zh: body.title_zh || '',
      title_ja: body.title_ja || '',
      category: body.category || 'politics',
      category_slug: body.category || 'politics',
      initial_usdt,
      yes_bet,
      no_bet,
      expire_days,
      expire_date,
      end_date: expire_date,
      status: 'active',
      updated_at: nowIso(),
      total_volume,
      participants,
      outcomes: [
        {
          id: `${id}_yes`,
          name_ko: '예',
          name_en: 'Yes',
          name_zh: '是',
          name_ja: 'はい',
          name: '예',
          probability: probYes,
          total_bets: yes_bet
        },
        {
          id: `${id}_no`,
          name_ko: '아니오',
          name_en: 'No',
          name_zh: '否',
          name_ja: 'いいえ',
          name: '아니오',
          probability: probNo,
          total_bets: no_bet
        }
      ]
    }
    
    return c.json({ success: true, issue: updatedIssue })
  } catch (error: any) {
    console.error('Error updating issue:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// DELETE /api/issues/:id - Delete issue
app.delete('/api/issues/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const db = c.env.DB
    
    await db.prepare(`
      DELETE FROM issues WHERE id = ?
    `).bind(id).run()
    
    return c.json({ success: true, id })
  } catch (error: any) {
    console.error('Error deleting issue:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

export default app
