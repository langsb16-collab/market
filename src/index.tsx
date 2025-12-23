import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  GITHUB_TOKEN: string
  GIST_ID: string
}

const app = new Hono<{ Bindings: Bindings }>()

const GIST_FILENAME = 'eventbet-issues.json'

// CORS for API
app.use('/api/*', cors())

// Serve static files - MUST be before API routes to ensure proper file serving
app.use('/static/*', serveStatic({ root: './' }))
app.use('/admin/*', serveStatic({ root: './' }))

// API Routes - BEFORE any static
app.get('/api/issues', async (c) => {
  try {
    const gistId = c.env.GIST_ID || 'YOUR_GIST_ID_HERE'
    const rawUrl = `https://gist.githubusercontent.com/langsb16-collab/${gistId}/raw/${GIST_FILENAME}`
    const response = await fetch(rawUrl)
    
    if (!response.ok) {
      return c.json({ success: true, issues: [] })
    }
    
    const data = await response.json() as { version: number; updatedAt: string; items: any[] }
    return c.json({ success: true, issues: data.items || [] })
  } catch (error) {
    return c.json({ success: true, issues: [] })
  }
})

app.post('/api/issues', async (c) => {
  try {
    const body = await c.req.json()
    const { title_ko, title_en, title_zh, title_ja, category, initial_usdt, expire_days } = body
    
    const gistId = c.env.GIST_ID || '5543e3d9f6259e02813fe78cc93e2126'
    const token = c.env.GITHUB_TOKEN
    
    if (!token) {
      return c.json({ success: false, error: 'GitHub token not configured' }, 500)
    }
    
    const gistResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'EventBET-App'
      }
    })
    
    let currentIssues: any[] = []
    if (gistResponse.ok) {
      const gistData = await gistResponse.json() as any
      const fileContent = gistData.files[GIST_FILENAME]?.content
      if (fileContent) {
        const parsed = JSON.parse(fileContent)
        currentIssues = parsed.items || []
      }
    }
    
    const newIssue = {
      id: `iss_${Date.now()}`,
      title_ko,
      title_en,
      title_zh,
      title_ja,
      category,
      initial_usdt,
      yes_bet: Math.floor(initial_usdt * 0.5),
      no_bet: Math.floor(initial_usdt * 0.5),
      expire_days,
      expire_date: new Date(Date.now() + (expire_days || 7) * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    currentIssues.unshift(newIssue)
    
    const updateResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'EventBET-App'
      },
      body: JSON.stringify({
        files: {
          [GIST_FILENAME]: {
            content: JSON.stringify({
              version: 1,
              updatedAt: new Date().toISOString(),
              items: currentIssues
            }, null, 2)
          }
        }
      })
    })
    
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      console.error('Gist update failed:', updateResponse.status, errorText)
      return c.json({ success: false, error: `Failed to update Gist: ${updateResponse.status} - ${errorText}` }, 500)
    }
    
    return c.json({ success: true, id: newIssue.id, issue: newIssue })
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500)
  }
})

app.put('/api/issues/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    
    const gistId = c.env.GIST_ID || 'YOUR_GIST_ID_HERE'
    const token = c.env.GITHUB_TOKEN
    
    if (!token) {
      return c.json({ success: false, error: 'GitHub token not configured' }, 500)
    }
    
    const gistResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'EventBET-App'
      }
    })
    
    if (!gistResponse.ok) {
      return c.json({ success: false, error: 'Gist not found' }, 404)
    }
    
    const gistData = await gistResponse.json() as any
    const fileContent = gistData.files[GIST_FILENAME]?.content
    const parsed = JSON.parse(fileContent || '{"items":[]}')
    const issues = parsed.items || []
    
    const index = issues.findIndex((issue: any) => issue.id === id)
    if (index === -1) {
      return c.json({ success: false, error: 'Issue not found' }, 404)
    }
    
    issues[index] = {
      ...issues[index],
      ...body,
      updatedAt: new Date().toISOString()
    }
    
    await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        files: {
          [GIST_FILENAME]: {
            content: JSON.stringify({
              version: 1,
              updatedAt: new Date().toISOString(),
              items: issues
            }, null, 2)
          }
        }
      })
    })
    
    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500)
  }
})

app.delete('/api/issues/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    const gistId = c.env.GIST_ID || 'YOUR_GIST_ID_HERE'
    const token = c.env.GITHUB_TOKEN
    
    if (!token) {
      return c.json({ success: false, error: 'GitHub token not configured' }, 500)
    }
    
    const gistResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'EventBET-App'
      }
    })
    
    if (!gistResponse.ok) {
      return c.json({ success: false, error: 'Gist not found' }, 404)
    }
    
    const gistData = await gistResponse.json() as any
    const fileContent = gistData.files[GIST_FILENAME]?.content
    const parsed = JSON.parse(fileContent || '{"items":[]}')
    let issues = parsed.items || []
    
    issues = issues.filter((issue: any) => issue.id !== id)
    
    await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        files: {
          [GIST_FILENAME]: {
            content: JSON.stringify({
              version: 1,
              updatedAt: new Date().toISOString(),
              items: issues
            }, null, 2)
          }
        }
      })
    })
    
    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500)
  }
})

app.post('/api/issues/batch', async (c) => {
  try {
    const body = await c.req.json()
    const { issues: batchIssues } = body
    
    if (!Array.isArray(batchIssues) || batchIssues.length === 0) {
      return c.json({ success: false, error: 'Invalid batch data' }, 400)
    }
    
    const gistId = c.env.GIST_ID || 'YOUR_GIST_ID_HERE'
    const token = c.env.GITHUB_TOKEN
    
    if (!token) {
      return c.json({ success: false, error: 'GitHub token not configured' }, 500)
    }
    
    const gistResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'EventBET-App'
      }
    })
    
    let currentIssues: any[] = []
    if (gistResponse.ok) {
      const gistData = await gistResponse.json() as any
      const fileContent = gistData.files[GIST_FILENAME]?.content
      if (fileContent) {
        const parsed = JSON.parse(fileContent)
        currentIssues = parsed.items || []
      }
    }
    
    const newIssues = batchIssues.map((issue: any) => ({
      id: `iss_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title_ko: issue.title_ko || '',
      title_en: issue.title_en || '',
      title_zh: issue.title_zh || '',
      title_ja: issue.title_ja || '',
      category: issue.category || 'politics',
      initial_usdt: issue.initial_usdt || 100000,
      yes_bet: Math.floor((issue.initial_usdt || 100000) * 0.5),
      no_bet: Math.floor((issue.initial_usdt || 100000) * 0.5),
      expire_days: issue.expire_days || 25,
      expire_date: new Date(Date.now() + (issue.expire_days || 25) * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
    
    currentIssues.unshift(...newIssues)
    
    const updateResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'EventBET-App'
      },
      body: JSON.stringify({
        files: {
          [GIST_FILENAME]: {
            content: JSON.stringify({
              version: 1,
              updatedAt: new Date().toISOString(),
              items: currentIssues
            }, null, 2)
          }
        }
      })
    })
    
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      console.error('Gist update failed:', updateResponse.status, errorText)
      return c.json({ success: false, error: `Failed to update Gist: ${updateResponse.status} - ${errorText}` }, 500)
    }
    
    return c.json({ success: true, count: newIssues.length })
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500)
  }
})

// Serve static files - fallback for other paths
app.use('/*', serveStatic({ root: './' }))

export default app
