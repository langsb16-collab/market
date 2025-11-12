// PredictChain - Frontend Application

let currentLang = 'en'
let currentWallet = null
let categories = []
let events = []
let translations = {}
let isDarkMode = false

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light'
    isDarkMode = savedTheme === 'dark'
    applyTheme()
    
    // Load saved language
    const savedLang = localStorage.getItem('preferred_language') || 'en'
    currentLang = savedLang
    document.getElementById('langSelect').value = savedLang
    
    // Load saved wallet
    const savedWallet = localStorage.getItem('wallet_address')
    if (savedWallet) {
        currentWallet = savedWallet
        updateWalletButton()
    }
    
    // Load translations
    await loadTranslations()
    
    // Load data
    await loadCategories()
    await loadEvents()
    
    // Setup event listeners
    setupEventListeners()
    
    // Load user bets if wallet connected
    if (currentWallet) {
        loadUserBets()
    }
})

// Theme management
function applyTheme() {
    if (isDarkMode) {
        document.body.classList.add('dark-mode')
        document.getElementById('themeIcon').className = 'fas fa-sun'
    } else {
        document.body.classList.remove('dark-mode')
        document.getElementById('themeIcon').className = 'fas fa-moon'
    }
}

function toggleTheme() {
    isDarkMode = !isDarkMode
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
    applyTheme()
}

// Load translations
async function loadTranslations() {
    try {
        const response = await axios.get(`/api/translations/${currentLang}`)
        translations = response.data
        updateUITexts()
    } catch (error) {
        console.error('Error loading translations:', error)
    }
}

// Update UI texts with translations
function updateUITexts() {
    document.getElementById('walletBtnText').textContent = currentWallet 
        ? `${currentWallet.substring(0, 6)}...${currentWallet.substring(38)}`
        : translations.connectWallet
    document.getElementById('heroTitle').textContent = translations.title
    document.getElementById('heroSubtitle').textContent = translations.subtitle
    document.getElementById('categoriesTitle').textContent = translations.categories
    document.getElementById('marketsTitle').textContent = translations.trending
    document.getElementById('myBetsTitle').textContent = translations.myBets
    document.getElementById('betModalTitle').textContent = translations.placeBet
    
    // Update Odds/Fee section visibility based on language
    updateOddsFeeSection()
}

// Update Odds/Fee section based on current language
function updateOddsFeeSection() {
    // Hide all sections
    const sections = ['oddsFeeSectionKO', 'oddsFeeSectionEN', 'oddsFeeSectionZH', 'oddsFeeSectionJA']
    sections.forEach(id => {
        const element = document.getElementById(id)
        if (element) element.classList.add('hidden')
    })
    
    // Show current language section
    let sectionId = 'oddsFeeSectionEN' // default
    switch(currentLang) {
        case 'ko':
            sectionId = 'oddsFeeSectionKO'
            break
        case 'en':
            sectionId = 'oddsFeeSectionEN'
            break
        case 'zh':
            sectionId = 'oddsFeeSectionZH'
            break
        case 'ja':
            sectionId = 'oddsFeeSectionJA'
            break
    }
    
    const currentSection = document.getElementById(sectionId)
    if (currentSection) {
        currentSection.classList.remove('hidden')
    }
}

// Setup event listeners
function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme)
    
    // Language selector
    document.getElementById('langSelect').addEventListener('change', async (e) => {
        currentLang = e.target.value
        localStorage.setItem('preferred_language', currentLang)
        await loadTranslations()
        await loadCategories()
        await loadEvents()
        if (currentWallet) {
            await loadUserBets()
        }
    })
    
    // Wallet connection
    document.getElementById('connectWalletBtn').addEventListener('click', connectWallet)
    document.getElementById('closeBetModal').addEventListener('click', closeBetModal)
    
    // Close modal on outside click
    document.getElementById('betModal').addEventListener('click', (e) => {
        if (e.target.id === 'betModal') {
            closeBetModal()
        }
    })
}

