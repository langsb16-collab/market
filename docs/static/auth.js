// EventBET Authentication System
// Local Storage based user management

let currentUser = null

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('eventbet_user')
    if (savedUser) {
        currentUser = JSON.parse(savedUser)
        updateUIForLoggedInUser()
    } else {
        updateUIForGuest()
    }
    
    setupAuthListeners()
})

// Setup event listeners
function setupAuthListeners() {
    // Login button
    const loginBtn = document.getElementById('login-btn')
    if (loginBtn) {
        loginBtn.addEventListener('click', showLoginModal)
    }
    
    // Register button
    const registerBtn = document.getElementById('register-btn')
    if (registerBtn) {
        registerBtn.addEventListener('click', showRegisterModal)
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn')
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout)
    }
    
    // Intercept submit issue button
    const submitIssueBtn = document.getElementById('submit-issue-btn')
    if (submitIssueBtn) {
        submitIssueBtn.addEventListener('click', (e) => {
            if (!currentUser) {
                e.preventDefault()
                e.stopPropagation()
                // Get translations from app.js
                const currentLang = window.currentLang || 'ko'
                const translations = window.translations || {}
                const t = translations[currentLang] || translations.ko || {}
                showAuthRequiredModal(t.submitIssueLoginRequired || '이슈를 등록하려면 로그인이 필요합니다.')
            }
        })
    }
}

// Show login modal
function showLoginModal() {
    updateLoginModalTexts()
    const modal = document.getElementById('login-modal')
    if (modal) {
        modal.classList.remove('hidden')
        modal.classList.add('flex')
    }
}

// Show register modal
function showRegisterModal() {
    updateRegisterModalTexts()
    const modal = document.getElementById('register-modal')
    if (modal) {
        modal.classList.remove('hidden')
        modal.classList.add('flex')
    }
}

// Close login modal
function closeLoginModal() {
    const modal = document.getElementById('login-modal')
    if (modal) {
        modal.classList.add('hidden')
        modal.classList.remove('flex')
    }
}

// Close register modal
function closeRegisterModal() {
    const modal = document.getElementById('register-modal')
    if (modal) {
        modal.classList.add('hidden')
        modal.classList.remove('flex')
    }
}

// Handle login
function handleLogin(event) {
    event.preventDefault()
    
    const currentLang = window.currentLang || 'ko'
    const translations = window.translations || {}
    const t = translations[currentLang] || translations.ko || {}
    
    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('eventbet_users') || '[]')
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password)
    
    if (user) {
        // Check if user is suspended
        if (user.status === 'suspended') {
            alert(t.accountSuspended || '정지된 계정입니다. 관리자에게 문의하세요.')
            return
        }
        
        currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            wallet: user.wallet,
            role: user.role || 'user',
            status: user.status || 'active'
        }
        localStorage.setItem('eventbet_user', JSON.stringify(currentUser))
        updateUIForLoggedInUser()
        closeLoginModal()
        alert(t.loginSuccess || '로그인 성공!')
    } else {
        alert(t.loginFailed || '이메일 또는 비밀번호가 올바르지 않습니다.')
    }
}

// Handle registration
function handleRegister(event) {
    event.preventDefault()
    
    const currentLang = window.currentLang || 'ko'
    const translations = window.translations || {}
    const t = translations[currentLang] || translations.ko || {}
    
    const name = document.getElementById('register-name').value
    const phone = document.getElementById('register-phone').value
    const wallet = document.getElementById('register-wallet').value
    const email = document.getElementById('register-email').value
    const password = document.getElementById('register-password').value
    const confirmPassword = document.getElementById('register-confirm-password').value
    
    // Validation
    if (password !== confirmPassword) {
        alert(t.passwordMismatch || '비밀번호가 일치하지 않습니다.')
        return
    }
    
    if (password.length < 6) {
        alert(t.passwordTooShort || '비밀번호는 최소 6자 이상이어야 합니다.')
        return
    }
    
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('eventbet_users') || '[]')
    if (users.some(u => u.email === email)) {
        alert(t.emailExists || '이미 등록된 이메일입니다.')
        return
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name,
        phone,
        wallet,
        email,
        password,
        role: 'user',
        createdAt: new Date().toISOString(),
        status: 'active'
    }
    
    users.push(newUser)
    localStorage.setItem('eventbet_users', JSON.stringify(users))
    
    alert(t.registerSuccess || '회원가입이 완료되었습니다! 로그인해주세요.')
    closeRegisterModal()
}

