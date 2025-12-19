// EventBET - Static Frontend Application
// Enhanced with 450 markets (50 per category, all within 1 month)

console.log('EventBET: Script loaded')

let currentLang = 'ko'
let currentWallet = null
let isDarkMode = false
let currentCategory = 'all'
let displayedMarkets = 12
const MARKETS_PER_PAGE = 12
let currentSortBy = 'date' // 'date', 'volume', 'participants'

console.log('EventBET: Variables initialized')

// Get date within next 30 days
const getRandomDateWithinMonth = () => {
    const today = new Date()
    const daysAhead = Math.floor(Math.random() * 30) + 1
    const futureDate = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000)
    return futureDate.toISOString().split('T')[0]
}

// Translations (abbreviated)
const translations = {
    ko: {
        title: 'EventBET(이벤트벳) - 예측 시장 블록체인 배팅 플랫폼',
        subtitle: 'Where Global Events Meet Your Predictions',
        description: '전 세계 이슈와 당신의 예측이 만나는 곳',
        explore: '마켓 탐색',
        categories: '카테고리',
        trending: '인기 마켓',
        connectWallet: '지갑 연결',
        placeBet: '베팅하기',
        resolvesOn: '결과 발표',
        volume: '거래량',
        submitIssue: '이슈 등록',
        searchPlaceholder: '마켓 검색...',
        loadMore: '더 보기',
        showingMarkets: '개 마켓 표시 중',
        totalMarkets: '전체',
        individual: '개',
    },
    en: {
        title: 'EventBET - Blockchain Betting Platform',
        subtitle: 'Where Global Events Meet Your Predictions',
        description: 'Your predictions meet real-world events',
        explore: 'Explore Markets',
        categories: 'Categories',
        trending: 'Trending Markets',
        connectWallet: 'Connect Wallet',
        placeBet: 'Place Bet',
        resolvesOn: 'Resolves on',
        volume: 'Volume',
        submitIssue: 'Submit Issue',
        searchPlaceholder: 'Search markets...',
        loadMore: 'Load More',
        showingMarkets: 'markets shown',
        totalMarkets: 'Total',
        individual: '',
    },
    zh: {
        title: 'EventBET - 区块链博彩平台',
        subtitle: 'Where Global Events Meet Your Predictions',
        description: '您的预测与现实世界事件相遇',
        explore: '探索市场',
        categories: '分类',
        trending: '热门市场',
        connectWallet: '连接钱包',
        placeBet: '下注',
        resolvesOn: '结算日期',
        volume: '交易量',
        submitIssue: '提交问题',
        searchPlaceholder: '搜索市场...',
        loadMore: '加载更多',
        showingMarkets: '个市场',
        totalMarkets: '总计',
        individual: '个',
    },
    ja: {
        title: 'EventBET - ブロックチェーン賭博プラットフォーム',
        subtitle: 'Where Global Events Meet Your Predictions',
        description: 'あなたの予測が現実の出来事と出会う',
        explore: 'マーケットを探す',
        categories: 'カテゴリー',
        trending: 'トレンド市場',
        connectWallet: 'ウォレット接続',
        placeBet: 'ベットする',
        resolvesOn: '決済日',
        volume: '取引量',
        submitIssue: '問題を提出',
        searchPlaceholder: 'マーケット検索...',
        loadMore: 'もっと見る',
        showingMarkets: '件のマーケット',
        totalMarkets: '合計',
        individual: '件',
    }
}

// Categories
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

