// AI 자동응답 봇 - EventBET
const chatbotData = {
    "이 플랫폼이 무엇인가요": "EventBET은 블록체인 기반의 '예측 시장(prediction market)' 플랫폼으로, 전세계 이슈에 대해 사용자들이 베팅(예측)하고 결과에 따라 보상을 받을 수 있는 서비스입니다.",
    
    "어떤 암호화폐를 이용하나요": "플랫폼에서 명시된 암호화폐로는 USDT 로만 거래합니다.",
    
    "배당률 구조": "승자 독식 배당 구조로, 총 베팅액에서 플랫폼 수수료를 뺀 금액이 승자에게 분배됩니다.\n\n예시: 예측 A에 100명 × 1 USDT, 예측 B에 50명 × 1 USDT → 총 베팅액 150 USDT. 수수료 7% → 10.5 USDT 제하고 승자 풀 139.5 USDT → 예측 A가 승리하면 A 베팅자 각각 약 1.395 USDT 수령.",
    
    "수수료": "플랫폼 거래 수수료는 7% 입니다.\n또한 본인 유저 사용하는 거래소 입출금 수수료나 네트워크 송금 비용(가스비) 등이 추가될 수 있으며, 이는 EventBET 하고는 상관없습니다.",
    
    "리스크": "네 — 있습니다. 무승부는 없으므로 승패 결과를 정확히 하기위한 신중함과 예측력이 필요합니다.\n이런 구조 특성상 예측이 틀릴 경우 '베팅한 금액을 잃을 수 있음'이라는 점을 숙지해야 합니다.\n블록체인 및 암호화폐에 익숙하지 않은 사용자는 '지갑 연결', '네트워크 송금(가스비)' 등의 구조에서 추가 비용이나 기술적 리스크가 있을 수 있으므로 미리 이해해야 합니다.",
    
    "마켓": "마켓 탐색 → 카테고리 → 인기 마켓 형태로 메뉴가 구성되어 있으며, 전 세계 이슈를 대상으로 하는 예측 시장들이 제공됩니다.\n다만 구체적인 개별 이슈 리스트(예: 정치, 경제 이벤트, 스포츠 등)는 사이트에서 더 확인해야 합니다.",
    
    "기술": "Powered by Blockchain Technology - 블록체인 기반 예측 시장 관련 기술입니다.\n즉 투명성・탈중앙화 구조를 지향하고 있습니다.",
    
    "지갑": "사이트 상단에 '지갑 연결' 메뉴가 존재합니다.\n구체적인 사용 가능한 지갑 타입, 입금 최소 액수, 출금 조건 등에 관해서는 회원가입 및 지갑 연결 후 확인이 필요합니다.",
    
    "문의": "텔레그램 @HERB4989 (판매 제휴 문의)\n개발자 문의 이메일: locks88@naver.com\n'24시간 이내 답변', '다국어 지원', '파트너십 환영'",
    
    "언어": "웹사이트 상단에 '한국어 English 中文 日本語' 메뉴가 있고, 다국어 지원이 됩니다.",
    
    "주제": "정치, 입법, 경제 지표, 기술 동향, 스포츠·팝 컬처 등 다양한 실세계 이벤트가 시장으로 올라옵니다.\n예컨대 '미국에서 올해 TikTok이 금지될 것인가?' 같은 질문이 거래 대상이 될 수 있습니다.",
    
    "한국": "한국에서 암호화폐 기반 예측시장을 이용할 때는 환전·송금·세금 이슈를 미리 확인해야 합니다.\n해당 플랫폼이 한국 법률상 합법인지, 또는 한국 거주자가 이용 가능한지 여부도 확인해야 합니다.\n블록체인 지갑 연결·가스비용·암호화폐 이체 등 기술적 절차가 필요하며, 사용자 책임이 큽니다.",
    
    "규제": "예를들어, Polymarket은 과거에 CFTC로부터 등록되지 않은 파생상품 거래소로 운영했다는 이유로 벌금을 부과받았고, 미국 내 사용자가 일시적으로 차단된 적이 있습니다.\n일부 유럽 국가 및 아시아 국가에서는 도박·베팅 규제 차원에서 접근이 제한된 사례가 있습니다.",
    
    "예측시장 vs 토토": "예측시장은 '확률을 거래하는 금융시장'이고, 전통 베팅은 '회사가 정한 배당률에 돈을 거는 도박시장'입니다.\n따라서 예측시장은 정보·데이터 중심, 전통 베팅은 오락·배당 중심으로 구분됩니다.",
    
    "도움말": "다음 질문을 입력해보세요:\n• 이 플랫폼이 무엇인가요\n• 암호화폐\n• 배당률\n• 수수료\n• 리스크\n• 마켓\n• 지갑\n• 문의\n• 언어\n• 한국\n• 규제\n• 예측시장 vs 토토"
};