// Connect wallet (simplified simulation)
async function connectWallet() {
    if (currentWallet) {
        // Disconnect
        const confirm = window.confirm(translations.en === currentLang 
            ? 'Disconnect wallet?' 
            : '지갑 연결을 해제하시겠습니까?')
        if (confirm) {
            currentWallet = null
            localStorage.removeItem('wallet_address')
            updateWalletButton()
            document.getElementById('myBetsSection').classList.add('hidden')
        }
        return
    }
    
    // Simulate wallet connection (in real app, use Web3/Ethers.js)
    const wallet = prompt(
        currentLang === 'en' ? 'Enter your wallet address:' :
        currentLang === 'ko' ? '지갑 주소를 입력하세요:' :
        currentLang === 'zh' ? '输入您的钱包地址:' :
        '財布アドレスを入力してください:'
    )
    
    if (wallet && wallet.startsWith('0x') && wallet.length === 42) {
        currentWallet = wallet
        localStorage.setItem('wallet_address', wallet)
        updateWalletButton()
        await loadUserBets()
    } else if (wallet) {
        alert(currentLang === 'en' ? 'Invalid wallet address' :
              currentLang === 'ko' ? '잘못된 지갑 주소입니다' :
              currentLang === 'zh' ? '钱包地址无效' :
              '無効な財布アドレス')
    }
}

// Update wallet button
function updateWalletButton() {
    const btn = document.getElementById('walletBtnText')
    if (currentWallet) {
        btn.textContent = `${currentWallet.substring(0, 6)}...${currentWallet.substring(38)}`
        document.getElementById('myBetsSection').classList.remove('hidden')
    } else {
        btn.textContent = translations.connectWallet
        document.getElementById('myBetsSection').classList.add('hidden')
    }
}

// Load categories
async function loadCategories() {
    try {
        const response = await axios.get(`/api/categories?lang=${currentLang}`)
        categories = response.data.categories
        renderCategories()
    } catch (error) {
        console.error('Error loading categories:', error)
    }
}

// Render categories
function renderCategories() {
    const container = document.getElementById('categoriesContainer')
    container.innerHTML = `
        <button onclick="filterByCategory(null)" 
                class="btn-category active px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition">
            All
        </button>
    ` + categories.map(cat => `
        <button onclick="filterByCategory('${cat.slug}')" 
                class="btn-category px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition">
            ${cat.icon} ${cat.name}
        </button>
    `).join('')
}

// Load events
async function loadEvents(category = null) {
    try {
        const url = category 
            ? `/api/events?lang=${currentLang}&category=${category}`
            : `/api/events?lang=${currentLang}`
        const response = await axios.get(url)
        events = response.data.events
        renderEvents()
    } catch (error) {
        console.error('Error loading events:', error)
    }
}

// Filter by category
async function filterByCategory(category) {
    await loadEvents(category)
}

