// AI 자동응답 봇 - EventBET (질문 목록 메뉴 방식)

// =========================
// 중복 실행 방지 가드
// =========================
if (window.__CHATBOT_LOADED__) {
  console.warn('ChatBot: Already loaded, skipping duplicate initialization');
  // 조기 종료를 위해 즉시 실행 함수로 래핑
  (function() { return; })();
}
window.__CHATBOT_LOADED__ = true;

// 질문과 답변 데이터 (전역 변수로 선언)
if (!window.questionList) {
  window.questionList = [
    {
        id: 1,
        question: "이 플랫폼이 무엇인가요?",
        answer: "EventBET은 블록체인 기반의 '예측 시장(prediction market)' 플랫폼으로, 전세계 이슈에 대해 사용자들이 베팅(예측)하고 결과에 따라 보상을 받을 수 있는 서비스입니다.\n\n웹사이트: cashiq.my",
        icon: "fas fa-info-circle",
        category: "기본정보"
    },
    {
        id: 2,
        question: "어떤 암호화폐를 이용하나요?",
        answer: "플랫폼에서 명시된 암호화폐는 USDT 1종류만 거래합니다.\n\n⚠️ 비트코인(BTC)이나 이더리움(ETH)은 지원하지 않습니다.",
        icon: "fas fa-coins",
        category: "기본정보"
    },
    {
        id: 3,
        question: "배당률 및 수수료 구조 자세히 알려주세요",
        answer: "✅ 배당률(Odds) 구조\n승자 독식 배당 = 총 베팅액 - 수수료\n승자들이 전체 배팅 풀을 투자 비율에 따라 분배받습니다.\n\n📊 예시:\n\n• 예측 A에 베팅: 100명 × 1 USDT = 100 USDT\n• 예측 B에 베팅: 50명 × 1 USDT = 50 USDT\n• 총 베팅: 150 USDT\n• 플랫폼 수수료 7%: 10.5 USDT\n• 승자 배당 풀: 139.5 USDT\n• 예측 A 승리 시: 각 승자는 1.395 USDT 수령 (39.5% 수익)\n* 본인이 투자한 비율에 따라 수익을 가져갑니다.\n\n⚠️ 패자 손실: 결과가 발생하지 않으면 투자액 전액 손실",
        icon: "fas fa-chart-line",
        category: "수수료/배당"
    },
    {
        id: 4,
        question: "게시물(이벤트) 수수료, 즉 떼어가는 돈, 운영자 수수료",
        answer: "⚙️ 수수료(Fee) 구조\n\n💰 플랫폼 거래 수수료: 7%\n인건비, 관리비, 추가 기능 개발 등에 사용됩니다.\n\n⚠️ 추가 비용:\n• 거래소 입출금 수수료\n• 네트워크 송금 비용(가스비)\n\n이러한 추가 비용은 EventBET과는 무관하며 사용자가 별도로 부담합니다.",
        icon: "fas fa-percent",
        category: "수수료/배당"
    },
    {
        id: 5,
        question: "리스크(위험)가 있나요?",
        answer: "⚠️ 네, 리스크가 있습니다.\n\n• 무승부 없음 → 승패 결과를 정확히 예측해야 함\n• 예측이 틀리면 베팅 금액 전액 손실\n• 블록체인/암호화폐 기술에 익숙하지 않으면 지갑 연결, 가스비 등에서 추가 비용 및 기술적 어려움 발생 가능\n\n💡 신중한 예측과 충분한 이해가 필요합니다.",
        icon: "fas fa-exclamation-triangle",
        category: "리스크"
    },
    {
        id: 6,
        question: "어떤 이슈(마켓)에 베팅할 수 있나요?",
        answer: "'마켓 탐색 → 카테고리 → 인기 마켓' 형태로 구성되어 있으며, 전 세계 이슈를 대상으로 하는 예측 시장이 제공됩니다.\n\n📌 주요 카테고리:\n정치, 경제 이벤트, 스포츠, 팝컬처, 기술 동향 등\n\n구체적인 이슈 리스트는 사이트에서 확인하세요.",
        icon: "fas fa-list",
        category: "이용방법"
    },
    {
        id: 7,
        question: "플랫폼은 어떤 기술 기반인가요?",
        answer: "🔗 Powered by Blockchain Technology\n\n블록체인 기반 예측 시장 플랫폼으로 투명성과 탈중앙화 구조를 지향합니다.\n\n모든 거래가 블록체인에 기록되어 공정성이 보장됩니다.",
        icon: "fas fa-cube",
        category: "기술"
    },
    {
        id: 8,
        question: "입출금이나 지갑 연결 절차는?",
        answer: "사이트 상단에 '지갑 연결' 메뉴가 있습니다.\n\n📌 상세 정보:\n• 사용 가능한 지갑 타입\n• 입금 최소 액수\n• 출금 조건\n\n등은 회원가입 및 지갑 연결 후 확인할 수 있습니다.",
        icon: "fas fa-wallet",
        category: "이용방법"
    },
    {
        id: 9,
        question: "고객지원이나 파트너십 문의는?",
        answer: "📞 고객 지원 연락처:\n\n🔹 텔레그램: @HERB4989\n   (판매 제휴 문의)\n\n🔹 이메일: locks88@naver.com\n   (개발자 문의)\n\n✅ 24시간 이내 답변\n✅ 다국어 지원\n✅ 파트너십 환영",
        icon: "fas fa-headset",
        category: "고객지원"
    },
    {
        id: 10,
        question: "다른 언어도 지원되나요?",
        answer: "🌍 다국어 지원:\n\n웹사이트 상단에서 선택 가능:\n• 한국어 (Korean)\n• English (영어)\n• 中文 (중국어)\n• 日本語 (일본어)",
        icon: "fas fa-language",
        category: "기본정보"
    },
    {
        id: 11,
        question: "어떤 주제의 '시장'에 참여할 수 있나요?",
        answer: "다양한 실세계 이벤트가 시장으로 제공됩니다:\n\n📌 예시 주제:\n• 정치 (선거 결과 등)\n• 입법 (법안 통과 여부)\n• 경제 지표 (GDP, 주가 등)\n• 기술 동향 (신제품 출시 등)\n• 스포츠 (경기 결과)\n• 팝컬처 (시상식, 흥행 등)\n\n예: '미국에서 올해 TikTok이 금지될 것인가?'",
        icon: "fas fa-tags",
        category: "이용방법"
    },
    {
        id: 12,
        question: "한국 사용자 유의사항은?",
        answer: "⚠️ 한국 사용자 유의사항:\n\n1. 암호화폐 환전·송금·세금 이슈 확인 필요\n2. 한국 법률상 합법성 및 이용 가능 여부 확인\n3. 일부 국가에서는 접근 차단 사례 있음\n4. 블록체인 지갑, 가스비용 등 기술적 절차 이해 필요\n5. 사용자 책임이 큼",
        icon: "fas fa-flag",
        category: "규제/법률"
    },
    {
        id: 13,
        question: "규제 및 접근 제한은?",
        answer: "⚖️ 규제 정보:\n\n예를 들어, Polymarket은 과거에 CFTC로부터 등록되지 않은 파생상품 거래소로 운영했다는 이유로 벌금을 부과받았고, 미국 내 사용자가 일시적으로 차단된 적이 있습니다.\n\n일부 유럽 국가 및 아시아 국가에서는 도박·베팅 규제 차원에서 접근이 제한된 사례가 있습니다.\n\n💡 해당 국가에서 이용 가능 여부 및 법적 책임을 사전에 확인하는 것이 중요합니다.",
        icon: "fas fa-gavel",
        category: "규제/법률"
    },
    {
        id: 14,
        question: "예측시장 vs 전통 베팅 비교",
        answer: "🎯 예측시장 vs 전통 베팅(토토):\n\n【예측시장】\n✅ 확률을 거래하는 금융시장\n✅ YES/NO 주식 거래 구조\n✅ 배당률이 시장 참여자에 의해 형성\n✅ 중도 매도·헤지 가능\n✅ 정보·데이터 중심\n\n【전통 베팅】\n❌ 회사가 정한 배당률에 돈을 거는 도박\n❌ 배당률을 업체(북메이커)가 결정\n❌ 중도 환매 거의 불가\n❌ 오락·배당 중심",
        icon: "fas fa-balance-scale",
        category: "비교분석"
    },
    {
        id: 15,
        question: "배당 및 수익 구조 차이는?",
        answer: "💰 배당 및 수익 구조:\n\n【예측시장】\n• 승자 독식 구조\n• 시장 참여자들에 의해 배당률 자연 형성\n• YES/NO 승패 결과에 따른 분배\n\n【전통 베팅】\n• 업체(북메이커)가 배당률 결정\n• 중도 환매 거의 불가\n• 업체 중심 확률 책정 → 사용자 기대수익 낮음",
        icon: "fas fa-dollar-sign",
        category: "비교분석"
    },
    {
        id: 16,
        question: "가격 결정 방식 차이는?",
        answer: "📊 가격 결정 방식:\n\n【예측시장】\n• 수요·공급, 참여자 정보가 즉시 가격에 반영\n• YES 가격 0.74 = 약 74% 발생 가능성\n• 금융시장과 같은 오더북·AMM 시스템\n\n【전통 베팅】\n• 운영자가 위험 관리 차원에서 배당 조정\n• 실제 확률보다 낮은 배당률 (마진 포함)\n• 참여자 정보 일부만 반영",
        icon: "fas fa-calculator",
        category: "비교분석"
    },
    {
        id: 17,
        question: "위험 및 손실 구조 차이는?",
        answer: "⚠️ 위험 구조:\n\n【예측시장】\n• 잘못된 예측 = 투자금 전액 손실\n• BUT 결과 확정 전 중도 매도·헤지 가능\n• 유동성 위험 존재\n\n【전통 베팅】\n• 예측 틀리면 배팅액 전액 손실\n• 중도 헤지 거의 불가 → 리스크 통제 어려움\n• 업체 마진으로 장기적 승률 불리",
        icon: "fas fa-shield-alt",
        category: "비교분석"
    },
    {
        id: 18,
        question: "합법성 및 규제 차이는?",
        answer: "⚖️ 합법성·규제:\n\n【예측시장】\n• 국가별 규제 상이\n• 일부 국가는 연구·통계 목적으로 허용\n• '도박'이 아닌 '정보 기반 거래'로 분류되기도 함\n• Polymarket 등은 특정 국가 접근 차단 경험\n\n【전통 베팅】\n• 대부분 국가에서 도박으로 분류\n• 한국: 사설토토 불법, 스포츠토토만 제한적 합법\n• 규제·단속 대상 명확",
        icon: "fas fa-book",
        category: "비교분석"
    },
    {
        id: 19,
        question: "참여자 성격 차이는?",
        answer: "👥 참여자 성격:\n\n【예측시장】\n• 정치·경제·세계 이슈 분석하는 투자형 사용자\n• 시장 정보(뉴스/여론/데이터) 근거로 거래\n• '통계·정보전' 성향 강함\n\n【전통 베팅】\n• 스포츠·경기 위주\n• 오락성·운 중심\n• 확률보다 '응원/감정'이 개입되는 경우 많음",
        icon: "fas fa-users",
        category: "비교분석"
    },
    {
        id: 20,
        question: "투명성 차이는?",
        answer: "🔐 투명성:\n\n【예측시장】\n✅ 블록체인 기반 → 거래 기록 투명\n✅ 결제·정산 공개\n✅ 스마트컨트랙트 기반 → 공정성 높음\n\n【전통 베팅】\n❌ 회사 내부 시스템 의존\n❌ 배당 조작 논란 가능\n❌ 정산 방식 비공개인 경우 다수",
        icon: "fas fa-eye",
        category: "비교분석"
    },
    {
        id: 21,
        question: "이용 편리성 차이는?",
        answer: "🔧 이용 편리성:\n\n【예측시장】\n• 암호화폐 지갑 필요\n• 해외 이용 시 VPN 필요할 수 있음\n• 블록체인 기술 이해 필요\n\n【전통 베팅】\n• 카드·계좌 등 일반 결제 편함\n• 접근성 매우 높음\n• 기술적 장벽 낮음",
        icon: "fas fa-mobile-alt",
        category: "비교분석"
    }
  ];
}