// Event templates for each category
const eventTemplates = {
    politics: [
        { ko: '한국 국회 법안 통과 여부', en: 'Korean Parliament Bill Passage', zh: '韩国国会法案通过', ja: '韓国国会法案通過' },
        { ko: '미국 대통령 정책 발표', en: 'US President Policy Announcement', zh: '美国总统政策宣布', ja: '米大統領政策発表' },
        { ko: '유럽 선거 결과 예측', en: 'European Election Results', zh: '欧洲选举结果', ja: '欧州選挙結果' },
        { ko: '일본 내각 개각 여부', en: 'Japan Cabinet Reshuffle', zh: '日本内阁改组', ja: '日本内閣改造' },
        { ko: '중국 정책 변화 발표', en: 'China Policy Change', zh: '中国政策变化', ja: '中国政策変更' },
        { ko: '아시아 외교 회담 성사', en: 'Asian Diplomatic Meeting', zh: '亚洲外交会议', ja: 'アジア外交会議' },
        { ko: '글로벌 정상회담 개최', en: 'Global Summit Meeting', zh: '全球峰会', ja: 'グローバルサミット' },
        { ko: '국제 조약 체결 여부', en: 'International Treaty Signing', zh: '国际条约签署', ja: '国際条約締結' },
        { ko: '신임 장관 임명 여부', en: 'New Minister Appointment', zh: '新部长任命', ja: '新大臣任命' },
        { ko: '정치 개혁안 통과', en: 'Political Reform Passage', zh: '政治改革通过', ja: '政治改革通過' },
    ],
    sports: [
        { ko: '프리미어리그 경기 결과', en: 'Premier League Match Result', zh: '英超比赛结果', ja: 'プレミアリーグ試合結果' },
        { ko: 'NBA 플레이오프 진출', en: 'NBA Playoffs Qualification', zh: 'NBA季后赛资格', ja: 'NBAプレーオフ進出' },
        { ko: '월드컵 예선 통과', en: 'World Cup Qualifier', zh: '世界杯预选赛', ja: 'W杯予選通過' },
        { ko: '올림픽 메달 획득', en: 'Olympic Medal Win', zh: '奥运奖牌', ja: '五輪メダル獲得' },
        { ko: '테니스 그랜드슬램 우승', en: 'Tennis Grand Slam Win', zh: '网球大满贯冠军', ja: 'テニスGS優勝' },
        { ko: '야구 월드시리즈 진출', en: 'World Series Qualification', zh: '世界大赛资格', ja: 'WSシリーズ進出' },
        { ko: '축구 챔피언스리그 승리', en: 'Champions League Win', zh: '欧冠胜利', ja: 'CL勝利' },
        { ko: '골프 메이저 대회 우승', en: 'Golf Major Championship', zh: '高尔夫大赛冠军', ja: 'ゴルフメジャー優勝' },
        { ko: 'UFC 타이틀 방어 성공', en: 'UFC Title Defense', zh: 'UFC卫冕成功', ja: 'UFCタイトル防衛' },
        { ko: 'F1 그랑프리 우승', en: 'F1 Grand Prix Win', zh: 'F1大奖赛冠军', ja: 'F1GP優勝' },
    ],
    technology: [
        { ko: 'iPhone 신모델 발표', en: 'New iPhone Launch', zh: 'iPhone新机发布', ja: 'iPhone新型発表' },
        { ko: 'AI 기술 혁신 발표', en: 'AI Technology Breakthrough', zh: 'AI技术突破', ja: 'AI技術革新' },
        { ko: '삼성 신제품 출시', en: 'Samsung New Product Launch', zh: '三星新产品发布', ja: 'サムスン新製品' },
        { ko: '구글 서비스 업데이트', en: 'Google Service Update', zh: '谷歌服务更新', ja: 'Googleサービス更新' },
        { ko: '테슬라 자율주행 승인', en: 'Tesla Autopilot Approval', zh: '特斯拉自动驾驶批准', ja: 'テスラ自動運転承認' },
        { ko: '메타 VR 기기 출시', en: 'Meta VR Device Launch', zh: 'Meta VR设备发布', ja: 'Meta VR機器発売' },
        { ko: '마이크로소프트 AI 통합', en: 'Microsoft AI Integration', zh: '微软AI整合', ja: 'マイクロソフトAI統合' },
        { ko: '넷플릭스 신기능 추가', en: 'Netflix New Feature', zh: '奈飞新功能', ja: 'Netflix新機能' },
        { ko: '아마존 배송 혁신', en: 'Amazon Delivery Innovation', zh: '亚马逊配送创新', ja: 'Amazon配送革新' },
        { ko: '스페이스X 발사 성공', en: 'SpaceX Launch Success', zh: 'SpaceX发射成功', ja: 'SpaceX打上成功' },
    ],
    cryptocurrency: [
        { ko: '비트코인 $70K 돌파', en: 'Bitcoin Reaches $70K', zh: '比特币突破7万美元', ja: 'ビットコイン7万ドル突破' },
        { ko: '이더리움 업그레이드 완료', en: 'Ethereum Upgrade Complete', zh: '以太坊升级完成', ja: 'イーサリアムアップグレード' },
        { ko: 'SEC ETF 승인 발표', en: 'SEC ETF Approval', zh: 'SEC ETF批准', ja: 'SEC ETF承認' },
        { ko: '리플 소송 결과 발표', en: 'Ripple Lawsuit Result', zh: '瑞波诉讼结果', ja: 'Ripple訴訟結果' },
        { ko: '바이낸스 신규 상장', en: 'Binance New Listing', zh: '币安新上市', ja: 'Binance新規上場' },
        { ko: '솔라나 네트워크 업데이트', en: 'Solana Network Update', zh: 'Solana网络更新', ja: 'Solanaネットワーク更新' },
        { ko: '카르다노 스마트컨트랙트', en: 'Cardano Smart Contract', zh: '卡尔达诺智能合约', ja: 'Cardanoスマコン' },
        { ko: '폴카닷 파라체인 추가', en: 'Polkadot Parachain Addition', zh: '波卡平行链增加', ja: 'Polkadotパラチェーン追加' },
        { ko: '체인링크 파트너십', en: 'Chainlink Partnership', zh: 'Chainlink合作', ja: 'Chainlinkパートナーシップ' },
        { ko: '아발란체 DeFi 확장', en: 'Avalanche DeFi Expansion', zh: 'Avalanche DeFi扩展', ja: 'Avalanche DeFi拡大' },
    ],
    entertainment: [
        { ko: '넷플릭스 드라마 시즌2', en: 'Netflix Drama Season 2', zh: '奈飞剧集第2季', ja: 'Netflixドラマシーズン2' },
        { ko: 'BTS 컴백 앨범 발표', en: 'BTS Comeback Album', zh: 'BTS回归专辑', ja: 'BTSカムバックアルバム' },
        { ko: '마블 신작 영화 개봉', en: 'New Marvel Movie Release', zh: '漫威新电影上映', ja: 'マーベル新作公開' },
        { ko: '블랙핑크 월드투어', en: 'Blackpink World Tour', zh: '黑粉世界巡演', ja: 'ブラックピンクワールドツアー' },
        { ko: '디즈니+ 오리지널 공개', en: 'Disney+ Original Release', zh: '迪士尼+原创发布', ja: 'ディズニー+オリジナル公開' },
        { ko: '아카데미 시상식 결과', en: 'Academy Awards Result', zh: '奥斯卡颁奖结果', ja: 'アカデミー賞結果' },
        { ko: '칸 영화제 수상작', en: 'Cannes Film Festival Winner', zh: '戛纳电影节获奖', ja: 'カンヌ映画祭受賞作' },
        { ko: '그래미 어워드 후보', en: 'Grammy Awards Nominee', zh: '格莱美奖提名', ja: 'グラミー賞ノミネート' },
        { ko: '빌보드 차트 1위', en: 'Billboard Chart #1', zh: '公告牌排行榜第1', ja: 'ビルボードチャート1位' },
        { ko: '스포티파이 스트리밍 기록', en: 'Spotify Streaming Record', zh: 'Spotify流媒体记录', ja: 'Spotifyストリーミング記録' },
    ],
    economy: [
        { ko: '한국은행 금리 인상', en: 'BOK Interest Rate Hike', zh: '韩国央行加息', ja: '韓銀利上げ' },
        { ko: '미국 GDP 성장률 발표', en: 'US GDP Growth Rate', zh: '美国GDP增长率', ja: '米GDP成長率' },
        { ko: '중국 경제 지표 개선', en: 'China Economic Indicators', zh: '中国经济指标改善', ja: '中国経済指標改善' },
        { ko: '일본 엔화 환율 변동', en: 'Japanese Yen Exchange Rate', zh: '日元汇率变动', ja: '円為替レート変動' },
        { ko: '유럽 인플레이션 하락', en: 'European Inflation Drop', zh: '欧洲通胀下降', ja: '欧州インフレ低下' },
        { ko: '글로벌 주식시장 반등', en: 'Global Stock Market Rally', zh: '全球股市反弹', ja: 'グローバル株式反発' },
        { ko: '원유 가격 급등', en: 'Oil Price Surge', zh: '原油价格飙升', ja: '原油価格急騰' },
        { ko: '금 가격 사상 최고치', en: 'Gold Price Record High', zh: '黄金价格创新高', ja: '金価格最高値' },
        { ko: '부동산 시장 회복', en: 'Real Estate Market Recovery', zh: '房地产市场复苏', ja: '不動産市場回復' },
        { ko: '반도체 수출 증가', en: 'Semiconductor Export Increase', zh: '半导体出口增加', ja: '半導体輸出増加' },
    ],
    science: [
        { ko: 'NASA 화성 탐사 성공', en: 'NASA Mars Exploration Success', zh: 'NASA火星探测成功', ja: 'NASA火星探査成功' },
        { ko: '노벨상 수상자 발표', en: 'Nobel Prize Winner Announcement', zh: '诺贝尔奖获得者公布', ja: 'ノーベル賞受賞者発表' },
        { ko: '암 치료 신약 승인', en: 'Cancer Drug Approval', zh: '癌症新药批准', ja: 'がん治療新薬承認' },
        { ko: '양자컴퓨터 돌파구', en: 'Quantum Computer Breakthrough', zh: '量子计算机突破', ja: '量子コンピュータ突破' },
        { ko: 'AI 의료 진단 성공', en: 'AI Medical Diagnosis Success', zh: 'AI医疗诊断成功', ja: 'AI医療診断成功' },
        { ko: '우주 탐사선 발사', en: 'Space Probe Launch', zh: '太空探测器发射', ja: '宇宙探査機打上' },
        { ko: '유전자 편집 기술 발전', en: 'Gene Editing Technology', zh: '基因编辑技术进展', ja: '遺伝子編集技術進展' },
        { ko: '백신 임상시험 성공', en: 'Vaccine Clinical Trial Success', zh: '疫苗临床试验成功', ja: 'ワクチン臨床試験成功' },
        { ko: '재생에너지 효율 향상', en: 'Renewable Energy Efficiency', zh: '可再生能源效率提升', ja: '再生エネ効率向上' },
        { ko: '인공장기 이식 성공', en: 'Artificial Organ Transplant', zh: '人工器官移植成功', ja: '人工臓器移植成功' },
    ],
    climate: [
        { ko: '파리기후협약 목표 달성', en: 'Paris Agreement Goal', zh: '巴黎气候协议目标', ja: 'パリ協定目標達成' },
        { ko: '탄소중립 정책 발표', en: 'Carbon Neutral Policy', zh: '碳中和政策发布', ja: 'カーボンニュートラル政策' },
        { ko: '재생에너지 투자 증가', en: 'Renewable Energy Investment', zh: '可再生能源投资增加', ja: '再生エネ投資増加' },
        { ko: '전기차 보급 확대', en: 'EV Adoption Expansion', zh: '电动车普及扩大', ja: 'EV普及拡大' },
        { ko: '플라스틱 규제 강화', en: 'Plastic Regulation Tightening', zh: '塑料监管加强', ja: 'プラスチック規制強化' },
        { ko: '산림 복원 프로젝트', en: 'Forest Restoration Project', zh: '森林恢复项目', ja: '森林復元プロジェクト' },
        { ko: '해양 보호 구역 확대', en: 'Marine Protected Area Expansion', zh: '海洋保护区扩大', ja: '海洋保護区拡大' },
        { ko: '대기오염 감소 정책', en: 'Air Pollution Reduction Policy', zh: '空气污染减少政策', ja: '大気汚染削減政策' },
        { ko: '지속가능 농업 확산', en: 'Sustainable Agriculture Spread', zh: '可持续农业推广', ja: '持続可能農業拡大' },
        { ko: '그린뉴딜 법안 통과', en: 'Green New Deal Bill', zh: '绿色新政法案通过', ja: 'グリーンニューディール法案' },
    ]
}

