// AI 자동응답 봇 - EventBET (질문 목록 메뉴 방식)

// 다국어 번역 객체
const chatbotTranslations = {
    ko: {
        botTitle: "EventBET AI 봇",
        botSubtitle: "궁금한 질문을 선택하세요",
        faqTitle: "💬 자주 묻는 질문",
        faqSubtitle: "궁금하신 내용을 선택해주세요",
        inputPlaceholder: "질문을 입력하세요...",
        footerContact: "📞 추가 문의: @HERB4989 (텔레그램)",
        footerEmail: "📧 locks88@naver.com",
        noAnswerMessage: "죄송합니다. 해당 질문에 대한 답변을 찾지 못했습니다. 😅\n\n왼쪽 상단의 ← 버튼을 클릭하여 질문 목록으로 돌아가세요.\n\n또는 다음 연락처로 문의해주세요:\n📞 텔레그램: @HERB4989\n📧 이메일: locks88@naver.com"
    },
    en: {
        botTitle: "EventBET AI Bot",
        botSubtitle: "Select a question",
        faqTitle: "💬 Frequently Asked Questions",
        faqSubtitle: "Choose the topic you're curious about",
        inputPlaceholder: "Enter your question...",
        footerContact: "📞 Contact: @HERB4989 (Telegram)",
        footerEmail: "📧 locks88@naver.com",
        noAnswerMessage: "Sorry, I couldn't find an answer to that question. 😅\n\nClick the ← button at the top left to return to the question list.\n\nOr contact us:\n📞 Telegram: @HERB4989\n📧 Email: locks88@naver.com"
    },
    zh: {
        botTitle: "EventBET AI 机器人",
        botSubtitle: "选择一个问题",
        faqTitle: "💬 常见问题",
        faqSubtitle: "选择您想了解的内容",
        inputPlaceholder: "输入您的问题...",
        footerContact: "📞 联系我们：@HERB4989（Telegram）",
        footerEmail: "📧 locks88@naver.com",
        noAnswerMessage: "抱歉，找不到该问题的答案。😅\n\n点击左上角的 ← 按钮返回问题列表。\n\n或联系我们：\n📞 Telegram：@HERB4989\n📧 邮箱：locks88@naver.com"
    },
    ja: {
        botTitle: "EventBET AIボット",
        botSubtitle: "質問を選択してください",
        faqTitle: "💬 よくある質問",
        faqSubtitle: "お知りになりたい内容を選択してください",
        inputPlaceholder: "質問を入力してください...",
        footerContact: "📞 お問い合わせ：@HERB4989（Telegram）",
        footerEmail: "📧 locks88@naver.com",
        noAnswerMessage: "申し訳ございません。その質問の答えが見つかりませんでした。😅\n\n左上の ← ボタンをクリックして質問リストに戻ってください。\n\nまたはお問い合わせください：\n📞 Telegram：@HERB4989\n📧 メール：locks88@naver.com"
    }
};

