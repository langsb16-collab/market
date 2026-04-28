// EventBET Authentication System
// API-based user management with social login support

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
async function handleLogin(event) {
    event.preventDefault()
    
    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        
        const data = await response.json()
        
        if (data.success) {
            currentUser = data.user
            localStorage.setItem('eventbet_user', JSON.stringify(currentUser))
            updateUIForLoggedInUser()
            closeLoginModal()
            showPopup('로그인 성공!', 'success')
            
            // Reload page to show user-specific content
            setTimeout(() => location.reload(), 1000)
        } else {
            showPopup(data.error || '로그인 실패', 'error')
        }
    } catch (error) {
        console.error('Login error:', error)
        showPopup('로그인 중 오류가 발생했습니다', 'error')
    }
}

// Handle register
async function handleRegister(event) {
    event.preventDefault()
    
    const name = document.getElementById('register-name').value
    const phone = document.getElementById('register-phone').value
    const wallet = document.getElementById('register-wallet').value
    const email = document.getElementById('register-email').value
    const password = document.getElementById('register-password').value
    const confirmPassword = document.getElementById('register-confirm-password').value
    const referralCode = document.getElementById('register-referral-code')?.value || ''
    
    // Validate
    if (password !== confirmPassword) {
        showPopup('비밀번호가 일치하지 않습니다', 'error')
        return
    }
    
    if (password.length < 6) {
        showPopup('비밀번호는 최소 6자 이상이어야 합니다', 'error')
        return
    }
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                name,
                phone,
                wallet_address: wallet,
                password,
                referral_code: referralCode
            })
        })
        
        const data = await response.json()
        
        if (data.success) {
            showPopup('회원가입 성공! 로그인해주세요.', 'success')
            closeRegisterModal()
            showLoginModal()
        } else {
            showPopup(data.error || '회원가입 실패', 'error')
        }
    } catch (error) {
        console.error('Register error:', error)
        showPopup('회원가입 중 오류가 발생했습니다', 'error')
    }
}

// Logout
function logout() {
    currentUser = null
    localStorage.removeItem('eventbet_user')
    updateUIForGuest()
    showPopup('로그아웃되었습니다', 'success')
    setTimeout(() => location.reload(), 1000)
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    document.getElementById('login-btn')?.classList.add('hidden')
    document.getElementById('register-btn')?.classList.add('hidden')
    
    const userProfile = document.getElementById('user-profile')
    if (userProfile) {
        userProfile.classList.remove('hidden')
        userProfile.classList.add('flex')
    }
    
    const userName = document.getElementById('user-name')
    if (userName) {
        userName.textContent = currentUser.name || currentUser.email
    }
}

// Update UI for guest
function updateUIForGuest() {
    document.getElementById('login-btn')?.classList.remove('hidden')
    document.getElementById('register-btn')?.classList.remove('hidden')
    
    const userProfile = document.getElementById('user-profile')
    if (userProfile) {
        userProfile.classList.add('hidden')
        userProfile.classList.remove('flex')
    }
}

// Show auth required modal
function showAuthRequiredModal(message) {
    showPopup(message, 'warning')
    setTimeout(() => showLoginModal(), 1500)
}

// Get current user
function getCurrentUser() {
    return currentUser
}

// Check if user is logged in
function isLoggedIn() {
    return currentUser !== null
}

// ========== SOCIAL LOGIN FUNCTIONS ==========

// Kakao Login
async function loginWithKakao() {
    try {
        // Initialize Kakao SDK (you need to add Kakao SDK script to index.html)
        if (!window.Kakao) {
            showPopup('Kakao SDK가 로드되지 않았습니다', 'error')
            return
        }
        
        if (!window.Kakao.isInitialized()) {
            // Replace with your Kakao JavaScript Key
            window.Kakao.init('YOUR_KAKAO_JS_KEY')
        }
        
        window.Kakao.Auth.login({
            success: async function(authObj) {
                // Get user info
                window.Kakao.API.request({
                    url: '/v2/user/me',
                    success: async function(res) {
                        const kakaoAccount = res.kakao_account
                        const profile = kakaoAccount.profile
                        
                        // Send to backend
                        const response = await fetch('/api/auth/social/kakao', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                kakao_id: res.id,
                                email: kakaoAccount.email,
                                name: profile.nickname,
                                avatar_url: profile.profile_image_url,
                                referral_code: document.getElementById('register-referral-code')?.value || ''
                            })
                        })
                        
                        const data = await response.json()
                        
                        if (data.success) {
                            currentUser = data.user
                            localStorage.setItem('eventbet_user', JSON.stringify(currentUser))
                            updateUIForLoggedInUser()
                            closeLoginModal()
                            closeRegisterModal()
                            showPopup('카카오 로그인 성공!', 'success')
                            setTimeout(() => location.reload(), 1000)
                        } else {
                            showPopup(data.error || '카카오 로그인 실패', 'error')
                        }
                    },
                    fail: function(error) {
                        console.error('Kakao user info error:', error)
                        showPopup('카카오 사용자 정보를 가져올 수 없습니다', 'error')
                    }
                })
            },
            fail: function(err) {
                console.error('Kakao login error:', err)
                showPopup('카카오 로그인 실패', 'error')
            }
        })
    } catch (error) {
        console.error('Kakao login error:', error)
        showPopup('카카오 로그인 중 오류가 발생했습니다', 'error')
    }
}

// Facebook Login
async function loginWithFacebook() {
    showPopup('Facebook 로그인은 준비 중입니다', 'warning')
    // TODO: Implement Facebook Login
}

// Instagram Login
async function loginWithInstagram() {
    showPopup('Instagram 로그인은 준비 중입니다', 'warning')
    // TODO: Implement Instagram Login
}

// Twitter/X Login
async function loginWithTwitter() {
    showPopup('X(Twitter) 로그인은 준비 중입니다', 'warning')
    // TODO: Implement Twitter Login
}

// Export functions for global use
window.loginWithKakao = loginWithKakao
window.loginWithFacebook = loginWithFacebook
window.loginWithInstagram = loginWithInstagram
window.loginWithTwitter = loginWithTwitter
window.handleLogin = handleLogin
window.handleRegister = handleRegister
window.closeLoginModal = closeLoginModal
window.closeRegisterModal = closeRegisterModal
window.getCurrentUser = getCurrentUser
window.isLoggedIn = isLoggedIn
