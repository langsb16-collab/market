import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  GITHUB_TOKEN: string
  GIST_ID: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS
app.use('/api/*', cors())

// GitHub Gist configuration
const GIST_FILENAME = 'eventbet-issues.json'

// API: Get all issues from GitHub Gist
app.get('/api/issues', async (c) => {
  try {
    const gistId = c.env.GIST_ID || 'YOUR_GIST_ID_HERE'
    
    // Fetch from raw Gist URL (no auth needed for public read)
    const rawUrl = `https://gist.githubusercontent.com/langsb16-collab/${gistId}/raw/${GIST_FILENAME}`
    const response = await fetch(rawUrl)
    
    if (!response.ok) {
      // Return empty array if Gist doesn't exist yet
      return c.json({ success: true, issues: [] })
    }
    
    const data = await response.json() as { version: number; updatedAt: string; items: any[] }
    return c.json({ success: true, issues: data.items || [] })
  } catch (error) {
    console.error('Error fetching issues:', error)
    return c.json({ success: true, issues: [] })
  }
})

// API: Create issue (writes to GitHub Gist)
app.post('/api/issues', async (c) => {
  try {
    const body = await c.req.json()
    const { title_ko, title_en, title_zh, title_ja, category, initial_usdt, expire_days } = body
    
    const gistId = c.env.GIST_ID || 'YOUR_GIST_ID_HERE'
    const token = c.env.GITHUB_TOKEN
    
    if (!token) {
      return c.json({ success: false, error: 'GitHub token not configured' }, 500)
    }
    
    // Fetch current Gist content
    const gistResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
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
    
    // Create new issue
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
    
    // Add to beginning of array
    currentIssues.unshift(newIssue)
    
    // Update Gist
    const updateResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
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
              items: currentIssues
            }, null, 2)
          }
        }
      })
    })
    
    if (!updateResponse.ok) {
      const error = await updateResponse.text()
      console.error('Failed to update Gist:', error)
      return c.json({ success: false, error: 'Failed to update Gist' }, 500)
    }
    
    return c.json({ success: true, id: newIssue.id })
  } catch (error) {
    console.error('Error creating issue:', error)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

// API: Update issue
app.put('/api/issues/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    
    const gistId = c.env.GIST_ID || 'YOUR_GIST_ID_HERE'
    const token = c.env.GITHUB_TOKEN
    
    if (!token) {
      return c.json({ success: false, error: 'GitHub token not configured' }, 500)
    }
    
    // Fetch current Gist content
    const gistResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    
    if (!gistResponse.ok) {
      return c.json({ success: false, error: 'Gist not found' }, 404)
    }
    
    const gistData = await gistResponse.json() as any
    const fileContent = gistData.files[GIST_FILENAME]?.content
    const parsed = JSON.parse(fileContent || '{"items":[]}')
    const issues = parsed.items || []
    
    // Find and update issue
    const index = issues.findIndex((issue: any) => issue.id === id)
    if (index === -1) {
      return c.json({ success: false, error: 'Issue not found' }, 404)
    }
    
    issues[index] = {
      ...issues[index],
      ...body,
      updatedAt: new Date().toISOString()
    }
    
    // Update Gist
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
    console.error('Error updating issue:', error)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

// API: Delete issue
app.delete('/api/issues/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    const gistId = c.env.GIST_ID || 'YOUR_GIST_ID_HERE'
    const token = c.env.GITHUB_TOKEN
    
    if (!token) {
      return c.json({ success: false, error: 'GitHub token not configured' }, 500)
    }
    
    // Fetch current Gist content
    const gistResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    
    if (!gistResponse.ok) {
      return c.json({ success: false, error: 'Gist not found' }, 404)
    }
    
    const gistData = await gistResponse.json() as any
    const fileContent = gistData.files[GIST_FILENAME]?.content
    const parsed = JSON.parse(fileContent || '{"items":[]}')
    let issues = parsed.items || []
    
    // Remove issue
    issues = issues.filter((issue: any) => issue.id !== id)
    
    // Update Gist
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
    console.error('Error deleting issue:', error)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

// Default route
app.get('/', (c) => {
  return c.redirect('/index.html')
})

export default app
