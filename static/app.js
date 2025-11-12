// EventBET - Static Frontend Application (No Backend Required)

let currentLang = 'ko'
let currentWallet = null
let isDarkMode = false

// Hardcoded translations
const translations = {
    ko: {
        title: 'EventBET(이벤트벳) - 예측 시장 블록체인 배팅 플랫폼',
        subtitle: 'Where Global Events Meet Your Predictions',
        description: '전 세계 이슈와 당신의 예측이 만나는 곳',
        explore: '마켓 탐색',
        categories: '카테고리',
        trending: '인기 마켓',
        myBets: '내 베팅',
        connectWallet: '지갑 연결',
        placeBet: '베팅하기',
        amount: '금액',
        selectCrypto: '암호화폐 선택',
        potentialPayout: '예상 수익',
        resolvesOn: '결과 발표',
        volume: '거래량',
        submitTitle: '예측 마켓 제출',
        submitDescription: '흥미로운 이벤트가 있나요? 검토를 위해 제출하세요!',
        submitButton: '제출하기',
        labelTitle: '제목',
        labelDescription: '설명',
        labelCategory: '카테고리',
        labelResolveDate: '결과 발표일',
        footerOddsTitle: '배당률 계산',
        footerOddsDesc: '시장 확률에 따라 배당률이 계산됩니다',
        footerFeeTitle: '거래 수수료',
        footerFeeDesc: '모든 거래에 2% 플랫폼 수수료',
        footerSupportTitle: '지원 암호화폐',
        footerSupportDesc: 'BTC, ETH, USDT 지원'
    },
    en: {
        title: 'EventBET - Blockchain Betting Platform',
        subtitle: 'Where Global Events Meet Your Predictions',
        description: 'Your predictions meet real-world events',
        explore: 'Explore Markets',
        categories: 'Categories',
        trending: 'Trending Markets',
        myBets: 'My Bets',
        connectWallet: 'Connect Wallet',
        placeBet: 'Place Bet',
        amount: 'Amount',
        selectCrypto: 'Select Cryptocurrency',
        potentialPayout: 'Potential Payout',
        resolvesOn: 'Resolves on',
        volume: 'Volume',
        submitTitle: 'Submit Your Prediction Market',
        submitDescription: 'Have an interesting event? Submit it for review!',
        submitButton: 'Submit',
        labelTitle: 'Title',
        labelDescription: 'Description',
        labelCategory: 'Category',
        labelResolveDate: 'Resolution Date',
        footerOddsTitle: 'Odds Calculation',
        footerOddsDesc: 'Odds are calculated based on market probability',
        footerFeeTitle: 'Transaction Fees',
        footerFeeDesc: '2% platform fee on all transactions',
        footerSupportTitle: 'Cryptocurrencies',
        footerSupportDesc: 'BTC, ETH, USDT supported'
    },
    zh: {
        title: 'EventBET - 区块链博彩平台',
        subtitle: 'Where Global Events Meet Your Predictions',
        description: '您的预测与现实世界事件相遇',
        explore: '探索市场',
        categories: '分类',
        trending: '热门市场',
        myBets: '我的投注',
        connectWallet: '连接钱包',
        placeBet: '下注',
        amount: '金额',
        selectCrypto: '选择加密货币',
        potentialPayout: '预期收益',
        resolvesOn: '结算日期',
        volume: '交易量',
        submitTitle: '提交预测市场',
        submitDescription: '有有趣的事件吗？提交审核！',
        submitButton: '提交',
        labelTitle: '标题',
        labelDescription: '描述',
        labelCategory: '分类',
        labelResolveDate: '结算日期',
        footerOddsTitle: '赔率计算',
        footerOddsDesc: '赔率根据市场概率计算',
        footerFeeTitle: '交易费用',
        footerFeeDesc: '所有交易收取2%平台费',
        footerSupportTitle: '支持的加密货币',
        footerSupportDesc: '支持BTC, ETH, USDT'
    },
    ja: {
        title: 'EventBET - ブロックチェーン賭博プラットフォーム',
        subtitle: 'Where Global Events Meet Your Predictions',
        description: 'あなたの予測が現実の出来事と出会う',
        explore: 'マーケットを探す',
        categories: 'カテゴリー',
        trending: 'トレンド市場',
        myBets: 'マイベット',
        connectWallet: 'ウォレット接続',
        placeBet: 'ベットする',
        amount: '金額',
        selectCrypto: '暗号通貨を選択',
        potentialPayout: '予想払戻金',
        resolvesOn: '決済日',
        volume: '取引量',
        submitTitle: '予測市場を提出',
        submitDescription: '面白いイベントはありますか？レビュー用に提出してください！',
        submitButton: '提出',
        labelTitle: 'タイトル',
        labelDescription: '説明',
        labelCategory: 'カテゴリー',
        labelResolveDate: '決済日',
        footerOddsTitle: 'オッズ計算',
        footerOddsDesc: 'オッズは市場確率に基づいて計算されます',
        footerFeeTitle: '取引手数料',
        footerFeeDesc: 'すべての取引に2%のプラットフォーム手数料',
        footerSupportTitle: '対応暗号通貨',
        footerSupportDesc: 'BTC、ETH、USDT対応'
    }
}

