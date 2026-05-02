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

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

function generateUserId(): string {
  return Date.now().toString()
}

// CORS for API
app.use('/api/*', cors())

// API routes only - no static file handling in Worker

// GET /api/issues - Fetch all issues with outcomes (multi-language support)
app.get('/api/issues', async (c) => {
  try {
    const db = c.env.DB
    const lang = c.req.query('lang') || 'ko'
    
    // Fetch all active issues
    const { results } = await db.prepare(`
      SELECT * FROM issues 
      WHERE status = 'active' 
      ORDER BY created_at DESC
    `).all()
    
    // Add outcomes to each issue with language-specific title
    const issues = results.map((issue: any) => {
      const totalBet = (issue.yes_bet || 0) + (issue.no_bet || 0)
      const probYes = totalBet > 0 ? issue.yes_bet / totalBet : 0.5
      const probNo = totalBet > 0 ? issue.no_bet / totalBet : 0.5
      
      // Select title based on language, fallback to Korean
      let title = issue.title_ko
      if (lang === 'en' && issue.title_en) title = issue.title_en
      else if (lang === 'zh' && issue.title_zh) title = issue.title_zh
      else if (lang === 'ja' && issue.title_ja) title = issue.title_ja
      
      return {
        ...issue,
        title, // Current language title
        outcomes: [
          {
            id: `${issue.id}_yes`,
            name_ko: '예',
            name_en: 'Yes',
            name_zh: '是',
            name_ja: 'はい',
            name: lang === 'en' ? 'Yes' : lang === 'zh' ? '是' : lang === 'ja' ? 'はい' : '예',
            probability: probYes,
            total_bets: issue.yes_bet || 0
          },
          {
            id: `${issue.id}_no`,
            name_ko: '아니오',
            name_en: 'No',
            name_zh: '否',
            name_ja: 'いいえ',
            name: lang === 'en' ? 'No' : lang === 'zh' ? '否' : lang === 'ja' ? 'いいえ' : '아니오',
            probability: probNo,
            total_bets: issue.no_bet || 0
          }
        ]
      }
    })
    
    return c.json({ success: true, issues, lang })
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

// GET /api/categories - Get categories with translations
app.get('/api/categories', async (c) => {
  try {
    const db = c.env.DB
    const lang = c.req.query('lang') || 'ko'
    
    // Fetch category translations
    const { results } = await db.prepare(`
      SELECT * FROM category_translations
      WHERE language = ?
      ORDER BY category_slug
    `).bind(lang).all()
    
    // Create category map
    const categories = results.map((cat: any) => ({
      slug: cat.category_slug,
      name: cat.name,
      language: cat.language
    }))
    
    return c.json({ success: true, categories, lang })
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ========== AUTH ROUTES ==========

// POST /api/auth/register - Register with email
app.post('/api/auth/register', async (c) => {
  try {
    const body = await c.req.json()
    const db = c.env.DB
    
    const { email, name, phone, wallet_address, password, referral_code } = body
    
    // Check if user exists
    const existing = await db.prepare(
      'SELECT id FROM users WHERE email = ? OR wallet_address = ?'
    ).bind(email, wallet_address).first()
    
    if (existing) {
      return c.json({ success: false, error: 'User already exists' }, 400)
    }
    
    // Generate user ID and referral code
    const userId = generateUserId()
    const myReferralCode = generateReferralCode()
    
    // Insert user
    await db.prepare(`
      INSERT INTO users (
        id, email, name, phone, wallet_address, password_hash,
        referral_code, referred_by, social_provider, status, created_at, last_login
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'email', 'active', ?, ?)
    `).bind(
      userId, email, name, phone, wallet_address,
      password, // In production, use bcrypt/argon2
      myReferralCode,
      referral_code || null,
      nowIso(),
      nowIso()
    ).run()
    
    // If referred by someone, create reward record
    if (referral_code) {
      const referrer = await db.prepare(
        'SELECT id FROM users WHERE referral_code = ?'
      ).bind(referral_code).first()
      
      if (referrer) {
        const rewardId = `rwd_${Date.now()}`
        await db.prepare(`
          INSERT INTO referral_rewards (
            id, referrer_id, referred_user_id, reward_amount, reward_type, status, created_at
          ) VALUES (?, ?, ?, 10.0, 'signup', 'pending', ?)
        `).bind(rewardId, String(referrer.id), userId, nowIso()).run()
        
        // Update referrer's count
        await db.prepare(
          'UPDATE users SET referral_count = referral_count + 1 WHERE id = ?'
        ).bind(String(referrer.id)).run()
      }
    }
    
    return c.json({
      success: true,
      user: {
        id: userId,
        email,
        name,
        referral_code: myReferralCode
      }
    })
  } catch (error: any) {
    console.error('Error registering user:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// POST /api/auth/login - Login with email
app.post('/api/auth/login', async (c) => {
  try {
    const body = await c.req.json()
    const db = c.env.DB
    
    const { email, password } = body
    
    const user = await db.prepare(
      'SELECT * FROM users WHERE email = ? AND password_hash = ?'
    ).bind(email, password).first()
    
    if (!user) {
      return c.json({ success: false, error: 'Invalid credentials' }, 401)
    }
    
    // Update last login
    await db.prepare(
      'UPDATE users SET last_login = ? WHERE id = ?'
    ).bind(nowIso(), user.id).run()
    
    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        wallet_address: user.wallet_address,
        referral_code: user.referral_code,
        referral_count: user.referral_count,
        referral_rewards: user.referral_rewards
      }
    })
  } catch (error: any) {
    console.error('Error logging in:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// POST /api/auth/social/kakao - Kakao OAuth callback
app.post('/api/auth/social/kakao', async (c) => {
  try {
    const body = await c.req.json()
    const db = c.env.DB
    
    const { kakao_id, email, name, avatar_url, referral_code } = body
    
    // Check if user exists
    let user = await db.prepare(
      'SELECT * FROM users WHERE kakao_id = ?'
    ).bind(kakao_id).first()
    
    if (!user) {
      // Create new user
      const userId = generateUserId()
      const myReferralCode = generateReferralCode()
      
      await db.prepare(`
        INSERT INTO users (
          id, email, name, kakao_id, avatar_url, referral_code,
          referred_by, social_provider, status, created_at, last_login
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'kakao', 'active', ?, ?)
      `).bind(
        userId, email, name, kakao_id, avatar_url,
        myReferralCode, referral_code || null, nowIso(), nowIso()
      ).run()
      
      // Handle referral reward
      if (referral_code) {
        const referrer = await db.prepare(
          'SELECT id FROM users WHERE referral_code = ?'
        ).bind(referral_code).first()
        
        if (referrer) {
          const rewardId = `rwd_${Date.now()}`
          await db.prepare(`
            INSERT INTO referral_rewards (
              id, referrer_id, referred_user_id, reward_amount, reward_type, status, created_at
            ) VALUES (?, ?, ?, 10.0, 'signup', 'pending', ?)
          `).bind(rewardId, String(referrer.id), userId, nowIso()).run()
          
          await db.prepare(
            'UPDATE users SET referral_count = referral_count + 1 WHERE id = ?'
          ).bind(String(referrer.id)).run()
        }
      }
      
      user = { id: userId, email, name, referral_code: myReferralCode, referral_count: 0, referral_rewards: 0 }
    } else {
      // Update last login
      await db.prepare(
        'UPDATE users SET last_login = ? WHERE id = ?'
      ).bind(nowIso(), user.id).run()
    }
    
    return c.json({ success: true, user })
  } catch (error: any) {
    console.error('Error with Kakao login:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Similar endpoints for Facebook, Instagram, X (Twitter)
app.post('/api/auth/social/facebook', async (c) => {
  // Similar to Kakao implementation
  return c.json({ success: false, error: 'Not implemented yet' }, 501)
})

app.post('/api/auth/social/instagram', async (c) => {
  return c.json({ success: false, error: 'Not implemented yet' }, 501)
})

app.post('/api/auth/social/twitter', async (c) => {
  return c.json({ success: false, error: 'Not implemented yet' }, 501)
})

// ========== CHAT ROUTES ==========

// GET /api/chat/messages - Get user's chat messages
app.get('/api/chat/messages/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const db = c.env.DB
    
    const { results } = await db.prepare(`
      SELECT * FROM chat_messages
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 100
    `).bind(userId).all()
    
    return c.json({ success: true, messages: results })
  } catch (error: any) {
    console.error('Error fetching messages:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// POST /api/chat/messages - Send message
app.post('/api/chat/messages', async (c) => {
  try {
    const body = await c.req.json()
    const db = c.env.DB
    
    const { user_id, message, message_type = 'text', file_url = null } = body
    
    const msgId = `msg_${Date.now()}`
    
    await db.prepare(`
      INSERT INTO chat_messages (
        id, user_id, message, message_type, file_url, is_admin_reply, is_read, created_at
      ) VALUES (?, ?, ?, ?, ?, FALSE, FALSE, ?)
    `).bind(msgId, user_id, message, message_type, file_url, nowIso()).run()
    
    return c.json({
      success: true,
      message: {
        id: msgId,
        user_id,
        message,
        message_type,
        file_url,
        created_at: nowIso()
      }
    })
  } catch (error: any) {
    console.error('Error sending message:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// POST /api/chat/admin/reply - Admin reply to message
app.post('/api/chat/admin/reply', async (c) => {
  try {
    const body = await c.req.json()
    const db = c.env.DB
    
    const { user_id, admin_id, message } = body
    
    const msgId = `msg_${Date.now()}`
    
    await db.prepare(`
      INSERT INTO chat_messages (
        id, user_id, admin_id, message, message_type, is_admin_reply, is_read, created_at
      ) VALUES (?, ?, ?, ?, 'text', TRUE, FALSE, ?)
    `).bind(msgId, user_id, admin_id, message, nowIso()).run()
    
    return c.json({ success: true, message_id: msgId })
  } catch (error: any) {
    console.error('Error sending admin reply:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ========== REFERRAL ROUTES ==========

// GET /api/referrals/stats/:userId - Get referral stats
app.get('/api/referrals/stats/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const db = c.env.DB
    
    const user = await db.prepare(
      'SELECT referral_code, referral_count, referral_rewards FROM users WHERE id = ?'
    ).bind(userId).first()
    
    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404)
    }
    
    // Get pending rewards
    const { results: pending } = await db.prepare(`
      SELECT * FROM referral_rewards
      WHERE referrer_id = ? AND status = 'pending'
      ORDER BY created_at DESC
    `).bind(userId).all()
    
    // Get paid rewards
    const { results: paid } = await db.prepare(`
      SELECT * FROM referral_rewards
      WHERE referrer_id = ? AND status = 'paid'
      ORDER BY paid_at DESC
      LIMIT 20
    `).bind(userId).all()
    
    return c.json({
      success: true,
      referral_code: user.referral_code,
      total_referrals: user.referral_count,
      total_rewards: user.referral_rewards,
      pending_rewards: pending,
      paid_rewards: paid
    })
  } catch (error: any) {
    console.error('Error fetching referral stats:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

// POST /api/referrals/claim - Claim pending rewards
app.post('/api/referrals/claim', async (c) => {
  try {
    const body = await c.req.json()
    const db = c.env.DB
    
    const { user_id } = body
    
    // Get all pending rewards
    const { results: pending } = await db.prepare(`
      SELECT * FROM referral_rewards
      WHERE referrer_id = ? AND status = 'pending'
    `).bind(user_id).all()
    
    if (pending.length === 0) {
      return c.json({ success: false, error: 'No pending rewards' }, 400)
    }
    
    // Calculate total
    const total = pending.reduce((sum: number, r: any) => sum + r.reward_amount, 0)
    
    // Mark all as paid
    await db.prepare(`
      UPDATE referral_rewards
      SET status = 'paid', paid_at = ?
      WHERE referrer_id = ? AND status = 'pending'
    `).bind(nowIso(), user_id).run()
    
    // Update user's total rewards
    await db.prepare(
      'UPDATE users SET referral_rewards = referral_rewards + ? WHERE id = ?'
    ).bind(total, user_id).run()
    
    return c.json({
      success: true,
      claimed_amount: total,
      claimed_count: pending.length
    })
  } catch (error: any) {
    console.error('Error claiming rewards:', error)
    return c.json({ success: false, error: error.message }, 500)
  }
})

export default app
