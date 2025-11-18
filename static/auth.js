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
                showAuthRequiredModal('이슈를 등록하려면 로그인이 필요합니다.')
            }
        })
    }
}

// Show login modal
function showLoginModal() {
    const modal = document.getElementById('login-modal')
    if (modal) {
        modal.classList.remove('hidden')
        modal.classList.add('flex')
    }
}

// Show register modal
function showRegisterModal() {
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
    
    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('eventbet_users') || '[]')
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password)
    
    if (user) {
        // Check if user is suspended
        if (user.status === 'suspended') {
            alert('정지된 계정입니다. 관리자에게 문의하세요.')
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
        alert('로그인 성공!')
    } else {
        alert('이메일 또는 비밀번호가 올바르지 않습니다.')
    }
}

// Handle registration
function handleRegister(event) {
    event.preventDefault()
    
    const name = document.getElementById('register-name').value
    const phone = document.getElementById('register-phone').value
    const wallet = document.getElementById('register-wallet').value
    const email = document.getElementById('register-email').value
    const password = document.getElementById('register-password').value
    const confirmPassword = document.getElementById('register-confirm-password').value
    
    // Validation
    if (password !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.')
        return
    }
    
    if (password.length < 6) {
        alert('비밀번호는 최소 6자 이상이어야 합니다.')
        return
    }
    
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('eventbet_users') || '[]')
    if (users.some(u => u.email === email)) {
        alert('이미 등록된 이메일입니다.')
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
    
    alert('회원가입이 완료되었습니다! 로그인해주세요.')
    closeRegisterModal()
}

// Logout
function logout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        currentUser = null
        localStorage.removeItem('eventbet_user')
        updateUIForGuest()
        alert('로그아웃 되었습니다.')
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
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4'
    modal.innerHTML = `
        <div class="modal-content rounded-lg p-6 max-w-md w-full text-center">
            <i class="fas fa-lock text-5xl text-yellow-500 mb-4"></i>
            <h3 class="text-xl font-bold mb-3">로그인이 필요합니다</h3>
            <p class="text-secondary mb-6">${message}</p>
            <div class="flex space-x-3">
                <button onclick="this.closest('.fixed').remove(); showLoginModal()" class="flex-1 btn-primary py-3 rounded-lg font-semibold">
                    <i class="fas fa-sign-in-alt mr-2"></i>
                    로그인
                </button>
                <button onclick="this.closest('.fixed').remove(); showRegisterModal()" class="flex-1 btn-primary py-3 rounded-lg font-semibold">
                    <i class="fas fa-user-plus mr-2"></i>
                    회원가입
                </button>
            </div>
            <button onclick="this.closest('.fixed').remove()" class="mt-3 text-secondary hover:text-accent">
                닫기
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

// Export for use in other scripts
window.EventBETAuth = {
    isLoggedIn,
    getCurrentUser,
    showAuthRequiredModal,
    showLoginModal,
    showRegisterModal
}
