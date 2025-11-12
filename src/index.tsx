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
    title: 'PredictChain - Decentralized Prediction Market',
    subtitle: 'Bet on World Events with Cryptocurrency',
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
    title: 'PredictChain - 탈중앙화 예측 시장',
    subtitle: '암호화폐로 세계 이슈에 베팅하세요',
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
    title: 'PredictChain - 去中心化预测市场',
    subtitle: '用加密货币投注世界事件',
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
    title: 'PredictChain - 分散型予測市場',
    subtitle: '暗号通貨で世界のイベントに賭ける',
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
        <title>PredictChain - Decentralized Prediction Market</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            body {
                background-color: #1e3a5f;
                color: #ffffff;
            }
            .card {
                background: linear-gradient(135deg, #2c5282 0%, #1a365d 100%);
                border: 1px solid #4a5568;
            }
            .card:hover {
                border-color: #63b3ed;
                transform: translateY(-2px);
                transition: all 0.3s ease;
            }
            .btn-primary {
                background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
            }
            .btn-primary:hover {
                background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
            }
            .outcome-bar {
                background: rgba(66, 153, 225, 0.2);
                border-radius: 4px;
                overflow: hidden;
            }
            .outcome-fill {
                background: linear-gradient(90deg, #4299e1 0%, #63b3ed 100%);
                height: 100%;
                transition: width 0.3s ease;
            }
            .mobile-text {
                font-size: 0.875rem;
            }
            @media (max-width: 640px) {
                .mobile-text {
                    font-size: 0.75rem;
                }
                h1 {
                    font-size: 1.5rem;
                }
                h2 {
                    font-size: 1.25rem;
                }
            }
        </style>
    </head>
    <body class="min-h-screen">
        <!-- Header -->
        <header class="bg-gray-900 bg-opacity-50 backdrop-blur-md sticky top-0 z-50 border-b border-gray-700">
            <div class="container mx-auto px-3 sm:px-6 py-3 sm:py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2 sm:space-x-3">
                        <i class="fas fa-chart-line text-blue-400 text-xl sm:text-2xl"></i>
                        <h1 class="text-lg sm:text-2xl font-bold mobile-text">PredictChain</h1>
                    </div>
                    <div class="flex items-center space-x-2 sm:space-x-4">
                        <!-- Language Selector -->
                        <select id="langSelect" class="bg-gray-800 text-white text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none">
                            <option value="en">🇬🇧 EN</option>
                            <option value="ko">🇰🇷 KO</option>
                            <option value="zh">🇨🇳 ZH</option>
                            <option value="ja">🇯🇵 JA</option>
                        </select>
                        <button id="connectWalletBtn" class="btn-primary text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold shadow-lg mobile-text">
                            <i class="fas fa-wallet mr-1 sm:mr-2"></i>
                            <span id="walletBtnText">Connect Wallet</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <div class="container mx-auto px-3 sm:px-6 py-4 sm:py-8">
            <!-- Hero Section -->
            <div class="text-center mb-6 sm:mb-12">
                <h2 class="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4" id="heroTitle">Bet on World Events with Cryptocurrency</h2>
                <p class="text-sm sm:text-lg text-gray-300 mb-4 sm:mb-6 mobile-text" id="heroSubtitle">
                    Transparent, Secure, Decentralized Prediction Market
                </p>
                <div class="flex justify-center space-x-4 sm:space-x-6 text-xs sm:text-sm mobile-text">
                    <div class="text-center">
                        <div class="text-blue-400 font-bold text-base sm:text-2xl">₿ BTC</div>
                        <div class="text-gray-400 text-xs">Bitcoin</div>
                    </div>
                    <div class="text-center">
                        <div class="text-blue-400 font-bold text-base sm:text-2xl">Ξ ETH</div>
                        <div class="text-gray-400 text-xs">Ethereum</div>
                    </div>
                    <div class="text-center">
                        <div class="text-blue-400 font-bold text-base sm:text-2xl">₮ USDT</div>
                        <div class="text-gray-400 text-xs">Tether</div>
                    </div>
                </div>
            </div>

            <!-- Categories Filter -->
            <div class="mb-6 sm:mb-8">
                <div class="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 class="text-lg sm:text-xl font-bold mobile-text" id="categoriesTitle">Categories</h3>
                </div>
                <div id="categoriesContainer" class="flex overflow-x-auto space-x-2 sm:space-x-3 pb-2">
                    <!-- Categories will be loaded here -->
                </div>
            </div>

            <!-- Markets Grid -->
            <div class="mb-6 sm:mb-8">
                <h3 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4 mobile-text" id="marketsTitle">Trending Markets</h3>
                <div id="marketsContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
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
        </div>

        <!-- Bet Modal -->
        <div id="betModal" class="hidden fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-3 sm:p-4">
            <div class="bg-gray-900 rounded-lg p-4 sm:p-8 max-w-md w-full border border-gray-700">
                <div class="flex justify-between items-center mb-4 sm:mb-6">
                    <h3 class="text-lg sm:text-2xl font-bold mobile-text" id="betModalTitle">Place Bet</h3>
                    <button id="closeBetModal" class="text-gray-400 hover:text-white text-xl sm:text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div id="betModalContent">
                    <!-- Bet form will be loaded here -->
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

export default app