class ChatBot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.currentView = 'menu'; // 'menu' or 'chat'
        this.init();
    }

    init() {
        this.createChatbotUI();
        this.addEventListeners();
        this.showMenuView();
    }

    createChatbotUI() {
        const chatbotHTML = `
            <!-- 챗봇 버튼 (2배 확대) - 진한 색상 -->
            <div id="chatbot-button" class="fixed bottom-6 right-6 z-50 cursor-pointer group">
                <div class="relative">
                    <div class="bg-gradient-to-r from-blue-800 to-purple-800 rounded-full p-8 shadow-2xl transform transition-all duration-300 group-hover:scale-110 animate-pulse">
                        <i class="fas fa-robot text-white text-6xl"></i>
                    </div>
                    <div class="absolute -top-4 -right-4 bg-red-600 text-white text-sm font-bold rounded-full w-12 h-12 flex items-center justify-center animate-bounce">
                        AI
                    </div>
                </div>
            </div>

            <!-- 챗봇 창 -->
            <div id="chatbot-window" class="fixed bottom-32 right-6 w-96 bg-white rounded-2xl shadow-2xl z-50 hidden flex flex-col" style="height: 600px; max-height: 80vh;">
                <!-- 헤더 - 진한 색상 -->
                <div class="bg-gradient-to-r from-blue-800 to-purple-800 text-white p-4 rounded-t-2xl flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="bg-white rounded-full p-2">
                            <i class="fas fa-robot text-blue-600 text-xl"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-lg">EventBET AI 봇</h3>
                            <p class="text-xs opacity-90">궁금한 질문을 선택하세요</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button id="back-to-menu" class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors hidden">
                            <i class="fas fa-arrow-left text-xl"></i>
                        </button>
                        <button id="close-chatbot" class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                </div>

                <!-- 메뉴 뷰 (질문 목록) -->
                <div id="menu-view" class="flex-1 overflow-y-auto p-4 bg-gray-50">
                    <div class="mb-4">
                        <h4 class="text-sm font-bold text-gray-600 mb-2">💬 자주 묻는 질문</h4>
                        <p class="text-xs text-gray-500 mb-4">궁금하신 내용을 선택해주세요</p>
                    </div>

                    <!-- 카테고리별 질문 -->
                    <div id="questions-container" class="space-y-3">
                        <!-- 질문 버튼들이 여기에 추가됩니다 -->
                    </div>
                </div>

                <!-- 채팅 뷰 -->
                <div id="chat-view" class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 hidden">
                    <!-- 메시지가 여기에 추가됩니다 -->
                </div>

                <!-- 입력 영역 (채팅 뷰에서만 표시) -->
                <div id="chat-input-area" class="p-4 bg-white border-t border-gray-200 rounded-b-2xl hidden">
                    <div class="flex space-x-2">
                        <input type="text" id="chat-input" placeholder="질문을 입력하세요..." class="flex-1 px-4 py-2 border-2 border-gray-300 rounded-full focus:border-blue-500 focus:outline-none text-sm">
                        <button id="send-message" class="bg-gradient-to-r from-blue-800 to-purple-800 text-white rounded-full px-6 py-2 hover:opacity-90 transition-opacity">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>

                <!-- 푸터 (메뉴 뷰에서만 표시) -->
                <div id="menu-footer" class="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
                    <div class="text-center text-xs text-gray-500">
                        <p>📞 추가 문의: @HERB4989 (텔레그램)</p>
                        <p class="mt-1">📧 locks88@naver.com</p>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    addEventListeners() {
        const chatbotButton = document.getElementById('chatbot-button');
        const closeChatbot = document.getElementById('close-chatbot');
        const backToMenu = document.getElementById('back-to-menu');
        const sendButton = document.getElementById('send-message');
        const chatInput = document.getElementById('chat-input');

        chatbotButton.addEventListener('click', () => this.toggleChat());
        closeChatbot.addEventListener('click', () => this.toggleChat());
        backToMenu.addEventListener('click', () => this.showMenuView());
        
        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
        }
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWindow = document.getElementById('chatbot-window');
        const chatButton = document.getElementById('chatbot-button');

        if (this.isOpen) {
            chatWindow.classList.remove('hidden');
            chatWindow.classList.add('flex');
            chatButton.style.display = 'none';
            this.showMenuView();
        } else {
            chatWindow.classList.add('hidden');
            chatWindow.classList.remove('flex');
            chatButton.style.display = 'block';
        }
    }

    showMenuView() {
        this.currentView = 'menu';
        
        // 뷰 전환
        document.getElementById('menu-view').classList.remove('hidden');
        document.getElementById('chat-view').classList.add('hidden');
        document.getElementById('chat-input-area').classList.add('hidden');
        document.getElementById('menu-footer').classList.remove('hidden');
        document.getElementById('back-to-menu').classList.add('hidden');

        // 질문 목록 생성
        this.renderQuestions();
    }

    showChatView() {
        this.currentView = 'chat';
        
        // 뷰 전환
        document.getElementById('menu-view').classList.add('hidden');
        document.getElementById('chat-view').classList.remove('hidden');
        document.getElementById('chat-input-area').classList.remove('hidden');
        document.getElementById('menu-footer').classList.add('hidden');
        document.getElementById('back-to-menu').classList.remove('hidden');

        // 메시지 초기화
        document.getElementById('chat-view').innerHTML = '';
    }

    renderQuestions() {
        const container = document.getElementById('questions-container');
        container.innerHTML = '';

        // 카테고리별로 그룹화
        const categories = {};
        questionList.forEach(q => {
            if (!categories[q.category]) {
                categories[q.category] = [];
            }
            categories[q.category].push(q);
        });

        // 카테고리별로 렌더링
        Object.entries(categories).forEach(([category, questions]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'mb-4';
            
            const categoryTitle = document.createElement('h5');
            categoryTitle.className = 'text-xs font-bold text-blue-800 mb-2 flex items-center';
            categoryTitle.innerHTML = `<i class="fas fa-folder mr-2"></i>${category}`;
            categoryDiv.appendChild(categoryTitle);

            questions.forEach(q => {
                const button = document.createElement('button');
                button.className = 'w-full text-left px-4 py-3 mb-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-700 hover:bg-blue-50 transition-all text-sm flex items-center space-x-3 group';
                button.innerHTML = `
                    <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-700 to-purple-700 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <i class="${q.icon} text-xs"></i>
                    </div>
                    <div class="flex-1">
                        <p class="font-semibold text-gray-800 group-hover:text-blue-800">${q.question}</p>
                    </div>
                    <i class="fas fa-chevron-right text-gray-400 group-hover:text-blue-800"></i>
                `;
                button.addEventListener('click', () => this.selectQuestion(q));
                categoryDiv.appendChild(button);
            });

            container.appendChild(categoryDiv);
        });
    }

    selectQuestion(question) {
        this.showChatView();
        
        // 사용자가 선택한 질문 표시
        this.addMessageToChat(question.question, 'user');
        
        // 봇 응답
        setTimeout(() => {
            this.addMessageToChat(question.answer, 'bot');
        }, 500);
    }

    addMessageToChat(text, type) {
        const chatView = document.getElementById('chat-view');
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${type === 'user' ? 'justify-end' : 'justify-start'}`;

        const bubble = document.createElement('div');
        bubble.className = `max-w-xs px-4 py-2 rounded-2xl ${
            type === 'user' 
                ? 'bg-gradient-to-r from-blue-800 to-purple-800 text-white' 
                : 'bg-white text-gray-800 shadow-md'
        }`;
        bubble.style.whiteSpace = 'pre-wrap';
        bubble.textContent = text;

        messageDiv.appendChild(bubble);
        chatView.appendChild(messageDiv);

        // 스크롤을 최하단으로
        chatView.scrollTop = chatView.scrollHeight;
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();

        if (!message) return;

        // 사용자 메시지 추가
        this.addMessageToChat(message, 'user');
        input.value = '';

        // 키워드 검색
        setTimeout(() => {
            const response = this.searchAnswer(message);
            this.addMessageToChat(response, 'bot');
        }, 500);
    }

    searchAnswer(query) {
        const lowerQuery = query.toLowerCase();
        
        // 질문 제목에서 검색
        for (const q of questionList) {
            if (q.question.toLowerCase().includes(lowerQuery)) {
                return q.answer;
            }
        }

        // 키워드로 검색
        const keywords = {
            "플랫폼": 1,
            "암호화폐": 2,
            "배당": 3,
            "수수료": 4,
            "리스크": 5,
            "위험": 5,
            "마켓": 6,
            "이슈": 6,
            "기술": 7,
            "블록체인": 7,
            "지갑": 8,
            "입금": 8,
            "출금": 8,
            "문의": 9,
            "고객": 9,
            "언어": 10,
            "주제": 11,
            "한국": 12,
            "규제": 13,
            "비교": 14,
            "토토": 14
        };

        for (const [keyword, id] of Object.entries(keywords)) {
            if (lowerQuery.includes(keyword)) {
                const question = questionList.find(q => q.id === id);
                if (question) return question.answer;
            }
        }

        // 기본 응답
        return "죄송합니다. 해당 질문에 대한 답변을 찾지 못했습니다. 😅\n\n왼쪽 상단의 ← 버튼을 클릭하여 질문 목록으로 돌아가세요.\n\n또는 다음 연락처로 문의해주세요:\n📞 텔레그램: @HERB4989\n📧 이메일: locks88@naver.com";
    }
}

// 페이지 로드 시 챗봇 초기화
if (!window.__CHATBOT_INITIALIZED__) {
    window.__CHATBOT_INITIALIZED__ = true;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (!window.chatbotInstance) {
                window.chatbotInstance = new ChatBot();
                console.log('ChatBot: Initialized via DOMContentLoaded');
            }
        });
    } else {
        if (!window.chatbotInstance) {
            window.chatbotInstance = new ChatBot();
            console.log('ChatBot: Initialized immediately');
        }
    }
}
