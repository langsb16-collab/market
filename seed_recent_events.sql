-- 최근 3주 이내 한국, 중국, 미국, 일본 주요 이슈 (2025년 11월 기준)

-- 정치 이슈 (10개)
INSERT INTO events (title_en, title_ko, title_zh, title_ja, category_id, image_url, end_date, created_at, total_volume) VALUES
('Will Trump win 2024 US Presidential Election?', '트럼프가 2024 미국 대선에서 승리할까?', '特朗普会赢得2024年美国总统选举吗？', 'トランプは2024年米大統領選挙で勝利するか？', 1, 'https://images.unsplash.com/photo-1541872703-74c34d53993c?w=800', '2024-11-30', datetime('now', '-2 days'), 250000),
('Will South Korea impeach President Yoon?', '윤석열 대통령 탄핵소추안이 통과될까?', '韩国会弹劾尹锡悦总统吗？', '韓国は尹大統領を弾劾するか？', 1, 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=800', '2024-12-15', datetime('now', '-1 day'), 180000),
('Will Xi Jinping visit Taiwan in 2025?', '시진핑 주석이 2025년 대만을 방문할까?', '习近平会在2025年访问台湾吗？', '習近平は2025年に台湾を訪問するか？', 1, 'https://images.unsplash.com/photo-1580757468214-c73f7062a5cb?w=800', '2025-12-31', datetime('now', '-3 days'), 150000),
('Will Japan raise consumption tax in 2025?', '일본이 2025년 소비세를 인상할까?', '日本会在2025年提高消费税吗？', '日本は2025年に消費税を引き上げるか？', 1, 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800', '2025-06-30', datetime('now', '-5 days'), 120000),
('Will Biden run for re-election in 2024?', '바이든이 2024년 재선에 출마할까?', '拜登会在2024年竞选连任吗？', 'バイデンは2024年に再選出馬するか？', 1, 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800', '2024-12-01', datetime('now', '-6 days'), 200000),
('Will North Korea conduct nuclear test in 2024?', '북한이 2024년 핵실험을 실시할까?', '朝鲜会在2024年进行核试验吗？', '北朝鮮は2024年に核実験を実施するか？', 1, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800', '2024-12-31', datetime('now', '-4 days'), 95000),
('Will China reunify with Taiwan by 2030?', '중국이 2030년까지 대만과 통일할까?', '中国会在2030年前与台湾统一吗？', '中国は2030年までに台湾と統一するか？', 1, 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800', '2030-12-31', datetime('now', '-7 days'), 175000),
('Will US Congress pass immigration reform in 2025?', '미국 의회가 2025년 이민 개혁안을 통과시킬까?', '美国国会会在2025年通过移民改革吗？', '米議会は2025年に移民改革を可決するか？', 1, 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800', '2025-12-31', datetime('now', '-8 days'), 110000),
('Will South Korea join NATO in 2025?', '한국이 2025년 NATO에 가입할까?', '韩国会在2025年加入北约吗？', '韓国は2025年にNATOに加盟するか？', 1, 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800', '2025-12-31', datetime('now', '-9 days'), 88000),
('Will Japan amend Article 9 in 2025?', '일본이 2025년 평화헌법 9조를 개정할까?', '日本会在2025年修改第九条吗？', '日本は2025年に第9条を改正するか？', 1, 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800', '2025-12-31', datetime('now', '-10 days'), 92000);

-- 스포츠 이슈 (10개)
INSERT INTO events (title_en, title_ko, title_zh, title_ja, category_id, image_url, end_date, created_at, total_volume) VALUES
('Will Messi win 2024 Ballon d''Or?', '메시가 2024 발롱도르를 수상할까?', '梅西会赢得2024金球奖吗？', 'メッシは2024年バロンドールを受賞するか？', 2, 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=800', '2024-12-01', datetime('now', '-1 day'), 320000),
('Will Son Heung-min score 20+ goals this season?', '손흥민이 이번 시즌 20골 이상 득점할까?', '孙兴慜本赛季会进20球以上吗？', 'ソン・フンミンは今シーズン20ゴール以上得点するか？', 2, 'https://images.unsplash.com/photo-1553778263-73a83af78d04?w=800', '2025-05-31', datetime('now', '-2 days'), 280000),
('Will Ohtani win MVP in 2024?', '오타니가 2024년 MVP를 수상할까?', '大谷会赢得2024年MVP吗？', '大谷は2024年MVPを受賞するか？', 2, 'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=800', '2024-11-30', datetime('now', '-3 days'), 260000),
('Will Manchester City win Champions League 2025?', '맨시티가 2025 챔피언스리그 우승할까?', '曼城会赢得2025欧冠吗？', 'マンチェスター・シティは2025年CLで優勝するか？', 2, 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800', '2025-06-01', datetime('now', '-4 days'), 300000),
('Will China win Asian Cup 2024?', '중국이 2024 아시안컵 우승할까?', '中国会赢得2024亚洲杯吗？', '中国は2024年アジアカップで優勝するか？', 2, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', '2024-02-10', datetime('now', '-5 days'), 140000),
('Will LeBron James retire in 2025?', '르브론 제임스가 2025년 은퇴할까?', '勒布朗·詹姆斯会在2025年退役吗？', 'レブロン・ジェームズは2025年に引退するか？', 2, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800', '2025-12-31', datetime('now', '-6 days'), 190000),
('Will Japan host 2030 World Cup?', '일본이 2030 월드컵을 개최할까?', '日本会举办2030世界杯吗？', '日本は2030年W杯を開催するか？', 2, 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800', '2024-12-31', datetime('now', '-7 days'), 160000),
('Will Ronaldo score 50+ goals in 2024?', '호날두가 2024년 50골 이상 득점할까?', '罗纳尔多会在2024年进50球以上吗？', 'ロナウドは2024年に50ゴール以上得点するか？', 2, 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800', '2024-12-31', datetime('now', '-8 days'), 210000),
('Will Korea qualify for 2026 World Cup?', '한국이 2026 월드컵 본선에 진출할까?', '韩国会晋级2026世界杯吗？', '韓国は2026年W杯に出場するか？', 2, 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800', '2025-11-30', datetime('now', '-9 days'), 175000),
('Will Tom Brady come out of retirement?', '톰 브래디가 은퇴를 번복할까?', '汤姆·布雷迪会复出吗？', 'トム・ブレイディは復帰するか？', 2, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800', '2025-03-01', datetime('now', '-10 days'), 145000);

-- 기술 이슈 (10개)
INSERT INTO events (title_en, title_ko, title_zh, title_ja, category_id, image_url, end_date, created_at, total_volume) VALUES
('Will GPT-5 be released in 2024?', 'GPT-5가 2024년에 출시될까?', 'GPT-5会在2024年发布吗？', 'GPT-5は2024年にリリースされるか？', 6, 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', '2024-12-31', datetime('now', '-1 day'), 380000),
('Will Apple launch foldable iPhone in 2025?', '애플이 2025년 폴더블 아이폰을 출시할까?', '苹果会在2025年推出折叠iPhone吗？', 'AppleはTime 2025年に折りたたみiPhoneを発売するか？', 6, 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=800', '2025-12-31', datetime('now', '-2 days'), 350000),
('Will Tesla achieve Level 5 autonomy in 2025?', '테슬라가 2025년 완전자율주행을 달성할까?', '特斯拉会在2025年实现5级自动驾驶吗？', 'テスラは2025年にレベル5自動運転を達成するか？', 6, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800', '2025-12-31', datetime('now', '-3 days'), 290000),
('Will Bitcoin reach $100,000 in 2024?', '비트코인이 2024년 10만 달러를 돌파할까?', '比特币会在2024年突破10万美元吗？', 'ビットコインは2024年に10万ドルを突破するか？', 6, 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800', '2024-12-31', datetime('now', '-4 days'), 420000),
('Will Meta release affordable VR headset in 2024?', '메타가 2024년 저가형 VR 헤드셋을 출시할까?', 'Meta会在2024年发布平价VR头显吗？', 'Metaは2024年に手頃なVRヘッドセットを発売するか？', 6, 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800', '2024-12-31', datetime('now', '-5 days'), 180000),
('Will Samsung launch AR glasses in 2025?', '삼성이 2025년 AR 글래스를 출시할까?', '三星会在2025年推出AR眼镜吗？', 'サムスンは2025年にARグラスを発売するか？', 6, 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800', '2025-12-31', datetime('now', '-6 days'), 220000),
('Will quantum computer break RSA encryption in 2025?', '양자컴퓨터가 2025년 RSA 암호화를 해독할까?', '量子计算机会在2025年破解RSA加密吗？', '量子コンピューターは2025年にRSA暗号を破るか？', 6, 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800', '2025-12-31', datetime('now', '-7 days'), 160000),
('Will Twitter (X) introduce paid verification?', '트위터(X)가 유료 인증을 도입할까?', 'Twitter(X)会推出付费认证吗？', 'Twitter(X)は有料認証を導入するか？', 6, 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800', '2024-12-31', datetime('now', '-8 days'), 145000),
('Will TikTok be banned in US in 2024?', '틱톡이 2024년 미국에서 금지될까?', 'TikTok会在2024年在美国被禁吗？', 'TikTokは2024年に米国で禁止されるか？', 6, 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800', '2024-12-31', datetime('now', '-9 days'), 310000),
('Will SpaceX land on Mars in 2025?', '스페이스X가 2025년 화성에 착륙할까?', 'SpaceX会在2025年登陆火星吗？', 'スペースXは2025年に火星に着陸するか？', 6, 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800', '2025-12-31', datetime('now', '-10 days'), 275000);

-- 경제 이슈 (10개)
INSERT INTO events (title_en, title_ko, title_zh, title_ja, category_id, image_url, end_date, created_at, total_volume) VALUES
('Will US Fed raise interest rates in Dec 2024?', '미국 연준이 2024년 12월 금리를 인상할까?', '美联储会在2024年12月加息吗？', '米FRBは2024年12月に利上げするか？', 5, 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800', '2024-12-31', datetime('now', '-1 day'), 340000),
('Will Korean Won fall below 1400 vs USD in 2024?', '원화가 2024년 달러당 1400원 이하로 하락할까?', '韩元会在2024年跌破1美元兑1400韩元吗？', 'ウォンは2024年に1ドル1400ウォン以下に下落するか？', 5, 'https://images.unsplash.com/photo-1621981386829-9b458a2cddde?w=800', '2024-12-31', datetime('now', '-2 days'), 260000),
('Will Chinese GDP growth exceed 5% in 2024?', '중국 GDP 성장률이 2024년 5%를 넘을까?', '中国2024年GDP增长会超过5%吗？', '中国の2024年GDP成長率は5%を超えるか？', 5, 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800', '2024-12-31', datetime('now', '-3 days'), 290000),
('Will Japan enter recession in 2025?', '일본이 2025년 경기침체에 진입할까?', '日本会在2025年进入衰退吗？', '日本は2025年に景気後退に入るか？', 5, 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', '2025-12-31', datetime('now', '-4 days'), 220000),
('Will oil prices reach $100/barrel in 2024?', '유가가 2024년 배럴당 100달러를 넘을까?', '油价会在2024年突破每桶100美元吗？', '原油価格は2024年に1バレル100ドルを超えるか？', 5, 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800', '2024-12-31', datetime('now', '-5 days'), 310000),
('Will US housing market crash in 2025?', '미국 주택시장이 2025년 폭락할까?', '美国房地产市场会在2025年崩溃吗？', '米住宅市場は2025年に暴落するか？', 5, 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', '2025-12-31', datetime('now', '-6 days'), 280000),
('Will Samsung stock hit 100,000 KRW in 2024?', '삼성전자 주가가 2024년 10만원을 돌파할까?', '三星股价会在2024年突破10万韩元吗？', 'サムスン株は2024年に10万ウォンを突破するか？', 5, 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800', '2024-12-31', datetime('now', '-7 days'), 195000),
('Will unemployment rate in US exceed 5% in 2024?', '미국 실업률이 2024년 5%를 넘을까?', '美国失业率会在2024年超过5%吗？', '米失業率は2024年に5%を超えるか？', 5, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800', '2024-12-31', datetime('now', '-8 days'), 175000),
('Will China ban cryptocurrency trading permanently?', '중국이 암호화폐 거래를 영구 금지할까?', '中国会永久禁止加密货币交易吗？', '中国は仮想通貨取引を永久に禁止するか？', 5, 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800', '2025-06-30', datetime('now', '-9 days'), 240000),
('Will Nikkei 225 reach 40,000 in 2024?', '니케이 225가 2024년 4만을 돌파할까?', '日经225会在2024年突破4万吗？', '日経225は2024年に4万を突破するか？', 5, 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800', '2024-12-31', datetime('now', '-10 days'), 210000);

-- 엔터테인먼트 이슈 (10개)
INSERT INTO events (title_en, title_ko, title_zh, title_ja, category_id, image_url, end_date, created_at, total_volume) VALUES
('Will BTS reunite for comeback in 2025?', 'BTS가 2025년 컴백할까?', 'BTS会在2025年复出吗？', 'BTSは2025年に再結成するか？', 3, 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=800', '2025-12-31', datetime('now', '-1 day'), 450000),
('Will Barbie 2 be announced in 2024?', '바비 2편이 2024년에 발표될까?', 'Barbie 2会在2024年宣布吗？', 'バービー2は2024年に発表されるか？', 3, 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=800', '2024-12-31', datetime('now', '-2 days'), 320000),
('Will Taylor Swift win Grammy in 2025?', '테일러 스위프트가 2025 그래미를 수상할까?', '泰勒·斯威夫特会赢得2025格莱美吗？', 'テイラー・スウィフトは2025年グラミー賞を受賞するか？', 3, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', '2025-02-02', datetime('now', '-3 days'), 380000),
('Will Squid Game S3 release in 2024?', '오징어 게임 시즌3가 2024년 공개될까?', '鱿鱼游戏第三季会在2024年发布吗？', 'イカゲームシーズン3は2024年に公開されるか？', 3, 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800', '2024-12-31', datetime('now', '-4 days'), 420000),
('Will Marvel announce Avengers 6 in 2024?', '마블이 2024년 어벤져스 6을 발표할까?', '漫威会在2024年宣布复仇者联盟6吗？', 'マーベルは2024年にアベンジャーズ6を発表するか？', 3, 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800', '2024-12-31', datetime('now', '-5 days'), 360000),
('Will Blackpink renew YG contract in 2024?', '블랙핑크가 2024년 YG와 재계약할까?', 'Blackpink会在2024年与YG续约吗？', 'BLACKPINKは2024年にYGと契約更新するか？', 3, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', '2024-12-31', datetime('now', '-6 days'), 290000),
('Will anime Your Name sequel release in 2025?', '너의 이름은 속편이 2025년 개봉할까?', '你的名字续集会在2025年上映吗？', '君の名は。続編は2025年に公開されるか？', 3, 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800', '2025-12-31', datetime('now', '-7 days'), 270000),
('Will K-drama Parasite series air in 2024?', '기생충 드라마 시리즈가 2024년 방영될까?', '寄生虫剧集会在2024年播出吗？', 'パラサイトドラマシリーズは2024年に放送されるか？', 3, 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800', '2024-12-31', datetime('now', '-8 days'), 310000),
('Will Dune 3 be officially greenlit?', '듄 3편이 공식 제작 확정될까?', 'Dune 3会正式获批吗？', 'デューン3は正式に制作決定するか？', 3, 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800', '2025-06-30', datetime('now', '-9 days'), 255000),
('Will Netflix reach 300M subscribers in 2024?', '넷플릭스가 2024년 3억 가입자를 돌파할까?', 'Netflix会在2024年达到3亿订阅者吗？', 'Netflixは2024年に3億人の加入者を突破するか？', 3, 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800', '2024-12-31', datetime('now', '-10 days'), 230000);