// Hardcoded categories
const categories = [
    { id: 1, slug: 'politics', name_ko: '정치', name_en: 'Politics', name_zh: '政治', name_ja: '政治', icon: '🏛️' },
    { id: 2, slug: 'sports', name_ko: '스포츠', name_en: 'Sports', name_zh: '体育', name_ja: 'スポーツ', icon: '⚽' },
    { id: 3, slug: 'technology', name_ko: '기술', name_en: 'Technology', name_zh: '科技', name_ja: 'テクノロジー', icon: '💻' },
    { id: 4, slug: 'cryptocurrency', name_ko: '암호화폐', name_en: 'Crypto', name_zh: '加密货币', name_ja: '暗号通貨', icon: '₿' },
    { id: 5, slug: 'entertainment', name_ko: '엔터테인먼트', name_en: 'Entertainment', name_zh: '娱乐', name_ja: 'エンターテイメント', icon: '🎬' },
    { id: 6, slug: 'economy', name_ko: '경제', name_en: 'Economy', name_zh: '经济', name_ja: '経済', icon: '📈' },
    { id: 7, slug: 'science', name_ko: '과학', name_en: 'Science', name_zh: '科学', name_ja: '科学', icon: '🔬' },
    { id: 8, slug: 'climate', name_ko: '기후', name_en: 'Climate', name_zh: '气候', name_ja: '気候', icon: '🌍' }
]

