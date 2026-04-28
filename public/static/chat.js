// Chat System with Auto-Translation, Voice/Video Call, and File Upload
// Telegram-style UI/UX with HelloTalk-like auto-translation

class ChatSystem {
    constructor() {
        this.isOpen = false
        this.isRecording = false
        this.recordingStartTime = null
        this.recordingTimer = null
        this.mediaRecorder = null
        this.audioChunks = []
        this.autoTranslate = true
        this.currentLanguage = 'ko'
        this.unreadCount = 0
        this.currentUser = null
        this.messages = []
        this.pollingInterval = null
        
        this.init()
    }

    init() {
        // Get current user
        const savedUser = localStorage.getItem('eventbet_user')
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser)
        }
        
        this.setupEventListeners()
        this.loadChatHistory()
        
        // Start polling for new messages if user is logged in
        if (this.currentUser) {
            this.startPolling()
        }
    }

    setupEventListeners() {
        // Chat button toggle
        const chatButton = document.getElementById('chat-button')
        if (chatButton) {
            chatButton.addEventListener('click', () => this.toggleChat())
        }

        // Close button
        const closeButton = document.getElementById('chat-close')
        if (closeButton) {
            closeButton.addEventListener('click', () => this.closeChat())
        }

        // Send message
        const sendButton = document.getElementById('chat-send')
        const inputField = document.getElementById('chat-input')
        
        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage())
        }
        
        if (inputField) {
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage()
                }
            })
        }

        // File attachment
        const attachButton = document.getElementById('chat-attach')
        const fileInput = document.getElementById('chat-file-input')
        
        if (attachButton && fileInput) {
            attachButton.addEventListener('click', () => fileInput.click())
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e))
        }

        // Voice recording
        const voiceButton = document.getElementById('chat-voice-record')
        if (voiceButton) {
            voiceButton.addEventListener('click', () => this.toggleRecording())
        }

        // Translation toggle
        const translateButton = document.getElementById('chat-translate-toggle')
        if (translateButton) {
            translateButton.addEventListener('click', () => this.toggleTranslation())
        }

        // Video call
        const videoButton = document.getElementById('chat-video-call')
        if (videoButton) {
            videoButton.addEventListener('click', () => this.startVideoCall())
        }

        // Voice call
        const voiceCallButton = document.getElementById('chat-voice-call')
        if (voiceCallButton) {
            voiceCallButton.addEventListener('click', () => this.startVoiceCall())
        }
    }

    toggleChat() {
        if (!this.currentUser) {
            showPopup('채팅을 사용하려면 로그인이 필요합니다', 'warning')
            setTimeout(() => showLoginModal(), 1500)
            return
        }
        
        this.isOpen = !this.isOpen
        const chatWindow = document.getElementById('chat-window')
        
        if (this.isOpen) {
            chatWindow.classList.remove('hidden')
            this.unreadCount = 0
            this.updateUnreadBadge()
            this.scrollToBottom()
        } else {
            chatWindow.classList.add('hidden')
        }
    }

    closeChat() {
        this.isOpen = false
        const chatWindow = document.getElementById('chat-window')
        chatWindow.classList.add('hidden')
    }

    async sendMessage() {
        const inputField = document.getElementById('chat-input')
        const message = inputField.value.trim()
        
        if (!message) return
        if (!this.currentUser) {
            showPopup('로그인이 필요합니다', 'warning')
            return
        }
        
        try {
            const response = await fetch('/api/chat/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: this.currentUser.id,
                    message: message,
                    message_type: 'text'
                })
            })
            
            const data = await response.json()
            
            if (data.success) {
                inputField.value = ''
                this.appendMessage({
                    ...data.message,
                    is_admin_reply: false,
                    is_own: true
                })
            } else {
                showPopup('메시지 전송 실패', 'error')
            }
        } catch (error) {
            console.error('Send message error:', error)
            showPopup('메시지 전송 중 오류가 발생했습니다', 'error')
        }
    }

    async loadChatHistory() {
        if (!this.currentUser) return
        
        try {
            const response = await fetch(`/api/chat/messages/${this.currentUser.id}`)
            const data = await response.json()
            
            if (data.success) {
                this.messages = data.messages
                this.renderMessages()
                this.scrollToBottom()
            }
        } catch (error) {
            console.error('Load chat history error:', error)
        }
    }

    renderMessages() {
        const container = document.getElementById('chat-messages')
        if (!container) return
        
        // Keep welcome message
        const welcomeMsg = container.querySelector('.text-center')
        
        if (this.messages.length === 0) {
            return
        }
        
        // Remove welcome message if there are messages
        if (welcomeMsg) {
            welcomeMsg.remove()
        }
        
        // Clear and render messages
        container.innerHTML = ''
        this.messages.reverse().forEach(msg => {
            this.appendMessage({
                ...msg,
                is_own: !msg.is_admin_reply
            })
        })
    }

    appendMessage(data) {
        const container = document.getElementById('chat-messages')
        if (!container) return
        
        const messageDiv = document.createElement('div')
        messageDiv.className = `flex ${data.is_own ? 'justify-end' : 'justify-start'} mb-4`
        
        const isAdmin = data.is_admin_reply
        
        messageDiv.innerHTML = `
            <div class="max-w-xs ${data.is_own ? 'order-2' : 'order-1'}">
                <div class="${data.is_own ? 'bg-teal-500' : 'bg-white dark:bg-gray-700'} rounded-2xl px-4 py-2 shadow">
                    <p class="${data.is_own ? 'text-white' : 'text-gray-800 dark:text-gray-200'} text-sm">${this.escapeHtml(data.message)}</p>
                    ${data.translated_message ? `<p class="text-xs opacity-75 mt-1 pt-1 border-t ${data.is_own ? 'border-white/20' : 'border-gray-200'}">🌐 ${this.escapeHtml(data.translated_message)}</p>` : ''}
                    ${data.file_url ? `<img src="${data.file_url}" class="mt-2 rounded-lg max-w-full" alt="Attachment">` : ''}
                </div>
                <p class="text-xs text-gray-400 mt-1 ${data.is_own ? 'text-right' : 'text-left'}">
                    ${isAdmin ? '관리자' : '나'} • ${this.formatTime(data.created_at)}
                </p>
            </div>
        `
        
        container.appendChild(messageDiv)
        this.scrollToBottom()
    }

    escapeHtml(text) {
        const div = document.createElement('div')
        div.textContent = text
        return div.innerHTML
    }

    formatTime(timestamp) {
        const date = new Date(timestamp)
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes}`
    }

    scrollToBottom() {
        const container = document.getElementById('chat-messages')
        if (container) {
            setTimeout(() => {
                container.scrollTop = container.scrollHeight
            }, 100)
        }
    }

    startPolling() {
        // Poll for new messages every 5 seconds
        this.pollingInterval = setInterval(() => {
            this.loadChatHistory()
        }, 5000)
    }

    stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval)
            this.pollingInterval = null
        }
    }

    async handleFileUpload(event) {
        const file = event.target.files[0]
        if (!file) return
        
        if (!file.type.startsWith('image/')) {
            showPopup('이미지 파일만 업로드 가능합니다', 'warning')
            return
        }
        
        if (file.size > 5 * 1024 * 1024) {
            showPopup('파일 크기는 5MB 이하여야 합니다', 'warning')
            return
        }
        
        showPopup('파일 업로드 기능은 준비 중입니다', 'warning')
        // TODO: Implement file upload to R2 storage
    }

    async toggleRecording() {
        if (!this.isRecording) {
            await this.startRecording()
        } else {
            await this.stopRecording()
        }
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            this.mediaRecorder = new MediaRecorder(stream)
            this.audioChunks = []
            
            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data)
            }
            
            this.mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' })
                // TODO: Upload to R2 and send as message
                showPopup('음성 메시지 기능은 준비 중입니다', 'warning')
            }
            
            this.mediaRecorder.start()
            this.isRecording = true
            this.recordingStartTime = Date.now()
            
            // Show recording indicator
            const indicator = document.getElementById('chat-recording-indicator')
            indicator.classList.remove('hidden')
            
            // Start timer (max 30 seconds)
            this.recordingTimer = setInterval(() => {
                const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000)
                const timer = document.getElementById('chat-recording-timer')
                timer.textContent = `${Math.floor(elapsed / 60).toString().padStart(2, '0')}:${(elapsed % 60).toString().padStart(2, '0')}`
                
                if (elapsed >= 30) {
                    this.stopRecording()
                }
            }, 100)
        } catch (error) {
            console.error('Recording error:', error)
            showPopup('마이크 접근 권한이 필요합니다', 'error')
        }
    }

    async stopRecording() {
        if (!this.isRecording) return
        
        this.mediaRecorder.stop()
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop())
        this.isRecording = false
        
        if (this.recordingTimer) {
            clearInterval(this.recordingTimer)
            this.recordingTimer = null
        }
        
        const indicator = document.getElementById('chat-recording-indicator')
        indicator.classList.add('hidden')
    }

    toggleTranslation() {
        this.autoTranslate = !this.autoTranslate
        const button = document.getElementById('chat-translate-toggle')
        
        if (this.autoTranslate) {
            button.classList.add('text-teal-500')
            showPopup('자동 번역이 활성화되었습니다', 'success')
        } else {
            button.classList.remove('text-teal-500')
            showPopup('자동 번역이 비활성화되었습니다', 'success')
        }
    }

    startVideoCall() {
        showPopup('영상 통화 기능은 준비 중입니다', 'warning')
        // TODO: Implement WebRTC video call
    }

    startVoiceCall() {
        showPopup('음성 통화 기능은 준비 중입니다', 'warning')
        // TODO: Implement WebRTC voice call
    }

    updateUnreadBadge() {
        const badge = document.getElementById('chat-unread-badge')
        if (badge) {
            if (this.unreadCount > 0) {
                badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount
                badge.classList.remove('hidden')
            } else {
                badge.classList.add('hidden')
            }
        }
    }
}

// Initialize chat system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chatSystem = new ChatSystem()
})