// Generate 450 events (50 per category)
const generateEvents = () => {
    console.log('EventBET: generateEvents() called')
    const allEvents = []
    let id = 1
    
    console.log('EventBET: Categories count:', categories.length)
    categories.forEach(category => {
        const templates = eventTemplates[category.slug]
        
        for (let i = 0; i < 50; i++) {
            const template = templates[i % templates.length]
            const variation = Math.floor(i / templates.length) + 1
            const probYes = 0.3 + Math.random() * 0.4 // 30-70%
            
            const volume = Math.floor(Math.random() * 20000000) + 1000000
            const participants = Math.floor(volume / 1000) + Math.floor(Math.random() * 500) // 이용객 수
            
            allEvents.push({
                id: id++,
                category_id: category.id,
                category_slug: category.slug,
                title_ko: `${template.ko} #${variation}`,
                title_en: `${template.en} #${variation}`,
                title_zh: `${template.zh} #${variation}`,
                title_ja: `${template.ja} #${variation}`,
                description_ko: `${template.ko} #${variation}에 대한 예측 마켓입니다.`,
                description_en: `Prediction market for ${template.en} #${variation}.`,
                description_zh: `关于${template.zh} #${variation}的预测市场。`,
                description_ja: `${template.ja} #${variation}についての予測市場です。`,
                resolve_date: getRandomDateWithinMonth(),
                total_volume: volume,
                participants: participants,
                outcomes: [
                    { id: id * 2 - 1, name: '예', probability: probYes },
                    { id: id * 2, name: '아니오', probability: 1 - probYes }
                ]
            })
        }
    })
    
    // Shuffle to mix categories
    return allEvents.sort(() => Math.random() - 0.5)
}