// Render events
function renderEvents() {
    const container = document.getElementById('marketsContainer')
    
    if (events.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12 text-secondary text-sm mobile-text">
                ${currentLang === 'en' ? 'No active markets available' :
                  currentLang === 'ko' ? '활성 마켓이 없습니다' :
                  currentLang === 'zh' ? '没有可用的活跃市场' :
                  'アクティブなマーケットはありません'}
            </div>
        `
        return
    }
    
    container.innerHTML = events.map(event => {
        const endDate = new Date(event.end_date)
        const now = new Date()
        const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
        
        // Ensure outcomes exist, create default if empty
        const hasOutcomes = event.outcomes && event.outcomes.length > 0
        const defaultOutcome = hasOutcomes ? event.outcomes[0].id : null
        
        // Get real image for the event based on category and keywords
        const getEventImage = (categorySlug, title) => {
            // Use Picsum Photos for realistic images based on category
            const imageIds = {
                'politics': '1060', // Government buildings
                'sports': '449', // Stadium/sports
                'technology': '180', // Tech/abstract
                'cryptocurrency': '1068', // Finance/money
                'entertainment': '399', // Entertainment
                'economy': '1067', // Business
                'science': '1074', // Science/research
                'climate': '1080' // Nature/environment
            }
            const imageId = imageIds[categorySlug] || '180'
            return `https://picsum.photos/id/${imageId}/120/120`
        }
        
        const eventImage = getEventImage(event.category_slug, event.title)
        
        return `
            <div class="card rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                 onclick="openBetModalByEventId(${event.id})">
                <!-- Polymarket Style Layout -->
                <div class="flex p-3 sm:p-4">
                    <!-- Left: Square Image -->
                    <div class="flex-shrink-0 mr-3">
                        <img src="${eventImage}" 
                             alt="${event.category_name}"
                             class="w-12 h-12 sm:w-16 sm:h-16 rounded object-cover"
                             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ctext y=%22.9em%22 font-size=%2290%22%3E${event.category_icon}%3C/text%3E%3C/svg%3E'">
                    </div>
                    
                    <!-- Right: Content -->
                    <div class="flex-1 min-w-0">
                        <!-- Category Badge and Volume -->
                        <div class="flex items-center justify-between mb-2">
                            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                ${event.category_icon} ${event.category_name}
                            </span>
                            <span class="text-xs font-bold text-green-600 dark:text-green-400">
                                $${formatNumber(event.total_volume)}
                            </span>
                        </div>
                        
                        <!-- Title -->
                        <h4 class="text-sm font-bold mb-2 mobile-text leading-tight line-clamp-2">${event.title}</h4>
                
                        <!-- Outcomes with Beautiful YES/NO Style -->
                        <div class="space-y-1.5">
                            ${hasOutcomes ? event.outcomes.slice(0, 2).map((outcome, idx) => {
                                const isYes = outcome.name.toLowerCase().includes('yes') || outcome.name === '예' || outcome.name === '是' || outcome.name === 'はい'
                                const isNo = outcome.name.toLowerCase().includes('no') || outcome.name === '아니오' || outcome.name === '否' || outcome.name === 'いいえ'
                                const bgColor = isYes ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 
                                               isNo ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 
                                               'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                const textColor = isYes ? 'text-green-700 dark:text-green-300' : 
                                                 isNo ? 'text-red-700 dark:text-red-300' : 
                                                 'text-blue-700 dark:text-blue-300'
                                const percentColor = isYes ? 'text-green-600 dark:text-green-400' : 
                                                    isNo ? 'text-red-600 dark:text-red-400' : 
                                                    'text-blue-600 dark:text-blue-400'
                                return `
                                <div class="relative overflow-hidden rounded-lg border ${bgColor} hover:shadow-md transition-all cursor-pointer"
                                     onclick="event.stopPropagation(); openBetModalById(${event.id}, ${outcome.id})">
                                    <!-- Background Progress Bar -->
                                    <div class="absolute inset-0 ${isYes ? 'bg-green-200 dark:bg-green-700' : isNo ? 'bg-red-200 dark:bg-red-700' : 'bg-blue-200 dark:bg-blue-700'} opacity-20"
                                         style="width: ${outcome.probability * 100}%; transition: width 0.3s ease;"></div>
                                    
                                    <!-- Content -->
                                    <div class="relative z-10 flex items-center justify-between p-2">
                                        <div class="flex items-center space-x-2">
                                            <span class="font-bold text-sm ${textColor}">${outcome.name}</span>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                            <span class="text-xl font-bold ${percentColor}">${(outcome.probability * 100).toFixed(1)}%</span>
                                            ${outcome.total_bets > 0 ? `<span class="text-xs text-gray-500 dark:text-gray-400">$${formatNumber(outcome.total_bets)}</span>` : ''}
                                        </div>
                                    </div>
                                </div>
                            `}).join('') : `
                                <div class="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-center">
                                    <span class="text-xs text-white font-semibold mobile-text">
                                        ${currentLang === 'ko' ? '📊 클릭하여 상세 정보 확인' :
                                          currentLang === 'en' ? '📊 Click to view details' :
                                          currentLang === 'zh' ? '📊 点击查看详情' :
                                          '📊 詳細を表示するにはクリック'}
                                    </span>
                                </div>
                            `}
                            ${hasOutcomes && event.outcomes.length > 2 ? `
                                <div class="text-center">
                                    <span class="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                        +${event.outcomes.length - 2} ${currentLang === 'ko' ? '개 옵션 더보기' :
                                                                         currentLang === 'en' ? 'more options' :
                                                                         currentLang === 'zh' ? '更多选项' :
                                                                         'その他のオプション'}
                                    </span>
                                </div>
                            ` : ''}
                        </div>
                        
                        <!-- Footer: Time and Date -->
                        <div class="flex items-center justify-between text-xs mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <div class="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                                <i class="far fa-clock"></i>
                                <span>${daysLeft > 0 ? `${daysLeft}${currentLang === 'ko' ? '일 남음' : currentLang === 'zh' ? '天' : currentLang === 'ja' ? '日' : 'd left'}` : (currentLang === 'ko' ? '곧 마감' : currentLang === 'zh' ? '即将' : currentLang === 'ja' ? 'まもなく' : 'Soon')}</span>
                            </div>
                            <span class="text-gray-500 dark:text-gray-400">${endDate.toLocaleDateString(currentLang === 'ko' ? 'ko-KR' : currentLang === 'zh' ? 'zh-CN' : currentLang === 'ja' ? 'ja-JP' : 'en-US', {month: 'short', day: 'numeric'})}</span>
                        </div>
                    </div>
                </div>
            </div>
        `
    }).join('')
}

