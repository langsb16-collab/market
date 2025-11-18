import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Translation helper
const translations = {
  en: {
    title: 'EventBET - Blockchain Betting Platform',
    subtitle: 'Where Global Events Meet Your Predictions',
    description: 'Your predictions meet real-world events',
    explore: 'Explore Markets',
    categories: 'Categories',
    trending: 'Trending Markets',
    myBets: 'My Bets',
    connectWallet: 'Connect Wallet',
    totalVolume: 'Total Volume',
    placeBet: 'Place Bet',
    amount: 'Amount',
    selectCrypto: 'Select Cryptocurrency',
    potentialPayout: 'Potential Payout',
    betHistory: 'Bet History',
    resolvesOn: 'Resolves on',
    volume: 'Volume',
  },
  ko: {
    title: 'EventBET(이벤트벳) - 예측 시장 블록체인 배팅 플랫폼',
    subtitle: 'Where Global Events Meet Your Predictions',
    description: '전 세계 이슈와 당신의 예측이 만나는 곳',
    explore: '마켓 탐색',
    categories: '카테고리',
    trending: '인기 마켓',
    myBets: '내 베팅',
    connectWallet: '지갑 연결',
    totalVolume: '총 거래량',
    placeBet: '베팅하기',
    amount: '금액',
    selectCrypto: '암호화폐 선택',
    potentialPayout: '예상 수익',
    betHistory: '베팅 내역',
    resolvesOn: '결과 확정일',
    volume: '거래량',
  },
  zh: {
    title: 'EventBET - 区块链博彩平台',
    subtitle: 'Where Global Events Meet Your Predictions',
    description: '全球事件与您的预测相遇之处',
    explore: '探索市场',
    categories: '分类',
    trending: '热门市场',
    myBets: '我的投注',
    connectWallet: '连接钱包',
    totalVolume: '总交易量',
    placeBet: '下注',
    amount: '金额',
    selectCrypto: '选择加密货币',
    potentialPayout: '预期收益',
    betHistory: '投注历史',
    resolvesOn: '结算日期',
    volume: '交易量',
  },
  ja: {
    title: 'EventBET - ブロックチェーンベッティングプラットフォーム',
    subtitle: 'Where Global Events Meet Your Predictions',
    description: '世界のイベントとあなたの予測が出会う場所',
    explore: 'マーケットを探す',
    categories: 'カテゴリー',
    trending: 'トレンドマーケット',
    myBets: '私のベット',
    connectWallet: 'ウォレット接続',
    totalVolume: '総取引量',
    placeBet: 'ベットする',
    amount: '金額',
    selectCrypto: '暗号通貨を選択',
    potentialPayout: '予想配当',
    betHistory: 'ベット履歴',
    resolvesOn: '決済日',
    volume: '取引量',
  },
}

// API: Get all categories
app.get('/api/categories', async (c) => {
  const lang = c.req.query('lang') || 'en'
  const { env } = c
  
  const { results } = await env.DB.prepare(`
    SELECT id, 
           name_${lang} as name,
           slug, icon
    FROM categories
    ORDER BY id
  `).all()
  
  return c.json({ categories: results })
})

// API: Get all events with outcomes
app.get('/api/events', async (c) => {
  const lang = c.req.query('lang') || 'en'
  const category = c.req.query('category')
  const { env } = c
  
  let query = `
    SELECT e.id, e.category_id,
           e.title_${lang} as title,
           e.description_${lang} as description,
           e.image_url, e.end_date, e.status, e.total_volume,
           c.name_${lang} as category_name,
           c.slug as category_slug,
           c.icon as category_icon
    FROM events e
    JOIN categories c ON e.category_id = c.id
    WHERE e.status = 'active'
  `
  
  if (category) {
    query += ` AND c.slug = '${category}'`
  }
  
  query += ` ORDER BY e.total_volume DESC, e.created_at DESC`
  
  const { results: events } = await env.DB.prepare(query).all()
  
  // Get outcomes for each event
  for (const event of events as any[]) {
    const { results: outcomes } = await env.DB.prepare(`
      SELECT id, 
             name_${lang} as name,
             probability, total_bets
      FROM outcomes
      WHERE event_id = ?
      ORDER BY probability DESC
    `).bind(event.id).all()
    
    event.outcomes = outcomes
  }
  
  return c.json({ events })
})

