// EventBET - Static Frontend Application
// Enhanced with 450 markets (50 per category, all within 1 month)

console.log('EventBET: Script loaded')

let currentLang = 'ko'
window.currentLang = currentLang // 챗봇과 auth에서 접근 가능하도록 전역 노출
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
        onlyCrypto: '유일하게 지원되는 암호화폐',
        // 로그인 모달 메시지
        loginRequired: '로그인이 필요합니다',
        loginRequiredDesc: '마켓 상세 정보를 보려면 로그인이 필요합니다.',
        submitIssueLoginRequired: '이슈를 등록하려면 로그인이 필요합니다.',
        loginButton: '로그인',
        signupButton: '회원가입',
        closeButton: '닫기',
        noticeButton: '공지',
        submitIssueButton: '이슈 등록',
        // 로그인 모달
        loginTitle: '로그인',
        emailLabel: '이메일',
        passwordLabel: '비밀번호',
        passwordPlaceholder: '비밀번호를 입력하세요',
        noAccount: '계정이 없으신가요?',
        // 회원가입 모달
        registerTitle: '회원가입',
        nameLabel: '이름',
        namePlaceholder: '홍길동',
        phoneLabel: '전화번호',
        phonePlaceholder: '010-1234-5678',
        walletLabel: 'USDT 지갑주소',
        walletHint: '(배당 받을 주소)',
        walletPlaceholder: '0x...',
        confirmPasswordLabel: '비밀번호 확인',
        passwordMinLength: '최소 6자 이상',
        confirmPasswordPlaceholder: '비밀번호 재입력',
        memberBenefits: '회원 전용 혜택',
        benefit1: '모든 마켓 상세 정보 조회',
        benefit2: '베팅 및 이슈 등록 권한',
        benefit3: '신규 이벤트 알림 서비스',
        benefit4: '배당 내역 관리',
        hasAccount: '이미 계정이 있으신가요?',
        // Alert messages
        accountSuspended: '정지된 계정입니다. 관리자에게 문의하세요.',
        loginSuccess: '로그인 성공!',
        loginFailed: '이메일 또는 비밀번호가 올바르지 않습니다.',
        passwordMismatch: '비밀번호가 일치하지 않습니다.',
        passwordTooShort: '비밀번호는 최소 6자 이상이어야 합니다.',
        emailExists: '이미 등록된 이메일입니다.',
        registerSuccess: '회원가입이 완료되었습니다! 로그인해주세요.',
        logoutConfirm: '로그아웃 하시겠습니까?',
        logoutSuccess: '로그아웃 되었습니다.',
        // 공지사항 모달
        noticeModalTitle: '공지사항',
        noticeEmpty: '등록된 공지사항이 없습니다.',
        noticeBackToList: '목록으로',
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
        onlyCrypto: 'Only Supported Cryptocurrency',
        // Login modal messages
        loginRequired: 'Login Required',
        loginRequiredDesc: 'You need to login to view market details.',
        submitIssueLoginRequired: 'You need to login to submit an issue.',
        loginButton: 'Login',
        signupButton: 'Sign Up',
        closeButton: 'Close',
        noticeButton: 'Notice',
        submitIssueButton: 'Submit Issue',
        // Login modal
        loginTitle: 'Login',
        emailLabel: 'Email',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Enter password',
        noAccount: "Don't have an account?",
        // Register modal
        registerTitle: 'Sign Up',
        nameLabel: 'Name',
        namePlaceholder: 'John Doe',
        phoneLabel: 'Phone',
        phonePlaceholder: '010-1234-5678',
        walletLabel: 'USDT Wallet Address',
        walletHint: '(for receiving payouts)',
        walletPlaceholder: '0x...',
        confirmPasswordLabel: 'Confirm Password',
        passwordMinLength: 'Min 6 characters',
        confirmPasswordPlaceholder: 'Re-enter password',
        memberBenefits: 'Member Benefits',
        benefit1: 'View all market details',
        benefit2: 'Betting and issue submission',
        benefit3: 'New event notifications',
        benefit4: 'Payout history management',
        hasAccount: 'Already have an account?',
        // Alert messages
        accountSuspended: 'Account suspended. Please contact administrator.',
        loginSuccess: 'Login successful!',
        loginFailed: 'Email or password is incorrect.',
        passwordMismatch: 'Passwords do not match.',
        passwordTooShort: 'Password must be at least 6 characters.',
        emailExists: 'Email already registered.',
        registerSuccess: 'Registration complete! Please login.',
        logoutConfirm: 'Are you sure you want to logout?',
        logoutSuccess: 'Logged out successfully.',
        // Notice modal
        noticeModalTitle: 'Notices',
        noticeEmpty: 'No notices available.',
        noticeBackToList: 'Back to List',
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
        onlyCrypto: '唯一支持的加密货币',
        // 登录模态框消息
        loginRequired: '需要登录',
        loginRequiredDesc: '您需要登录才能查看市场详情。',
        submitIssueLoginRequired: '您需要登录才能提交问题。',
        loginButton: '登录',
        signupButton: '注册',
        closeButton: '关闭',
        noticeButton: '公告',
        submitIssueButton: '提交问题',
        // 登录模态框
        loginTitle: '登录',
        emailLabel: '邮箱',
        passwordLabel: '密码',
        passwordPlaceholder: '请输入密码',
        noAccount: '还没有账户？',
        // 注册模态框
        registerTitle: '注册',
        nameLabel: '姓名',
        namePlaceholder: '张三',
        phoneLabel: '电话',
        phonePlaceholder: '010-1234-5678',
        walletLabel: 'USDT 钱包地址',
        walletHint: '(用于接收分红)',
        walletPlaceholder: '0x...',
        confirmPasswordLabel: '确认密码',
        passwordMinLength: '最少6个字符',
        confirmPasswordPlaceholder: '重新输入密码',
        memberBenefits: '会员专属福利',
        benefit1: '查看所有市场详情',
        benefit2: '投注和提交问题权限',
        benefit3: '新活动通知服务',
        benefit4: '分红记录管理',
        hasAccount: '已有账户？',
        // 提示消息
        accountSuspended: '账户已停用。请联系管理员。',
        loginSuccess: '登录成功！',
        loginFailed: '邮箱或密码不正确。',
        passwordMismatch: '密码不匹配。',
        passwordTooShort: '密码至少须为6个字符。',
        emailExists: '邮箱已注册。',
        registerSuccess: '注册完成！请登录。',
        logoutConfirm: '确定要退出登录吗？',
        logoutSuccess: '退出成功。',
        // 公告模态框
        noticeModalTitle: '公告',
        noticeEmpty: '暂无公告。',
        noticeBackToList: '返回列表',
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
        onlyCrypto: '唯一サポートされている暗号通貨',
        // ログインモーダルメッセージ
        loginRequired: 'ログインが必要です',
        loginRequiredDesc: 'マーケットの詳細を表示するにはログインが必要です。',
        submitIssueLoginRequired: '問題を提出するにはログインが必要です。',
        loginButton: 'ログイン',
        signupButton: '会員登録',
        closeButton: '閉じる',
        noticeButton: 'お知らせ',
        submitIssueButton: '問題を提出',
        // ログインモーダル
        loginTitle: 'ログイン',
        emailLabel: 'メール',
        passwordLabel: 'パスワード',
        passwordPlaceholder: 'パスワードを入力',
        noAccount: 'アカウントをお持ちでないですか？',
        // 会員登録モーダル
        registerTitle: '会員登録',
        nameLabel: '名前',
        namePlaceholder: '山田太郎',
        phoneLabel: '電話番号',
        phonePlaceholder: '010-1234-5678',
        walletLabel: 'USDT ウォレットアドレス',
        walletHint: '(配当受取用)',
        walletPlaceholder: '0x...',
        confirmPasswordLabel: 'パスワード確認',
        passwordMinLength: '最低6文字以上',
        confirmPasswordPlaceholder: 'パスワード再入力',
        memberBenefits: '会員限定特典',
        benefit1: 'すべてのマーケット詳細閲覧',
        benefit2: 'ベット及び問題提出権限',
        benefit3: '新規イベント通知サービス',
        benefit4: '配当履歴管理',
        hasAccount: 'すでにアカウントをお持ちですか？',
        // アラートメッセージ
        accountSuspended: 'アカウントが停止されています。管理者にお問い合わせください。',
        loginSuccess: 'ログイン成功！',
        loginFailed: 'メールまたはパスワードが正しくありません。',
        passwordMismatch: 'パスワードが一致しません。',
        passwordTooShort: 'パスワードは最低6文字以上必要です。',
        emailExists: 'メールはすでに登録されています。',
        registerSuccess: '会員登録完了！ログインしてください。',
        logoutConfirm: 'ログアウトしますか？',
        logoutSuccess: 'ログアウトしました。',
        // お知らせモーダル
        noticeModalTitle: 'お知らせ',
        noticeEmpty: 'お知らせはありません。',
        noticeBackToList: 'リストに戻る',
    }
}