// Open bet modal by event ID (creates default outcome if none exist)
function openBetModalByEventId(eventId) {
    try {
        console.log('openBetModalByEventId called with eventId:', eventId)
        console.log('Events array length:', events.length)
        
        const event = events.find(e => e.id === eventId)
        if (!event) {
            console.error('Event not found:', eventId)
            console.error('Available event IDs:', events.map(e => e.id))
            alert('Event not found. Please refresh the page.')
            return
        }
        
        console.log('Found event:', event.title)
        
        // If event has outcomes, use the first one
        if (event.outcomes && event.outcomes.length > 0) {
            console.log('Opening modal with first outcome:', event.outcomes[0].name)
            openBetModal(event, event.outcomes[0])
        } else {
            // Create default "Yes" outcome for events without outcomes
            console.log('Creating default outcome for event without outcomes')
            const defaultOutcome = {
                id: 0,
                name: currentLang === 'ko' ? '예' :
                      currentLang === 'en' ? 'Yes' :
                      currentLang === 'zh' ? '是' :
                      'はい',
                probability: 0.5,
                total_bets: 0
            }
            openBetModal(event, defaultOutcome)
        }
    } catch (error) {
        console.error('Error in openBetModalByEventId:', error)
        alert('Error opening market details: ' + error.message)
    }
}

// Open bet modal by ID (finds event and outcome from events array)
function openBetModalById(eventId, outcomeId) {
    const event = events.find(e => e.id === eventId)
    if (!event) {
        console.error('Event not found:', eventId)
        return
    }
    
    const outcome = event.outcomes.find(o => o.id === outcomeId)
    if (!outcome) {
        console.error('Outcome not found:', outcomeId)
        return
    }
    
    openBetModal(event, outcome)
}