// 질문과 답변 데이터 (다국어)
const questionList = [
    {
        id: 1,
        question: {
            ko: "이 플랫폼이 무엇인가요?",
            en: "What is this platform?",
            zh: "这个平台是什么？",
            ja: "このプラットフォームは何ですか？"
        },
        answer: {
            ko: "EventBET은 블록체인 기반의 '예측 시장(prediction market)' 플랫폼으로, 전세계 이슈에 대해 사용자들이 베팅(예측)하고 결과에 따라 보상을 받을 수 있는 서비스입니다.\n\n웹사이트: cashiq.my",
            en: "EventBET is a blockchain-based 'prediction market' platform where users can bet (predict) on global issues and receive rewards based on the results.\n\nWebsite: cashiq.my",
            zh: "EventBET是一个基于区块链的"预测市场"平台，用户可以对全球问题进行投注（预测）并根据结果获得奖励。\n\n网站：cashiq.my",
            ja: "EventBETはブロックチェーンベースの「予測市場」プラットフォームで、ユーザーは世界中の問題に賭け（予測）、結果に応じて報酬を受け取ることができます。\n\nウェブサイト：cashiq.my"
        },
        icon: "fas fa-info-circle",
        category: {
            ko: "기본정보",
            en: "Basic Info",
            zh: "基本信息",
            ja: "基本情報"
        }
    },
    {
        id: 2,
        question: {
            ko: "어떤 암호화폐를 이용하나요?",
            en: "What cryptocurrency is used?",
            zh: "使用什么加密货币？",
            ja: "どの暗号通貨を使用しますか？"
        },
        answer: {
            ko: "플랫폼에서 명시된 암호화폐는 USDT 1종류만 거래합니다.\n\n⚠️ 비트코인(BTC)이나 이더리움(ETH)은 지원하지 않습니다.",
            en: "The platform only supports USDT as the trading cryptocurrency.\n\n⚠️ Bitcoin (BTC) and Ethereum (ETH) are not supported.",
            zh: "平台仅支持USDT作为交易加密货币。\n\n⚠️ 不支持比特币（BTC）或以太坊（ETH）。",
            ja: "プラットフォームでは、USDTのみが取引暗号通貨としてサポートされています。\n\n⚠️ ビットコイン（BTC）やイーサリアム（ETH）はサポートされていません。"
        },
        icon: "fas fa-coins",
        category: {
            ko: "기본정보",
            en: "Basic Info",
            zh: "基本信息",
            ja: "基本情報"
        }
    },
    {
        id: 3,
        question: {
            ko: "배당률 및 수수료 구조 자세히 알려주세요",
            en: "Please explain the odds and fee structure in detail",
            zh: "请详细说明赔率和费用结构",
            ja: "配当率と手数料の構造を詳しく教えてください"
        },
        answer: {
            ko: "✅ 배당률(Odds) 구조\n승자 독식 배당 = 총 베팅액 - 수수료\n승자들이 전체 배팅 풀을 투자 비율에 따라 분배받습니다.\n\n📊 예시:\n\n• 예측 A에 베팅: 100명 × 1 USDT = 100 USDT\n• 예측 B에 베팅: 50명 × 1 USDT = 50 USDT\n• 총 베팅: 150 USDT\n• 플랫폼 수수료 7%: 10.5 USDT\n• 승자 배당 풀: 139.5 USDT\n• 예측 A 승리 시: 각 승자는 1.395 USDT 수령 (39.5% 수익)\n* 본인이 투자한 비율에 따라 수익을 가져갑니다.\n\n⚠️ 패자 손실: 결과가 발생하지 않으면 투자액 전액 손실",
            en: "✅ Odds Structure\nWinner-takes-all payout = Total bets - Fees\nWinners share the entire betting pool proportionally.\n\n📊 Example:\n\n• Prediction A bets: 100 people × 1 USDT = 100 USDT\n• Prediction B bets: 50 people × 1 USDT = 50 USDT\n• Total bets: 150 USDT\n• Platform fee 7%: 10.5 USDT\n• Winner payout pool: 139.5 USDT\n• If Prediction A wins: Each winner receives 1.395 USDT (39.5% profit)\n* You receive profit proportional to your investment.\n\n⚠️ Loser loss: If result doesn't occur, entire investment is lost",
            zh: "✅ 赔率结构\n赢家通吃赔付 = 总投注额 - 费用\n赢家按投资比例分享整个投注池。\n\n📊 示例：\n\n• 预测A投注：100人 × 1 USDT = 100 USDT\n• 预测B投注：50人 × 1 USDT = 50 USDT\n• 总投注：150 USDT\n• 平台费用7%：10.5 USDT\n• 赢家赔付池：139.5 USDT\n• 如果预测A获胜：每个赢家收到1.395 USDT（39.5%利润）\n* 您根据投资比例获得利润。\n\n⚠️ 输家损失：如果结果未发生，全部投资损失",
            ja: "✅ 配当率の構造\n勝者総取り配当 = 総ベット額 - 手数料\n勝者は投資比率に応じてベットプール全体を分配します。\n\n📊 例：\n\n• 予測Aへのベット：100人 × 1 USDT = 100 USDT\n• 予測Bへのベット：50人 × 1 USDT = 50 USDT\n• 総ベット：150 USDT\n• プラットフォーム手数料7%：10.5 USDT\n• 勝者配当プール：139.5 USDT\n• 予測Aが勝利した場合：各勝者は1.395 USDTを受け取ります（39.5%の利益）\n* 投資比率に応じて利益を受け取ります。\n\n⚠️ 敗者の損失：結果が発生しない場合、投資額全額が損失となります"
        },
        icon: "fas fa-chart-line",
        category: {
            ko: "수수료/배당",
            en: "Fees/Payouts",
            zh: "费用/赔付",
            ja: "手数料/配当"
        }
    },
    {
        id: 4,
        question: {
            ko: "게시물(이벤트) 수수료, 즉 떼어가는 돈, 운영자 수수료",
            en: "Event fees - platform commission and operator fees",
            zh: "活动费用 - 平台佣金和运营商费用",
            ja: "イベント手数料 - プラットフォーム手数料とオペレーター手数料"
        },
        answer: {
            ko: "⚙️ 수수료(Fee) 구조\n\n💰 플랫폼 거래 수수료: 7%\n인건비, 관리비, 추가 기능 개발 등에 사용됩니다.\n\n⚠️ 추가 비용:\n• 거래소 입출금 수수료\n• 네트워크 송금 비용(가스비)\n\n이러한 추가 비용은 EventBET과는 무관하며 사용자가 별도로 부담합니다.",
            en: "⚙️ Fee Structure\n\n💰 Platform transaction fee: 7%\nUsed for personnel costs, management, and feature development.\n\n⚠️ Additional costs:\n• Exchange deposit/withdrawal fees\n• Network transfer costs (gas fees)\n\nThese additional costs are separate from EventBET and borne by users.",
            zh: "⚙️ 费用结构\n\n💰 平台交易费用：7%\n用于人员成本、管理和功能开发。\n\n⚠️ 额外费用：\n• 交易所存取款费用\n• 网络转账费用（Gas费）\n\n这些额外费用与EventBET无关，由用户自行承担。",
            ja: "⚙️ 手数料構造\n\n💰 プラットフォーム取引手数料：7%\n人件費、管理費、追加機能開発などに使用されます。\n\n⚠️ 追加費用：\n• 取引所の入出金手数料\n• ネットワーク送金費用（ガス代）\n\nこれらの追加費用はEventBETとは無関係で、ユーザーが別途負担します。"
        },
        icon: "fas fa-percent",
        category: {
            ko: "수수료/배당",
            en: "Fees/Payouts",
            zh: "费用/赔付",
            ja: "手数料/配当"
        }
    },
    {
        id: 5,
        question: {
            ko: "리스크(위험)가 있나요?",
            en: "Are there any risks?",
            zh: "有风险吗？",
            ja: "リスクはありますか？"
        },
        answer: {
            ko: "⚠️ 네, 리스크가 있습니다.\n\n• 무승부 없음 → 승패 결과를 정확히 예측해야 함\n• 예측이 틀리면 베팅 금액 전액 손실\n• 블록체인/암호화폐 기술에 익숙하지 않으면 지갑 연결, 가스비 등에서 추가 비용 및 기술적 어려움 발생 가능\n\n💡 신중한 예측과 충분한 이해가 필요합니다.",
            en: "⚠️ Yes, there are risks.\n\n• No draws → Must accurately predict win/loss results\n• Wrong predictions result in total betting amount loss\n• If unfamiliar with blockchain/crypto technology, additional costs and technical difficulties may occur with wallet connections, gas fees, etc.\n\n💡 Careful predictions and sufficient understanding are required.",
            zh: "⚠️ 是的，存在风险。\n\n• 没有平局 → 必须准确预测胜负结果\n• 预测错误会导致投注金额全部损失\n• 如果不熟悉区块链/加密货币技术，在钱包连接、Gas费等方面可能会产生额外费用和技术困难\n\n💡 需要谨慎预测和充分理解。",
            ja: "⚠️ はい、リスクがあります。\n\n• 引き分けなし → 勝敗結果を正確に予測する必要があります\n• 予測が外れるとベット額全額が損失となります\n• ブロックチェーン/暗号通貨技術に慣れていない場合、ウォレット接続、ガス代などで追加費用や技術的困難が発生する可能性があります\n\n💡 慎重な予測と十分な理解が必要です。"
        },
        icon: "fas fa-exclamation-triangle",
        category: {
            ko: "리스크",
            en: "Risks",
            zh: "风险",
            ja: "リスク"
        }
    },
    {
        id: 6,
        question: {
            ko: "어떤 이슈(마켓)에 베팅할 수 있나요?",
            en: "What issues (markets) can I bet on?",
            zh: "可以投注哪些问题（市场）？",
            ja: "どのような問題（マーケット）に賭けることができますか？"
        },
        answer: {
            ko: "'마켓 탐색 → 카테고리 → 인기 마켓' 형태로 구성되어 있으며, 전 세계 이슈를 대상으로 하는 예측 시장이 제공됩니다.\n\n📌 주요 카테고리:\n정치, 경제 이벤트, 스포츠, 팝컬처, 기술 동향 등\n\n구체적인 이슈 리스트는 사이트에서 확인하세요.",
            en: "Organized as 'Explore Markets → Categories → Popular Markets', providing prediction markets for global issues.\n\n📌 Main categories:\nPolitics, Economic Events, Sports, Pop Culture, Technology Trends, etc.\n\nCheck the site for specific issue lists.",
            zh: "以"探索市场 → 类别 → 热门市场"的形式组织，提供针对全球问题的预测市场。\n\n📌 主要类别：\n政治、经济事件、体育、流行文化、技术趋势等\n\n请访问网站查看具体问题列表。",
            ja: "「マーケット探索 → カテゴリー → 人気マーケット」の形式で構成されており、世界的な問題を対象とした予測市場が提供されます。\n\n📌 主なカテゴリー：\n政治、経済イベント、スポーツ、ポップカルチャー、技術動向など\n\n具体的な問題リストはサイトでご確認ください。"
        },
        icon: "fas fa-list",
        category: {
            ko: "이용방법",
            en: "How to Use",
            zh: "使用方法",
            ja: "使用方法"
        }
    },
    {
        id: 7,
        question: {
            ko: "플랫폼은 어떤 기술 기반인가요?",
            en: "What technology is the platform based on?",
            zh: "平台基于什么技术？",
            ja: "プラットフォームはどのような技術に基づいていますか？"
        },
        answer: {
            ko: "🔗 Powered by Blockchain Technology\n\n블록체인 기반 예측 시장 플랫폼으로 투명성과 탈중앙화 구조를 지향합니다.\n\n모든 거래가 블록체인에 기록되어 공정성이 보장됩니다.",
            en: "🔗 Powered by Blockchain Technology\n\nA blockchain-based prediction market platform pursuing transparency and decentralized structure.\n\nAll transactions are recorded on the blockchain, ensuring fairness.",
            zh: "🔗 由区块链技术驱动\n\n基于区块链的预测市场平台，追求透明度和去中心化结构。\n\n所有交易都记录在区块链上，确保公平性。",
            ja: "🔗 ブロックチェーン技術により提供\n\nブロックチェーンベースの予測市場プラットフォームで、透明性と分散化構造を目指しています。\n\nすべての取引がブロックチェーンに記録され、公平性が保証されます。"
        },
        icon: "fas fa-cube",
        category: {
            ko: "기술",
            en: "Technology",
            zh: "技术",
            ja: "テクノロジー"
        }
    },
    {
        id: 8,
        question: {
            ko: "입출금이나 지갑 연결 절차는?",
            en: "How do deposits/withdrawals and wallet connections work?",
            zh: "存取款和钱包连接流程是怎样的？",
            ja: "入出金やウォレット接続の手順は？"
        },
        answer: {
            ko: "사이트 상단에 '지갑 연결' 메뉴가 있습니다.\n\n📌 상세 정보:\n• 사용 가능한 지갑 타입\n• 입금 최소 액수\n• 출금 조건\n\n등은 회원가입 및 지갑 연결 후 확인할 수 있습니다.",
            en: "There is a 'Connect Wallet' menu at the top of the site.\n\n📌 Detailed information:\n• Available wallet types\n• Minimum deposit amount\n• Withdrawal conditions\n\nCan be checked after registration and wallet connection.",
            zh: "网站顶部有"连接钱包"菜单。\n\n📌 详细信息：\n• 可用的钱包类型\n• 最低存款金额\n• 提款条件\n\n可以在注册并连接钱包后查看。",
            ja: "サイト上部に「ウォレット接続」メニューがあります。\n\n📌 詳細情報：\n• 使用可能なウォレットタイプ\n• 最低入金額\n• 出金条件\n\n登録およびウォレット接続後に確認できます。"
        },
        icon: "fas fa-wallet",
        category: {
            ko: "이용방법",
            en: "How to Use",
            zh: "使用方法",
            ja: "使用方法"
        }
    },
    {
        id: 9,
        question: {
            ko: "고객지원이나 파트너십 문의는?",
            en: "How to contact customer support or inquire about partnerships?",
            zh: "如何联系客户支持或咨询合作伙伴关系？",
            ja: "カスタマーサポートやパートナーシップについての問い合わせは？"
        },
        answer: {
            ko: "📞 고객 지원 연락처:\n\n🔹 텔레그램: @HERB4989\n   (판매 제휴 문의)\n\n🔹 이메일: locks88@naver.com\n   (개발자 문의)\n\n✅ 24시간 이내 답변\n✅ 다국어 지원\n✅ 파트너십 환영",
            en: "📞 Customer Support Contact:\n\n🔹 Telegram: @HERB4989\n   (Sales partnership inquiries)\n\n🔹 Email: locks88@naver.com\n   (Developer inquiries)\n\n✅ Response within 24 hours\n✅ Multilingual support\n✅ Partnerships welcome",
            zh: "📞 客户支持联系方式：\n\n🔹 Telegram：@HERB4989\n   (销售合作咨询)\n\n🔹 邮箱：locks88@naver.com\n   (开发者咨询)\n\n✅ 24小时内回复\n✅ 多语言支持\n✅ 欢迎合作伙伴",
            ja: "📞 カスタマーサポート連絡先：\n\n🔹 Telegram：@HERB4989\n   (販売提携のお問い合わせ)\n\n🔹 メール：locks88@naver.com\n   (開発者のお問い合わせ)\n\n✅ 24時間以内に返信\n✅ 多言語サポート\n✅ パートナーシップ歓迎"
        },
        icon: "fas fa-headset",
        category: {
            ko: "고객지원",
            en: "Customer Support",
            zh: "客户支持",
            ja: "カスタマーサポート"
        }
    },
    {
        id: 10,
        question: {
            ko: "다른 언어도 지원되나요?",
            en: "Are other languages supported?",
            zh: "支持其他语言吗？",
            ja: "他の言語もサポートされていますか？"
        },
        answer: {
            ko: "🌍 다국어 지원:\n\n웹사이트 상단에서 선택 가능:\n• 한국어 (Korean)\n• English (영어)\n• 中文 (중국어)\n• 日本語 (일본어)",
            en: "🌍 Multilingual Support:\n\nSelectable at the top of the website:\n• 한국어 (Korean)\n• English\n• 中文 (Chinese)\n• 日本語 (Japanese)",
            zh: "🌍 多语言支持：\n\n可在网站顶部选择：\n• 한국어（韩语）\n• English（英语）\n• 中文（中文）\n• 日本語（日语）",
            ja: "🌍 多言語サポート：\n\nウェブサイト上部で選択可能：\n• 한국어（韓国語）\n• English（英語）\n• 中文（中国語）\n• 日本語（日本語）"
        },
        icon: "fas fa-language",
        category: {
            ko: "기본정보",
            en: "Basic Info",
            zh: "基本信息",
            ja: "基本情報"
        }
    },
    {
        id: 11,
        question: {
            ko: "어떤 주제의 '시장'에 참여할 수 있나요?",
            en: "What topics of 'markets' can I participate in?",
            zh: "可以参与哪些主题的"市场"？",
            ja: "どのようなテーマの「市場」に参加できますか？"
        },
        answer: {
            ko: "다양한 실세계 이벤트가 시장으로 제공됩니다:\n\n📌 예시 주제:\n• 정치 (선거 결과 등)\n• 입법 (법안 통과 여부)\n• 경제 지표 (GDP, 주가 등)\n• 기술 동향 (신제품 출시 등)\n• 스포츠 (경기 결과)\n• 팝컬처 (시상식, 흥행 등)\n\n예: '미국에서 올해 TikTok이 금지될 것인가?'",
            en: "Various real-world events are provided as markets:\n\n📌 Example topics:\n• Politics (election results, etc.)\n• Legislation (bill passage)\n• Economic indicators (GDP, stock prices, etc.)\n• Technology trends (new product launches, etc.)\n• Sports (game results)\n• Pop culture (awards, box office, etc.)\n\nExample: 'Will TikTok be banned in the US this year?'",
            zh: "提供各种现实世界事件作为市场：\n\n📌 示例主题：\n• 政治（选举结果等）\n• 立法（法案通过与否）\n• 经济指标（GDP、股价等）\n• 技术趋势（新产品发布等）\n• 体育（比赛结果）\n• 流行文化（颁奖典礼、票房等）\n\n例如："今年美国会禁止TikTok吗？"",
            ja: "さまざまな実世界のイベントが市場として提供されます：\n\n📌 例示トピック：\n• 政治（選挙結果など）\n• 立法（法案通過の有無）\n• 経済指標（GDP、株価など）\n• 技術動向（新製品発売など）\n• スポーツ（試合結果）\n• ポップカルチャー（授賞式、興行など）\n\n例：「米国で今年TikTokは禁止されるか？」"
        },
        icon: "fas fa-tags",
        category: {
            ko: "이용방법",
            en: "How to Use",
            zh: "使用方法",
            ja: "使用方法"
        }
    },
    {
        id: 12,
        question: {
            ko: "한국 사용자 유의사항은?",
            en: "What should Korean users be aware of?",
            zh: "韩国用户的注意事项是什么？",
            ja: "韓国ユーザーの注意事項は？"
        },
        answer: {
            ko: "⚠️ 한국 사용자 유의사항:\n\n1. 암호화폐 환전·송금·세금 이슈 확인 필요\n2. 한국 법률상 합법성 및 이용 가능 여부 확인\n3. 일부 국가에서는 접근 차단 사례 있음\n4. 블록체인 지갑, 가스비용 등 기술적 절차 이해 필요\n5. 사용자 책임이 큼",
            en: "⚠️ Notes for Korean users:\n\n1. Need to check cryptocurrency exchange, transfer, and tax issues\n2. Confirm legality and availability under Korean law\n3. Access may be blocked in some countries\n4. Need to understand technical procedures like blockchain wallets, gas fees\n5. High user responsibility",
            zh: "⚠️ 韩国用户注意事项：\n\n1. 需要确认加密货币兑换、转账、税收问题\n2. 确认韩国法律下的合法性和可用性\n3. 某些国家可能会阻止访问\n4. 需要理解区块链钱包、Gas费用等技术流程\n5. 用户责任重大",
            ja: "⚠️ 韓国ユーザーの注意事項：\n\n1. 暗号通貨の両替・送金・税金問題の確認が必要\n2. 韓国法律上の合法性と利用可能性の確認\n3. 一部の国ではアクセスがブロックされる事例あり\n4. ブロックチェーンウォレット、ガス代など技術的手順の理解が必要\n5. ユーザー責任が大きい"
        },
        icon: "fas fa-flag",
        category: {
            ko: "규제/법률",
            en: "Regulations/Law",
            zh: "监管/法律",
            ja: "規制/法律"
        }
    },
    {
        id: 13,
        question: {
            ko: "규제 및 접근 제한은?",
            en: "What about regulations and access restrictions?",
            zh: "关于监管和访问限制？",
            ja: "規制およびアクセス制限について？"
        },
        answer: {
            ko: "⚖️ 규제 정보:\n\n예를 들어, Polymarket은 과거에 CFTC로부터 등록되지 않은 파생상품 거래소로 운영했다는 이유로 벌금을 부과받았고, 미국 내 사용자가 일시적으로 차단된 적이 있습니다.\n\n일부 유럽 국가 및 아시아 국가에서는 도박·베팅 규제 차원에서 접근이 제한된 사례가 있습니다.\n\n💡 해당 국가에서 이용 가능 여부 및 법적 책임을 사전에 확인하는 것이 중요합니다.",
            en: "⚖️ Regulatory Information:\n\nFor example, Polymarket was fined by the CFTC in the past for operating as an unregistered derivatives exchange, and US users were temporarily blocked.\n\nIn some European and Asian countries, access has been restricted due to gambling/betting regulations.\n\n💡 It's important to check availability and legal responsibilities in your country in advance.",
            zh: "⚖️ 监管信息：\n\n例如，Polymarket过去因作为未注册的衍生品交易所运营而被CFTC罚款，美国用户曾被暂时封锁。\n\n在一些欧洲和亚洲国家，由于赌博/博彩监管，访问受到限制。\n\n💡 提前确认您所在国家的可用性和法律责任非常重要。",
            ja: "⚖️ 規制情報：\n\n例えば、Polymarketは過去にCFTCから未登録のデリバティブ取引所として運営したとして罰金を科され、米国内のユーザーが一時的にブロックされたことがあります。\n\n一部のヨーロッパおよびアジア諸国では、ギャンブル・賭博規制の観点からアクセスが制限された事例があります。\n\n💡 該当国での利用可否および法的責任を事前に確認することが重要です。"
        },
        icon: "fas fa-gavel",
        category: {
            ko: "규제/법률",
            en: "Regulations/Law",
            zh: "监管/法律",
            ja: "規制/法律"
        }
    },
    {
        id: 14,
        question: {
            ko: "예측시장 vs 전통 베팅 비교",
            en: "Prediction Markets vs Traditional Betting Comparison",
            zh: "预测市场与传统博彩比较",
            ja: "予測市場と伝統的な賭博の比較"
        },
        answer: {
            ko: "🎯 예측시장 vs 전통 베팅(토토):\n\n【예측시장】\n✅ 확률을 거래하는 금융시장\n✅ YES/NO 주식 거래 구조\n✅ 배당률이 시장 참여자에 의해 형성\n✅ 중도 매도·헤지 가능\n✅ 정보·데이터 중심\n\n【전통 베팅】\n❌ 회사가 정한 배당률에 돈을 거는 도박\n❌ 배당률을 업체(북메이커)가 결정\n❌ 중도 환매 거의 불가\n❌ 오락·배당 중심",
            en: "🎯 Prediction Markets vs Traditional Betting:\n\n【Prediction Markets】\n✅ Financial market trading probabilities\n✅ YES/NO stock trading structure\n✅ Odds formed by market participants\n✅ Mid-way selling and hedging possible\n✅ Information and data-focused\n\n【Traditional Betting】\n❌ Gambling on company-set odds\n❌ Odds determined by bookmakers\n❌ Mid-way redemption almost impossible\n❌ Entertainment and payout-focused",
            zh: "🎯 预测市场与传统博彩：\n\n【预测市场】\n✅ 交易概率的金融市场\n✅ YES/NO股票交易结构\n✅ 赔率由市场参与者形成\n✅ 可以中途卖出和对冲\n✅ 以信息和数据为中心\n\n【传统博彩】\n❌ 在公司设定的赔率上下注\n❌ 赔率由博彩公司（庄家）决定\n❌ 几乎无法中途赎回\n❌ 以娱乐和赔付为中心",
            ja: "🎯 予測市場と伝統的な賭博：\n\n【予測市場】\n✅ 確率を取引する金融市場\n✅ YES/NO株式取引構造\n✅ オッズが市場参加者によって形成\n✅ 途中売却・ヘッジ可能\n✅ 情報・データ中心\n\n【伝統的な賭博】\n❌ 会社が設定したオッズに賭ける\n❌ オッズを業者（ブックメーカー）が決定\n❌ 途中換金ほぼ不可\n❌ 娯楽・配当中心"
        },
        icon: "fas fa-balance-scale",
        category: {
            ko: "비교분석",
            en: "Comparison",
            zh: "对比分析",
            ja: "比較分析"
        }
    },
    {
        id: 15,
        question: {
            ko: "배당 및 수익 구조 차이는?",
            en: "What are the differences in payout and profit structure?",
            zh: "赔付和利润结构的差异是什么？",
            ja: "配当と収益構造の違いは？"
        },
        answer: {
            ko: "💰 배당 및 수익 구조:\n\n【예측시장】\n• 승자 독식 구조\n• 시장 참여자들에 의해 배당률 자연 형성\n• YES/NO 승패 결과에 따른 분배\n\n【전통 베팅】\n• 업체(북메이커)가 배당률 결정\n• 중도 환매 거의 불가\n• 업체 중심 확률 책정 → 사용자 기대수익 낮음",
            en: "💰 Payout and Profit Structure:\n\n【Prediction Markets】\n• Winner-takes-all structure\n• Odds naturally formed by market participants\n• Distribution based on YES/NO win/loss results\n\n【Traditional Betting】\n• Odds determined by bookmakers\n• Mid-way redemption almost impossible\n• Bookmaker-centric probability → Lower expected user returns",
            zh: "💰 赔付和利润结构：\n\n【预测市场】\n• 赢家通吃结构\n• 赔率由市场参与者自然形成\n• 根据YES/NO胜负结果分配\n\n【传统博彩】\n• 赔率由博彩公司（庄家）决定\n• 几乎无法中途赎回\n• 以庄家为中心的概率设定 → 用户预期收益较低",
            ja: "💰 配当と収益構造：\n\n【予測市場】\n• 勝者総取り構造\n• 市場参加者によってオッズが自然に形成\n• YES/NO勝敗結果による分配\n\n【伝統的な賭博】\n• 業者（ブックメーカー）がオッズを決定\n• 途中換金ほぼ不可\n• 業者中心の確率設定 → ユーザーの期待収益が低い"
        },
        icon: "fas fa-dollar-sign",
        category: {
            ko: "비교분석",
            en: "Comparison",
            zh: "对比分析",
            ja: "比較分析"
        }
    },
    {
        id: 16,
        question: {
            ko: "가격 결정 방식 차이는?",
            en: "What are the differences in price determination?",
            zh: "价格确定方式的差异是什么？",
            ja: "価格決定方式の違いは？"
        },
        answer: {
            ko: "📊 가격 결정 방식:\n\n【예측시장】\n• 수요·공급, 참여자 정보가 즉시 가격에 반영\n• YES 가격 0.74 = 약 74% 발생 가능성\n• 금융시장과 같은 오더북·AMM 시스템\n\n【전통 베팅】\n• 운영자가 위험 관리 차원에서 배당 조정\n• 실제 확률보다 낮은 배당률 (마진 포함)\n• 참여자 정보 일부만 반영",
            en: "📊 Price Determination Method:\n\n【Prediction Markets】\n• Supply/demand and participant info immediately reflected in price\n• YES price 0.74 = approx. 74% probability\n• Order book/AMM system like financial markets\n\n【Traditional Betting】\n• Operators adjust odds for risk management\n• Odds lower than actual probability (includes margin)\n• Only partial participant info reflected",
            zh: "📊 价格确定方式：\n\n【预测市场】\n• 供需和参与者信息立即反映在价格中\n• YES价格0.74 = 约74%的发生概率\n• 类似金融市场的订单簿·AMM系统\n\n【传统博彩】\n• 运营商从风险管理角度调整赔率\n• 赔率低于实际概率（包含利润）\n• 仅部分反映参与者信息",
            ja: "📊 価格決定方式：\n\n【予測市場】\n• 需要・供給、参加者情報が即座に価格に反映\n• YES価格0.74 = 約74%の発生可能性\n• 金融市場と同様のオーダーブック・AMMシステム\n\n【伝統的な賭博】\n• 運営者がリスク管理の観点からオッズを調整\n• 実際の確率より低いオッズ（マージン含む）\n• 参加者情報の一部のみ反映"
        },
        icon: "fas fa-calculator",
        category: {
            ko: "비교분석",
            en: "Comparison",
            zh: "对比分析",
            ja: "比較分析"
        }
    },
    {
        id: 17,
        question: {
            ko: "위험 및 손실 구조 차이는?",
            en: "What are the differences in risk and loss structure?",
            zh: "风险和损失结构的差异是什么？",
            ja: "リスクと損失構造の違いは？"
        },
        answer: {
            ko: "⚠️ 위험 구조:\n\n【예측시장】\n• 잘못된 예측 = 투자금 전액 손실\n• BUT 결과 확정 전 중도 매도·헤지 가능\n• 유동성 위험 존재\n\n【전통 베팅】\n• 예측 틀리면 배팅액 전액 손실\n• 중도 헤지 거의 불가 → 리스크 통제 어려움\n• 업체 마진으로 장기적 승률 불리",
            en: "⚠️ Risk Structure:\n\n【Prediction Markets】\n• Wrong prediction = Total investment loss\n• BUT mid-way selling/hedging possible before results\n• Liquidity risk exists\n\n【Traditional Betting】\n• Wrong prediction = Total bet loss\n• Mid-way hedging almost impossible → Hard to control risk\n• Bookmaker margins make long-term win rate unfavorable",
            zh: "⚠️ 风险结构：\n\n【预测市场】\n• 错误预测 = 投资全额损失\n• 但可以在结果确定前中途卖出·对冲\n• 存在流动性风险\n\n【传统博彩】\n• 预测错误则投注额全额损失\n• 几乎无法中途对冲 → 难以控制风险\n• 庄家利润导致长期胜率不利",
            ja: "⚠️ リスク構造：\n\n【予測市場】\n• 誤った予測 = 投資金全額損失\n• ただし結果確定前に途中売却・ヘッジ可能\n• 流動性リスクが存在\n\n【伝統的な賭博】\n• 予測を外すとベット額全額損失\n• 途中ヘッジほぼ不可 → リスク管理困難\n• 業者マージンにより長期的勝率不利"
        },
        icon: "fas fa-shield-alt",
        category: {
            ko: "비교분석",
            en: "Comparison",
            zh: "对比分析",
            ja: "比較分析"
        }
    },
    {
        id: 18,
        question: {
            ko: "합법성 및 규제 차이는?",
            en: "What are the differences in legality and regulations?",
            zh: "合法性和监管的差异是什么？",
            ja: "合法性と規制の違いは？"
        },
        answer: {
            ko: "⚖️ 합법성·규제:\n\n【예측시장】\n• 국가별 규제 상이\n• 일부 국가는 연구·통계 목적으로 허용\n• '도박'이 아닌 '정보 기반 거래'로 분류되기도 함\n• Polymarket 등은 특정 국가 접근 차단 경험\n\n【전통 베팅】\n• 대부분 국가에서 도박으로 분류\n• 한국: 사설토토 불법, 스포츠토토만 제한적 합법\n• 규제·단속 대상 명확",
            en: "⚖️ Legality & Regulations:\n\n【Prediction Markets】\n• Regulations vary by country\n• Some countries allow for research/statistical purposes\n• Sometimes classified as 'information-based trading' rather than 'gambling'\n• Polymarket etc. experienced access blocks in certain countries\n\n【Traditional Betting】\n• Classified as gambling in most countries\n• Korea: Illegal private betting, only sports betting limitedly legal\n• Clear regulatory and enforcement targets",
            zh: "⚖️ 合法性·监管：\n\n【预测市场】\n• 各国监管不同\n• 一些国家为研究·统计目的允许\n• 有时被归类为"基于信息的交易"而非"赌博"\n• Polymarket等在特定国家经历过访问封锁\n\n【传统博彩】\n• 在大多数国家被归类为赌博\n• 韩国：私人博彩非法，仅限体育博彩有限合法\n• 监管·执法目标明确",
            ja: "⚖️ 合法性·規制：\n\n【予測市場】\n• 国によって規制が異なる\n• 一部の国では研究・統計目的で許可\n• 「ギャンブル」ではなく「情報ベースの取引」として分類されることも\n• Polymarketなどは特定国でアクセスブロックの経験\n\n【伝統的な賭博】\n• ほとんどの国でギャンブルとして分類\n• 韓国：違法な私的賭博、スポーツ賭博のみ限定的に合法\n• 規制・取締り対象が明確"
        },
        icon: "fas fa-book",
        category: {
            ko: "비교분석",
            en: "Comparison",
            zh: "对比分析",
            ja: "比較分析"
        }
    },
    {
        id: 19,
        question: {
            ko: "참여자 성격 차이는?",
            en: "What are the differences in participant characteristics?",
            zh: "参与者特征的差异是什么？",
            ja: "参加者の特性の違いは？"
        },
        answer: {
            ko: "👥 참여자 성격:\n\n【예측시장】\n• 정치·경제·세계 이슈 분석하는 투자형 사용자\n• 시장 정보(뉴스/여론/데이터) 근거로 거래\n• '통계·정보전' 성향 강함\n\n【전통 베팅】\n• 스포츠·경기 위주\n• 오락성·운 중심\n• 확률보다 '응원/감정'이 개입되는 경우 많음",
            en: "👥 Participant Characteristics:\n\n【Prediction Markets】\n• Investment-type users analyzing political/economic/global issues\n• Trading based on market information (news/polls/data)\n• Strong 'statistics/information battle' tendency\n\n【Traditional Betting】\n• Sports/game-focused\n• Entertainment and luck-centered\n• Often involves 'support/emotion' rather than probability",
            zh: "👥 参与者特征：\n\n【预测市场】\n• 分析政治·经济·世界问题的投资型用户\n• 基于市场信息（新闻/民意/数据）进行交易\n• 强烈的"统计·信息战"倾向\n\n【传统博彩】\n• 以体育·比赛为主\n• 以娱乐性·运气为中心\n• 往往涉及"支持/情感"而非概率",
            ja: "👥 参加者の特性：\n\n【予測市場】\n• 政治・経済・世界問題を分析する投資型ユーザー\n• 市場情報（ニュース/世論/データ）に基づいて取引\n• 「統計・情報戦」の傾向が強い\n\n【伝統的な賭博】\n• スポーツ・試合中心\n• 娯楽性・運中心\n• 確率より「応援/感情」が介入する場合が多い"
        },
        icon: "fas fa-users",
        category: {
            ko: "비교분석",
            en: "Comparison",
            zh: "对比分析",
            ja: "比較分析"
        }
    },
    {
        id: 20,
        question: {
            ko: "투명성 차이는?",
            en: "What are the differences in transparency?",
            zh: "透明度的差异是什么？",
            ja: "透明性の違いは？"
        },
        answer: {
            ko: "🔐 투명성:\n\n【예측시장】\n✅ 블록체인 기반 → 거래 기록 투명\n✅ 결제·정산 공개\n✅ 스마트컨트랙트 기반 → 공정성 높음\n\n【전통 베팅】\n❌ 회사 내부 시스템 의존\n❌ 배당 조작 논란 가능\n❌ 정산 방식 비공개인 경우 다수",
            en: "🔐 Transparency:\n\n【Prediction Markets】\n✅ Blockchain-based → Transparent transaction records\n✅ Public payment and settlement\n✅ Smart contract-based → High fairness\n\n【Traditional Betting】\n❌ Dependent on internal company systems\n❌ Possible odds manipulation controversies\n❌ Settlement methods often non-disclosed",
            zh: "🔐 透明度：\n\n【预测市场】\n✅ 基于区块链 → 交易记录透明\n✅ 公开支付·结算\n✅ 基于智能合约 → 公平性高\n\n【传统博彩】\n❌ 依赖公司内部系统\n❌ 可能存在赔率操纵争议\n❌ 结算方式往往不公开",
            ja: "🔐 透明性：\n\n【予測市場】\n✅ ブロックチェーンベース → 取引記録が透明\n✅ 決済・精算が公開\n✅ スマートコントラクトベース → 公平性が高い\n\n【伝統的な賭博】\n❌ 会社の内部システムに依存\n❌ オッズ操作の論争の可能性\n❌ 精算方式が非公開の場合が多い"
        },
        icon: "fas fa-eye",
        category: {
            ko: "비교분석",
            en: "Comparison",
            zh: "对比分析",
            ja: "比較分析"
        }
    },
    {
        id: 21,
        question: {
            ko: "이용 편리성 차이는?",
            en: "What are the differences in ease of use?",
            zh: "使用便利性的差异是什么？",
            ja: "利用の便利さの違いは？"
        },
        answer: {
            ko: "🔧 이용 편리성:\n\n【예측시장】\n• 암호화폐 지갑 필요\n• 해외 이용 시 VPN 필요할 수 있음\n• 블록체인 기술 이해 필요\n\n【전통 베팅】\n• 카드·계좌 등 일반 결제 편함\n• 접근성 매우 높음\n• 기술적 장벽 낮음",
            en: "🔧 Ease of Use:\n\n【Prediction Markets】\n• Crypto wallet required\n• VPN may be needed for overseas use\n• Blockchain technology understanding required\n\n【Traditional Betting】\n• Convenient general payment methods (card, bank account)\n• Very high accessibility\n• Low technical barriers",
            zh: "🔧 使用便利性：\n\n【预测市场】\n• 需要加密货币钱包\n• 海外使用可能需要VPN\n• 需要理解区块链技术\n\n【传统博彩】\n• 方便的普通支付方式（卡、账户等）\n• 可访问性非常高\n• 技术门槛低",
            ja: "🔧 利用の便利さ：\n\n【予測市場】\n• 暗号通貨ウォレットが必要\n• 海外利用時にVPNが必要な場合がある\n• ブロックチェーン技術の理解が必要\n\n【伝統的な賭博】\n• カード・口座などの一般的な決済が便利\n• アクセス性が非常に高い\n• 技術的障壁が低い"
        },
        icon: "fas fa-mobile-alt",
        category: {
            ko: "비교분석",
            en: "Comparison",
            zh: "对比分析",
            ja: "比較分析"
        }
    }
];

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
        const t = chatbotTranslations[window.currentLang || 'ko'];
        
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
                            <h3 id="chatbot-title" class="font-bold text-lg">${t.botTitle}</h3>
                            <p id="chatbot-subtitle" class="text-xs opacity-90">${t.botSubtitle}</p>
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
                        <h4 id="faq-title" class="text-sm font-bold text-gray-600 mb-2">${t.faqTitle}</h4>
                        <p id="faq-subtitle" class="text-xs text-gray-500 mb-4">${t.faqSubtitle}</p>
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
                        <input type="text" id="chat-input" placeholder="${t.inputPlaceholder}" class="flex-1 px-4 py-2 border-2 border-gray-300 rounded-full focus:border-blue-500 focus:outline-none text-sm">
                        <button id="send-message" class="bg-gradient-to-r from-blue-800 to-purple-800 text-white rounded-full px-6 py-2 hover:opacity-90 transition-opacity">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>

                <!-- 푸터 (메뉴 뷰에서만 표시) -->
                <div id="menu-footer" class="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
                    <div class="text-center text-xs text-gray-500">
                        <p id="footer-contact">${t.footerContact}</p>
                        <p id="footer-email" class="mt-1">${t.footerEmail}</p>
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

    // 언어 변경 시 UI 업데이트
    updateLanguage() {
        const currentLang = window.currentLang || 'ko';
        const t = chatbotTranslations[currentLang];
        
        // 헤더 업데이트
        const titleEl = document.getElementById('chatbot-title');
        const subtitleEl = document.getElementById('chatbot-subtitle');
        if (titleEl) titleEl.textContent = t.botTitle;
        if (subtitleEl) subtitleEl.textContent = t.botSubtitle;
        
        // 메뉴 뷰 업데이트
        const faqTitleEl = document.getElementById('faq-title');
        const faqSubtitleEl = document.getElementById('faq-subtitle');
        if (faqTitleEl) faqTitleEl.textContent = t.faqTitle;
        if (faqSubtitleEl) faqSubtitleEl.textContent = t.faqSubtitle;
        
        // 입력 영역 업데이트
        const chatInputEl = document.getElementById('chat-input');
        if (chatInputEl) chatInputEl.placeholder = t.inputPlaceholder;
        
        // 푸터 업데이트
        const footerContactEl = document.getElementById('footer-contact');
        const footerEmailEl = document.getElementById('footer-email');
        if (footerContactEl) footerContactEl.textContent = t.footerContact;
        if (footerEmailEl) footerEmailEl.textContent = t.footerEmail;
        
        // 질문 목록 재렌더링
        if (this.currentView === 'menu') {
            this.renderQuestions();
        }
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
        
        const currentLang = window.currentLang || 'ko';

        // 카테고리별로 그룹화
        const categories = {};
        questionList.forEach(q => {
            const categoryText = typeof q.category === 'object' ? q.category[currentLang] : q.category;
            if (!categories[categoryText]) {
                categories[categoryText] = [];
            }
            categories[categoryText].push(q);
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
                const questionText = typeof q.question === 'object' ? q.question[currentLang] : q.question;
                
                const button = document.createElement('button');
                button.className = 'w-full text-left px-4 py-3 mb-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-700 hover:bg-blue-50 transition-all text-sm flex items-center space-x-3 group';
                button.innerHTML = `
                    <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-700 to-purple-700 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <i class="${q.icon} text-xs"></i>
                    </div>
                    <div class="flex-1">
                        <p class="font-semibold text-gray-800 group-hover:text-blue-800">${questionText}</p>
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
        
        const currentLang = window.currentLang || 'ko';
        const questionText = typeof question.question === 'object' ? question.question[currentLang] : question.question;
        const answerText = typeof question.answer === 'object' ? question.answer[currentLang] : question.answer;
        
        // 사용자가 선택한 질문 표시
        this.addMessageToChat(questionText, 'user');
        
        // 봇 응답
        setTimeout(() => {
            this.addMessageToChat(answerText, 'bot');
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
        const currentLang = window.currentLang || 'ko';
        
        // 질문 제목에서 검색
        for (const q of questionList) {
            const questionText = typeof q.question === 'object' ? q.question[currentLang] : q.question;
            if (questionText.toLowerCase().includes(lowerQuery)) {
                return typeof q.answer === 'object' ? q.answer[currentLang] : q.answer;
            }
        }

        // 키워드로 검색 (다국어)
        const keywords = {
            // Korean
            "플랫폼": 1, "암호화폐": 2, "배당": 3, "수수료": 4, "리스크": 5, "위험": 5,
            "마켓": 6, "이슈": 6, "기술": 7, "블록체인": 7, "지갑": 8, "입금": 8, "출금": 8,
            "문의": 9, "고객": 9, "언어": 10, "주제": 11, "한국": 12, "규제": 13, "비교": 14, "토토": 14,
            // English
            "platform": 1, "crypto": 2, "odds": 3, "fee": 4, "risk": 5,
            "market": 6, "issue": 6, "technology": 7, "blockchain": 7, "wallet": 8, "deposit": 8, "withdraw": 8,
            "contact": 9, "support": 9, "language": 10, "topic": 11, "korea": 12, "regulation": 13, "comparison": 14, "betting": 14,
            // Chinese
            "平台": 1, "加密": 2, "赔率": 3, "费用": 4, "风险": 5,
            "市场": 6, "问题": 6, "技术": 7, "区块链": 7, "钱包": 8, "存款": 8, "提款": 8,
            "联系": 9, "支持": 9, "语言": 10, "主题": 11, "韩国": 12, "监管": 13, "比较": 14, "博彩": 14,
            // Japanese
            "プラットフォーム": 1, "暗号": 2, "配当": 3, "手数料": 4, "リスク": 5,
            "マーケット": 6, "問題": 6, "技術": 7, "ブロックチェーン": 7, "ウォレット": 8, "入金": 8, "出金": 8,
            "問い合わせ": 9, "サポート": 9, "言語": 10, "トピック": 11, "韓国": 12, "規制": 13, "比較": 14, "賭博": 14
        };

        for (const [keyword, id] of Object.entries(keywords)) {
            if (lowerQuery.includes(keyword)) {
                const question = questionList.find(q => q.id === id);
                if (question) {
                    return typeof question.answer === 'object' ? question.answer[currentLang] : question.answer;
                }
            }
        }

        // 기본 응답 (다국어)
        const t = chatbotTranslations[currentLang];
        return t.noAnswerMessage;
    }
}

// 페이지 로드 시 챗봇 초기화
let chatbotInstance = null;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        chatbotInstance = new ChatBot();
        window.chatbotInstance = chatbotInstance; // 전역 접근 가능하도록
    });
} else {
    chatbotInstance = new ChatBot();
    window.chatbotInstance = chatbotInstance; // 전역 접근 가능하도록
}