// API: Get single event details
app.get('/api/events/:id', async (c) => {
  const lang = c.req.query('lang') || 'en'
  const id = c.req.param('id')
  const { env } = c
  
  const event = await env.DB.prepare(`
    SELECT e.id, e.category_id,
           e.title_${lang} as title,
           e.description_${lang} as description,
           e.resolution_criteria_${lang} as resolution_criteria,
           e.image_url, e.end_date, e.resolution_date,
           e.status, e.total_volume,
           c.name_${lang} as category_name,
           c.slug as category_slug,
           c.icon as category_icon
    FROM events e
    JOIN categories c ON e.category_id = c.id
    WHERE e.id = ?
  `).bind(id).first()
  
  if (!event) {
    return c.json({ error: 'Event not found' }, 404)
  }
  
  const { results: outcomes } = await env.DB.prepare(`
    SELECT id, 
           name_${lang} as name,
           probability, total_bets
    FROM outcomes
    WHERE event_id = ?
    ORDER BY probability DESC
  `).bind(id).all()
  
  return c.json({ event: { ...event, outcomes } })
})

// API: Place a bet
app.post('/api/bets', async (c) => {
  const { env } = c
  const { wallet_address, event_id, outcome_id, amount, crypto_type, crypto_amount, transaction_hash } = await c.req.json()
  
  // Validate input
  if (!wallet_address || !event_id || !outcome_id || !amount || !crypto_type || !crypto_amount) {
    return c.json({ error: 'Missing required fields' }, 400)
  }
  
  // Get or create user
  let user = await env.DB.prepare(`
    SELECT id FROM users WHERE wallet_address = ?
  `).bind(wallet_address).first()
  
  if (!user) {
    const result = await env.DB.prepare(`
      INSERT INTO users (wallet_address) VALUES (?)
    `).bind(wallet_address).run()
    user = { id: result.meta.last_row_id }
  }
  
  // Get outcome probability
  const outcome = await env.DB.prepare(`
    SELECT probability FROM outcomes WHERE id = ?
  `).bind(outcome_id).first()
  
  if (!outcome) {
    return c.json({ error: 'Outcome not found' }, 404)
  }
  
  const probability = outcome.probability as number
  const potential_payout = amount / probability
  
  // Create bet
  const betResult = await env.DB.prepare(`
    INSERT INTO bets (
      user_id, event_id, outcome_id, amount, crypto_type, crypto_amount,
      probability_at_bet, potential_payout, status, transaction_hash
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    user.id,
    event_id,
    outcome_id,
    amount,
    crypto_type,
    crypto_amount,
    probability,
    potential_payout,
    transaction_hash ? 'confirmed' : 'pending',
    transaction_hash || null
  ).run()
  
  // Update outcome totals
  await env.DB.prepare(`
    UPDATE outcomes 
    SET total_bets = total_bets + ?
    WHERE id = ?
  `).bind(amount, outcome_id).run()
  
  // Recalculate probabilities for this event
  const { results: allOutcomes } = await env.DB.prepare(`
    SELECT id, total_bets FROM outcomes WHERE event_id = ?
  `).bind(event_id).all()
  
  const totalBets = (allOutcomes as any[]).reduce((sum, o) => sum + o.total_bets, 0)
  
  for (const o of allOutcomes as any[]) {
    const newProb = totalBets > 0 ? o.total_bets / totalBets : 1 / allOutcomes.length
    await env.DB.prepare(`
      UPDATE outcomes SET probability = ? WHERE id = ?
    `).bind(newProb, o.id).run()
  }
  
  // Update event total volume
  await env.DB.prepare(`
    UPDATE events SET total_volume = total_volume + ? WHERE id = ?
  `).bind(amount, event_id).run()
  
  return c.json({ 
    success: true, 
    bet_id: betResult.meta.last_row_id,
    potential_payout 
  })
})

// API: Get user bets
app.get('/api/bets/:wallet', async (c) => {
  const lang = c.req.query('lang') || 'en'
  const wallet = c.req.param('wallet')
  const { env } = c
  
  const { results: bets } = await env.DB.prepare(`
    SELECT b.id, b.amount, b.crypto_type, b.crypto_amount,
           b.probability_at_bet, b.potential_payout, b.status,
           b.created_at, b.confirmed_at,
           e.title_${lang} as event_title,
           o.name_${lang} as outcome_name,
           o.probability as current_probability
    FROM bets b
    JOIN events e ON b.event_id = e.id
    JOIN outcomes o ON b.outcome_id = o.id
    JOIN users u ON b.user_id = u.id
    WHERE u.wallet_address = ?
    ORDER BY b.created_at DESC
    LIMIT 50
  `).bind(wallet).all()
  
  return c.json({ bets })
})

// API: Submit user prediction market
app.post('/api/submissions', async (c) => {
  const { env } = c
  const data = await c.req.json()
  
  // Validate required fields
  const required = ['title_en', 'title_ko', 'title_zh', 'title_ja', 'wallet_address', 'crypto_type', 'outcomes']
  for (const field of required) {
    if (!data[field]) {
      return c.json({ error: `Missing required field: ${field}` }, 400)
    }
  }
  
  // Validate crypto type - Only USDT is supported
  if (data.crypto_type !== 'USDT') {
    return c.json({ error: 'Invalid crypto_type. Only USDT is supported' }, 400)
  }
  
  // Validate bet limits
  const betMin = parseFloat(data.bet_limit_min) || 1.0
  const betMax = parseFloat(data.bet_limit_max) || 1000.0
  
  if (betMin < 1 || betMax > 1000 || betMin > betMax) {
    return c.json({ error: 'Invalid bet limits. Min: 1-1000, Max must be >= Min' }, 400)
  }
  
  // Insert submission
  const result = await env.DB.prepare(`
    INSERT INTO user_submissions (
      title_en, title_ko, title_zh, title_ja,
      description_en, description_ko, description_zh, description_ja,
      bet_limit_min, bet_limit_max, crypto_type, outcomes,
      wallet_address, email, nickname, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `).bind(
    data.title_en,
    data.title_ko,
    data.title_zh,
    data.title_ja,
    data.description_en || '',
    data.description_ko || '',
    data.description_zh || '',
    data.description_ja || '',
    betMin,
    betMax,
    data.crypto_type,
    JSON.stringify(data.outcomes),
    data.wallet_address,
    data.email || null,
    data.nickname || null
  ).run()
  
  return c.json({ 
    success: true, 
    submission_id: result.meta.last_row_id,
    message: 'Submission received. It will be reviewed by admin.'
  })
})

// API: Get user submissions (for the user who submitted)
app.get('/api/submissions/:wallet', async (c) => {
  const wallet = c.req.param('wallet')
  const { env } = c
  
  const { results } = await env.DB.prepare(`
    SELECT id, title_en, title_ko, title_zh, title_ja,
           crypto_type, bet_limit_min, bet_limit_max,
           status, created_at, admin_notes
    FROM user_submissions
    WHERE wallet_address = ?
    ORDER BY created_at DESC
  `).bind(wallet).all()
  
  return c.json({ submissions: results })
})

// API: Get translations
app.get('/api/translations/:lang', (c) => {
  const lang = c.req.param('lang') as keyof typeof translations
  return c.json(translations[lang] || translations.en)
})

// Main page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EventBET - Decentralized Prediction Market</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            /* Apple-Inspired Design - Light Mode (Default) */
            body {
                background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
                color: #1d1d1f;
                transition: background 0.3s ease, color 0.3s ease;
                font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            }
            
            body.dark-mode {
                background: linear-gradient(180deg, #000000 0%, #1a1a1a 100%);
                color: #f5f5f7;
            }
            
            /* Apple-Style Header */
            .header {
                background: rgba(255, 255, 255, 0.72);
                backdrop-filter: saturate(180%) blur(20px);
                -webkit-backdrop-filter: saturate(180%) blur(20px);
                border-bottom: 0.5px solid rgba(0, 0, 0, 0.08);
            }
            
            body.dark-mode .header {
                background: rgba(29, 29, 31, 0.72);
                backdrop-filter: saturate(180%) blur(20px);
                -webkit-backdrop-filter: saturate(180%) blur(20px);
                border-bottom: 0.5px solid rgba(255, 255, 255, 0.1);
            }
            
            /* Apple-Style Cards */
            .card {
                background: #ffffff;
                border: none;
                border-radius: 18px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            body.dark-mode .card {
                background: #1d1d1f;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.2);
            }
            
            .card:hover {
                transform: translateY(-4px) scale(1.01);
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
            }
            
            body.dark-mode .card:hover {
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4);
            }
            
            /* Line Clamp */
            .line-clamp-2 {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            
            /* Image Styles */
            .card img {
                transition: transform 0.3s ease;
            }
            
            .card:hover img {
                transform: scale(1.05);
            }
            
            /* Apple-Style Buttons */
            .btn-primary {
                background: linear-gradient(180deg, #007aff 0%, #0051d5 100%);
                color: #ffffff;
                border: none;
                border-radius: 12px;
                font-weight: 600;
                letter-spacing: -0.01em;
                box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
                transition: all 0.2s ease;
            }
            
            .btn-primary:hover {
                background: linear-gradient(180deg, #0051d5 0%, #003d99 100%);
                box-shadow: 0 4px 16px rgba(0, 122, 255, 0.4);
                transform: translateY(-1px);
            }
            
            .btn-category {
                background-color: rgba(120, 120, 128, 0.12);
                color: #1d1d1f;
                border: none;
                border-radius: 20px;
                font-weight: 500;
                transition: all 0.2s ease;
            }
            
            body.dark-mode .btn-category {
                background-color: rgba(120, 120, 128, 0.24);
                color: #f5f5f7;
            }
            
            .btn-category:hover {
                background-color: rgba(120, 120, 128, 0.18);
                transform: scale(1.02);
            }
            
            body.dark-mode .btn-category:hover {
                background-color: rgba(120, 120, 128, 0.32);
            }
            
            .btn-category.active {
                background: linear-gradient(180deg, #007aff 0%, #0051d5 100%);
                color: #ffffff;
                box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
            }
            
            /* Outcome bars */
            .outcome-bar {
                background: #e5e7eb;
                border-radius: 4px;
                overflow: hidden;
            }
            
            body.dark-mode .outcome-bar {
                background: #2a2a2a;
            }
            
            .outcome-fill {
                background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
                height: 100%;
                transition: width 0.3s ease;
            }
            
            /* Text colors */
            .text-secondary {
                color: #6b7280;
            }
            
            body.dark-mode .text-secondary {
                color: #9ca3af;
            }
            
            .text-accent {
                color: #3b82f6;
            }
            
            body.dark-mode .text-accent {
                color: #60a5fa;
            }
            
            /* Inputs and selects */
            select, input {
                background-color: #f9fafb;
                color: #000000;
                border: 1px solid #e0e0e0;
            }
            
            body.dark-mode select,
            body.dark-mode input {
                background-color: #1a1a1a;
                color: #ffffff;
                border: 1px solid #404040;
            }
            
            select:focus, input:focus {
                border-color: #3b82f6;
                outline: none;
            }
            
            /* Apple-Style Modal */
            .modal-content {
                background: #ffffff;
                border: none;
                border-radius: 20px;
                box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.08);
                backdrop-filter: blur(40px);
                -webkit-backdrop-filter: blur(40px);
            }
            
            body.dark-mode .modal-content {
                background: rgba(29, 29, 31, 0.95);
                box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(0, 0, 0, 0.4);
            }
            
            /* Theme toggle button */
            .theme-toggle {
                background-color: #f3f4f6;
                color: #000000;
                border: 1px solid #e0e0e0;
                cursor: pointer;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                transition: all 0.3s ease;
            }
            
            body.dark-mode .theme-toggle {
                background-color: #2a2a2a;
                color: #ffffff;
                border: 1px solid #404040;
            }
            
            .theme-toggle:hover {
                background-color: #e5e7eb;
            }
            
            body.dark-mode .theme-toggle:hover {
                background-color: #3a3a3a;
            }
            
            /* Hide scrollbar */
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
            .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
            
            /* Compact card design */
            .card {
                transition: all 0.2s ease;
            }
            
            .card h4 {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                line-height: 1.4;
                min-height: 2.8em;
            }
            
            .card p {
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            
            /* Mobile text sizing */
            .mobile-text {
                font-size: 0.875rem;
            }
            
            /* Mobile optimizations */
            @media (max-width: 640px) {
                .mobile-text {
                    font-size: 0.75rem;
                }
                
                h1 {
                    font-size: 1.125rem !important;
                }
                
                h2 {
                    font-size: 1rem !important;
                    padding: 0.5rem 0.75rem;
                }
                
                h3 {
                    font-size: 0.875rem !important;
                }
                
                h4 {
                    font-size: 0.8rem !important;
                }
                
                .card {
                    padding: 0.625rem !important;
                    margin-bottom: 0.5rem;
                }
                
                .card h4 {
                    font-size: 0.8rem !important;
                    min-height: 2.2em;
                    line-height: 1.3;
                }
                
                .card p {
                    font-size: 0.7rem !important;
                }
                
                /* Header mobile optimization */
                .header {
                    padding: 0.5rem 0.75rem !important;
                }
                
                /* Button sizes */
                button {
                    font-size: 0.75rem !important;
                    padding: 0.375rem 0.625rem !important;
                }
                
                .btn-primary {
                    padding: 0.5rem 0.75rem !important;
                }
                
                /* Input/Select mobile */
                select, input, textarea {
                    font-size: 0.875rem !important;
                    padding: 0.5rem !important;
                }
                
                /* Category buttons mobile */
                .btn-category {
                    font-size: 0.7rem !important;
                    padding: 0.375rem 0.625rem !important;
                    white-space: nowrap;
                }
                
                /* Modal mobile */
                .modal-content {
                    margin: 0.5rem;
                    padding: 1rem !important;
                    max-height: 90vh;
                    overflow-y: auto;
                }
                
                /* Hero section mobile */
                #heroTitle {
                    font-size: 0.875rem !important;
                    padding: 0.5rem 0.75rem !important;
                    line-height: 1.4;
                }
                
                #heroSubtitle {
                    font-size: 0.75rem !important;
                }
                
                #heroDescription {
                    font-size: 0.7rem !important;
                }
                
                /* Crypto icons */
                .text-accent.font-bold {
                    font-size: 1rem !important;
                }
                
                /* Grid spacing */
                .grid {
                    gap: 0.5rem !important;
                }
                
                /* Space adjustments */
                .space-x-2 > * + * {
                    margin-left: 0.25rem !important;
                }
                
                .space-x-4 > * + * {
                    margin-left: 0.5rem !important;
                }
                
                .space-x-6 > * + * {
                    margin-left: 0.75rem !important;
                }
                
                .mb-4 {
                    margin-bottom: 0.75rem !important;
                }
                
                .mb-6 {
                    margin-bottom: 1rem !important;
                }
                
                .mb-8 {
                    margin-bottom: 1.25rem !important;
                }
                
                /* Odds/Fee structure mobile */
                .card.p-4 {
                    padding: 0.75rem !important;
                }
                
                .card.p-6 {
                    padding: 1rem !important;
                }
                
                /* Form spacing mobile */
                .space-y-3 > * + * {
                    margin-top: 0.5rem !important;
                }
                
                .space-y-4 > * + * {
                    margin-top: 0.75rem !important;
                }
                
                /* Hide non-essential text on mobile */
                .hide-mobile {
                    display: none;
                }
            }
            
            /* Tablet optimization */
            @media (min-width: 641px) and (max-width: 1024px) {
                .card h4 {
                    font-size: 0.875rem;
                }
                
                .card p {
                    font-size: 0.8rem;
                }
            }
            
            /* Desktop optimization */
            @media (min-width: 1280px) {
                .card h4 {
                    font-size: 0.9rem;
                }
                .card p {
                    font-size: 0.8rem;
                }
            }
        </style>
    </head>
    <body class="min-h-screen">
        <!-- Header -->
        <header class="header sticky top-0 z-50">
            <div class="container mx-auto px-3 sm:px-6 py-3 sm:py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2 sm:space-x-3">
                        <i class="fas fa-chart-line text-accent text-xl sm:text-2xl"></i>
                        <h1 class="text-lg sm:text-2xl font-bold mobile-text">EventBET</h1>
                    </div>
                    <div class="flex items-center space-x-2 sm:space-x-4">
                        <!-- Theme Toggle -->
                        <button id="themeToggle" class="theme-toggle text-xs sm:text-sm" title="Toggle Dark Mode">
                            <i class="fas fa-moon" id="themeIcon"></i>
                        </button>
                        <!-- Language Selector -->
                        <select id="langSelect" class="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 rounded-lg focus:border-blue-400 focus:outline-none">
                            <option value="en">🇬🇧 EN</option>
                            <option value="ko">🇰🇷 KO</option>
                            <option value="zh">🇨🇳 ZH</option>
                            <option value="ja">🇯🇵 JA</option>
                        </select>
                        <!-- Submit Issue Button -->
                        <button id="submitIssueBtn" class="btn-primary text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold shadow-lg mobile-text">
                            <i class="fas fa-plus-circle mr-1 sm:mr-2"></i>
                            <span>이슈 등록</span>
                        </button>
                        <button id="connectWalletBtn" class="btn-primary text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold shadow-lg mobile-text">
                            <i class="fas fa-wallet mr-1 sm:mr-2"></i>
                            <span id="walletBtnText">Connect Wallet</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <div class="container mx-auto px-3 sm:px-6 py-4 sm:py-8">
            <!-- Hero Section -->
            <div class="text-center mb-4 sm:mb-8">
                <h2 class="text-xl sm:text-3xl font-bold mb-2 sm:mb-3 text-red-500 border-2 border-red-500 inline-block px-4 py-2 rounded-lg" id="heroTitle">EventBET(이벤트벳) - 예측 시장 블록체인 배팅 플랫폼</h2>
                <p class="text-base sm:text-lg mb-2 mobile-text font-semibold" id="heroSubtitle">
                    Where Global Events Meet Your Predictions.
                </p>
                <p class="text-sm text-secondary mb-3 sm:mb-4 mobile-text" id="heroDescription">
                    전 세계 이슈와 당신의 예측이 만나는 곳.
                </p>
                <div class="flex justify-center text-xs mobile-text">
                    <div class="text-center">
                        <div class="text-accent font-bold text-lg sm:text-xl">₮ USDT (Tether)</div>
                        <p class="text-xs text-secondary mt-1">유일하게 지원되는 암호화폐</p>
                    </div>
                </div>
            </div>

            <!-- Categories Filter -->
            <div class="mb-4 sm:mb-6">
                <h3 class="text-base sm:text-lg font-bold mb-2 sm:mb-3 mobile-text" id="categoriesTitle">Categories</h3>
                <div id="categoriesContainer" class="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
                    <!-- Categories will be loaded here -->
                </div>
            </div>

            <!-- Sort Filter -->
            <div class="mb-4 sm:mb-6">
                <div class="flex items-center justify-between flex-wrap gap-2">
                    <h3 class="text-lg sm:text-xl font-bold mobile-text" id="marketsTitle">
                        <span data-ko="인기 마켓" data-en="Popular Markets" data-zh="热门市场" data-ja="人気市場">인기 마켓</span>
                    </h3>
                    <div class="flex space-x-2 overflow-x-auto scrollbar-hide">
                        <button onclick="sortMarkets('date')" id="sort-date" class="btn-category active px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap">
                            <i class="fas fa-calendar mr-1"></i><span data-ko="날짜순서" data-en="Latest" data-zh="日期顺序" data-ja="日付順">날짜순서</span>
                        </button>
                        <button onclick="sortMarkets('volume')" id="sort-volume" class="btn-category px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap">
                            <i class="fas fa-chart-bar mr-1"></i><span data-ko="배팅규모" data-en="Volume" data-zh="交易量" data-ja="取引量">배팅규모</span>
                        </button>
                        <button onclick="sortMarkets('participants')" id="sort-participants" class="btn-category px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap">
                            <i class="fas fa-users mr-1"></i><span data-ko="참여인원" data-en="Participants" data-zh="参与人数" data-ja="参加者数">참여인원</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Markets Grid -->
            <div class="mb-6 sm:mb-8">
                <div id="marketsContainer" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    <!-- Markets will be loaded here -->
                </div>
            </div>

            <!-- My Bets Section -->
            <div id="myBetsSection" class="hidden">
                <h3 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4 mobile-text" id="myBetsTitle">My Bets</h3>
                <div id="myBetsContainer" class="space-y-3 sm:space-y-4">
                    <!-- User bets will be loaded here -->
                </div>
            </div>

        <!-- Bet Modal -->
        <div id="betModal" class="hidden fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-3 sm:p-4">
            <div class="modal-content rounded-lg p-4 sm:p-8 max-w-md w-full">
                <div class="flex justify-between items-center mb-4 sm:mb-6">
                    <h3 class="text-lg sm:text-2xl font-bold mobile-text" id="betModalTitle">Place Bet</h3>
                    <button id="closeBetModal" class="text-secondary hover:text-accent text-xl sm:text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div id="betModalContent">
                    <!-- Bet form will be loaded here -->
                </div>
            </div>
        </div>

        <!-- Submit Issue Modal -->
        <div id="submitIssueModal" class="hidden fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
            <div class="modal-content rounded-lg p-4 sm:p-6 max-w-3xl w-full my-8">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg sm:text-2xl font-bold mobile-text">
                        <i class="fas fa-plus-circle mr-2 text-accent"></i>
                        이슈 등록하기
                    </h3>
                    <button id="closeSubmitModal" class="text-secondary hover:text-accent text-xl sm:text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <form id="submitIssueForm" class="space-y-4">
                    <!-- Title Section -->
                    <div class="card p-4">
                        <h4 class="font-semibold mb-3 text-accent">
                            <i class="fas fa-heading mr-2"></i>
                            이슈 제목 (4개 언어 필수)
                        </h4>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm font-medium mb-1">🇰🇷 한국어 제목 *</label>
                                <input type="text" name="title_ko" required 
                                       class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                                       placeholder="예: 비트코인 2025년 말 $150,000 돌파?">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">🇬🇧 English Title *</label>
                                <input type="text" name="title_en" required 
                                       class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                                       placeholder="e.g., Bitcoin reaches $150,000 by end of 2025?">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">🇨🇳 中文标题 *</label>
                                <input type="text" name="title_zh" required 
                                       class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                                       placeholder="例如：比特币2025年底突破$150,000？">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">🇯🇵 日本語タイトル *</label>
                                <input type="text" name="title_ja" required 
                                       class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                                       placeholder="例：ビットコイン2025年末$150,000突破？">
                            </div>
                        </div>
                    </div>

                    <!-- Description Section (Optional) -->
                    <div class="card p-4">
                        <h4 class="font-semibold mb-3 text-accent">
                            <i class="fas fa-align-left mr-2"></i>
                            설명 (선택사항)
                        </h4>
                        <div class="space-y-3">
                            <textarea name="description_ko" rows="2" 
                                      class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                                      placeholder="한국어 설명"></textarea>
                            <textarea name="description_en" rows="2" 
                                      class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                                      placeholder="English description"></textarea>
                            <textarea name="description_zh" rows="2" 
                                      class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                                      placeholder="中文描述"></textarea>
                            <textarea name="description_ja" rows="2" 
                                      class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                                      placeholder="日本語の説明"></textarea>
                        </div>
                    </div>

                    <!-- Outcomes Section -->
                    <div class="card p-4">
                        <h4 class="font-semibold mb-3 text-accent">
                            <i class="fas fa-list-check mr-2"></i>
                            결정 사항 (Yes/No) *
                        </h4>
                        <div class="space-y-2">
                            <div class="flex items-center space-x-4">
                                <input type="radio" name="outcome_type" value="yes_no" checked class="w-4 h-4">
                                <label class="text-sm">Yes / No (예 / 아니오)</label>
                            </div>
                            <p class="text-xs text-secondary pl-8">
                                선택 결과는 자동으로 4개 언어로 변환됩니다
                            </p>
                        </div>
                    </div>

                    <!-- Betting Limits Section -->
                    <div class="card p-4">
                        <h4 class="font-semibold mb-3 text-accent">
                            <i class="fas fa-coins mr-2"></i>
                            1인당 배팅 한도 *
                        </h4>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm font-medium mb-2">암호화폐 *</label>
                                <div class="px-4 py-3 rounded-lg border-2 border-green-500 bg-green-500 bg-opacity-20">
                                    <div class="flex items-center justify-center">
                                        <i class="fas fa-dollar-sign mr-2 text-green-500"></i>
                                        <span class="font-bold text-green-500">USDT (Tether)</span>
                                    </div>
                                    <p class="text-xs text-center text-secondary mt-1">유일하게 지원되는 암호화폐</p>
                                </div>
                                <input type="hidden" name="crypto_type" value="USDT" required>
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-sm font-medium mb-1">최소 한도</label>
                                    <input type="number" name="bet_limit_min" min="1" max="1000" value="1" required 
                                           class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-1">최대 한도</label>
                                    <input type="number" name="bet_limit_max" min="1" max="1000" value="1000" required 
                                           class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm">
                                </div>
                            </div>
                            <p class="text-xs text-secondary">* 1개 ~ 1,000개 범위 내에서 설정</p>
                        </div>
                    </div>

                    <!-- User Info Section (Admin Only) -->
                    <div class="card p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500">
                        <h4 class="font-semibold mb-3 text-yellow-500">
                            <i class="fas fa-lock mr-2"></i>
                            운영자 전용 정보 (비공개)
                        </h4>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm font-medium mb-1">지갑 주소 *</label>
                                <input type="text" name="wallet_address" required 
                                       class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                                       placeholder="0x... (배당 받을 지갑 주소)">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">이메일</label>
                                <input type="email" name="email" 
                                       class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                                       placeholder="your@email.com (선택사항)">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">닉네임</label>
                                <input type="text" name="nickname" 
                                       class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                                       placeholder="사용자 닉네임 (선택사항)">
                            </div>
                        </div>
                    </div>

                    <!-- Wallet Connection Warning (hidden by default) -->
                    <div id="walletWarningSubmit" class="hidden p-4 bg-yellow-500 bg-opacity-20 border-2 border-yellow-500 rounded-lg text-center">
                        <i class="fas fa-wallet text-2xl text-yellow-500 mb-2"></i>
                        <p class="text-sm font-bold mb-3">
                            <span class="lang-ko">이슈를 제출하려면 지갑을 연결해주세요</span>
                            <span class="lang-en hidden">Connect Wallet to Submit Issue</span>
                            <span class="lang-zh hidden">连接钱包以提交问题</span>
                            <span class="lang-ja hidden">ウォレットを接続して問題を提出してください</span>
                        </p>
                        <button type="button" onclick="closeModalAndConnectWalletSubmit()" 
                                class="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold text-sm transition">
                            <i class="fas fa-plug mr-2"></i>
                            <span class="lang-ko">지갑 연결</span>
                            <span class="lang-en hidden">Connect Wallet</span>
                            <span class="lang-zh hidden">连接钱包</span>
                            <span class="lang-ja hidden">ウォレットを接続</span>
                        </button>
                    </div>

                    <!-- Submit Button -->
                    <div class="flex space-x-3">
                        <button type="submit" id="submitIssueBtn2" class="flex-1 btn-primary py-3 rounded-lg font-semibold text-sm">
                            <i class="fas fa-paper-plane mr-2"></i>
                            제출하기
                        </button>
                        <button type="button" id="cancelSubmitBtn" class="px-6 py-3 rounded-lg font-semibold text-sm hover:bg-opacity-20">
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

export default app
