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
        
        return `
            <div class="card rounded-lg p-4 sm:p-6">
                <div class="flex items-start justify-between mb-3 sm:mb-4">
                    <div class="flex items-center space-x-2">
                        <span class="text-lg sm:text-xl">${event.category_icon}</span>
                        <span class="text-xs text-secondary mobile-text">${event.category_name}</span>
                    </div>
                    <div class="text-right">
                        <div class="text-xs text-secondary mobile-text">${translations.volume}</div>
                        <div class="text-xs sm:text-sm font-bold text-accent mobile-text">$${formatNumber(event.total_volume)}</div>
                    </div>
                </div>
                
                <h4 class="text-sm sm:text-lg font-bold mb-2 sm:mb-3 mobile-text">${event.title}</h4>
                <p class="text-xs text-secondary mb-3 sm:mb-4 mobile-text line-clamp-2">${event.description}</p>
                
                <div class="space-y-2 mb-3 sm:mb-4">
                    ${event.outcomes.slice(0, 3).map(outcome => `
                        <div class="cursor-pointer hover:opacity-80 p-2 rounded transition"
                             onclick='openBetModal(${JSON.stringify(event)}, ${JSON.stringify(outcome)})'>
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-xs sm:text-sm font-semibold mobile-text">${outcome.name}</span>
                                <span class="text-xs sm:text-sm font-bold text-accent mobile-text">${(outcome.probability * 100).toFixed(1)}%</span>
                            </div>
                            <div class="outcome-bar h-1.5 sm:h-2">
                                <div class="outcome-fill" style="width: ${outcome.probability * 100}%"></div>
                            </div>
                        </div>
                    `).join('')}
                    ${event.outcomes.length > 3 ? `
                        <div class="text-xs text-secondary text-center mobile-text">
                            +${event.outcomes.length - 3} more options
                        </div>
                    ` : ''}
                </div>
                
                <div class="flex items-center justify-between text-xs text-secondary mobile-text">
                    <span>
                        <i class="far fa-clock mr-1"></i>
                        ${daysLeft > 0 ? `${daysLeft} days left` : 'Ending soon'}
                    </span>
                    <span>${translations.resolvesOn}: ${endDate.toLocaleDateString()}</span>
                </div>
            </div>
        `
    }).join('')
}

// Open bet modal
function openBetModal(event, outcome) {
    if (!currentWallet) {
        alert(translations.connectWallet)
        return
    }
    
    const modal = document.getElementById('betModal')
    const content = document.getElementById('betModalContent')
    
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
        
        <form id="betForm" onsubmit="submitBet(event, ${event.id}, ${outcome.id}, ${outcome.probability})">
            <div class="mb-4">
                <label class="block text-xs sm:text-sm font-semibold mb-2 mobile-text">${translations.selectCrypto}</label>
                <select id="cryptoType" required
                        class="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus:outline-none text-xs sm:text-sm mobile-text">
                    <option value="USDT">₮ USDT (Tether)</option>
                    <option value="ETH">Ξ ETH (Ethereum)</option>
                    <option value="BTC">₿ BTC (Bitcoin)</option>
                </select>
            </div>
            
            <div class="mb-4">
                <label class="block text-xs sm:text-sm font-semibold mb-2 mobile-text">${translations.amount}</label>
                <input type="number" id="betAmount" required min="10" step="0.01"
                       class="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus:outline-none text-xs sm:text-sm mobile-text"
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
            
            <button type="submit" 
                    class="w-full btn-primary py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base mobile-text hover:shadow-xl transition">
                <i class="fas fa-check-circle mr-2"></i>
                ${translations.placeBet}
            </button>
        </form>
    `
    
    modal.classList.remove('hidden')
    
    // Update potential payout on amount change
    document.getElementById('betAmount').addEventListener('input', (e) => {
        const amount = parseFloat(e.target.value) || 0
        const payout = amount / outcome.probability
        document.getElementById('potentialPayout').textContent = 
            amount > 0 ? `$${payout.toFixed(2)}` : '-'
    })
}

// Close bet modal
function closeBetModal() {
    document.getElementById('betModal').classList.add('hidden')
}

// Submit bet
async function submitBet(e, eventId, outcomeId, probability) {
    e.preventDefault()
    
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

// Make functions globally accessible
window.filterByCategory = filterByCategory
window.openBetModal = openBetModal
window.submitBet = submitBet