// Hardcoded events with outcomes
const events = [
    {
        id: 1,
        category_id: 1,
        category_slug: 'politics',
        title_ko: '2024년 미국 대선, 민주당 승리?',
        title_en: 'Will Democrats win 2024 US Election?',
        title_zh: '2024年美国大选，民主党会赢吗？',
        title_ja: '2024年米国選挙、民主党が勝つ？',
        description_ko: '2024년 미국 대통령 선거에서 민주당 후보가 승리할 것인가?',
        description_en: 'Will the Democratic candidate win the 2024 US Presidential Election?',
        description_zh: '2024年美国总统选举，民主党候选人会获胜吗？',
        description_ja: '2024年の米国大統領選挙で民主党候補が勝利するか？',
        resolve_date: '2024-11-06',
        total_volume: 15000000,
        outcomes: [
            { id: 1, name: '예', probability: 0.52 },
            { id: 2, name: '아니오', probability: 0.48 }
        ]
    },
    {
        id: 2,
        category_id: 2,
        category_slug: 'sports',
        title_ko: '리오넬 메시, 2024년 발롱도르 수상?',
        title_en: 'Will Messi win 2024 Ballon d\'Or?',
        title_zh: '梅西会赢得2024年金球奖吗？',
        title_ja: 'メッシは2024年バロンドールを受賞？',
        description_ko: '리오넬 메시가 2024년 발롱도르를 수상할 것인가?',
        description_en: 'Will Lionel Messi win the 2024 Ballon d\'Or award?',
        description_zh: '里奥内尔·梅西会赢得2024年金球奖吗？',
        description_ja: 'リオネル・メッシは2024年のバロンドールを受賞するか？',
        resolve_date: '2024-12-01',
        total_volume: 8500000,
        outcomes: [
            { id: 3, name: '예', probability: 0.35 },
            { id: 4, name: '아니오', probability: 0.65 }
        ]
    },
    {
        id: 3,
        category_id: 4,
        category_slug: 'cryptocurrency',
        title_ko: '비트코인, 2024년 말까지 $100,000 돌파?',
        title_en: 'Bitcoin to reach $100,000 by end of 2024?',
        title_zh: '比特币会在2024年底突破10万美元吗？',
        title_ja: 'ビットコインは2024年末までに10万ドル突破？',
        description_ko: '비트코인이 2024년 말까지 $100,000를 돌파할 것인가?',
        description_en: 'Will Bitcoin reach $100,000 by the end of 2024?',
        description_zh: '比特币会在2024年底达到10万美元吗？',
        description_ja: 'ビットコインは2024年末までに10万ドルに達するか？',
        resolve_date: '2024-12-31',
        total_volume: 25000000,
        outcomes: [
            { id: 5, name: '예', probability: 0.68 },
            { id: 6, name: '아니오', probability: 0.32 }
        ]
    },
    {
        id: 4,
        category_id: 3,
        category_slug: 'technology',
        title_ko: 'OpenAI GPT-5 2024년 출시?',
        title_en: 'Will OpenAI release GPT-5 in 2024?',
        title_zh: 'OpenAI会在2024年发布GPT-5吗？',
        title_ja: 'OpenAIは2024年にGPT-5をリリース？',
        description_ko: 'OpenAI가 2024년에 GPT-5를 출시할 것인가?',
        description_en: 'Will OpenAI release GPT-5 in 2024?',
        description_zh: 'OpenAI会在2024年发布GPT-5吗？',
        description_ja: 'OpenAIは2024年にGPT-5をリリースするか？',
        resolve_date: '2024-12-31',
        total_volume: 12000000,
        outcomes: [
            { id: 7, name: '예', probability: 0.42 },
            { id: 8, name: '아니오', probability: 0.58 }
        ]
    },
    {
        id: 5,
        category_id: 5,
        category_slug: 'entertainment',
        title_ko: '오펜하이머, 2024 아카데미 작품상 수상?',
        title_en: 'Oppenheimer wins Best Picture at 2024 Oscars?',
        title_zh: '《奥本海默》会赢得2024年奥斯卡最佳影片吗？',
        title_ja: '『オッペンハイマー』は2024年アカデミー作品賞受賞？',
        description_ko: '영화 오펜하이머가 2024 아카데미 작품상을 수상할 것인가?',
        description_en: 'Will the movie Oppenheimer win Best Picture at the 2024 Academy Awards?',
        description_zh: '电影《奥本海默》会赢得2024年奥斯卡最佳影片奖吗？',
        description_ja: '映画『オッペンハイマー』は2024年アカデミー作品賞を受賞するか？',
        resolve_date: '2024-03-11',
        total_volume: 5500000,
        outcomes: [
            { id: 9, name: '예', probability: 0.78 },
            { id: 10, name: '아니오', probability: 0.22 }
        ]
    },
    {
        id: 6,
        category_id: 6,
        category_slug: 'economy',
        title_ko: '미국 2024년 경기침체 진입?',
        title_en: 'Will US enter recession in 2024?',
        title_zh: '美国会在2024年进入经济衰退吗？',
        title_ja: '米国は2024年に景気後退に入る？',
        description_ko: '미국이 2024년에 경기침체에 진입할 것인가?',
        description_en: 'Will the United States enter a recession in 2024?',
        description_zh: '美国会在2024年进入经济衰退吗？',
        description_ja: '米国は2024年に景気後退に入るか？',
        resolve_date: '2024-12-31',
        total_volume: 18000000,
        outcomes: [
            { id: 11, name: '예', probability: 0.28 },
            { id: 12, name: '아니오', probability: 0.72 }
        ]
    }
]

// Get image for event based on category
const getEventImage = (categorySlug, title) => {
    const imageIds = {
        'politics': '1060',
        'sports': '449',
        'technology': '180',
        'cryptocurrency': '1068',
        'entertainment': '399',
        'economy': '1067',
        'science': '1074',
        'climate': '1080'
    }
    const imageId = imageIds[categorySlug] || '180'
    return `https://picsum.photos/id/${imageId}/120/120`
}

// Format number with commas
const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Get translated category name
const getCategoryName = (category) => {
    return category[`name_${currentLang}`] || category.name_en
}

// Get translated event title
const getEventTitle = (event) => {
    return event[`title_${currentLang}`] || event.title_en
}