// 전역으로 translations 노출 (auth.js에서 사용)
window.translations = translations

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
        { ko: '조태용 전 국가정보원장 구속영장 발부. 실형 5년 이상, 이하', en: 'Arrest Warrant Issued for Former NIS Director Cho Tae-yong. Prison Sentence 5+ Years or Less', zh: '前国情院院长赵太庸逮捕令签发。实刑5年以上或以下', ja: '趙太庸前国情院長逮捕令状発付。実刑5年以上または以下' },
        { ko: '대장동 개발사업 관련 검찰 항소 포기 및 해당 검사 징계 여부', en: 'Prosecutor Appeal Abandonment in Daejang-dong Case and Disciplinary Action Against Prosecutor', zh: '大庄洞开发案相关检方放弃上诉及对该检察官的纪律处分', ja: '大壮洞開発事業関連検察控訴放棄および当該検事懲戒の有無' },
        { ko: '서울시장 민주당 승리? 국민의힘 승리?', en: 'Seoul Mayor Election: Democratic Party Victory or People Power Party Victory?', zh: '首尔市长选举：民主党获胜还是国民力量党获胜？', ja: 'ソウル市長選挙：民主党勝利？国民の力勝利？' },
        { ko: '부산시장 민주당 승리? 국민의힘 승리?', en: 'Busan Mayor Election: Democratic Party Victory or People Power Party Victory?', zh: '釜山市长选举：民主党获胜还是国民力量党获胜？', ja: '釜山市長選挙：民主党勝利？国民の力勝利？' },
        { ko: '종묘 건축물 142m 개발 진행? 중단?', en: 'Jongmyo 142m Building Development: Proceed or Halt?', zh: '宗庙建筑142米开发项目：继续还是中断？', ja: '宗廟建築物142m開発：進行？中止？' },
        { ko: '한국 국회 법안 통과 여부', en: 'Korean Parliament Bill Passage', zh: '韩国国会法案通过', ja: '韓国国会法案通過' },
        { ko: '미국 대통령 정책 발표', en: 'US President Policy Announcement', zh: '美国总统政策宣布', ja: '米大統領政策発表' },
        { ko: '유럽 선거 결과 예측', en: 'European Election Results', zh: '欧洲选举结果', ja: '欧州選挙結果' },
        { ko: '일본 내각 개각 여부', en: 'Japan Cabinet Reshuffle', zh: '日本内阁改组', ja: '日本内閣改造' },
        { ko: '중국 정책 변화 발표', en: 'China Policy Change', zh: '中国政策变化', ja: '中国政策変更' },
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
    const shuffled = allEvents.sort(() => Math.random() - 0.5)
    console.log('EventBET: Generated events count:', shuffled.length)
    return shuffled
}