console.log('EventBET: About to call generateEvents()')
let events = generateEvents()

console.log(`Generated ${events.length} events`)

// Load issues from localStorage (admin panel)
try {
    const storedIssues = JSON.parse(localStorage.getItem('eventbet_issues') || '[]')
    console.log(`EventBET: Found ${storedIssues.length} issues in localStorage`)
    
    if (storedIssues.length > 0) {
        // Convert admin issues to event format
        const adminEvents = storedIssues.filter(issue => issue.status === 'active').map(issue => {
            // Determine category
            const categoryMap = {
                'crypto': 'crypto',
                'politics': 'politics',
                'sports': 'sports',
                'entertainment': 'entertainment',
                'economy': 'economy',
                'science': 'science',
                'climate': 'climate',
                'other': 'other'
            }
            const categorySlug = categoryMap[issue.category] || 'other'
            const category = categories.find(c => c.slug === categorySlug) || categories[0]
            
            // Use admin-defined betting amounts or generate random
            const totalUsdt = issue.initialUsdt || (issue.yesBet + issue.noBet) || 60
            const yesBet = issue.yesBet || 0
            const noBet = issue.noBet || 0
            const totalBet = yesBet + noBet
            
            // Calculate probability from betting amounts
            const probYes = totalBet > 0 ? yesBet / totalBet : 0.5
            
            // Volume in larger scale for display (multiply by 10000 for realistic numbers)
            const volume = totalUsdt * 10000
            const participants = Math.floor(volume / 1000) + Math.floor(Math.random() * 100)
            
            return {
                id: issue.id || Date.now(),
                category_id: category.id,
                category_slug: categorySlug,
                title_ko: issue.title,
                title_en: issue.title,
                title_zh: issue.title,
                title_ja: issue.title,
                description_ko: issue.description || issue.title,
                description_en: issue.description || issue.title,
                description_zh: issue.description || issue.title,
                description_ja: issue.description || issue.title,
                resolve_date: issue.expireDate || getRandomDateWithinMonth(),
                total_volume: volume,
                participants: participants,
                outcomes: [
                    { id: `${issue.id}-yes`, name: '예', probability: probYes },
                    { id: `${issue.id}-no`, name: '아니오', probability: 1 - probYes }
                ],
                isAdminIssue: true,
                initialUsdt: totalUsdt
            }
        })
        
        // Add admin events at the beginning
        events = [...adminEvents, ...events]
        console.log(`EventBET: Added ${adminEvents.length} admin issues, total events: ${events.length}`)
    }
} catch (error) {
    console.error('EventBET: Error loading issues from localStorage:', error)
}