// Open bet modal
function openBetModal(event, outcome) {
    try {
        console.log('openBetModal called')
        console.log('Event:', event)
        console.log('Outcome:', outcome)
        
        const modal = document.getElementById('betModal')
        const content = document.getElementById('betModalContent')
        
        if (!modal) {
            console.error('Modal element not found!')
            alert('Error: Modal element not found. Please refresh the page.')
            return
        }
        
        if (!content) {
            console.error('Modal content element not found!')
            alert('Error: Modal content element not found. Please refresh the page.')
            return
        }
        
        console.log('Modal elements found successfully')
        
        // Determine if wallet is connected
        const isWalletConnected = !!currentWallet
        console.log('Wallet connected:', isWalletConnected)
    
    // Get translations for connect wallet message
    const connectWalletMsg = {
        en: 'Connect Wallet to Place Bet',
        ko: '베팅하려면 지갑을 연결하세요',
        zh: '连接钱包以下注',
        ja: 'ベットするにはウォレットを接続してください'
    }
    
    content.innerHTML = `
        <div class="mb-4">
            <div class="text-xs text-secondary mb-1 mobile-text">${event.category_name}</div>
            <h4 class="text-base sm:text-lg font-bold mb-2 mobile-text">${event.title}</h4>
            <div class="card p-3 rounded-lg">
                <div class="flex justify-between items-center">
                    <span class="text-sm font-semibold mobile-text">${outcome.name}</span>
                    <span class="text-lg font-bold text-accent">${(outcome.probability * 100).toFixed(1)}%</span>
                </div>
            </div>
        </div>
        
        ${!isWalletConnected ? `
            <div class="mb-4 p-4 bg-yellow-500 bg-opacity-20 border-2 border-yellow-500 rounded-lg text-center">
                <i class="fas fa-wallet text-2xl text-yellow-500 mb-2"></i>
                <p class="text-sm font-bold mobile-text">${connectWalletMsg[currentLang] || connectWalletMsg.en}</p>
                <button type="button" onclick="closeModalAndConnectWallet()" 
                        class="mt-3 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold text-sm mobile-text transition">
                    <i class="fas fa-plug mr-2"></i>
                    ${translations.connectWallet}
                </button>
            </div>
        ` : ''}
        
        <form id="betForm" onsubmit="submitBet(event, ${event.id}, ${outcome.id}, ${outcome.probability})">
            <div class="mb-4">
                <label class="block text-xs sm:text-sm font-semibold mb-2 mobile-text">${translations.selectCrypto}</label>
                <select id="cryptoType" required ${!isWalletConnected ? 'disabled' : ''}
                        class="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus:outline-none text-xs sm:text-sm mobile-text ${!isWalletConnected ? 'opacity-50 cursor-not-allowed' : ''}">
                    <option value="USDT">₮ USDT (Tether)</option>
                    <option value="ETH">Ξ ETH (Ethereum)</option>
                    <option value="BTC">₿ BTC (Bitcoin)</option>
                </select>
            </div>
            
            <div class="mb-4">
                <label class="block text-xs sm:text-sm font-semibold mb-2 mobile-text">${translations.amount}</label>
                <input type="number" id="betAmount" required min="10" step="0.01" ${!isWalletConnected ? 'disabled' : ''}
                       class="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus:outline-none text-xs sm:text-sm mobile-text ${!isWalletConnected ? 'opacity-50 cursor-not-allowed' : ''}"
                       placeholder="Enter amount in USD">
            </div>
            
            <div class="mb-6 p-3 card rounded-lg">
                <div class="flex justify-between text-xs sm:text-sm mobile-text">
                    <span class="text-secondary">Current Odds:</span>
                    <span class="font-semibold">${(outcome.probability * 100).toFixed(1)}%</span>
                </div>
                <div class="flex justify-between text-xs sm:text-sm mobile-text mt-2">
                    <span class="text-secondary">${translations.potentialPayout}:</span>
                    <span class="font-bold text-accent" id="potentialPayout">-</span>
                </div>
            </div>
            
            <button type="submit" ${!isWalletConnected ? 'disabled' : ''}
                    class="w-full btn-primary py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base mobile-text hover:shadow-xl transition ${!isWalletConnected ? 'opacity-50 cursor-not-allowed' : ''}">
                <i class="fas fa-check-circle mr-2"></i>
                ${translations.placeBet}
            </button>
        </form>
    `
    
    console.log('Setting modal content complete')
    console.log('Removing hidden class from modal')
    modal.classList.remove('hidden')
    console.log('Modal should now be visible')
    
    // Update potential payout on amount change (only if wallet connected)
    if (isWalletConnected) {
        const betAmountInput = document.getElementById('betAmount')
        if (betAmountInput) {
            betAmountInput.addEventListener('input', (e) => {
                const amount = parseFloat(e.target.value) || 0
                const payout = amount / outcome.probability
                const payoutElement = document.getElementById('potentialPayout')
                if (payoutElement) {
                    payoutElement.textContent = amount > 0 ? `$${payout.toFixed(2)}` : '-'
                }
            })
        }
    }
    
    console.log('openBetModal completed successfully')
    } catch (error) {
        console.error('Error in openBetModal:', error)
        console.error('Error stack:', error.stack)
        alert('Error opening bet modal: ' + error.message)
    }
}

// Close modal and open wallet connection
function closeModalAndConnectWallet() {
    closeBetModal()
    setTimeout(() => {
        connectWallet()
    }, 300)
}

