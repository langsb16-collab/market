import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))
app.use('/*', serveStatic({ root: './' }))

// API: Get all issues
app.get('/api/issues', async (c) => {
  const { DB } = c.env
  const result = await DB.prepare(`
    SELECT * FROM issues 
    WHERE status = 'active' 
    ORDER BY created_at DESC
  `).all()
  
  return c.json({ success: true, issues: result.results })
})

// API: Create issue
app.post('/api/issues', async (c) => {
  const { DB } = c.env
  const body = await c.req.json()
  
  const { title_ko, title_en, title_zh, title_ja, category, initial_usdt, expire_days } = body
  
  // Calculate expire date
  const expireDate = new Date()
  expireDate.setDate(expireDate.setDate + (expire_days || 7))
  
  // Random YES/NO bet distribution
  const yesRatio = 0.3 + Math.random() * 0.4
  const yesBet = Math.floor(initial_usdt * yesRatio)
  const noBet = initial_usdt - yesBet
  
  const result = await DB.prepare(`
    INSERT INTO issues (title_ko, title_en, title_zh, title_ja, category, initial_usdt, yes_bet, no_bet, expire_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
  `).bind(title_ko, title_en, title_zh, title_ja, category, initial_usdt, yesBet, noBet, expireDate.toISOString()).run()
  
  return c.json({ success: true, id: result.meta.last_row_id })
})

// API: Update issue
app.put('/api/issues/:id', async (c) => {
  const { DB } = c.env
  const id = c.req.param('id')
  const body = await c.req.json()
  
  const { title_ko, title_en, title_zh, title_ja, category, initial_usdt, expire_days, status } = body
  
  const expireDate = new Date()
  expireDate.setDate(expireDate.getDate() + (expire_days || 7))
  
  await DB.prepare(`
    UPDATE issues 
    SET title_ko = ?, title_en = ?, title_zh = ?, title_ja = ?, 
        category = ?, initial_usdt = ?, expire_date = ?, status = ?
    WHERE id = ?
  `).bind(title_ko, title_en, title_zh, title_ja, category, initial_usdt, expireDate.toISOString(), status, id).run()
  
  return c.json({ success: true })
})

// API: Delete issue
app.delete('/api/issues/:id', async (c) => {
  const { DB } = c.env
  const id = c.req.param('id')
  
  await DB.prepare(`DELETE FROM issues WHERE id = ?`).bind(id).run()
  
  return c.json({ success: true })
})

// Default route
app.get('/', (c) => {
  return c.redirect('/index.html')
})

export default app