// Initialize app
console.log('EventBET: Setting up DOMContentLoaded listener')
document.addEventListener('DOMContentLoaded', () => {
    console.log('EventBET: DOMContentLoaded fired!')
    console.log('EventBET: Total events available:', events.length)
    console.log('EventBET: First 3 events:', events.slice(0, 3))
    
    const savedTheme = localStorage.getItem('theme') || 'light'
    isDarkMode = savedTheme === 'dark'
    applyTheme()
    
    const savedLang = localStorage.getItem('preferred_language') || 'ko'
    currentLang = savedLang
    const langSelector = document.getElementById('language-selector')
    if (langSelector) langSelector.value = savedLang
    
    setupEventListeners()
    updateUITexts()
    renderCategories()
    
    console.log('EventBET: About to call renderMarkets()')
    try {
        renderMarkets()
        console.log('EventBET: renderMarkets() completed successfully')
    } catch (error) {
        console.error('EventBET: Error in renderMarkets():', error)
    }
})

// Setup event listeners
function setupEventListeners() {
    const langSelector = document.getElementById('language-selector')
    if (langSelector) {
        langSelector.addEventListener('change', (e) => {
            currentLang = e.target.value
            localStorage.setItem('preferred_language', currentLang)
            updateUITexts()
            renderMarkets()
        })
    }
    
    const themeToggle = document.getElementById('theme-toggle')
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme)
    
    const connectWallet = document.getElementById('connect-wallet')
    if (connectWallet) {
        connectWallet.addEventListener('click', () => {
            if (!currentWallet) {
                currentWallet = '0x' + Math.random().toString(16).substr(2, 40)
                localStorage.setItem('wallet_address', currentWallet)
                updateUITexts()
                alert('지갑 연결 성공: ' + currentWallet)
            } else {
                currentWallet = null
                localStorage.removeItem('wallet_address')
                updateUITexts()
            }
        })
    }
    
    const submitIssueBtn = document.getElementById('submit-issue-btn')
    if (submitIssueBtn) submitIssueBtn.addEventListener('click', openSubmitIssueModal)
    
    const exploreButton = document.getElementById('explore-button')
    if (exploreButton) {
        exploreButton.addEventListener('click', () => {
            document.getElementById('markets-container').scrollIntoView({ behavior: 'smooth' })
        })
    }
    
    const searchInput = document.getElementById('search-input')
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch)
    }
    
    const loadMoreBtn = document.getElementById('load-more-btn')
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreMarkets)
    }
}

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

// Update UI texts
function updateUITexts() {
    const t = translations[currentLang] || translations.ko
    
    const appTitle = document.getElementById('app-title')
    if (appTitle) appTitle.textContent = 'EventBET'
    
    const connectWalletText = document.getElementById('connect-wallet-text')
    if (connectWalletText) {
        connectWalletText.textContent = currentWallet 
            ? `${currentWallet.substring(0, 6)}...${currentWallet.substring(38)}`
            : t.connectWallet
    }
    
    const submitIssueText = document.getElementById('submit-issue-text')
    if (submitIssueText) submitIssueText.textContent = t.submitIssue
    
    const heroTitle = document.getElementById('hero-title')
    if (heroTitle) heroTitle.textContent = t.title
    
    const heroSubtitle = document.getElementById('hero-subtitle')
    if (heroSubtitle) heroSubtitle.textContent = t.subtitle
    
    const heroDescription = document.getElementById('hero-description')
    if (heroDescription) heroDescription.textContent = t.description
    
    const exploreButton = document.querySelector('#explore-button span')
    if (exploreButton) exploreButton.textContent = t.explore
    
    const categoriesTitle = document.getElementById('categories-title')
    if (categoriesTitle) categoriesTitle.textContent = t.categories
    
    const trendingTitle = document.getElementById('trending-title')
    if (trendingTitle) trendingTitle.textContent = t.trending
    
    const searchInput = document.getElementById('search-input')
    if (searchInput) searchInput.placeholder = t.searchPlaceholder
    
    updateMarketCount()
}

// Update market count
function updateMarketCount() {
    const t = translations[currentLang] || translations.ko
    const marketCount = document.getElementById('market-count')
    const filteredEvents = getFilteredEvents()
    if (marketCount) {
        marketCount.textContent = `${t.showingMarkets}: ${Math.min(displayedMarkets, filteredEvents.length)}${t.individual} / ${t.totalMarkets} ${filteredEvents.length}${t.individual}`
    }
}