// Close bet modal
function closeBetModal() {
    document.getElementById('betModal').classList.add('hidden')
}

// Submit bet
async function submitBet(e, eventId, outcomeId, probability) {
    e.preventDefault()
    
    // Check wallet connection before submitting
    if (!currentWallet) {
        alert(currentLang === 'en' ? 'Please connect your wallet first' :
              currentLang === 'ko' ? '먼저 지갑을 연결해주세요' :
              currentLang === 'zh' ? '请先连接您的钱包' :
              'まず財布を接続してください')
        return
    }
    
    const amount = parseFloat(document.getElementById('betAmount').value)
    const cryptoType = document.getElementById('cryptoType').value
    
    // Simulate crypto amount conversion (in real app, use live exchange rates)
    const cryptoAmount = cryptoType === 'USDT' ? amount :
                        cryptoType === 'ETH' ? amount / 3000 :
                        amount / 50000
    
    // Simulate transaction hash (in real app, use blockchain transaction)
    const txHash = '0x' + Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('')
    
    try {
        const response = await axios.post('/api/bets', {
            wallet_address: currentWallet,
            event_id: eventId,
            outcome_id: outcomeId,
            amount: amount,
            crypto_type: cryptoType,
            crypto_amount: cryptoAmount,
            transaction_hash: txHash
        })
        
        if (response.data.success) {
            alert(currentLang === 'en' ? `Bet placed successfully! Potential payout: $${response.data.potential_payout.toFixed(2)}` :
                  currentLang === 'ko' ? `베팅 성공! 예상 수익: $${response.data.potential_payout.toFixed(2)}` :
                  currentLang === 'zh' ? `投注成功！预期收益: $${response.data.potential_payout.toFixed(2)}` :
                  `ベット成功！予想配当: $${response.data.potential_payout.toFixed(2)}`)
            
            closeBetModal()
            await loadEvents()
            await loadUserBets()
        }
    } catch (error) {
        console.error('Error placing bet:', error)
        alert(currentLang === 'en' ? 'Error placing bet. Please try again.' :
              currentLang === 'ko' ? '베팅 중 오류가 발생했습니다.' :
              currentLang === 'zh' ? '下注时出错' :
              'ベット中にエラーが発生しました')
    }
}

// Load user bets
async function loadUserBets() {
    if (!currentWallet) return
    
    try {
        const response = await axios.get(`/api/bets/${currentWallet}?lang=${currentLang}`)
        const bets = response.data.bets
        renderUserBets(bets)
    } catch (error) {
        console.error('Error loading user bets:', error)
    }
}

// Render user bets
function renderUserBets(bets) {
    const container = document.getElementById('myBetsContainer')
    
    if (bets.length === 0) {
        container.innerHTML = `
            <div class="card rounded-lg p-6 text-center text-secondary text-sm mobile-text">
                ${currentLang === 'en' ? 'No bets yet. Start predicting!' :
                  currentLang === 'ko' ? '아직 베팅이 없습니다. 예측을 시작하세요!' :
                  currentLang === 'zh' ? '还没有投注。开始预测！' :
                  'まだベットがありません。予測を始めましょう！'}
            </div>
        `
        return
    }
    
    container.innerHTML = bets.map(bet => {
        const createdDate = new Date(bet.created_at).toLocaleDateString()
        const statusColor = bet.status === 'confirmed' ? 'text-green-500' :
                           bet.status === 'won' ? 'text-accent' :
                           bet.status === 'lost' ? 'text-red-500' :
                           'text-yellow-500'
        
        return `
            <div class="card rounded-lg p-4 sm:p-6">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div class="flex-1">
                        <div class="text-xs text-secondary mb-1 mobile-text">${createdDate}</div>
                        <h5 class="text-sm sm:text-base font-bold mb-1 mobile-text">${bet.event_title}</h5>
                        <div class="text-xs sm:text-sm text-accent mobile-text">
                            <i class="fas fa-arrow-right mr-1"></i>
                            ${bet.outcome_name}
                        </div>
                    </div>
                    <div class="text-left sm:text-right">
                        <div class="text-base sm:text-lg font-bold">${bet.crypto_amount.toFixed(4)} ${bet.crypto_type}</div>
                        <div class="text-xs text-secondary mobile-text">≈ $${bet.amount.toFixed(2)}</div>
                        <div class="text-xs ${statusColor} font-semibold mt-1 mobile-text">${bet.status.toUpperCase()}</div>
                    </div>
                </div>
                <div class="mt-3 pt-3 border-t" style="border-color: var(--border-color, #e0e0e0);">
                    <div class="flex justify-between text-xs mobile-text">
                        <span class="text-secondary">Odds at bet:</span>
                        <span>${(bet.probability_at_bet * 100).toFixed(1)}%</span>
                    </div>
                    <div class="flex justify-between text-xs mobile-text mt-1">
                        <span class="text-secondary">Current odds:</span>
                        <span>${(bet.current_probability * 100).toFixed(1)}%</span>
                    </div>
                    <div class="flex justify-between text-xs mobile-text mt-1">
                        <span class="text-secondary">${translations.potentialPayout}:</span>
                        <span class="text-green-500 font-bold">$${bet.potential_payout.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `
    }).join('')
}