// Get translated event description
const getEventDescription = (event) => {
    return event[`description_${currentLang}`] || event.description_en
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light'
    isDarkMode = savedTheme === 'dark'
    applyTheme()
    
    // Load saved language
    const savedLang = localStorage.getItem('preferred_language') || 'ko'
    currentLang = savedLang
    const langSelector = document.getElementById('language-selector')
    if (langSelector) langSelector.value = savedLang
    
    // Setup event listeners
    setupEventListeners()
    
    // Render UI
    updateUITexts()
    renderCategories()
    renderMarkets()
})

// Theme management
function applyTheme() {
    if (isDarkMode) {
        document.body.classList.add('dark-mode')
        const themeIcon = document.querySelector('#theme-toggle i')
        if (themeIcon) themeIcon.className = 'fas fa-sun text-yellow-400'
    } else {
        document.body.classList.remove('dark-mode')
        const themeIcon = document.querySelector('#theme-toggle i')
        if (themeIcon) themeIcon.className = 'fas fa-moon text-gray-700'
    }
}

function toggleTheme() {
    isDarkMode = !isDarkMode
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
    applyTheme()
}

// Update UI texts with translations
function updateUITexts() {
    const t = translations[currentLang] || translations.en
    
    // Header
    const appTitle = document.getElementById('app-title')
    if (appTitle) appTitle.textContent = 'EventBET'
    
    const connectWalletText = document.getElementById('connect-wallet-text')
    if (connectWalletText) {
        connectWalletText.textContent = currentWallet 
            ? `${currentWallet.substring(0, 6)}...${currentWallet.substring(38)}`
            : t.connectWallet
    }
    
    // Hero section
    const heroTitle = document.getElementById('hero-title')
    if (heroTitle) heroTitle.textContent = 'EventBET'
    
    const heroSubtitle = document.getElementById('hero-subtitle')
    if (heroSubtitle) heroSubtitle.textContent = t.subtitle
    
    const heroDescription = document.getElementById('hero-description')
    if (heroDescription) heroDescription.textContent = t.description
    
    const exploreButton = document.querySelector('#explore-button span')
    if (exploreButton) exploreButton.textContent = t.explore
    
    // Section titles
    const categoriesTitle = document.getElementById('categories-title')
    if (categoriesTitle) categoriesTitle.textContent = t.categories
    
    const trendingTitle = document.getElementById('trending-title')
    if (trendingTitle) trendingTitle.textContent = t.trending
    
    // Submit section
    const submitTitle = document.getElementById('submit-title')
    if (submitTitle) submitTitle.textContent = t.submitTitle
    
    const submitDescription = document.getElementById('submit-description')
    if (submitDescription) submitDescription.textContent = t.submitDescription
    
    const labelTitle = document.getElementById('label-title')
    if (labelTitle) labelTitle.textContent = t.labelTitle
    
    const labelDescription = document.getElementById('label-description')
    if (labelDescription) labelDescription.textContent = t.labelDescription
    
    const labelCategory = document.getElementById('label-category')
    if (labelCategory) labelCategory.textContent = t.labelCategory
    
    const labelResolveDate = document.getElementById('label-resolve-date')
    if (labelResolveDate) labelResolveDate.textContent = t.labelResolveDate
    
    const submitButtonText = document.getElementById('submit-button-text')
    if (submitButtonText) submitButtonText.textContent = t.submitButton
    
    // Footer
    const footerOddsTitle = document.getElementById('footer-odds-title')
    if (footerOddsTitle) footerOddsTitle.textContent = t.footerOddsTitle
    
    const footerOddsDesc = document.getElementById('footer-odds-desc')
    if (footerOddsDesc) footerOddsDesc.textContent = t.footerOddsDesc
    
    const footerFeeTitle = document.getElementById('footer-fee-title')
    if (footerFeeTitle) footerFeeTitle.textContent = t.footerFeeTitle
    
    const footerFeeDesc = document.getElementById('footer-fee-desc')
    if (footerFeeDesc) footerFeeDesc.textContent = t.footerFeeDesc
    
    const footerSupportTitle = document.getElementById('footer-support-title')
    if (footerSupportTitle) footerSupportTitle.textContent = t.footerSupportTitle
    
    const footerSupportDesc = document.getElementById('footer-support-desc')
    if (footerSupportDesc) footerSupportDesc.textContent = t.footerSupportDesc
}