// Get filtered events
function getFilteredEvents() {
    let filtered = events
    
    if (currentCategory !== 'all') {
        filtered = filtered.filter(e => e.category_slug === currentCategory)
    }
    
    const searchInput = document.getElementById('search-input')
    if (searchInput && searchInput.value) {
        const query = searchInput.value.toLowerCase()
        filtered = filtered.filter(e => 
            e.title_ko.toLowerCase().includes(query) ||
            e.title_en.toLowerCase().includes(query) ||
            e.title_zh.toLowerCase().includes(query) ||
            e.title_ja.toLowerCase().includes(query)
        )
    }
    
    // Apply sorting
    if (currentSortBy === 'date') {
        // Sort by resolve_date (earliest first)
        filtered.sort((a, b) => new Date(a.resolve_date) - new Date(b.resolve_date))
    } else if (currentSortBy === 'volume') {
        // Sort by total_volume (highest first)
        filtered.sort((a, b) => b.total_volume - a.total_volume)
    } else if (currentSortBy === 'participants') {
        // Sort by participants (highest first) - 이용객 숫자
        filtered.sort((a, b) => b.participants - a.participants)
    }
    
    return filtered
}

// Sort markets
function sortMarkets(sortBy) {
    currentSortBy = sortBy
    displayedMarkets = MARKETS_PER_PAGE
    
    // Update button states
    document.getElementById('sort-date')?.classList.remove('active')
    document.getElementById('sort-volume')?.classList.remove('active')
    document.getElementById('sort-participants')?.classList.remove('active')
    
    const activeBtn = document.getElementById('sort-' + sortBy)
    if (activeBtn) {
        activeBtn.classList.add('active')
    }
    
    renderMarkets()
}

// Handle search
function handleSearch() {
    displayedMarkets = MARKETS_PER_PAGE
    renderMarkets()
}

// Load more markets
function loadMoreMarkets() {
    displayedMarkets += MARKETS_PER_PAGE
    renderMarkets()
}

// Render categories
function renderCategories() {
    const container = document.getElementById('categories-container')
    if (!container) return
    
    const allCategory = {
        id: 'all',
        slug: 'all',
        name_ko: '전체',
        name_en: 'All',
        name_zh: '全部',
        name_ja: 'すべて',
        icon: '📋'
    }
    
    const allCategories = [allCategory, ...categories]
    
    container.innerHTML = allCategories.map(category => {
        const isActive = currentCategory === category.slug
        const categoryCount = category.slug === 'all' ? events.length : events.filter(e => e.category_slug === category.slug).length
        return `
        <div class="bg-white rounded-lg shadow-sm p-2 sm:p-3 hover:shadow-md transition-shadow cursor-pointer ${isActive ? 'ring-2 ring-blue-500' : ''}"
             onclick="filterByCategory('${category.slug}')">
            <div class="text-center">
                <div class="text-xl sm:text-2xl mb-1">${category.icon}</div>
                <h4 class="text-xs sm:text-sm font-semibold text-gray-900">${getCategoryName(category)}</h4>
                <span class="text-xs text-gray-500">${categoryCount}</span>
            </div>
        </div>
        `
    }).join('')
}

// Filter by category
function filterByCategory(categorySlug) {
    currentCategory = categorySlug
    displayedMarkets = MARKETS_PER_PAGE
    renderCategories()
    renderMarkets()
}

// Get category name
const getCategoryName = (category) => {
    return category[`name_${currentLang}`] || category.name_en
}

// Get event title
const getEventTitle = (event) => {
    return event[`title_${currentLang}`] || event.title_en
}

// Get event description
const getEventDescription = (event) => {
    return event[`description_${currentLang}`] || event.description_en
}

// Get event image with category-specific variety
const getEventImage = (categorySlug, eventId) => {
    const imageIdsByCategory = {
        'politics': [10, 15, 22, 30, 40, 82, 96, 106, 119, 152, 180, 201, 225, 250, 287, 302, 365, 403, 433, 480],
        'sports': [62, 93, 144, 158, 169, 185, 213, 247, 272, 318, 349, 374, 401, 426, 456, 488, 512, 548, 572, 601],
        'technology': [0, 1, 20, 36, 52, 77, 101, 123, 145, 173, 194, 219, 243, 268, 291, 320, 348, 381, 412, 447],
        'cryptocurrency': [11, 28, 45, 67, 89, 111, 136, 161, 189, 212, 239, 263, 292, 316, 344, 371, 395, 423, 452, 481],
        'entertainment': [16, 33, 54, 72, 94, 116, 141, 167, 195, 222, 246, 274, 300, 328, 355, 384, 410, 438, 465, 492],
        'economy': [3, 25, 47, 69, 91, 113, 138, 163, 191, 217, 241, 266, 294, 322, 350, 379, 408, 434, 461, 490],
        'science': [8, 18, 39, 60, 85, 109, 133, 157, 182, 208, 233, 257, 283, 309, 337, 363, 389, 419, 445, 475],
        'climate': [12, 29, 50, 70, 95, 117, 142, 168, 196, 221, 248, 275, 303, 330, 358, 386, 413, 440, 468, 495]
    }
    
    const categoryImages = imageIdsByCategory[categorySlug] || imageIdsByCategory['technology']
    const imageIndex = (eventId - 1) % categoryImages.length
    const imageId = categoryImages[imageIndex]
    
    return `https://picsum.photos/id/${imageId}/120/120`
}