console.log('EventBET: About to call generateEvents()')
let events = generateEvents()
console.log('EventBET: Events generated successfully:', events.length, 'events')

// 카테고리 ID 검증
if (events.length > 0) {
    const firstEvent = events[0]
    console.log('EventBET: First event sample:', {
        id: firstEvent.id,
        category_id: firstEvent.category_id,
        category_slug: firstEvent.category_slug,
        title_ko: firstEvent.title_ko
    })
    
    const categoryIds = events.map(e => e.category_id)
    const uniqueCategoryIds = [...new Set(categoryIds)]
    console.log('EventBET: Unique category IDs in events:', uniqueCategoryIds)
    console.log('EventBET: Available categories:', categories.map(c => c.id))
}

// 관리자가 등록한 이슈 병합
function loadAdminIssuesFromStorage() {
    try {
        const adminIssues = JSON.parse(localStorage.getItem('admin_issues') || '[]')
        if (adminIssues.length > 0) {
            console.log(`Loading ${adminIssues.length} admin issues`)
            
            // 관리자 이슈에 ID 및 participants 추가
            adminIssues.forEach((issue, index) => {
                const newId = events.length + index + 1
                const enhancedIssue = {
                    ...issue,
                    id: newId,
                    participants: Math.floor(issue.total_volume / 1000) + Math.floor(Math.random() * 500),
                    outcomes: issue.outcomes.map((outcome, oIndex) => ({
                        id: newId * 2 + oIndex - 1,
                        name: outcome.name,
                        probability: outcome.probability
                    }))
                }
                events.push(enhancedIssue)
            })
            
            console.log(`Total events after merge: ${events.length}`)
        }
    } catch (error) {
        console.error('Failed to load admin issues:', error)
    }
}