// Format number with commas
function formatNumber(num) {
    return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// ========================================
// ISSUE SUBMISSION FEATURE
// ========================================

// Open submit issue modal
function openSubmitIssueModal() {
    // Open modal regardless of wallet connection
    document.getElementById('submitIssueModal').classList.remove('hidden')
    
    // If wallet is connected, pre-fill wallet address and enable form
    if (currentWallet) {
        document.querySelector('[name="wallet_address"]').value = currentWallet
        enableSubmitIssueForm(true)
    } else {
        // Wallet not connected - show warning and disable form
        enableSubmitIssueForm(false)
    }
}

// Enable or disable submit issue form based on wallet connection
function enableSubmitIssueForm(enabled) {
    const form = document.getElementById('submitIssueForm')
    const submitBtn = document.getElementById('submitIssueBtn2')
    const walletWarning = document.getElementById('walletWarningSubmit')
    
    if (!enabled) {
        // Disable all form inputs
        const inputs = form.querySelectorAll('input, textarea, select, button[type="submit"]')
        inputs.forEach(input => {
            if (input.type !== 'button' && input.id !== 'cancelSubmitBtn') {
                input.disabled = true
                input.classList.add('opacity-50', 'cursor-not-allowed')
            }
        })
        
        // Show wallet connection warning
        if (walletWarning) {
            walletWarning.classList.remove('hidden')
        }
        
        // Disable submit button
        if (submitBtn) {
            submitBtn.disabled = true
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed')
        }
    } else {
        // Enable all form inputs
        const inputs = form.querySelectorAll('input, textarea, select, button[type="submit"]')
        inputs.forEach(input => {
            input.disabled = false
            input.classList.remove('opacity-50', 'cursor-not-allowed')
        })
        
        // Hide wallet connection warning
        if (walletWarning) {
            walletWarning.classList.add('hidden')
        }
        
        // Enable submit button
        if (submitBtn) {
            submitBtn.disabled = false
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed')
        }
    }
}

// Close submit issue modal
function closeSubmitIssueModal() {
    document.getElementById('submitIssueModal').classList.add('hidden')
    document.getElementById('submitIssueForm').reset()
    document.querySelector('[name="wallet_address"]').value = currentWallet || ''
}

// Handle crypto selection
function setupCryptoSelection() {
    const cryptoButtons = document.querySelectorAll('.crypto-select')
    cryptoButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active state from all buttons
            cryptoButtons.forEach(b => {
                b.classList.remove('border-blue-500', 'bg-blue-500', 'bg-opacity-20')
                b.classList.add('border-gray-500')
            })
            
            // Add active state to clicked button
            this.classList.add('border-blue-500', 'bg-blue-500', 'bg-opacity-20')
            this.classList.remove('border-gray-500')
            
            // Update hidden input
            const crypto = this.dataset.crypto
            document.querySelector('[name="crypto_type"]').value = crypto
        })
    })
}