// Format number
const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Render markets
function renderMarkets() {
    console.log('EventBET: renderMarkets() called')
    const container = document.getElementById('markets-container')
    if (!container) {
        console.error('EventBET: markets-container not found!')
        return
    }
    console.log('EventBET: markets-container found, rendering...')
    
    const filteredEvents = getFilteredEvents()
    const eventsToShow = filteredEvents.slice(0, displayedMarkets)
    
    const html = eventsToShow.map(event => {
        const category = categories.find(c => c.id === event.category_id)
        const eventImage = getEventImage(event.category_slug, event.id)
        const hasOutcomes = event.outcomes && event.outcomes.length > 0
        
        let card = '<div class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all market-card" onclick="openBetModal(' + event.id + ')">'
        card += '<div class="flex p-2 sm:p-3">'
        card += '<div class="flex-shrink-0 mr-2">'
        card += '<img src="' + eventImage + '" alt="' + getCategoryName(category) + '" class="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover" onerror="this.src=\'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ctext y=%22.9em%22 font-size=%2290%22%3E' + category.icon + '%3C/text%3E%3C/svg%3E\'">'
        card += '</div>'
        card += '<div class="flex-1 min-w-0">'
        card += '<div class="flex items-center justify-between mb-1">'
        card += '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">'
        card += category.icon + ' ' + getCategoryName(category)
        card += '</span>'
        card += '<span class="text-xs font-bold text-green-600">$' + formatNumber(event.total_volume) + '</span>'
        card += '</div>'
        card += '<h3 class="text-xs sm:text-sm font-bold text-gray-900 mb-1 line-clamp-2">' + getEventTitle(event) + '</h3>'
        card += '<div class="flex items-center text-xs text-gray-500 mb-2">'
        card += '<i class="far fa-calendar mr-1 text-xs"></i>'
        card += '<span class="text-xs">' + translations[currentLang].resolvesOn + ': ' + event.resolve_date + '</span>'
        card += '</div>'
        
        if (hasOutcomes) {
            card += '<div class="grid grid-cols-2 gap-1.5">'
            event.outcomes.slice(0, 2).forEach(outcome => {
                const isYes = outcome.name === '예' || outcome.name.toLowerCase().includes('yes') || outcome.name === '是' || outcome.name === 'はい'
                const isNo = outcome.name === '아니오' || outcome.name.toLowerCase().includes('no') || outcome.name === '否' || outcome.name === 'いいえ'
                const bgColor = isYes ? 'bg-green-50' : isNo ? 'bg-red-50' : 'bg-blue-50'
                const textColor = isYes ? 'text-green-700' : isNo ? 'text-red-700' : 'text-blue-700'
                const percentColor = isYes ? 'text-green-600' : isNo ? 'text-red-600' : 'text-blue-600'
                const barColor = isYes ? 'bg-green-200' : isNo ? 'bg-red-200' : 'bg-blue-200'
                
                card += '<div class="relative overflow-hidden rounded border ' + bgColor + ' hover:shadow-md transition-all">'
                card += '<div class="absolute inset-0 ' + barColor + ' opacity-20" style="width: ' + (outcome.probability * 100) + '%; transition: width 0.3s ease;"></div>'
                card += '<div class="relative z-10 flex items-center justify-between p-1.5">'
                card += '<span class="font-bold text-xs ' + textColor + '">' + outcome.name + '</span>'
                card += '<span class="text-base font-bold ' + percentColor + '">' + (outcome.probability * 100).toFixed(1) + '%</span>'
                card += '</div>'
                card += '</div>'
            })
            card += '</div>'
        }
        
        card += '</div></div></div>'
        return card
    }).join('')
    
    container.innerHTML = html
    
    // Show/hide load more button
    const loadMoreBtn = document.getElementById('load-more-btn')
    if (loadMoreBtn) {
        if (displayedMarkets < filteredEvents.length) {
            loadMoreBtn.classList.remove('hidden')
        } else {
            loadMoreBtn.classList.add('hidden')
        }
    }
    
    updateMarketCount()
}