// 관리자 이슈 로드
loadAdminIssuesFromStorage()

console.log(`Generated ${events.length} events`)

// Initialize app
console.log('EventBET: Setting up DOMContentLoaded listener')
document.addEventListener('DOMContentLoaded', () => {
    console.log('EventBET: DOMContentLoaded fired!')
    const savedTheme = localStorage.getItem('theme') || 'light'
    isDarkMode = savedTheme === 'dark'
    applyTheme()
    
    const savedLang = localStorage.getItem('preferred_language') || 'ko'
    currentLang = savedLang
    window.currentLang = currentLang // 전역 변수도 업데이트
    const langSelector = document.getElementById('language-selector')
    if (langSelector) langSelector.value = savedLang
    
    setupEventListeners()
    updateUITexts()
    renderCategories()
    
    // 관리자 이슈 업데이트 이벤트 리스너
    window.addEventListener('adminIssuesUpdated', () => {
        console.log('Admin issues updated, reloading...')
        loadAdminIssuesFromStorage()
        renderCategories()
        renderMarkets()
    })
    
    // DOM이 완전히 준비될 때까지 약간 지연
    setTimeout(() => {
        renderMarkets()
    }, 100)
})

// Setup event listeners
function setupEventListeners() {
    const langSelector = document.getElementById('language-selector')
    if (langSelector) {
        langSelector.addEventListener('change', (e) => {
            currentLang = e.target.value
            window.currentLang = currentLang // 전역 변수도 업데이트
            localStorage.setItem('preferred_language', currentLang)
            updateUITexts()
            renderCategories()
            renderMarkets()
            
            // 챗봇 언어 업데이트
            if (window.chatbotInstance && typeof window.chatbotInstance.updateLanguage === 'function') {
                window.chatbotInstance.updateLanguage()
            }
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
    
    // Update login and register button texts
    const loginBtnText = document.getElementById('login-btn-text')
    if (loginBtnText) loginBtnText.textContent = t.loginButton
    
    const registerBtnText = document.getElementById('register-btn-text')
    if (registerBtnText) registerBtnText.textContent = t.signupButton
    
    // Update "Only supported cryptocurrency" texts
    const cryptoTexts = document.querySelectorAll('.crypto-support-text')
    cryptoTexts.forEach(el => {
        el.textContent = t.onlyCrypto
    })
    
    // Update notice button text
    const noticeBtnText = document.getElementById('notice-btn-text')
    if (noticeBtnText) noticeBtnText.textContent = t.noticeButton
    
    // Update submit issue button text
    const submitIssueBtnText = document.getElementById('submit-issue-btn-text')
    if (submitIssueBtnText) submitIssueBtnText.textContent = t.submitIssueButton
    
    // Update notice modal texts
    const noticeModalTitle = document.getElementById('notice-modal-title')
    if (noticeModalTitle) noticeModalTitle.textContent = t.noticeModalTitle
    
    const noticeEmptyText = document.getElementById('notice-empty-text')
    if (noticeEmptyText) noticeEmptyText.textContent = t.noticeEmpty
    
    const noticeBackText = document.getElementById('notice-back-text')
    if (noticeBackText) noticeBackText.textContent = t.noticeBackToList
    
    // Update all elements with data-ko, data-en, data-zh, data-ja attributes
    document.querySelectorAll('[data-ko]').forEach(element => {
        const langKey = `data-${currentLang}`
        if (element.hasAttribute(langKey)) {
            element.textContent = element.getAttribute(langKey)
        }
    })
    
    updateMarketCount()
}

// Update market count (removed from UI but kept for compatibility)
function updateMarketCount() {
    // Market count display has been removed from UI
    // Function kept for compatibility with existing code
    return
}

// Get filtered events
function getFilteredEvents() {
    console.log('EventBET: getFilteredEvents() called')
    console.log('EventBET: events array exists:', !!events)
    console.log('EventBET: events length:', events ? events.length : 0)
    
    let filtered = events
    
    if (currentCategory !== 'all') {
        filtered = filtered.filter(e => e.category_slug === currentCategory)
        console.log('EventBET: After category filter:', filtered.length, 'category:', currentCategory)
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
        console.log('EventBET: After search filter:', filtered.length)
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
    
    console.log('EventBET: Final filtered events:', filtered.length)
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
        return `
        <div class="bg-white rounded-lg shadow-sm p-2 sm:p-3 hover:shadow-md transition-shadow cursor-pointer ${isActive ? 'ring-2 ring-blue-500' : ''}"
             onclick="filterByCategory('${category.slug}')">
            <div class="text-center">
                <div class="text-xl sm:text-2xl mb-1">${category.icon}</div>
                <h4 class="text-xs sm:text-sm font-semibold text-gray-900">${getCategoryName(category)}</h4>
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
    if (!category) {
        console.error('EventBET: getCategoryName called with undefined category')
        return 'Unknown'
    }
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
    console.log('EventBET: Total events available:', events ? events.length : 0)
    
    const container = document.getElementById('markets-container')
    if (!container) {
        console.error('EventBET: markets-container not found!')
        return
    }
    console.log('EventBET: markets-container found, rendering...')
    
    const filteredEvents = getFilteredEvents()
    console.log('EventBET: Filtered events:', filteredEvents.length)
    console.log('EventBET: displayedMarkets:', displayedMarkets)
    
    const eventsToShow = filteredEvents.slice(0, displayedMarkets)
    console.log('EventBET: Events to show:', eventsToShow.length)
    
    const html = eventsToShow.map(event => {
        const category = categories.find(c => c.id === event.category_id)
        
        // 카테고리를 찾지 못한 경우 에러 로그 및 스킵
        if (!category) {
            console.error('EventBET: Category not found for event:', event.id, 'category_id:', event.category_id)
            return '' // 빈 문자열 반환하여 스킵
        }
        
        const eventImage = getEventImage(event.category_slug, event.id)
        const hasOutcomes = event.outcomes && event.outcomes.length > 0
        
        let card = '<div class="card market-card cursor-pointer" onclick="openBetModal(' + event.id + ')">'
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
        const t = translations[currentLang] || translations.ko
        window.EventBETAuth.showAuthRequiredModal(t.loginRequiredDesc)
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
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">카테고리 *</label>
                    <select id="issue-category" required ${!currentWallet ? 'disabled' : ''}
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        ${categories.map(cat => `<option value="${cat.slug}">${cat.icon} ${getCategoryName(cat)}</option>`).join('')}
                    </select>
                </div>
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
            
            // 폼 데이터 수집
            const formData = new FormData(form)
            const inputs = form.querySelectorAll('input[type="text"], textarea, input[type="email"], input[type="number"], select')
            
            // 카테고리 선택 값 가져오기
            const categorySelect = document.getElementById('issue-category')
            const selectedCategorySlug = categorySelect ? categorySelect.value : 'politics'
            const selectedCategory = categories.find(c => c.slug === selectedCategorySlug) || categories[0]
            
            // 새 이슈 생성
            const newIssue = {
                id: events.length + 1,
                category_id: selectedCategory.id,
                category_slug: selectedCategory.slug,
                title_ko: inputs[0].value,
                title_en: inputs[1].value,
                title_zh: inputs[2].value,
                title_ja: inputs[3].value,
                description_ko: inputs[4].value || `${inputs[0].value}에 대한 예측 마켓입니다.`,
                description_en: inputs[4].value || `Prediction market for ${inputs[1].value}.`,
                description_zh: inputs[4].value || `关于${inputs[2].value}的预测市场。`,
                description_ja: inputs[4].value || `${inputs[3].value}についての予測市場です。`,
                resolve_date: getRandomDateWithinMonth(),
                total_volume: Math.floor(Math.random() * 1000000) + 100000,
                participants: Math.floor(Math.random() * 100) + 10,
                outcomes: [
                    { id: (events.length + 1) * 2 - 1, name: '예', probability: 0.5 },
                    { id: (events.length + 1) * 2, name: '아니오', probability: 0.5 }
                ]
            }
            
            // events 배열에 추가
            events.push(newIssue)
            
            // UI 업데이트
            renderCategories() // 카테고리 개수 업데이트
            renderMarkets()    // 마켓 목록 업데이트
            
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

// Copy wallet address to clipboard
window.copyWalletAddress = function() {
    // Try to get address from hero section first, then from modal
    const heroAddress = document.getElementById('wallet-address')
    const modalAddress = document.getElementById('wallet-address-modal')
    const walletAddress = (heroAddress ? heroAddress.textContent : modalAddress.textContent).trim()
    
    // Modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(walletAddress).then(() => {
            showCopyNotification('success')
        }).catch(err => {
            console.error('Failed to copy:', err)
            fallbackCopy(walletAddress)
        })
    } else {
        fallbackCopy(walletAddress)
    }
}

// Fallback copy method for older browsers
function fallbackCopy(text) {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    
    try {
        document.execCommand('copy')
        showCopyNotification('success')
    } catch (err) {
        console.error('Fallback copy failed:', err)
        showCopyNotification('error')
    }
    
    document.body.removeChild(textArea)
}

// Show copy notification
function showCopyNotification(type) {
    const message = type === 'success' 
        ? '✅ 지갑 주소가 복사되었습니다!' 
        : '❌ 복사에 실패했습니다. 수동으로 복사해주세요.'
    
    // Create notification element
    const notification = document.createElement('div')
    notification.className = `fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-2xl font-semibold text-white transition-all duration-300 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`
    notification.innerHTML = `
        <div class="flex items-center gap-2">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `
    
    document.body.appendChild(notification)
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1'
        notification.style.transform = 'translate(-50%, 0)'
    }, 100)
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0'
        notification.style.transform = 'translate(-50%, -20px)'
        setTimeout(() => {
            document.body.removeChild(notification)
        }, 300)
    }, 3000)
}