// Setup event listeners
function setupEventListeners() {
    const langSelector = document.getElementById('language-selector')
    if (langSelector) {
        langSelector.addEventListener('change', (e) => {
            currentLang = e.target.value
            localStorage.setItem('preferred_language', currentLang)
            updateUITexts()
            renderCategories()
            renderMarkets()
        })
    }
    
    const themeToggle = document.getElementById('theme-toggle')
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme)
    }
    
    const connectWallet = document.getElementById('connect-wallet')
    if (connectWallet) {
        connectWallet.addEventListener('click', () => {
            if (!currentWallet) {
                // Simulate wallet connection
                currentWallet = '0x' + Math.random().toString(16).substr(2, 40)
                localStorage.setItem('wallet_address', currentWallet)
                updateUITexts()
                alert(translations[currentLang].connectWallet + ': ' + currentWallet)
            } else {
                // Disconnect wallet
                currentWallet = null
                localStorage.removeItem('wallet_address')
                updateUITexts()
            }
        })
    }
    
    const exploreButton = document.getElementById('explore-button')
    if (exploreButton) {
        exploreButton.addEventListener('click', () => {
            document.getElementById('markets-container').scrollIntoView({ behavior: 'smooth' })
        })
    }
    
    const submissionForm = document.getElementById('submission-form')
    if (submissionForm) {
        submissionForm.addEventListener('submit', (e) => {
            e.preventDefault()
            alert(translations[currentLang].submitButton + ' - ' + translations[currentLang].submitDescription)
        })
    }
}

// Render categories
function renderCategories() {
    const container = document.getElementById('categories-container')
    if (!container) return
    
    const submitCategoryInput = document.getElementById('submit-category-input')
    if (submitCategoryInput) {
        submitCategoryInput.innerHTML = categories.map(cat => 
            `<option value="${cat.id}">${cat.icon} ${getCategoryName(cat)}</option>`
        ).join('')
    }
    
    container.innerHTML = categories.map(category => `
        <div class="bg-white rounded-lg shadow-sm p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div class="text-center">
                <div class="text-3xl sm:text-4xl mb-2">${category.icon}</div>
                <h4 class="text-sm sm:text-base font-semibold text-gray-900">${getCategoryName(category)}</h4>
            </div>
        </div>
    `).join('')
}