// Logout
function logout() {
    const currentLang = window.currentLang || 'ko'
    const translations = window.translations || {}
    const t = translations[currentLang] || translations.ko || {}
    
    if (confirm(t.logoutConfirm || '로그아웃 하시겠습니까?')) {
        currentUser = null
        localStorage.removeItem('eventbet_user')
        updateUIForGuest()
        alert(t.logoutSuccess || '로그아웃 되었습니다.')
        // Reload page
        window.location.reload()
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    // Hide login/register buttons
    const loginBtn = document.getElementById('login-btn')
    const registerBtn = document.getElementById('register-btn')
    if (loginBtn) loginBtn.classList.add('hidden')
    if (registerBtn) registerBtn.classList.add('hidden')
    
    // Show user profile
    const userProfile = document.getElementById('user-profile')
    if (userProfile) {
        userProfile.classList.remove('hidden')
        userProfile.classList.add('flex')
    }
    
    // Update user name
    const userName = document.getElementById('user-name')
    if (userName && currentUser) {
        userName.textContent = currentUser.name + '님'
    }
}

// Update UI for guest
function updateUIForGuest() {
    // Show login/register buttons
    const loginBtn = document.getElementById('login-btn')
    const registerBtn = document.getElementById('register-btn')
    if (loginBtn) loginBtn.classList.remove('hidden')
    if (registerBtn) registerBtn.classList.remove('hidden')
    
    // Hide user profile
    const userProfile = document.getElementById('user-profile')
    if (userProfile) {
        userProfile.classList.add('hidden')
        userProfile.classList.remove('flex')
    }
}

// Show auth required modal
function showAuthRequiredModal(message) {
    // Get translations from app.js
    const currentLang = window.currentLang || 'ko'
    const translations = window.translations || {}
    const t = translations[currentLang] || translations.ko || {}
    
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4'
    modal.innerHTML = `
        <div class="modal-content rounded-lg p-6 max-w-md w-full text-center">
            <i class="fas fa-lock text-5xl text-yellow-500 mb-4"></i>
            <h3 class="text-xl font-bold mb-3">${t.loginRequired || '로그인이 필요합니다'}</h3>
            <p class="text-secondary mb-6">${message}</p>
            <div class="flex space-x-3">
                <button onclick="this.closest('.fixed').remove(); showLoginModal()" class="flex-1 btn-primary py-3 rounded-lg font-semibold">
                    <i class="fas fa-sign-in-alt mr-2"></i>
                    ${t.loginButton || '로그인'}
                </button>
                <button onclick="this.closest('.fixed').remove(); showRegisterModal()" class="flex-1 btn-primary py-3 rounded-lg font-semibold">
                    <i class="fas fa-user-plus mr-2"></i>
                    ${t.signupButton || '회원가입'}
                </button>
            </div>
            <button onclick="this.closest('.fixed').remove()" class="mt-3 text-secondary hover:text-accent">
                ${t.closeButton || '닫기'}
            </button>
        </div>
    `
    document.body.appendChild(modal)
}

// Check if user is logged in
function isLoggedIn() {
    return currentUser !== null
}

// Get current user
function getCurrentUser() {
    return currentUser
}

// Update login modal texts based on current language
function updateLoginModalTexts() {
    const currentLang = window.currentLang || 'ko'
    const translations = window.translations || {}
    const t = translations[currentLang] || translations.ko || {}
    
    // Update login modal
    const loginTitle = document.getElementById('login-modal-title')
    if (loginTitle) loginTitle.textContent = t.loginTitle || '로그인'
    
    const loginEmailLabel = document.getElementById('login-email-label')
    if (loginEmailLabel) loginEmailLabel.textContent = t.emailLabel || '이메일'
    
    const loginPasswordLabel = document.getElementById('login-password-label')
    if (loginPasswordLabel) loginPasswordLabel.textContent = t.passwordLabel || '비밀번호'
    
    const loginPasswordInput = document.getElementById('login-password-input')
    if (loginPasswordInput) loginPasswordInput.placeholder = t.passwordPlaceholder || '비밀번호를 입력하세요'
    
    const loginSubmitBtn = document.getElementById('login-submit-btn')
    if (loginSubmitBtn) loginSubmitBtn.textContent = t.loginButton || '로그인'
    
    const loginNoAccount = document.getElementById('login-no-account')
    if (loginNoAccount) loginNoAccount.textContent = t.noAccount || '계정이 없으신가요?'
    
    const loginToRegister = document.getElementById('login-to-register')
    if (loginToRegister) loginToRegister.textContent = t.signupButton || '회원가입'
}

// Update register modal texts based on current language
function updateRegisterModalTexts() {
    const currentLang = window.currentLang || 'ko'
    const translations = window.translations || {}
    const t = translations[currentLang] || translations.ko || {}
    
    // Update register modal
    const registerTitle = document.getElementById('register-modal-title')
    if (registerTitle) registerTitle.textContent = t.registerTitle || '회원가입'
    
    const registerNameLabel = document.getElementById('register-name-label')
    if (registerNameLabel) registerNameLabel.textContent = t.nameLabel || '이름'
    
    const registerNameInput = document.getElementById('register-name-input')
    if (registerNameInput) registerNameInput.placeholder = t.namePlaceholder || '홍길동'
    
    const registerPhoneLabel = document.getElementById('register-phone-label')
    if (registerPhoneLabel) registerPhoneLabel.textContent = t.phoneLabel || '전화번호'
    
    const registerPhoneInput = document.getElementById('register-phone-input')
    if (registerPhoneInput) registerPhoneInput.placeholder = t.phonePlaceholder || '010-1234-5678'
    
    const registerWalletLabel = document.getElementById('register-wallet-label')
    if (registerWalletLabel) registerWalletLabel.textContent = t.walletLabel || 'USDT 지갑주소'
    
    const registerWalletHint = document.getElementById('register-wallet-hint')
    if (registerWalletHint) registerWalletHint.textContent = t.walletHint || '(배당 받을 주소)'
    
    const registerWalletInput = document.getElementById('register-wallet-input')
    if (registerWalletInput) registerWalletInput.placeholder = t.walletPlaceholder || '0x...'
    
    const registerEmailLabel = document.getElementById('register-email-label')
    if (registerEmailLabel) registerEmailLabel.textContent = t.emailLabel || '이메일'
    
    const registerPasswordLabel = document.getElementById('register-password-label')
    if (registerPasswordLabel) registerPasswordLabel.textContent = t.passwordLabel || '비밀번호'
    
    const registerPasswordInput = document.getElementById('register-password-input')
    if (registerPasswordInput) registerPasswordInput.placeholder = t.passwordMinLength || '최소 6자 이상'
    
    const registerConfirmPasswordLabel = document.getElementById('register-confirm-password-label')
    if (registerConfirmPasswordLabel) registerConfirmPasswordLabel.textContent = t.confirmPasswordLabel || '비밀번호 확인'
    
    const registerConfirmPasswordInput = document.getElementById('register-confirm-password-input')
    if (registerConfirmPasswordInput) registerConfirmPasswordInput.placeholder = t.confirmPasswordPlaceholder || '비밀번호 재입력'
    
    const registerBenefitsTitle = document.getElementById('register-benefits-title')
    if (registerBenefitsTitle) registerBenefitsTitle.textContent = t.memberBenefits || '회원 전용 혜택'
    
    const registerBenefit1 = document.getElementById('register-benefit-1')
    if (registerBenefit1) registerBenefit1.textContent = t.benefit1 || '모든 마켓 상세 정보 조회'
    
    const registerBenefit2 = document.getElementById('register-benefit-2')
    if (registerBenefit2) registerBenefit2.textContent = t.benefit2 || '베팅 및 이슈 등록 권한'
    
    const registerBenefit3 = document.getElementById('register-benefit-3')
    if (registerBenefit3) registerBenefit3.textContent = t.benefit3 || '신규 이벤트 알림 서비스'
    
    const registerBenefit4 = document.getElementById('register-benefit-4')
    if (registerBenefit4) registerBenefit4.textContent = t.benefit4 || '배당 내역 관리'
    
    const registerSubmitBtn = document.getElementById('register-submit-btn')
    if (registerSubmitBtn) registerSubmitBtn.textContent = t.signupButton || '회원가입'
    
    const registerHasAccount = document.getElementById('register-has-account')
    if (registerHasAccount) registerHasAccount.textContent = t.hasAccount || '이미 계정이 있으신가요?'
    
    const registerToLogin = document.getElementById('register-to-login')
    if (registerToLogin) registerToLogin.textContent = t.loginButton || '로그인'
}

// Export for use in other scripts
window.EventBETAuth = {
    isLoggedIn,
    getCurrentUser,
    showAuthRequiredModal,
    showLoginModal,
    showRegisterModal
}