// Submit issue form
async function submitIssueForm(e) {
    e.preventDefault()
    
    // Check wallet connection before submitting
    if (!currentWallet) {
        alert(currentLang === 'en' ? 'Please connect your wallet first to submit an issue' :
              currentLang === 'ko' ? '이슈를 제출하려면 먼저 지갑을 연결해주세요' :
              currentLang === 'zh' ? '请先连接您的钱包以提交问题' :
              'まず財布を接続して問題を提出してください')
        return
    }
    
    const formData = new FormData(e.target)
    const data = {
        title_en: formData.get('title_en'),
        title_ko: formData.get('title_ko'),
        title_zh: formData.get('title_zh'),
        title_ja: formData.get('title_ja'),
        description_en: formData.get('description_en'),
        description_ko: formData.get('description_ko'),
        description_zh: formData.get('description_zh'),
        description_ja: formData.get('description_ja'),
        crypto_type: formData.get('crypto_type'),
        bet_limit_min: parseFloat(formData.get('bet_limit_min')),
        bet_limit_max: parseFloat(formData.get('bet_limit_max')),
        wallet_address: formData.get('wallet_address'),
        email: formData.get('email'),
        nickname: formData.get('nickname'),
        outcomes: [
            { en: 'Yes', ko: '예', zh: '是', ja: 'はい' },
            { en: 'No', ko: '아니오', zh: '否', ja: 'いいえ' }
        ]
    }
    
    try {
        const response = await axios.post('/api/submissions', data)
        
        if (response.data.success) {
            alert(currentLang === 'en' ? 'Submission received! It will be reviewed by admin.' :
                  currentLang === 'ko' ? '제출되었습니다! 운영자 검토 후 게시됩니다.' :
                  currentLang === 'zh' ? '已提交！管理员审核后发布。' :
                  '提出されました！管理者のレビュー後に公開されます。')
            closeSubmitIssueModal()
        }
    } catch (error) {
        console.error('Submission error:', error)
        alert(currentLang === 'en' ? 'Submission failed. Please try again.' :
              currentLang === 'ko' ? '제출 실패. 다시 시도해주세요.' :
              currentLang === 'zh' ? '提交失败。请重试。' :
              '提出失敗。再試行してください。')
    }
}

// Setup issue submission event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Submit issue button
    const submitIssueBtn = document.getElementById('submitIssueBtn')
    if (submitIssueBtn) {
        submitIssueBtn.addEventListener('click', openSubmitIssueModal)
    }
    
    // Close modal buttons
    const closeSubmitModal = document.getElementById('closeSubmitModal')
    if (closeSubmitModal) {
        closeSubmitModal.addEventListener('click', closeSubmitIssueModal)
    }
    
    const cancelSubmitBtn = document.getElementById('cancelSubmitBtn')
    if (cancelSubmitBtn) {
        cancelSubmitBtn.addEventListener('click', closeSubmitIssueModal)
    }
    
    // Close on outside click
    const submitIssueModal = document.getElementById('submitIssueModal')
    if (submitIssueModal) {
        submitIssueModal.addEventListener('click', (e) => {
            if (e.target.id === 'submitIssueModal') {
                closeSubmitIssueModal()
            }
        })
    }
    
    // Form submission
    const submitIssueForm = document.getElementById('submitIssueForm')
    if (submitIssueForm) {
        submitIssueForm.addEventListener('submit', submitIssueForm)
    }
    
    // Crypto selection
    setupCryptoSelection()
})

// Close submit issue modal and open wallet connection
function closeModalAndConnectWalletSubmit() {
    closeSubmitIssueModal()
    setTimeout(() => {
        connectWallet()
    }, 300)
}

// Make functions globally accessible
window.filterByCategory = filterByCategory
window.openBetModal = openBetModal
window.openBetModalById = openBetModalById
window.openBetModalByEventId = openBetModalByEventId
window.submitBet = submitBet
window.openSubmitIssueModal = openSubmitIssueModal
window.closeSubmitIssueModal = closeSubmitIssueModal
window.closeModalAndConnectWallet = closeModalAndConnectWallet
window.closeModalAndConnectWalletSubmit = closeModalAndConnectWalletSubmit
window.enableSubmitIssueForm = enableSubmitIssueForm