class ChatBot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatbotUI();
        this.addEventListeners();
        this.addWelcomeMessage();
    }

    createChatbotUI() {
        const chatbotHTML = `
            <!-- 챗봇 버튼 -->
            <div id="chatbot-button" class="fixed bottom-6 right-6 z-50 cursor-pointer group">
                <div class="relative">
                    <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                    <div class="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-4 shadow-2xl hover:scale-110 transition-transform duration-200">
                        <i class="fas fa-robot text-white text-3xl"></i>
                    </div>
                </div>
                <div class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
                    AI
                </div>
            </div>

            <!-- 챗봇 창 -->
            <div id="chatbot-window" class="fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl z-50 hidden flex-col" style="height: 600px; max-height: 80vh;">
                <!-- 헤더 -->
                <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="bg-white rounded-full p-2">
                            <i class="fas fa-robot text-blue-600 text-xl"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-lg">EventBET AI</h3>
                            <p class="text-xs opacity-90">자동응답 도우미</p>
                        </div>
                    </div>
                    <button id="chatbot-close" class="text-white hover:bg-white/20 rounded-lg p-2 transition-colors">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>

                <!-- 메시지 영역 -->
                <div id="chatbot-messages" class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    <!-- Messages will be added here -->
                </div>

                <!-- 빠른 질문 버튼 -->
                <div id="quick-questions" class="px-4 py-2 bg-white border-t flex gap-2 overflow-x-auto">
                    <button class="quick-btn px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs whitespace-nowrap hover:bg-blue-200 transition-colors" data-question="플랫폼">
                        🏠 플랫폼 소개
                    </button>
                    <button class="quick-btn px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs whitespace-nowrap hover:bg-purple-200 transition-colors" data-question="수수료">
                        💰 수수료
                    </button>
                    <button class="quick-btn px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs whitespace-nowrap hover:bg-green-200 transition-colors" data-question="문의">
                        📞 문의하기
                    </button>
                </div>

                <!-- 입력 영역 -->
                <div class="p-4 bg-white border-t rounded-b-2xl">
                    <div class="flex space-x-2">
                        <input 
                            type="text" 
                            id="chatbot-input" 
                            placeholder="질문을 입력하세요..."
                            class="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                        <button id="chatbot-send" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    addEventListeners() {
        const button = document.getElementById('chatbot-button');
        const closeBtn = document.getElementById('chatbot-close');
        const sendBtn = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');
        const quickBtns = document.querySelectorAll('.quick-btn');

        button.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.toggleChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.dataset.question;
                this.sendMessage(question);
            });
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('chatbot-window');
        const button = document.getElementById('chatbot-button');
        
        if (this.isOpen) {
            window.classList.remove('hidden');
            window.classList.add('flex');
            button.style.display = 'none';
        } else {
            window.classList.add('hidden');
            window.classList.remove('flex');
            button.style.display = 'block';
        }
    }

    addWelcomeMessage() {
        const welcomeMsg = "안녕하세요! EventBET AI 도우미입니다. 😊\n\n궁금하신 점을 물어보세요!\n\n'도움말'을 입력하시면 질문 목록을 볼 수 있습니다.";
        this.addMessage(welcomeMsg, 'bot');
    }

    sendMessage(text = null) {
        const input = document.getElementById('chatbot-input');
        const message = text || input.value.trim();

        if (!message) return;

        // 사용자 메시지 추가
        this.addMessage(message, 'user');
        input.value = '';

        // 봇 응답 (타이핑 효과)
        setTimeout(() => {
            const response = this.getResponse(message);
            this.addMessage(response, 'bot');
        }, 500);
    }

    getResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // 키워드 매칭
        for (const [keyword, response] of Object.entries(chatbotData)) {
            if (lowerMessage.includes(keyword.toLowerCase()) || 
                keyword.toLowerCase().includes(lowerMessage)) {
                return response;
            }
        }

        // 기본 응답
        return "죄송합니다. 질문을 이해하지 못했습니다. 😅\n\n'도움말'을 입력하시면 질문 가능한 주제 목록을 확인하실 수 있습니다.\n\n또는 다음으로 문의해주세요:\n📧 locks88@naver.com\n💬 텔레그램 @HERB4989";
    }

    addMessage(text, type) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${type === 'user' ? 'justify-end' : 'justify-start'}`;

        const bubble = document.createElement('div');
        bubble.className = `max-w-xs px-4 py-3 rounded-2xl ${
            type === 'user' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none' 
                : 'bg-white text-gray-800 shadow-md rounded-bl-none border border-gray-200'
        }`;
        bubble.style.whiteSpace = 'pre-wrap';
        bubble.textContent = text;

        messageDiv.appendChild(bubble);
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        this.messages.push({ text, type, timestamp: new Date() });
    }
}

// 페이지 로드 시 챗봇 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ChatBot();
    });
} else {
    new ChatBot();
}
