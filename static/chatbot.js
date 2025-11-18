// AI 자동응답 봇 - EventBET (업데이트: 상세 Q&A 19개 주제)
const chatbotData = {
    // Q1. 플랫폼 소개
    "플랫폼|무엇|소개": "EventBET은 블록체인 기반의 '예측 시장(prediction market)' 플랫폼으로, 전세계 이슈에 대해 사용자들이 베팅(예측)하고 결과에 따라 보상을 받을 수 있는 서비스입니다. 웹사이트: cashiq.my",
    
    // Q2. 암호화폐 사용 (USDT만)
    "암호화폐|코인|USDT|테더": "플랫폼에서 명시된 암호화폐는 USDT 1종류만 거래합니다. 비트코인(BTC)이나 이더리움(ETH)은 지원하지 않습니다.",
    
    // Q3. 배당률 구조
    "배당|배당률|odds": "승자 독식 배당 구조로, 총 베팅액에서 플랫폼 수수료(7%)를 뺀 금액이 승자에게 분배됩니다.\n\n📊 예시:\n예측 A에 100명 × 1 USDT, 예측 B에 50명 × 1 USDT\n→ 총 베팅액 150 USDT\n→ 수수료 7% (10.5 USDT) 차감\n→ 승자 풀 139.5 USDT\n→ 예측 A가 승리하면 A 베팅자 각각 약 1.395 USDT 수령",
    
    // Q4. 수수료
    "수수료|fee|비용": "플랫폼 거래 수수료는 7%입니다.\n\n⚠️ 추가 비용:\n- 거래소 입출금 수수료\n- 네트워크 송금 비용(가스비)\n이러한 추가 비용은 EventBET과는 무관하며 사용자가 별도로 부담합니다.",
    
    // Q5. 리스크
    "리스크|위험|손실": "⚠️ 네, 리스크가 있습니다.\n\n• 무승부 없음 → 승패 결과를 정확히 예측해야 함\n• 예측이 틀리면 베팅 금액 전액 손실\n• 블록체인/암호화폐 기술에 익숙하지 않으면 지갑 연결, 가스비 등에서 추가 비용 및 기술적 어려움 발생 가능\n\n💡 신중한 예측과 충분한 이해가 필요합니다.",
    
    // Q6. 마켓 종류
    "마켓|이슈|베팅종류": "'마켓 탐색 → 카테고리 → 인기 마켓' 형태로 구성되어 있으며, 전 세계 이슈를 대상으로 하는 예측 시장이 제공됩니다.\n\n📌 주요 카테고리:\n정치, 경제 이벤트, 스포츠, 팝컬처, 기술 동향 등\n구체적인 이슈 리스트는 사이트에서 확인하세요.",
    
    // Q7. 기술 기반
    "기술|블록체인|technology": "🔗 Powered by Blockchain Technology\n\n블록체인 기반 예측 시장 플랫폼으로 투명성과 탈중앙화 구조를 지향합니다. 모든 거래가 블록체인에 기록되어 공정성이 보장됩니다.",
    
    // Q8. 지갑 연결
    "지갑|입금|출금|연결": "사이트 상단에 '지갑 연결' 메뉴가 있습니다.\n\n상세 정보:\n- 사용 가능한 지갑 타입\n- 입금 최소 액수\n- 출금 조건\n등은 회원가입 및 지갑 연결 후 확인할 수 있습니다.",
    
    // Q9. 고객 지원
    "고객|문의|지원|support|연락": "📞 고객 지원 연락처:\n\n🔹 텔레그램: @HERB4989 (판매 제휴 문의)\n🔹 이메일: locks88@naver.com (개발자 문의)\n\n✅ 24시간 이내 답변\n✅ 다국어 지원\n✅ 파트너십 환영",
    
    // Q10. 언어 지원
    "언어|language|다국어": "🌍 다국어 지원:\n\n웹사이트 상단에서 선택 가능:\n• 한국어 (Korean)\n• English (영어)\n• 中文 (중국어)\n• 日本語 (일본어)",
    
    // Q11. 시장 주제
    "주제|카테고리|이벤트": "다양한 실세계 이벤트가 시장으로 제공됩니다:\n\n📌 예시 주제:\n• 정치 (선거 결과 등)\n• 입법 (법안 통과 여부)\n• 경제 지표 (GDP, 주가 등)\n• 기술 동향 (신제품 출시 등)\n• 스포츠 (경기 결과)\n• 팝컬처 (시상식, 흥행 등)\n\n예: '미국에서 올해 TikTok이 금지될 것인가?'",
    
    // Q12. 규제 및 한국 사용자 유의사항
    "규제|합법|한국|유의사항": "⚠️ 한국 사용자 유의사항:\n\n1. 암호화폐 환전·송금·세금 이슈 확인 필요\n2. 한국 법률상 합법성 및 이용 가능 여부 확인\n3. 일부 국가에서는 접근 차단 사례 있음\n4. 블록체인 지갑, 가스비용 등 기술적 절차 이해 필요\n5. 사용자 책임이 큼\n\n💡 Polymarket 등은 과거 CFTC 벌금 부과 및 미국 사용자 차단 사례 있음",
    
    // Q13. 예측시장 vs 전통 베팅 비교
    "예측시장|토토|비교|차이점": "🎯 예측시장 vs 전통 베팅(토토) 비교:\n\n【예측시장】\n✅ 확률을 거래하는 금융시장\n✅ YES/NO 주식 거래 구조\n✅ 배당률이 시장 참여자에 의해 형성\n✅ 중도 매도·헤지 가능\n✅ 정보·데이터 중심\n\n【전통 베팅】\n❌ 회사가 정한 배당률에 돈을 거는 도박\n❌ 배당률을 업체(북메이커)가 결정\n❌ 중도 환매 거의 불가\n❌ 오락·배당 중심",
    
    // Q14-16. 배당 및 수익 구조
    "수익|가격결정|배당구조": "💰 배당 및 가격 결정 방식:\n\n【예측시장】\n• 승자 독식 구조\n• 수요·공급에 따라 가격 즉시 반영\n• YES 가격 0.74 = 약 74% 발생 가능성\n• 금융시장과 같은 오더북·AMM 시스템\n\n【전통 베팅】\n• 업체가 위험 관리 차원에서 배당 조정\n• 실제 확률보다 낮은 배당률 제공 (마진 포함)\n• 장기적으로 사용자에게 불리한 구조",
    
    // Q17. 위험 구조
    "위험구조|손실위험|헤지": "⚠️ 위험 및 손실 구조:\n\n【예측시장】\n• 잘못된 예측 = 투자금 전액 손실\n• BUT 결과 확정 전 중도 매도·헤지 가능\n• 유동성 위험 존재\n\n【전통 베팅】\n• 예측이 틀리면 배팅액 전액 손실\n• 중도 헤지 거의 불가 → 리스크 통제 어려움\n• 업체 마진·배당 조정으로 장기적 승률 불리",
    
    // Q18. 투명성
    "투명|공정성|블록체인기반": "🔐 투명성 비교:\n\n【예측시장】\n✅ 블록체인 기반 → 거래 기록 투명\n✅ 결제·정산 공개\n✅ 스마트컨트랙트 기반 → 공정성 높음\n\n【전통 베팅】\n❌ 회사 내부 시스템 의존\n❌ 배당 조작 논란 가능\n❌ 정산 방식 비공개인 경우 다수",
    
    // Q19. 참여자 성격
    "참여자|사용자|투자자": "👥 참여자 성격:\n\n【예측시장】\n• 정치·경제·세계 이슈 분석하는 투자형 사용자\n• 시장 정보(뉴스/여론/데이터) 근거로 거래\n• 단순 '운 게임'보다 '통계·정보전' 성향 강함\n\n【전통 베팅】\n• 스포츠·경기 위주\n• 오락성·운 중심\n• 확률보다 '응원/감정'이 개입되는 경우 많음",
    
    // 이용 편리성
    "편리성|사용방법|접근성": "🔧 이용 편리성:\n\n【예측시장】\n• 암호화폐 지갑 필요\n• 해외 이용 시 VPN 필요할 수 있음\n• 블록체인 기술 이해 필요\n\n【전통 베팅】\n• 카드·계좌 등 일반 결제 편함\n• 접근성 매우 높음\n• 기술적 장벽 낮음",
    
    // 참여 방법
    "참여방법|사용법|시작": "🎮 EventBET 참여 방법:\n\n1️⃣ cashiq.my 사이트 접속\n2️⃣ 상단 '지갑 연결' 클릭\n3️⃣ 관심 있는 이슈(마켓) 선택\n4️⃣ YES 또는 NO에 USDT로 베팅\n5️⃣ 결과 확정 후 승리하면 자동으로 배당금 수령\n\n💡 지갑 연결이 반드시 필요합니다!",
    
    // 승자 독식 설명
    "승자독식|배당방식": "💰 승자 독식 방식 상세 설명:\n\n총 베팅액에서 플랫폼 수수료(7%)를 제외한 금액이 승자에게 분배됩니다.\n\n📌 예시:\n• 예측 A: 100명 × 1 USDT = 100 USDT\n• 예측 B: 50명 × 1 USDT = 50 USDT\n• 총액: 150 USDT\n• 수수료 7%: 10.5 USDT\n• 승자 풀: 139.5 USDT\n• A 승리 시: 각 베팅자 약 1.395 USDT 수령\n\n자신의 베팅 비율에 따라 배당금이 달라집니다.",
    
    // 도움말
    "도움말|help|명령어": "💬 AI 자동응답 봇 사용 가이드\n\n다음 키워드로 질문해보세요:\n\n🔹 기본 정보:\n• 플랫폼, 소개\n• 암호화폐, USDT\n• 배당, 수수료\n• 리스크, 위험\n\n🔹 사용 방법:\n• 마켓, 이슈\n• 지갑, 입출금\n• 참여방법, 시작\n\n🔹 상세 비교:\n• 예측시장, 토토\n• 투명성, 공정성\n• 참여자\n\n🔹 기타:\n• 언어, 고객지원\n• 규제, 한국\n• 연락처"
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
                    <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-4 shadow-2xl transform transition-all duration-300 group-hover:scale-110 animate-pulse">
                        <i class="fas fa-robot text-white text-3xl"></i>
                    </div>
                    <div class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                        AI
                    </div>
                </div>
            </div>

            <!-- 챗봇 창 -->
            <div id="chatbot-window" class="fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl z-50 hidden flex flex-col" style="height: 600px; max-height: 80vh;">
                <!-- 헤더 -->
                <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="bg-white rounded-full p-2">
                            <i class="fas fa-robot text-blue-600 text-xl"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-lg">EventBET AI 봇</h3>
                            <p class="text-xs opacity-90">24/7 자동응답</p>
                        </div>
                    </div>
                    <button id="close-chatbot" class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>

                <!-- 메시지 영역 -->
                <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    <!-- 메시지가 여기에 추가됩니다 -->
                </div>

                <!-- 빠른 질문 버튼 -->
                <div class="px-4 py-2 bg-gray-100 border-t border-gray-200">
                    <div class="text-xs text-gray-600 mb-2">빠른 질문:</div>
                    <div class="flex flex-wrap gap-2">
                        <button class="quick-question px-3 py-1 bg-white border border-blue-500 text-blue-600 rounded-full text-xs hover:bg-blue-50 transition-colors" data-question="플랫폼 소개">
                            플랫폼 소개
                        </button>
                        <button class="quick-question px-3 py-1 bg-white border border-blue-500 text-blue-600 rounded-full text-xs hover:bg-blue-50 transition-colors" data-question="암호화폐">
                            암호화폐
                        </button>
                        <button class="quick-question px-3 py-1 bg-white border border-blue-500 text-blue-600 rounded-full text-xs hover:bg-blue-50 transition-colors" data-question="배당률">
                            배당률
                        </button>
                        <button class="quick-question px-3 py-1 bg-white border border-blue-500 text-blue-600 rounded-full text-xs hover:bg-blue-50 transition-colors" data-question="고객지원">
                            고객지원
                        </button>
                    </div>
                </div>

                <!-- 입력 영역 -->
                <div class="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
                    <div class="flex space-x-2">
                        <input type="text" id="chat-input" placeholder="질문을 입력하세요..." class="flex-1 px-4 py-2 border-2 border-gray-300 rounded-full focus:border-blue-500 focus:outline-none text-sm">
                        <button id="send-message" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-6 py-2 hover:opacity-90 transition-opacity">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    addEventListeners() {
        const chatbotButton = document.getElementById('chatbot-button');
        const closeChatbot = document.getElementById('close-chatbot');
        const sendButton = document.getElementById('send-message');
        const chatInput = document.getElementById('chat-input');
        const quickQuestions = document.querySelectorAll('.quick-question');

        chatbotButton.addEventListener('click', () => this.toggleChat());
        closeChatbot.addEventListener('click', () => this.toggleChat());
        sendButton.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        quickQuestions.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.dataset.question;
                this.sendMessage(question);
            });
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWindow = document.getElementById('chatbot-window');
        const chatButton = document.getElementById('chatbot-button');

        if (this.isOpen) {
            chatWindow.classList.remove('hidden');
            chatWindow.classList.add('flex');
            chatButton.style.display = 'none';
        } else {
            chatWindow.classList.add('hidden');
            chatWindow.classList.remove('flex');
            chatButton.style.display = 'block';
        }
    }

    sendMessage(text = null) {
        const input = document.getElementById('chat-input');
        const message = text || input.value.trim();

        if (!message) return;

        // 사용자 메시지 추가
        this.addMessage(message, 'user');
        input.value = '';

        // 봇 응답
        setTimeout(() => {
            const response = this.getResponse(message);
            this.addMessage(response, 'bot');
        }, 500);
    }

    getResponse(message) {
        const lowerMessage = message.toLowerCase();

        // 키워드 매칭
        for (const [keywords, response] of Object.entries(chatbotData)) {
            const keywordList = keywords.split('|');
            if (keywordList.some(keyword => lowerMessage.includes(keyword.toLowerCase()))) {
                return response;
            }
        }

        // 기본 응답
        return "죄송합니다. 해당 질문에 대한 답변을 찾지 못했습니다. 😅\n\n'도움말'을 입력하시면 전체 질문 목록을 확인하실 수 있습니다.\n\n또는 다음 연락처로 문의해주세요:\n📞 텔레그램: @HERB4989\n📧 이메일: locks88@naver.com";
    }

    addMessage(text, type) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${type === 'user' ? 'justify-end' : 'justify-start'}`;

        const bubble = document.createElement('div');
        bubble.className = `max-w-xs px-4 py-2 rounded-2xl ${
            type === 'user' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                : 'bg-white text-gray-800 shadow-md'
        }`;
        bubble.style.whiteSpace = 'pre-wrap';
        bubble.textContent = text;

        messageDiv.appendChild(bubble);
        messagesContainer.appendChild(messageDiv);

        // 스크롤을 최하단으로
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addWelcomeMessage() {
        const welcomeMessage = "안녕하세요! 👋\n\nEventBET AI 자동응답 봇입니다.\n\n궁금하신 내용을 입력하시거나 아래 빠른 질문 버튼을 클릭해주세요!\n\n'도움말'을 입력하시면 전체 질문 목록을 확인하실 수 있습니다.";
        this.addMessage(welcomeMessage, 'bot');
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