// Open bet modal
function openBetModal(eventId) {
    // Check if user is logged in
    if (window.EventBETAuth && !window.EventBETAuth.isLoggedIn()) {
        window.EventBETAuth.showAuthRequiredModal('마켓 상세 정보를 보려면 로그인이 필요합니다.')
        return
    }
    
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
                ${!currentWallet ? `
                <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                    <p class="text-sm text-yellow-700">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        베팅하려면 지갑을 연결하세요
                    </p>
                </div>
                ` : ''}
                <div class="grid grid-cols-1 gap-3">
                    ${event.outcomes.map(outcome => {
                        const isYes = outcome.name === '예' || outcome.name.toLowerCase().includes('yes') || outcome.name === '是' || outcome.name === 'はい'
                        const isNo = outcome.name === '아니오' || outcome.name.toLowerCase().includes('no') || outcome.name === '否' || outcome.name === 'いいえ'
                        const bgColor = isYes ? 'bg-green-50 hover:bg-green-100' : isNo ? 'bg-red-50 hover:bg-red-100' : 'bg-blue-50 hover:bg-blue-100'
                        const textColor = isYes ? 'text-green-700' : isNo ? 'text-red-700' : 'text-blue-700'
                        return `
                        <button class="w-full ${bgColor} border-2 border-transparent hover:border-gray-300 rounded-lg p-4 transition-all ${!currentWallet ? 'opacity-50 cursor-not-allowed' : ''}"
                                ${!currentWallet ? 'disabled' : ''}>
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

// Open submit issue modal
function openSubmitIssueModal() {
    const modal = document.getElementById('submit-issue-modal')
    const modalContent = document.getElementById('submit-modal-content')
    
    if (!modal || !modalContent) return
    
    modalContent.innerHTML = `
        <form id="issue-form" class="space-y-4">
            ${!currentWallet ? `
            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <p class="text-sm text-yellow-700">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    이슈를 제출하려면 지갑을 연결해주세요
                </p>
                <button type="button" onclick="document.getElementById('connect-wallet').click(); closeSubmitIssueModal();"
                        class="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm">
                    <i class="fas fa-wallet mr-2"></i>
                    지갑 연결
                </button>
            </div>
            ` : ''}
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">이슈 제목 (한국어) *</label>
                    <input type="text" required ${!currentWallet ? 'disabled' : ''}
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Issue Title (English) *</label>
                    <input type="text" required ${!currentWallet ? 'disabled' : ''}
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">问题标题 (中文) *</label>
                    <input type="text" required ${!currentWallet ? 'disabled' : ''}
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">問題タイトル (日本語) *</label>
                    <input type="text" required ${!currentWallet ? 'disabled' : ''}
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">설명 (선택사항)</label>
                <textarea rows="3" ${!currentWallet ? 'disabled' : ''}
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">결과 옵션 *</label>
                    <select required ${!currentWallet ? 'disabled' : ''}
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="yes-no">예/아니오 (Yes/No)</option>
                        <option value="custom">커스텀 옵션</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">배팅 한도 (개수) *</label>
                    <input type="number" min="1" max="1000" value="100" required ${!currentWallet ? 'disabled' : ''}
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">암호화폐 선택 *</label>
                <div class="flex gap-4">
                    <label class="flex items-center ${!currentWallet ? 'opacity-50' : ''}">
                        <input type="radio" name="crypto" value="BTC" required ${!currentWallet ? 'disabled' : ''} class="mr-2">
                        <i class="fab fa-bitcoin text-yellow-500 mr-1"></i> BTC
                    </label>
                    <label class="flex items-center ${!currentWallet ? 'opacity-50' : ''}">
                        <input type="radio" name="crypto" value="ETH" ${!currentWallet ? 'disabled' : ''} class="mr-2">
                        <i class="fab fa-ethereum text-blue-500 mr-1"></i> ETH
                    </label>
                    <label class="flex items-center ${!currentWallet ? 'opacity-50' : ''}">
                        <input type="radio" name="crypto" value="USDT" ${!currentWallet ? 'disabled' : ''} class="mr-2">
                        <i class="fas fa-dollar-sign text-green-500 mr-1"></i> USDT
                    </label>
                </div>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
                <h5 class="font-semibold text-gray-900 mb-3">
                    <i class="fas fa-lock mr-2 text-gray-600"></i>
                    운영자 전용 정보
                </h5>
                <div class="space-y-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">지갑 주소 *</label>
                        <input type="text" value="${currentWallet || ''}" required readonly
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">이메일 *</label>
                            <input type="email" required ${!currentWallet ? 'disabled' : ''}
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">닉네임 *</label>
                            <input type="text" required ${!currentWallet ? 'disabled' : ''}
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                </div>
            </div>
            
            <button type="submit" ${!currentWallet ? 'disabled' : ''}
                    class="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium ${!currentWallet ? 'opacity-50 cursor-not-allowed' : ''}">
                <i class="fas fa-paper-plane mr-2"></i>
                이슈 제출
            </button>
        </form>
    `
    
    const form = document.getElementById('issue-form')
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault()
            alert('이슈가 성공적으로 제출되었습니다!')
            closeSubmitIssueModal()
        })
    }
    
    modal.classList.remove('hidden')
    modal.classList.add('flex')
}

// Close submit issue modal
function closeSubmitIssueModal() {
    const modal = document.getElementById('submit-issue-modal')
    if (modal) {
        modal.classList.add('hidden')
        modal.classList.remove('flex')
    }
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    const betModal = document.getElementById('bet-modal')
    if (betModal && e.target === betModal) {
        closeBetModal()
    }
    
    const submitModal = document.getElementById('submit-issue-modal')
    if (submitModal && e.target === submitModal) {
        closeSubmitIssueModal()
    }
})