// Render markets
function renderMarkets() {
    const container = document.getElementById('markets-container')
    if (!container) return
    
    container.innerHTML = events.map(event => {
        const category = categories.find(c => c.id === event.category_id)
        const eventImage = getEventImage(event.category_slug, getEventTitle(event))
        const hasOutcomes = event.outcomes && event.outcomes.length > 0
        
        return `
        <div class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all cursor-pointer market-card" onclick="openBetModal(${event.id})">
            <div class="flex p-3 sm:p-4">
                <!-- Left: Square Image -->
                <div class="flex-shrink-0 mr-3">
                    <img src="${eventImage}" 
                         alt="${getCategoryName(category)}"
                         class="w-12 h-12 sm:w-16 sm:h-16 rounded object-cover"
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ctext y=%22.9em%22 font-size=%2290%22%3E${category.icon}%3C/text%3E%3C/svg%3E'">
                </div>
                
                <!-- Right: Content -->
                <div class="flex-1 min-w-0">
                    <!-- Category Badge and Volume -->
                    <div class="flex items-center justify-between mb-2">
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            ${category.icon} ${getCategoryName(category)}
                        </span>
                        <span class="text-xs font-bold text-green-600">
                            $${formatNumber(event.total_volume)}
                        </span>
                    </div>
                    
                    <!-- Title -->
                    <h3 class="text-sm sm:text-base font-bold text-gray-900 mb-2 line-clamp-2">
                        ${getEventTitle(event)}
                    </h3>
                    
                    <!-- Resolve Date -->
                    <div class="flex items-center text-xs text-gray-500 mb-3">
                        <i class="far fa-calendar mr-1"></i>
                        <span>${translations[currentLang].resolvesOn}: ${event.resolve_date}</span>
                    </div>
                    
                    <!-- Outcomes -->
                    ${hasOutcomes ? `
                    <div class="grid grid-cols-2 gap-2">
                        ${event.outcomes.slice(0, 2).map((outcome) => {
                            const isYes = outcome.name.toLowerCase().includes('yes') || outcome.name === '예' || outcome.name === '是' || outcome.name === 'はい'
                            const isNo = outcome.name.toLowerCase().includes('no') || outcome.name === '아니오' || outcome.name === '否' || outcome.name === 'いいえ'
                            const bgColor = isYes ? 'bg-green-50 dark:bg-green-900/20 border-green-200' : 
                                           isNo ? 'bg-red-50 dark:bg-red-900/20 border-red-200' : 
                                           'bg-blue-50 dark:bg-blue-900/20 border-blue-200'
                            const textColor = isYes ? 'text-green-700' : 
                                             isNo ? 'text-red-700' : 
                                             'text-blue-700'
                            const percentColor = isYes ? 'text-green-600' : 
                                                isNo ? 'text-red-600' : 
                                                'text-blue-600'
                            return `
                            <div class="relative overflow-hidden rounded-lg border ${bgColor} hover:shadow-md transition-all">
                                <!-- Background Progress Bar -->
                                <div class="absolute inset-0 ${isYes ? 'bg-green-200' : isNo ? 'bg-red-200' : 'bg-blue-200'} opacity-20"
                                     style="width: ${outcome.probability * 100}%; transition: width 0.3s ease;"></div>
                                
                                <!-- Content -->
                                <div class="relative z-10 flex items-center justify-between p-2">
                                    <div class="flex items-center space-x-2">
                                        <span class="font-bold text-sm ${textColor}">${outcome.name}</span>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <span class="text-xl font-bold ${percentColor}">${(outcome.probability * 100).toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                            `
                        }).join('')}
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
        `
    }).join('')
}

// Open bet modal
function openBetModal(eventId) {
    const event = events.find(e => e.id === eventId)
    if (!event) return
    
    const category = categories.find(c => c.id === event.category_id)
    const modal = document.getElementById('bet-modal')
    const modalTitle = document.getElementById('modal-title')
    const modalContent = document.getElementById('modal-content')
    
    if (!modal || !modalTitle || !modalContent) return
    
    modalTitle.textContent = getEventTitle(event)
    
    modalContent.innerHTML = `
        <div class="space-y-4">
            <div>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    ${category.icon} ${getCategoryName(category)}
                </span>
            </div>
            
            <p class="text-sm sm:text-base text-gray-600">${getEventDescription(event)}</p>
            
            <div class="flex items-center text-sm text-gray-500">
                <i class="far fa-calendar mr-2"></i>
                <span>${translations[currentLang].resolvesOn}: ${event.resolve_date}</span>
            </div>
            
            <div class="flex items-center text-sm text-gray-600">
                <i class="fas fa-chart-line mr-2"></i>
                <span>${translations[currentLang].volume}: $${formatNumber(event.total_volume)}</span>
            </div>
            
            ${event.outcomes && event.outcomes.length > 0 ? `
            <div class="border-t pt-4">
                <h4 class="text-lg font-bold mb-3">${translations[currentLang].placeBet}</h4>
                <div class="grid grid-cols-1 gap-3">
                    ${event.outcomes.map(outcome => {
                        const isYes = outcome.name.toLowerCase().includes('yes') || outcome.name === '예' || outcome.name === '是' || outcome.name === 'はい'
                        const isNo = outcome.name.toLowerCase().includes('no') || outcome.name === '아니오' || outcome.name === '否' || outcome.name === 'いいえ'
                        const bgColor = isYes ? 'bg-green-50 hover:bg-green-100' : isNo ? 'bg-red-50 hover:bg-red-100' : 'bg-blue-50 hover:bg-blue-100'
                        const textColor = isYes ? 'text-green-700' : isNo ? 'text-red-700' : 'text-blue-700'
                        return `
                        <button class="w-full ${bgColor} border-2 border-transparent hover:border-gray-300 rounded-lg p-4 transition-all">
                            <div class="flex justify-between items-center">
                                <span class="font-bold ${textColor}">${outcome.name}</span>
                                <span class="text-2xl font-bold ${textColor}">${(outcome.probability * 100).toFixed(1)}%</span>
                            </div>
                        </button>
                        `
                    }).join('')}
                </div>
            </div>
            ` : ''}
        </div>
    `
    
    modal.classList.remove('hidden')
    modal.classList.add('flex')
}

// Close bet modal
function closeBetModal() {
    const modal = document.getElementById('bet-modal')
    if (modal) {
        modal.classList.add('hidden')
        modal.classList.remove('flex')
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('bet-modal')
    if (modal && e.target === modal) {
        closeBetModal()
    }
})
