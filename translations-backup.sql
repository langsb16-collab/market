PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE d1_migrations(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO "d1_migrations" VALUES(1,'0001_initial_schema.sql','2026-04-28 12:58:54');
INSERT INTO "d1_migrations" VALUES(2,'0001_create_issues.sql','2026-04-28 12:58:55');
INSERT INTO "d1_migrations" VALUES(3,'0002_create_issues_table.sql','2026-04-28 12:58:55');
INSERT INTO "d1_migrations" VALUES(4,'0003_add_social_login_and_referrals.sql','2026-04-28 22:04:16');
INSERT INTO "d1_migrations" VALUES(5,'0004_add_category_translations.sql','2026-05-02 12:43:25');
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME DEFAULT CURRENT_TIMESTAMP
, email TEXT, name TEXT, phone TEXT, password_hash TEXT, kakao_id TEXT, facebook_id TEXT, instagram_id TEXT, twitter_id TEXT, social_provider TEXT, avatar_url TEXT, referral_code TEXT, referred_by TEXT, referral_count INTEGER DEFAULT 0, referral_rewards REAL DEFAULT 0, status TEXT DEFAULT 'active', updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);
INSERT INTO "users" VALUES(1777414173366,'0x123...',NULL,'en','2026-04-28T22:09:33.366Z','2026-04-28T22:09:40.158Z','test@example.com','테스트','010-1234-5678','test1234',NULL,NULL,NULL,NULL,'email',NULL,'ETVKSKPN',NULL,1,0,'active','2026-04-28 22:09:33');
INSERT INTO "users" VALUES(1777414185820,'0x456...',NULL,'en','2026-04-28T22:09:45.820Z','2026-04-28T22:09:45.820Z','test2@example.com','테스트2','010-5678-1234','test1234',NULL,NULL,NULL,NULL,'email',NULL,'JS20DM55','ETVKSKPN',0,0,'active','2026-04-28 22:09:45');
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_en TEXT NOT NULL,
  name_ko TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  name_ja TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  title_en TEXT NOT NULL,
  title_ko TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  title_ja TEXT NOT NULL,
  description_en TEXT,
  description_ko TEXT,
  description_zh TEXT,
  description_ja TEXT,
  image_url TEXT,
  end_date DATETIME NOT NULL,
  resolution_date DATETIME,
  status TEXT DEFAULT 'active', 
  resolution_criteria_en TEXT,
  resolution_criteria_ko TEXT,
  resolution_criteria_zh TEXT,
  resolution_criteria_ja TEXT,
  total_volume REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
CREATE TABLE outcomes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  name_en TEXT NOT NULL,
  name_ko TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  name_ja TEXT NOT NULL,
  probability REAL DEFAULT 0.5, 
  total_bets REAL DEFAULT 0,
  is_winning_outcome BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id)
);
CREATE TABLE bets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  event_id INTEGER NOT NULL,
  outcome_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  crypto_type TEXT NOT NULL, 
  crypto_amount REAL NOT NULL,
  transaction_hash TEXT,
  probability_at_bet REAL NOT NULL, 
  potential_payout REAL NOT NULL,
  status TEXT DEFAULT 'pending', 
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  confirmed_at DATETIME,
  settled_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (outcome_id) REFERENCES outcomes(id)
);
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  bet_id INTEGER,
  transaction_hash TEXT UNIQUE NOT NULL,
  crypto_type TEXT NOT NULL,
  amount REAL NOT NULL,
  type TEXT NOT NULL, 
  status TEXT DEFAULT 'pending', 
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  confirmed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (bet_id) REFERENCES bets(id)
);
CREATE TABLE issues (
  id TEXT PRIMARY KEY,
  title_ko TEXT NOT NULL,
  title_en TEXT,
  title_zh TEXT,
  title_ja TEXT,
  description_ko TEXT,
  description_en TEXT,
  description_zh TEXT,
  description_ja TEXT,
  resolution_criteria_ko TEXT,
  resolution_criteria_en TEXT,
  resolution_criteria_zh TEXT,
  resolution_criteria_ja TEXT,
  category TEXT NOT NULL DEFAULT 'politics',
  category_id INTEGER DEFAULT 0,
  category_slug TEXT,
  initial_usdt REAL DEFAULT 60,
  yes_bet REAL DEFAULT 0,
  no_bet REAL DEFAULT 0,
  expire_days INTEGER DEFAULT 7,
  expire_date TEXT,
  end_date TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  total_volume REAL DEFAULT 0,
  participants INTEGER DEFAULT 0
);
INSERT INTO "issues" VALUES('1','2024 미국 대선: 트럼프 vs 바이든','2024 US Presidential Election: Trump vs Biden','2024年美国总统大选：特朗普对拜登','2024年米国大統領選：トランプ対バイデン',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Politics',0,'politics',60,28.59,31.41,30,'2026-05-28 13:01:06','2026-05-28 13:01:06','active','2026-04-28 13:01:06','2026-04-28 13:01:06',600000,6578);
INSERT INTO "issues" VALUES('2','2024 파리 올림픽 금메달 1위 국가','2024 Paris Olympics Gold Medal Winner','2024年巴黎奥运会金牌第一名国家','2024年パリオリンピック金メダル首位国',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sports',0,'sports',60,34.15,25.85,31,'2026-05-29 13:01:06','2026-05-29 13:01:06','active','2026-04-28 12:01:06','2026-04-28 13:01:06',600000,6137);
INSERT INTO "issues" VALUES('3','ChatGPT-5 2025년 출시','ChatGPT-5 Release in 2025','ChatGPT-5将于2025年发布','ChatGPT-5 2025年リリース',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Technology',0,'technology',60,39.96,20.04,32,'2026-05-30 13:01:06','2026-05-30 13:01:06','active','2026-04-28 11:01:06','2026-04-28 13:01:06',600000,6199);
INSERT INTO "issues" VALUES('4','오징어게임 시즌3 제작','Squid Game Season 3 Production','鱿鱼游戏第三季制作','イカゲームシーズン3制作',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Entertainment',0,'entertainment',60,29.37,30.63,33,'2026-05-31 13:01:06','2026-05-31 13:01:06','active','2026-04-28 10:01:06','2026-04-28 13:01:06',600000,6656);
INSERT INTO "issues" VALUES('5','비트코인 $100,000 돌파','Bitcoin Breaks $100,000','比特币突破100,000美元','ビットコイン10万ドル突破',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Economy',0,'economy',60,34.97,25.03,34,'2026-06-01 13:01:06','2026-06-01 13:01:06','active','2026-04-28 09:01:06','2026-04-28 13:01:06',600000,6688);
INSERT INTO "issues" VALUES('6','화성 유인 탐사 성공','Successful Manned Mars Mission','火星载人探测成功','火星有人探査成功',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Science',0,'science',60,23.02,36.98,35,'2026-06-02 13:01:06','2026-06-02 13:01:06','active','2026-04-28 08:01:06','2026-04-28 13:01:06',600000,6760);
INSERT INTO "issues" VALUES('7','북극 빙하 완전 소멸','Complete Arctic Ice Melt','北极冰川完全消失','北極氷河完全消滅',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Climate',0,'climate',60,20.76,39.24,36,'2026-06-03 13:01:06','2026-06-03 13:01:06','active','2026-04-28 07:01:06','2026-04-28 13:01:06',600000,6367);
INSERT INTO "issues" VALUES('8','한류 세계 1위','Korean Wave Tops Global Charts','韩流世界第一','韓流世界1位',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Culture',0,'culture',60,36.79,23.21,37,'2026-06-04 13:01:06','2026-06-04 13:01:06','active','2026-04-28 06:01:06','2026-04-28 13:01:06',600000,6497);
INSERT INTO "issues" VALUES('9','한국 대통령 지지율 40% 이상?','Korean President Approval Rating Above 40%?','韩国总统支持率超过40%？','韓国大統領支持率40%以上？',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Politics',0,'politics',60,26.23,33.77,38,'2026-06-05 13:01:06','2026-06-05 13:01:06','active','2026-04-28 05:01:06','2026-04-28 13:01:06',600000,6423);
INSERT INTO "issues" VALUES('10','메시 2025 MLS 우승','Messi Wins 2025 MLS Championship','梅西赢得2025年MLS冠军','メッシ2025年MLSチャンピオン',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sports',0,'sports',60,30.96,29.04,39,'2026-06-06 13:01:06','2026-06-06 13:01:06','active','2026-04-28 04:01:06','2026-04-28 13:01:06',600000,6066);
INSERT INTO "issues" VALUES('11','애플 비전프로 2 출시','Apple Vision Pro 2 Release','苹果Vision Pro 2发布','Apple Vision Pro 2リリース',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Technology',0,'technology',60,30.82,29.18,40,'2026-06-07 13:01:06','2026-06-07 13:01:06','active','2026-04-28 03:01:06','2026-04-28 13:01:06',600000,6906);
INSERT INTO "issues" VALUES('12','BTS 완전체 컴백','BTS Full Group Comeback','BTS完整组合回归','BTS完全体カムバック',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Entertainment',0,'entertainment',60,32.95,27.05,41,'2026-06-08 13:01:06','2026-06-08 13:01:06','active','2026-04-28 02:01:06','2026-04-28 13:01:06',600000,6242);
INSERT INTO "issues" VALUES('13','금값 온스당 $3,000','Gold Price $3,000 per Ounce','黄金价格每盎司3,000美元','金価格1オンス3,000ドル',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Economy',0,'economy',60,22.69,37.31,42,'2026-06-09 13:01:06','2026-06-09 13:01:06','active','2026-04-28 01:01:06','2026-04-28 13:01:06',600000,6484);
INSERT INTO "issues" VALUES('14','AI 의식 출현','Emergence of AI Consciousness','AI意识出现','AI意識の出現',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Science',0,'science',60,39.4,20.6,43,'2026-06-10 13:01:06','2026-06-10 13:01:06','active','2026-04-28 00:01:06','2026-04-28 13:01:06',600000,6364);
INSERT INTO "issues" VALUES('15','해수면 1m 상승','Sea Level Rises 1 Meter','海平面上升1米','海面1メートル上昇',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Climate',0,'climate',60,25.43,34.57,44,'2026-06-11 13:01:06','2026-06-11 13:01:06','active','2026-04-27 23:01:06','2026-04-28 13:01:06',600000,6890);
INSERT INTO "issues" VALUES('16','K-POP 빌보드 석권','K-POP Dominates Billboard','K-POP占领公告牌','K-POPビルボード制覇',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Culture',0,'culture',60,26.93,33.07,45,'2026-06-12 13:01:06','2026-06-12 13:01:06','active','2026-04-27 22:01:06','2026-04-28 13:01:06',600000,6594);
INSERT INTO "issues" VALUES('17','영국 EU 단일시장 재가입?','UK Rejoins EU Single Market?','英国重新加入欧盟单一市场？','英国、EU単一市場に再加入？',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Politics',0,'politics',60,36.26,23.74,46,'2026-06-13 13:01:06','2026-06-13 13:01:06','active','2026-04-27 21:01:06','2026-04-28 13:01:06',600000,6945);
INSERT INTO "issues" VALUES('18','손흥민 EPL 득점왕','Son Heung-min EPL Top Scorer','孙兴慜EPL最佳射手','ソン・フンミンEPL得点王',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sports',0,'sports',60,35.12,24.88,47,'2026-06-14 13:01:06','2026-06-14 13:01:06','active','2026-04-27 20:01:06','2026-04-28 13:01:06',600000,6367);
INSERT INTO "issues" VALUES('19','테슬라 FSD 완전 자율주행','Tesla FSD Full Self-Driving','特斯拉FSD完全自动驾驶','テスラFSD完全自動運転',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Technology',0,'technology',60,26.16,33.84,48,'2026-06-15 13:01:06','2026-06-15 13:01:06','active','2026-04-27 19:01:06','2026-04-28 13:01:06',600000,6806);
INSERT INTO "issues" VALUES('20','블랙핑크 월드투어','BLACKPINK World Tour','BLACKPINK世界巡演','BLACKPINKワールドツアー',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Entertainment',0,'entertainment',60,32.78,27.22,49,'2026-06-16 13:01:06','2026-06-16 13:01:06','active','2026-04-27 18:01:06','2026-04-28 13:01:06',600000,6593);
INSERT INTO "issues" VALUES('21','S&P 500 지수 6,000','S&P 500 지수 6,000','S&P 500 지수 6,000','S&P 500 지수 6,000',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Economy',0,'economy',60,39.54,20.46,50,'2026-06-17 13:01:06','2026-06-17 13:01:06','active','2026-04-27 17:01:06','2026-04-28 13:01:06',600000,6805);
INSERT INTO "issues" VALUES('22','핵융합 발전 상용화','핵융합 발전 상용화','핵융합 발전 상용화','핵융합 발전 상용화',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Science',0,'science',60,18.85,41.15,51,'2026-06-18 13:01:06','2026-06-18 13:01:06','active','2026-04-27 16:01:06','2026-04-28 13:01:06',600000,6073);
INSERT INTO "issues" VALUES('23','폭염 기록 경신','폭염 기록 경신','폭염 기록 경신','폭염 기록 경신',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Climate',0,'climate',60,20.03,39.97,52,'2026-06-19 13:01:06','2026-06-19 13:01:06','active','2026-04-27 15:01:06','2026-04-28 13:01:06',600000,6249);
INSERT INTO "issues" VALUES('24','한식 미슐랭 스타','한식 미슐랭 스타','한식 미슐랭 스타','한식 미슐랭 스타',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Culture',0,'culture',60,19.99,40.01,53,'2026-06-20 13:01:06','2026-06-20 13:01:06','active','2026-04-27 14:01:06','2026-04-28 13:01:06',600000,6165);
INSERT INTO "issues" VALUES('25','시진핑 2027년 이후 중국 주석 유지?','시진핑 2027년 이후 중국 주석 유지?','시진핑 2027년 이후 중국 주석 유지?','시진핑 2027년 이후 중국 주석 유지?',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Politics',0,'politics',60,34.23,25.77,54,'2026-06-21 13:01:06','2026-06-21 13:01:06','active','2026-04-27 13:01:06','2026-04-28 13:01:06',600000,6305);
INSERT INTO "issues" VALUES('26','한국 2026 월드컵 16강','한국 2026 월드컵 16강','한국 2026年 월드컵 16강','한국 2026年 월드컵 16강',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sports',0,'sports',60,20.83,39.17,55,'2026-06-22 13:01:06','2026-06-22 13:01:06','active','2026-04-27 12:01:06','2026-04-28 13:01:06',600000,6792);
INSERT INTO "issues" VALUES('27','삼성 갤럭시 폴더블 폰','삼성 갤럭시 폴더블 폰','삼성 갤럭시 폴더블 폰','삼성 갤럭시 폴더블 폰',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Technology',0,'technology',60,36.67,23.33,56,'2026-06-23 13:01:06','2026-06-23 13:01:06','active','2026-04-27 11:01:06','2026-04-28 13:01:06',600000,6789);
INSERT INTO "issues" VALUES('28','기생충 속편 제작','기생충 속편 Production','기생충 속편 制作','기생충 속편 制作',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Entertainment',0,'entertainment',60,35.91,24.09,57,'2026-06-24 13:01:06','2026-06-24 13:01:06','active','2026-04-27 10:01:06','2026-04-28 13:01:06',600000,6353);
INSERT INTO "issues" VALUES('29','유가 배럴당 $120','유가 배럴당 $120','유가 배럴당 $120','유가 배럴당 $120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Economy',0,'economy',60,39.92,20.08,58,'2026-06-25 13:01:06','2026-06-25 13:01:06','active','2026-04-27 09:01:06','2026-04-28 13:01:06',600000,6840);
INSERT INTO "issues" VALUES('30','암 완치 치료법 개발','암 완치 치료법 개발','암 완치 치료법 개발','암 완치 치료법 개발',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Science',0,'science',60,31.82,28.18,59,'2026-06-26 13:01:06','2026-06-26 13:01:06','active','2026-04-27 08:01:06','2026-04-28 13:01:06',600000,6966);
INSERT INTO "issues" VALUES('31','탄소중립 달성','Carbon Neutrality Achieved','实现碳中和','カーボンニュートラル達成',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Climate',0,'climate',60,24.94,35.06,60,'2026-06-27 13:01:06','2026-06-27 13:01:06','active','2026-04-27 07:01:06','2026-04-28 13:01:06',600000,6135);
INSERT INTO "issues" VALUES('32','한복 세계화','한복 세계화','한복 세계화','한복 세계화',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Culture',0,'culture',60,35.3,24.7,61,'2026-06-28 13:01:06','2026-06-28 13:01:06','active','2026-04-27 06:01:06','2026-04-28 13:01:06',600000,6955);
INSERT INTO "issues" VALUES('33','NATO 우크라이나 회원국 가입?','NATO 우크라이나 회원국 가입?','NATO 우크라이나 회원국 가입?','NATO 우크라이나 회원국 가입?',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Politics',0,'politics',60,18.14,41.86,62,'2026-06-29 13:01:06','2026-06-29 13:01:06','active','2026-04-27 05:01:06','2026-04-28 13:01:06',600000,6460);
INSERT INTO "issues" VALUES('34','NBA 레이커스 우승','NBA 레이커스 Championship','NBA 레이커스 冠军','NBA 레이커스 優勝',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sports',0,'sports',60,31.74,28.26,63,'2026-06-30 13:01:06','2026-06-30 13:01:06','active','2026-04-27 04:01:06','2026-04-28 13:01:06',600000,6518);
INSERT INTO "issues" VALUES('35','구글 AI 검색 독점','구글 AI 검색 독점','구글 AI 검색 독점','구글 AI 검색 독점',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Technology',0,'technology',60,26.76,33.24,64,'2026-07-01 13:01:06','2026-07-01 13:01:06','active','2026-04-27 03:01:06','2026-04-28 13:01:06',600000,6941);
INSERT INTO "issues" VALUES('36','어벤져스 신작 개봉','어벤져스 신작 개봉','어벤져스 신작 개봉','어벤져스 신작 개봉',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Entertainment',0,'entertainment',60,19.07,40.93,65,'2026-07-02 13:01:06','2026-07-02 13:01:06','active','2026-04-27 02:01:06','2026-04-28 13:01:06',600000,6629);
INSERT INTO "issues" VALUES('37','달러 환율 1,400원','달러 환율 1,400원','달러 환율 1,400원','달러 환율 1,400원',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Economy',0,'economy',60,19.44,40.56,66,'2026-07-03 13:01:06','2026-07-03 13:01:06','active','2026-04-27 01:01:06','2026-04-28 13:01:06',600000,6522);
INSERT INTO "issues" VALUES('38','양자컴퓨터 실용화','양자컴퓨터 실용화','양자컴퓨터 실용화','양자컴퓨터 실용화',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Science',0,'science',60,35.63,24.37,67,'2026-07-04 13:01:06','2026-07-04 13:01:06','active','2026-04-27 00:01:06','2026-04-28 13:01:06',600000,6064);
INSERT INTO "issues" VALUES('39','재생에너지 50%','재생에너지 50%','재생에너지 50%','재생에너지 50%',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Climate',0,'climate',60,19.15,40.85,68,'2026-07-05 13:01:06','2026-07-05 13:01:06','active','2026-04-26 23:01:06','2026-04-28 13:01:06',600000,6232);
INSERT INTO "issues" VALUES('40','한글날 공휴일','한글날 공휴일','한글날 공휴일','한글날 공휴일',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Culture',0,'culture',60,34.76,25.24,69,'2026-07-06 13:01:06','2026-07-06 13:01:06','active','2026-04-26 22:01:06','2026-04-28 13:01:06',600000,6002);
INSERT INTO "issues" VALUES('41','인도 2030년까지 중국 GDP 추월?','인도 2030년까지 중국 GDP 추월?','인도 2030년까지 중국 GDP 추월?','인도 2030년까지 중국 GDP 추월?',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Politics',0,'politics',60,35.12,24.88,70,'2026-07-07 13:01:06','2026-07-07 13:01:06','active','2026-04-26 21:01:06','2026-04-28 13:01:06',600000,6093);
INSERT INTO "issues" VALUES('42','류현진 MLB 복귀','류현진 MLB 복귀','류현진 MLB 복귀','류현진 MLB 복귀',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sports',0,'sports',60,40.67,19.33,71,'2026-07-08 13:01:06','2026-07-08 13:01:06','active','2026-04-26 20:01:06','2026-04-28 13:01:06',600000,6443);
INSERT INTO "issues" VALUES('43','OpenAI IPO 상장','OpenAI IPO 상장','OpenAI IPO 상장','OpenAI IPO 상장',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Technology',0,'technology',60,20.58,39.42,72,'2026-07-09 13:01:06','2026-07-09 13:01:06','active','2026-04-26 19:01:06','2026-04-28 13:01:06',600000,6496);
INSERT INTO "issues" VALUES('44','NCT 빌보드 1위','NCT 빌보드 1위','NCT 빌보드 1위','NCT 빌보드 1위',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Entertainment',0,'entertainment',60,22.2,37.8,73,'2026-07-10 13:01:06','2026-07-10 13:01:06','active','2026-04-26 18:01:06','2026-04-28 13:01:06',600000,6695);
INSERT INTO "issues" VALUES('45','테슬라 주가 $500','테슬라 주가 $500','테슬라 주가 $500','테슬라 주가 $500',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Economy',0,'economy',60,38.47,21.53,74,'2026-07-11 13:01:06','2026-07-11 13:01:06','active','2026-04-26 17:01:06','2026-04-28 13:01:06',600000,6013);
INSERT INTO "issues" VALUES('46','불로장생 약물 개발','불로장생 약물 개발','불로장생 약물 개발','불로장생 약물 개발',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Science',0,'science',60,39.79,20.21,75,'2026-07-12 13:01:06','2026-07-12 13:01:06','active','2026-04-26 16:01:06','2026-04-28 13:01:06',600000,6083);
INSERT INTO "issues" VALUES('47','전기차 판매 1위','전기차 판매 1위','전기차 판매 1위','전기차 판매 1위',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Climate',0,'climate',60,25.2,34.8,76,'2026-07-13 13:01:06','2026-07-13 13:01:06','active','2026-04-26 15:01:06','2026-04-28 13:01:06',600000,6764);
INSERT INTO "issues" VALUES('48','서울 세계 도시 1위','서울 세계 도시 1위','서울 세계 도시 1위','서울 세계 도시 1위',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Culture',0,'culture',60,25.93,34.07,77,'2026-07-14 13:01:06','2026-07-14 13:01:06','active','2026-04-26 14:01:06','2026-04-28 13:01:06',600000,6318);
INSERT INTO "issues" VALUES('49','UN 팔레스타인 국가 승인?','UN 팔레스타인 국가 승인?','UN 팔레스타인 국가 승인?','UN 팔레스타인 국가 승인?',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Politics',0,'politics',60,30.79,29.21,78,'2026-07-15 13:01:06','2026-07-15 13:01:06','active','2026-04-26 13:01:06','2026-04-28 13:01:06',600000,6817);
INSERT INTO "issues" VALUES('50','김민재 챔피언스리그 우승','김민재 챔피언스리그 Championship','김민재 챔피언스리그 冠军','김민재 챔피언스리그 優勝',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sports',0,'sports',60,19.29,40.71,79,'2026-07-16 13:01:06','2026-07-16 13:01:06','active','2026-04-26 12:01:06','2026-04-28 13:01:06',600000,6592);
INSERT INTO "issues" VALUES('51','메타 메타버스 성공','메타 메타버스 Success','메타 메타버스 成功','메타 메타버스 成功',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Technology',0,'technology',60,25.84,34.16,80,'2026-07-17 13:01:06','2026-07-17 13:01:06','active','2026-04-26 11:01:06','2026-04-28 13:01:06',600000,6718);
INSERT INTO "issues" VALUES('52','뉴진스 그래미 후보','뉴진스 그래미 후보','뉴진스 그래미 후보','뉴진스 그래미 후보',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Entertainment',0,'entertainment',60,41.86,18.14,81,'2026-07-18 13:01:06','2026-07-18 13:01:06','active','2026-04-26 10:01:06','2026-04-28 13:01:06',600000,6900);
INSERT INTO "issues" VALUES('53','NVIDIA 주가 $2,000','NVIDIA 주가 $2,000','NVIDIA 주가 $2,000','NVIDIA 주가 $2,000',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Economy',0,'economy',60,30.21,29.79,82,'2026-07-19 13:01:06','2026-07-19 13:01:06','active','2026-04-26 09:01:06','2026-04-28 13:01:06',600000,6821);
INSERT INTO "issues" VALUES('54','뇌-컴퓨터 인터페이스','뇌-컴퓨터 인터페이스','뇌-컴퓨터 인터페이스','뇌-컴퓨터 인터페이스',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Science',0,'science',60,35.39,24.61,83,'2026-07-20 13:01:06','2026-07-20 13:01:06','active','2026-04-26 08:01:06','2026-04-28 13:01:06',600000,6508);
INSERT INTO "issues" VALUES('55','태양광 발전 혁신','태양광 발전 혁신','태양광 발전 혁신','태양광 발전 혁신',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Climate',0,'climate',60,33.85,26.15,84,'2026-07-21 13:01:06','2026-07-21 13:01:06','active','2026-04-26 07:01:06','2026-04-28 13:01:06',600000,6200);
INSERT INTO "issues" VALUES('56','한국 관광객 1억명','한국 관광객 1억명','한국 관광객 1억명','한국 관광객 1억명',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Culture',0,'culture',60,23.06,36.94,85,'2026-07-22 13:01:06','2026-07-22 13:01:06','active','2026-04-26 06:01:06','2026-04-28 13:01:06',600000,6332);
INSERT INTO "issues" VALUES('57','2025년 브라질 대통령 탄핵?','2025년 브라질 대통령 탄핵?','2025年년 브라질 대통령 탄핵?','2025年년 브라질 대통령 탄핵?',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Politics',0,'politics',60,19.43,40.57,86,'2026-07-23 13:01:06','2026-07-23 13:01:06','active','2026-04-26 05:01:06','2026-04-28 13:01:06',600000,6274);
INSERT INTO "issues" VALUES('58','이강인 골든볼 후보','이강인 골든볼 후보','이강인 골든볼 후보','이강인 골든볼 후보',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sports',0,'sports',60,26.84,33.16,87,'2026-07-24 13:01:06','2026-07-24 13:01:06','active','2026-04-26 04:01:06','2026-04-28 13:01:06',600000,6443);
INSERT INTO "issues" VALUES('59','아마존 AI 비서','아마존 AI 비서','아마존 AI 비서','아마존 AI 비서',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Technology',0,'technology',60,25.62,34.38,88,'2026-07-25 13:01:06','2026-07-25 13:01:06','active','2026-04-26 03:01:06','2026-04-28 13:01:06',600000,6134);
INSERT INTO "issues" VALUES('60','IU 미국 투어','IU 미국 투어','IU 미국 투어','IU 미국 투어',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Entertainment',0,'entertainment',60,38.45,21.55,89,'2026-07-26 13:01:06','2026-07-26 13:01:06','active','2026-04-26 02:01:06','2026-04-28 13:01:06',600000,6244);
INSERT INTO "issues" VALUES('61','한국 기준금리 인하','한국 기준금리 인하','한국 기준금리 인하','한국 기준금리 인하',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Economy',0,'economy',60,31.75,28.25,90,'2026-07-27 13:01:06','2026-07-27 13:01:06','active','2026-04-26 01:01:06','2026-04-28 13:01:06',600000,6162);
INSERT INTO "issues" VALUES('62','인공 장기 이식','인공 장기 이식','인공 장기 이식','인공 장기 이식',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Science',0,'science',60,30.89,29.11,91,'2026-07-28 13:01:06','2026-07-28 13:01:06','active','2026-04-26 00:01:06','2026-04-28 13:01:06',600000,6155);
INSERT INTO "issues" VALUES('63','수소경제 활성화','수소경제 활성화','수소경제 활성화','수소경제 활성화',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Climate',0,'climate',60,35.02,24.98,92,'2026-07-29 13:01:06','2026-07-29 13:01:06','active','2026-04-25 23:01:06','2026-04-28 13:01:06',600000,6614);
INSERT INTO "issues" VALUES('64','제주도 세계유산','제주도 세계유산','제주도 세계유산','제주도 세계유산',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Culture',0,'culture',60,36.2,23.8,93,'2026-07-30 13:01:06','2026-07-30 13:01:06','active','2026-04-25 22:01:06','2026-04-28 13:01:06',600000,6626);
INSERT INTO "issues" VALUES('65','북한 관광 국경 개방?','북한 관광 국경 개방?','북한 관광 국경 개방?','북한 관광 국경 개방?',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Politics',0,'politics',60,28.74,31.26,94,'2026-07-31 13:01:06','2026-07-31 13:01:06','active','2026-04-25 21:01:06','2026-04-28 13:01:06',600000,6249);
INSERT INTO "issues" VALUES('66','박지성 감독 데뷔','박지성 감독 데뷔','박지성 감독 데뷔','박지성 감독 데뷔',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sports',0,'sports',60,24.01,35.99,95,'2026-08-01 13:01:06','2026-08-01 13:01:06','active','2026-04-25 20:01:06','2026-04-28 13:01:06',600000,6271);
INSERT INTO "issues" VALUES('67','MS 코파일럿 유료화','MS 코파일럿 유료화','MS 코파일럿 유료화','MS 코파일럿 유료화',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Technology',0,'technology',60,39.18,20.82,96,'2026-08-02 13:01:06','2026-08-02 13:01:06','active','2026-04-25 19:01:06','2026-04-28 13:01:06',600000,6208);
INSERT INTO "issues" VALUES('68','세븐틴 돔투어','세븐틴 돔투어','세븐틴 돔투어','세븐틴 돔투어',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Entertainment',0,'entertainment',60,41.64,18.36,97,'2026-08-03 13:01:06','2026-08-03 13:01:06','active','2026-04-25 18:01:06','2026-04-28 13:01:06',600000,6216);
INSERT INTO "issues" VALUES('69','미국 경기침체','미국 경기침체','미국 경기침체','미국 경기침체',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Economy',0,'economy',60,20.48,39.52,98,'2026-08-04 13:01:06','2026-08-04 13:01:06','active','2026-04-25 17:01:06','2026-04-28 13:01:06',600000,6058);
INSERT INTO "issues" VALUES('70','우주 엘리베이터','우주 엘리베이터','우주 엘리베이터','우주 엘리베이터',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Science',0,'science',60,34.18,25.82,99,'2026-08-05 13:01:06','2026-08-05 13:01:06','active','2026-04-25 16:01:06','2026-04-28 13:01:06',600000,6133);
INSERT INTO "issues" VALUES('71','플라스틱 금지법','플라스틱 금지법','플라스틱 금지법','플라스틱 금지법',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Climate',0,'climate',60,29.56,30.44,100,'2026-08-06 13:01:06','2026-08-06 13:01:06','active','2026-04-25 15:01:06','2026-04-28 13:01:06',600000,6365);
INSERT INTO "issues" VALUES('72','한국어 배우기 열풍','한국어 배우기 열풍','한국어 배우기 열풍','한국어 배우기 열풍',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Culture',0,'culture',60,38.88,21.12,101,'2026-08-07 13:01:06','2026-08-07 13:01:06','active','2026-04-25 14:01:06','2026-04-28 13:01:06',600000,6145);
INSERT INTO "issues" VALUES('73','2025년 이란 정권 교체?','2025년 이란 정권 교체?','2025年년 이란 정권 교체?','2025年년 이란 정권 교체?',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Politics',0,'politics',60,27.41,32.59,102,'2026-08-08 13:01:06','2026-08-08 13:01:06','active','2026-04-25 13:01:06','2026-04-28 13:01:06',600000,6863);
INSERT INTO "issues" VALUES('74','양키스 월드시리즈 우승','양키스 월드시리즈 Championship','양키스 월드시리즈 冠军','양키스 월드시리즈 優勝',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sports',0,'sports',60,21.7,38.3,103,'2026-08-09 13:01:06','2026-08-09 13:01:06','active','2026-04-25 12:01:06','2026-04-28 13:01:06',600000,6453);
INSERT INTO "issues" VALUES('75','NVIDIA 시총 1위','NVIDIA 시총 1위','NVIDIA 시총 1위','NVIDIA 시총 1위',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Technology',0,'technology',60,39.61,20.39,104,'2026-08-10 13:01:06','2026-08-10 13:01:06','active','2026-04-25 11:01:06','2026-04-28 13:01:06',600000,6232);
INSERT INTO "issues" VALUES('76','에스파 월드투어','에스파 월드투어','에스파 월드투어','에스파 월드투어',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Entertainment',0,'entertainment',60,31.27,28.73,105,'2026-08-11 13:01:06','2026-08-11 13:01:06','active','2026-04-25 10:01:06','2026-04-28 13:01:06',600000,6366);
INSERT INTO "issues" VALUES('77','중국 경제성장률 5%','중국 경제성장률 5%','중국 경제성장률 5%','중국 경제성장률 5%',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Economy',0,'economy',60,33.01,26.99,106,'2026-08-12 13:01:06','2026-08-12 13:01:06','active','2026-04-25 09:01:06','2026-04-28 13:01:06',600000,6114);
INSERT INTO "issues" VALUES('78','타임머신 이론 증명','타임머신 이론 증명','타임머신 이론 증명','타임머신 이론 증명',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Science',0,'science',60,20.38,39.62,107,'2026-08-13 13:01:06','2026-08-13 13:01:06','active','2026-04-25 08:01:06','2026-04-28 13:01:06',600000,6293);
INSERT INTO "issues" VALUES('79','녹색 기후 기금','녹색 기후 기금','녹색 기후 기금','녹색 기후 기금',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Climate',0,'climate',60,41.58,18.42,108,'2026-08-14 13:01:06','2026-08-14 13:01:06','active','2026-04-25 07:01:06','2026-04-28 13:01:06',600000,6382);
INSERT INTO "issues" VALUES('80','한국 영화 아카데미','한국 영화 아카데미','한국 영화 아카데미','한국 영화 아카데미',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Culture',0,'culture',60,35.77,24.23,109,'2026-08-15 13:01:06','2026-08-15 13:01:06','active','2026-04-25 06:01:06','2026-04-28 13:01:06',600000,6805);
INSERT INTO "issues" VALUES('81','일본 중국 전쟁 가능성','일본 중국 전쟁 가능성','일본 중국 전쟁 가능성','일본 중국 전쟁 가능성',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Politics',0,'politics',60,33.93,26.07,110,'2026-08-16 13:01:06','2026-08-16 13:01:06','active','2026-04-25 05:01:06','2026-04-28 13:01:06',600000,6176);
INSERT INTO "issues" VALUES('82','맨시티 4연패 달성','맨시티 4연패 Achievement','맨시티 4연패 达成','맨시티 4연패 達成',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sports',0,'sports',60,18.24,41.76,111,'2026-08-17 13:01:06','2026-08-17 13:01:06','active','2026-04-25 04:01:06','2026-04-28 13:01:06',600000,6474);
INSERT INTO "issues" VALUES('83','애플 AI 폰 출시','애플 AI 폰 Release','애플 AI 폰 发布','애플 AI 폰 リリース',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Technology',0,'technology',60,38.41,21.59,112,'2026-08-18 13:01:06','2026-08-18 13:01:06','active','2026-04-25 03:01:06','2026-04-28 13:01:06',600000,6521);
INSERT INTO "issues" VALUES('84','스트레이키즈 빌보드','스트레이키즈 빌보드','스트레이키즈 빌보드','스트레이키즈 빌보드',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Entertainment',0,'entertainment',60,19.99,40.01,113,'2026-08-19 13:01:06','2026-08-19 13:01:06','active','2026-04-25 02:01:06','2026-04-28 13:01:06',600000,6606);
INSERT INTO "issues" VALUES('85','일본 엔화 급락','일본 엔화 급락','일본 엔화 급락','일본 엔화 급락',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Economy',0,'economy',60,19.73,40.27,114,'2026-08-20 13:01:06','2026-08-20 13:01:06','active','2026-04-25 01:01:06','2026-04-28 13:01:06',600000,6218);
INSERT INTO "issues" VALUES('86','노벨상 한국인 수상','노벨상 한국인 수상','노벨상 한국인 수상','노벨상 한국인 수상',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Science',0,'science',60,29.92,30.08,115,'2026-08-21 13:01:06','2026-08-21 13:01:06','active','2026-04-25 00:01:06','2026-04-28 13:01:06',600000,6860);
INSERT INTO "issues" VALUES('87','북극곰 멸종 위기','북극곰 멸종 위기','북극곰 멸종 위기','북극곰 멸종 위기',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Climate',0,'climate',60,26.09,33.91,116,'2026-08-22 13:01:06','2026-08-22 13:01:06','active','2026-04-24 23:01:06','2026-04-28 13:01:06',600000,6395);
INSERT INTO "issues" VALUES('88','한국 드라마 에미상','한국 드라마 에미상','한국 드라마 에미상','한국 드라마 에미상',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Culture',0,'culture',60,31.59,28.41,117,'2026-08-23 13:01:06','2026-08-23 13:01:06','active','2026-04-24 22:01:06','2026-04-28 13:01:06',600000,6120);
INSERT INTO "issues" VALUES('89','러시아 푸틴 하야','러시아 푸틴 하야','러시아 푸틴 하야','러시아 푸틴 하야',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Politics',0,'politics',60,22.51,37.49,118,'2026-08-24 13:01:06','2026-08-24 13:01:06','active','2026-04-24 21:01:06','2026-04-28 13:01:06',600000,6497);
INSERT INTO "issues" VALUES('90','리버풀 EPL 우승','리버풀 EPL Championship','리버풀 EPL 冠军','리버풀 EPL 優勝',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sports',0,'sports',60,22.4,37.6,119,'2026-08-25 13:01:06','2026-08-25 13:01:06','active','2026-04-24 20:01:06','2026-04-28 13:01:06',600000,6772);
INSERT INTO "issues" VALUES('91','삼성 AI 칩 개발','삼성 AI 칩 개발','삼성 AI 칩 개발','삼성 AI 칩 개발',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Technology',0,'technology',60,26.64,33.36,120,'2026-08-26 13:01:06','2026-08-26 13:01:06','active','2026-04-24 19:01:06','2026-04-28 13:01:06',600000,6715);
INSERT INTO "issues" VALUES('92','아이브 일본 투어','아이브 일본 투어','아이브 일본 투어','아이브 일본 투어',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Entertainment',0,'entertainment',60,36.96,23.04,121,'2026-08-27 13:01:06','2026-08-27 13:01:06','active','2026-04-24 18:01:06','2026-04-28 13:01:06',600000,6824);
INSERT INTO "issues" VALUES('93','유로존 금리 인하','유로존 금리 인하','유로존 금리 인하','유로존 금리 인하',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Economy',0,'economy',60,40.1,19.9,122,'2026-08-28 13:01:06','2026-08-28 13:01:06','active','2026-04-24 17:01:06','2026-04-28 13:01:06',600000,6996);
INSERT INTO "issues" VALUES('94','DNA 편집 기술','DNA 편집 기술','DNA 편집 기술','DNA 편집 기술',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Science',0,'science',60,33.69,26.31,123,'2026-08-29 13:01:06','2026-08-29 13:01:06','active','2026-04-24 16:01:06','2026-04-28 13:01:06',600000,6733);
INSERT INTO "issues" VALUES('95','산호초 복원 성공','산호초 복원 Success','산호초 복원 成功','산호초 복원 成功',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Climate',0,'climate',60,29.81,30.19,124,'2026-08-30 13:01:06','2026-08-30 13:01:06','active','2026-04-24 15:01:06','2026-04-28 13:01:06',600000,6621);
INSERT INTO "issues" VALUES('96','김치 세계화','김치 세계화','김치 세계화','김치 세계화',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Culture',0,'culture',60,29.24,30.76,125,'2026-08-31 13:01:06','2026-08-31 13:01:06','active','2026-04-24 14:01:06','2026-04-28 13:01:06',600000,6081);
INSERT INTO "issues" VALUES('97','프랑스 극우 정권','프랑스 극우 정권','프랑스 극우 정권','프랑스 극우 정권',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Politics',0,'politics',60,41.67,18.33,126,'2026-09-01 13:01:06','2026-09-01 13:01:06','active','2026-04-24 13:01:06','2026-04-28 13:01:06',600000,6806);
INSERT INTO "issues" VALUES('98','PSG 챔스 우승','PSG 챔스 Championship','PSG 챔스 冠军','PSG 챔스 優勝',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sports',0,'sports',60,38.35,21.65,127,'2026-09-02 13:01:06','2026-09-02 13:01:06','active','2026-04-24 12:01:06','2026-04-28 13:01:06',600000,6867);
INSERT INTO "issues" VALUES('99','인텔 CPU 혁신','인텔 CPU 혁신','인텔 CPU 혁신','인텔 CPU 혁신',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Technology',0,'technology',60,36.63,23.37,128,'2026-09-03 13:01:06','2026-09-03 13:01:06','active','2026-04-24 11:01:06','2026-04-28 13:01:06',600000,6439);
INSERT INTO "issues" VALUES('100','르세라핌 미국 데뷔','르세라핌 미국 데뷔','르세라핌 미국 데뷔','르세라핌 미국 데뷔',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Entertainment',0,'entertainment',60,18.19,41.81,129,'2026-09-04 13:01:06','2026-09-04 13:01:06','active','2026-04-24 10:01:06','2026-04-28 13:01:06',600000,6221);
INSERT INTO "issues" VALUES('101','삼성전자 시총 500조','삼성전자 시총 500조','삼성전자 시총 500조','삼성전자 시총 500조',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Economy',0,'economy',60,32.3,27.7,130,'2026-09-05 13:01:06','2026-09-05 13:01:06','active','2026-04-24 09:01:06','2026-04-28 13:01:06',600000,6543);
INSERT INTO "issues" VALUES('102','줄기세포 치료','줄기세포 치료','줄기세포 치료','줄기세포 치료',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Science',0,'science',60,33.57,26.43,131,'2026-09-06 13:01:06','2026-09-06 13:01:06','active','2026-04-24 08:01:06','2026-04-28 13:01:06',600000,6911);
INSERT INTO "issues" VALUES('103','사막화 방지','사막화 방지','사막화 방지','사막화 방지',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Climate',0,'climate',60,29.88,30.12,132,'2026-09-07 13:01:06','2026-09-07 13:01:06','active','2026-04-24 07:01:06','2026-04-28 13:01:06',600000,6111);
INSERT INTO "issues" VALUES('104','한옥 호텔 인기','한옥 호텔 인기','한옥 호텔 인기','한옥 호텔 인기',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Culture',0,'culture',60,35.56,24.44,133,'2026-09-08 13:01:06','2026-09-08 13:01:06','active','2026-04-24 06:01:06','2026-04-28 13:01:06',600000,6149);
INSERT INTO "issues" VALUES('105','독일 총선 결과','독일 총선 결과','독일 총선 결과','독일 총선 결과',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Politics',0,'politics',60,31.37,28.63,134,'2026-09-09 13:01:06','2026-09-09 13:01:06','active','2026-04-24 05:01:06','2026-04-28 13:01:06',600000,6039);
INSERT INTO "issues" VALUES('106','바르셀로나 라리가 우승','바르셀로나 라리가 Championship','바르셀로나 라리가 冠军','바르셀로나 라리가 優勝',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sports',0,'sports',60,19.21,40.79,135,'2026-09-10 13:01:06','2026-09-10 13:01:06','active','2026-04-24 04:01:06','2026-04-28 13:01:06',600000,6720);
INSERT INTO "issues" VALUES('107','AMD GPU 1위','AMD GPU 1위','AMD GPU 1위','AMD GPU 1위',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Technology',0,'technology',60,23.05,36.95,136,'2026-09-11 13:01:06','2026-09-11 13:01:06','active','2026-04-24 03:01:06','2026-04-28 13:01:06',600000,6664);
INSERT INTO "issues" VALUES('108','지드래곤 컴백','지드래곤 컴백','지드래곤 컴백','지드래곤 컴백',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Entertainment',0,'entertainment',60,24.16,35.84,137,'2026-09-12 13:01:06','2026-09-12 13:01:06','active','2026-04-24 02:01:06','2026-04-28 13:01:06',600000,6060);
INSERT INTO "issues" VALUES('109','현대차 판매 1위','현대차 판매 1위','현대차 판매 1위','현대차 판매 1위',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Economy',0,'economy',60,29.57,30.43,138,'2026-09-13 13:01:06','2026-09-13 13:01:06','active','2026-04-24 01:01:06','2026-04-28 13:01:06',600000,6849);
INSERT INTO "issues" VALUES('110','나노봇 의료','나노봇 의료','나노봇 의료','나노봇 의료',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Science',0,'science',60,39.53,20.47,139,'2026-09-14 13:01:06','2026-09-14 13:01:06','active','2026-04-24 00:01:06','2026-04-28 13:01:06',600000,6002);
INSERT INTO "issues" VALUES('111','열대우림 보호','열대우림 보호','열대우림 보호','열대우림 보호',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Climate',0,'climate',60,29.84,30.16,140,'2026-09-15 13:01:06','2026-09-15 13:01:06','active','2026-04-23 23:01:06','2026-04-28 13:01:06',600000,6352);
INSERT INTO "issues" VALUES('112','한국 전통 무용','한국 전통 무용','한국 전통 무용','한국 전통 무용',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Culture',0,'culture',60,26.42,33.58,141,'2026-09-16 13:01:06','2026-09-16 13:01:06','active','2026-04-23 22:01:06','2026-04-28 13:01:06',600000,6577);
INSERT INTO "issues" VALUES('113','이탈리아 EU 탈퇴','이탈리아 EU 탈퇴','이탈리아 EU 탈퇴','이탈리아 EU 탈퇴',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Politics',0,'politics',60,28.62,31.38,142,'2026-09-17 13:01:06','2026-09-17 13:01:06','active','2026-04-23 21:01:06','2026-04-28 13:01:06',600000,6165);
INSERT INTO "issues" VALUES('114','레알 마드리드 트레블','레알 마드리드 트레블','레알 마드리드 트레블','레알 마드리드 트레블',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sports',0,'sports',60,35.21,24.79,143,'2026-09-18 13:01:06','2026-09-18 13:01:06','active','2026-04-23 20:01:06','2026-04-28 13:01:06',600000,6306);
INSERT INTO "issues" VALUES('115','퀄컴 스냅드래곤 성능','퀄컴 스냅드래곤 성능','퀄컴 스냅드래곤 성능','퀄컴 스냅드래곤 성능',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Technology',0,'technology',60,29.83,30.17,144,'2026-09-19 13:01:06','2026-09-19 13:01:06','active','2026-04-23 19:01:06','2026-04-28 13:01:06',600000,6818);
INSERT INTO "issues" VALUES('116','태양 솔로 활동','태양 솔로 활동','태양 솔로 활동','태양 솔로 활동',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Entertainment',0,'entertainment',60,24.21,35.79,145,'2026-09-20 13:01:06','2026-09-20 13:01:06','active','2026-04-23 18:01:06','2026-04-28 13:01:06',600000,6191);
INSERT INTO "issues" VALUES('117','SK하이닉스 점유율','SK하이닉스 점유율','SK하이닉스 점유율','SK하이닉스 점유율',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Economy',0,'economy',60,31.81,28.19,146,'2026-09-21 13:01:06','2026-09-21 13:01:06','active','2026-04-23 17:01:06','2026-04-28 13:01:06',600000,6182);
INSERT INTO "issues" VALUES('118','우주 정거장 완성','우주 정거장 Completion','우주 정거장 完成','우주 정거장 完成',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Science',0,'science',60,22.03,37.97,147,'2026-09-22 13:01:06','2026-09-22 13:01:06','active','2026-04-23 16:01:06','2026-04-28 13:01:06',600000,6366);
INSERT INTO "issues" VALUES('119','오존층 회복','오존층 회복','오존층 회복','오존층 회복',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Climate',0,'climate',60,31.85,28.15,148,'2026-09-23 13:01:06','2026-09-23 13:01:06','active','2026-04-23 15:01:06','2026-04-28 13:01:06',600000,6771);
INSERT INTO "issues" VALUES('120','판소리 유네스코','판소리 유네스코','판소리 유네스코','판소리 유네스코',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Culture',0,'culture',60,23.93,36.07,149,'2026-09-24 13:01:06','2026-09-24 13:01:06','active','2026-04-23 14:01:06','2026-04-28 13:01:06',600000,6599);
INSERT INTO "issues" VALUES('121','2024 미국 대선: 트럼프 vs 바이든','2024 US Presidential Election: Trump vs Biden','2024年美国总统大选：特朗普对拜登','2024年米国大統領選：トランプ対バイデン',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Politics',0,'politics',60,19.25,40.75,150,'2026-09-25 13:01:06','2026-09-25 13:01:06','active','2026-04-23 13:01:06','2026-04-28 13:01:06',600000,6537);
INSERT INTO "issues" VALUES('122','2024 파리 올림픽 금메달 1위 국가','2024 Paris Olympics Gold Medal Winner','2024年巴黎奥运会金牌第一名国家','2024年パリオリンピック金メダル首位国',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sports',0,'sports',60,22.01,37.99,151,'2026-09-26 13:01:06','2026-09-26 13:01:06','active','2026-04-23 12:01:06','2026-04-28 13:01:06',600000,6433);
INSERT INTO "issues" VALUES('123','ChatGPT-5 2025년 출시','ChatGPT-5 Release in 2025','ChatGPT-5将于2025年发布','ChatGPT-5 2025年リリース',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Technology',0,'technology',60,34.52,25.48,152,'2026-09-27 13:01:06','2026-09-27 13:01:06','active','2026-04-23 11:01:06','2026-04-28 13:01:06',600000,6265);
INSERT INTO "issues" VALUES('124','오징어게임 시즌3 제작','Squid Game Season 3 Production','鱿鱼游戏第三季制作','イカゲームシーズン3制作',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Entertainment',0,'entertainment',60,19.98,40.02,153,'2026-09-28 13:01:06','2026-09-28 13:01:06','active','2026-04-23 10:01:06','2026-04-28 13:01:06',600000,6571);
INSERT INTO "issues" VALUES('125','비트코인 $100,000 돌파','Bitcoin Breaks $100,000','比特币突破100,000美元','ビットコイン10万ドル突破',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Economy',0,'economy',60,33.56,26.44,154,'2026-09-29 13:01:06','2026-09-29 13:01:06','active','2026-04-23 09:01:06','2026-04-28 13:01:06',600000,6116);
INSERT INTO "issues" VALUES('126','화성 유인 탐사 성공','Successful Manned Mars Mission','火星载人探测成功','火星有人探査成功',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Science',0,'science',60,26.42,33.58,155,'2026-09-30 13:01:06','2026-09-30 13:01:06','active','2026-04-23 08:01:06','2026-04-28 13:01:06',600000,6644);
INSERT INTO "issues" VALUES('127','북극 빙하 완전 소멸','Complete Arctic Ice Melt','北极冰川完全消失','北極氷河完全消滅',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Climate',0,'climate',60,30.5,29.5,156,'2026-10-01 13:01:06','2026-10-01 13:01:06','active','2026-04-23 07:01:06','2026-04-28 13:01:06',600000,6254);
INSERT INTO "issues" VALUES('128','한류 세계 1위','Korean Wave Tops Global Charts','韩流世界第一','韓流世界1位',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Culture',0,'culture',60,28.44,31.56,157,'2026-10-02 13:01:06','2026-10-02 13:01:06','active','2026-04-23 06:01:06','2026-04-28 13:01:06',600000,6158);
INSERT INTO "issues" VALUES('129','한국 대통령 지지율 40% 이상?','Korean President Approval Rating Above 40%?','韩国总统支持率超过40%？','韓国大統領支持率40%以上？',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Politics',0,'politics',60,23.27,36.73,158,'2026-10-03 13:01:06','2026-10-03 13:01:06','active','2026-04-23 05:01:06','2026-04-28 13:01:06',600000,6327);
INSERT INTO "issues" VALUES('130','메시 2025 MLS 우승','Messi Wins 2025 MLS Championship','梅西赢得2025年MLS冠军','メッシ2025年MLSチャンピオン',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sports',0,'sports',60,38.74,21.26,159,'2026-10-04 13:01:06','2026-10-04 13:01:06','active','2026-04-23 04:01:06','2026-04-28 13:01:06',600000,6202);
INSERT INTO "issues" VALUES('131','애플 비전프로 2 출시','Apple Vision Pro 2 Release','苹果Vision Pro 2发布','Apple Vision Pro 2リリース',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Technology',0,'technology',60,21.53,38.47,160,'2026-10-05 13:01:06','2026-10-05 13:01:06','active','2026-04-23 03:01:06','2026-04-28 13:01:06',600000,6585);
INSERT INTO "issues" VALUES('132','BTS 완전체 컴백','BTS Full Group Comeback','BTS完整组合回归','BTS完全体カムバック',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Entertainment',0,'entertainment',60,19.88,40.12,161,'2026-10-06 13:01:06','2026-10-06 13:01:06','active','2026-04-23 02:01:06','2026-04-28 13:01:06',600000,6741);
INSERT INTO "issues" VALUES('133','금값 온스당 $3,000','Gold Price $3,000 per Ounce','黄金价格每盎司3,000美元','金価格1オンス3,000ドル',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Economy',0,'economy',60,41.85,18.15,162,'2026-10-07 13:01:06','2026-10-07 13:01:06','active','2026-04-23 01:01:06','2026-04-28 13:01:06',600000,6228);
INSERT INTO "issues" VALUES('134','AI 의식 출현','Emergence of AI Consciousness','AI意识出现','AI意識の出現',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Science',0,'science',60,34.76,25.24,163,'2026-10-08 13:01:06','2026-10-08 13:01:06','active','2026-04-23 00:01:06','2026-04-28 13:01:06',600000,6682);
INSERT INTO "issues" VALUES('135','해수면 1m 상승','Sea Level Rises 1 Meter','海平面上升1米','海面1メートル上昇',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Climate',0,'climate',60,26.61,33.39,164,'2026-10-09 13:01:06','2026-10-09 13:01:06','active','2026-04-22 23:01:06','2026-04-28 13:01:06',600000,6247);
INSERT INTO "issues" VALUES('136','K-POP 빌보드 석권','K-POP Dominates Billboard','K-POP占领公告牌','K-POPビルボード制覇',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Culture',0,'culture',60,26.44,33.56,165,'2026-10-10 13:01:06','2026-10-10 13:01:06','active','2026-04-22 22:01:06','2026-04-28 13:01:06',600000,6806);
INSERT INTO "issues" VALUES('137','영국 EU 단일시장 재가입?','UK Rejoins EU Single Market?','英国重新加入欧盟单一市场？','英国、EU単一市場に再加入？',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Politics',0,'politics',60,37.07,22.93,166,'2026-10-11 13:01:06','2026-10-11 13:01:06','active','2026-04-22 21:01:06','2026-04-28 13:01:06',600000,6247);
INSERT INTO "issues" VALUES('138','손흥민 EPL 득점왕','Son Heung-min EPL Top Scorer','孙兴慜EPL最佳射手','ソン・フンミンEPL得点王',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sports',0,'sports',60,31.67,28.33,167,'2026-10-12 13:01:06','2026-10-12 13:01:06','active','2026-04-22 20:01:06','2026-04-28 13:01:06',600000,6944);
INSERT INTO "issues" VALUES('139','테슬라 FSD 완전 자율주행','Tesla FSD Full Self-Driving','特斯拉FSD完全自动驾驶','テスラFSD完全自動運転',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Technology',0,'technology',60,36.06,23.94,168,'2026-10-13 13:01:06','2026-10-13 13:01:06','active','2026-04-22 19:01:06','2026-04-28 13:01:06',600000,6603);
INSERT INTO "issues" VALUES('140','블랙핑크 월드투어','BLACKPINK World Tour','BLACKPINK世界巡演','BLACKPINKワールドツアー',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Entertainment',0,'entertainment',60,31.7,28.3,169,'2026-10-14 13:01:06','2026-10-14 13:01:06','active','2026-04-22 18:01:06','2026-04-28 13:01:06',600000,6325);
INSERT INTO "issues" VALUES('141','S&P 500 지수 6,000','S&P 500 지수 6,000','S&P 500 지수 6,000','S&P 500 지수 6,000',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Economy',0,'economy',60,41.64,18.36,170,'2026-10-15 13:01:06','2026-10-15 13:01:06','active','2026-04-22 17:01:06','2026-04-28 13:01:06',600000,6707);
INSERT INTO "issues" VALUES('142','핵융합 발전 상용화','핵융합 발전 상용화','핵융합 발전 상용화','핵융합 발전 상용화',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Science',0,'science',60,40.62,19.38,171,'2026-10-16 13:01:06','2026-10-16 13:01:06','active','2026-04-22 16:01:06','2026-04-28 13:01:06',600000,6696);
INSERT INTO "issues" VALUES('143','폭염 기록 경신','폭염 기록 경신','폭염 기록 경신','폭염 기록 경신',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Climate',0,'climate',60,19.24,40.76,172,'2026-10-17 13:01:06','2026-10-17 13:01:06','active','2026-04-22 15:01:06','2026-04-28 13:01:06',600000,6285);
INSERT INTO "issues" VALUES('144','한식 미슐랭 스타','한식 미슐랭 스타','한식 미슐랭 스타','한식 미슐랭 스타',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Culture',0,'culture',60,29.63,30.37,173,'2026-10-18 13:01:06','2026-10-18 13:01:06','active','2026-04-22 14:01:06','2026-04-28 13:01:06',600000,6028);
INSERT INTO "issues" VALUES('145','시진핑 2027년 이후 중국 주석 유지?','시진핑 2027년 이후 중국 주석 유지?','시진핑 2027년 이후 중국 주석 유지?','시진핑 2027년 이후 중국 주석 유지?',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Politics',0,'politics',60,25.24,34.76,174,'2026-10-19 13:01:06','2026-10-19 13:01:06','active','2026-04-22 13:01:06','2026-04-28 13:01:06',600000,6352);
INSERT INTO "issues" VALUES('146','한국 2026 월드컵 16강','한국 2026 월드컵 16강','한국 2026年 월드컵 16강','한국 2026年 월드컵 16강',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sports',0,'sports',60,30.4,29.6,175,'2026-10-20 13:01:06','2026-10-20 13:01:06','active','2026-04-22 12:01:06','2026-04-28 13:01:06',600000,6535);
INSERT INTO "issues" VALUES('147','삼성 갤럭시 폴더블 폰','삼성 갤럭시 폴더블 폰','삼성 갤럭시 폴더블 폰','삼성 갤럭시 폴더블 폰',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Technology',0,'technology',60,24,36,176,'2026-10-21 13:01:06','2026-10-21 13:01:06','active','2026-04-22 11:01:06','2026-04-28 13:01:06',600000,6885);
INSERT INTO "issues" VALUES('148','기생충 속편 제작','기생충 속편 Production','기생충 속편 制作','기생충 속편 制作',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Entertainment',0,'entertainment',60,29.57,30.43,177,'2026-10-22 13:01:06','2026-10-22 13:01:06','active','2026-04-22 10:01:06','2026-04-28 13:01:06',600000,6001);
INSERT INTO "issues" VALUES('149','유가 배럴당 $120','유가 배럴당 $120','유가 배럴당 $120','유가 배럴당 $120',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Economy',0,'economy',60,28.03,31.97,178,'2026-10-23 13:01:06','2026-10-23 13:01:06','active','2026-04-22 09:01:06','2026-04-28 13:01:06',600000,6452);
INSERT INTO "issues" VALUES('150','암 완치 치료법 개발','암 완치 치료법 개발','암 완치 치료법 개발','암 완치 치료법 개발',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Science',0,'science',60,18.16,41.84,179,'2026-10-24 13:01:06','2026-10-24 13:01:06','active','2026-04-22 08:01:06','2026-04-28 13:01:06',600000,6557);
INSERT INTO "issues" VALUES('iss_1777381383172','미국 이란 전쟁 종식','End of the U.S.-Iran War','美伊战争结束','米国イラン戦争終結','','','','','공식 결과 확인','Verify official result','确认官方结果','公式結果確認','politics',0,'politics',60000,42000,18000,14,'2026-05-12T13:03:03.172Z','2026-05-12T13:03:03.172Z','active','2026-04-28T13:03:03.273Z','2026-04-28T13:03:03.273Z',600000000,6000035);
CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  admin_id TEXT,
  message TEXT NOT NULL,
  translated_message TEXT,
  message_type TEXT DEFAULT 'text',
  file_url TEXT,
  is_admin_reply BOOLEAN DEFAULT FALSE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE referral_rewards (
  id TEXT PRIMARY KEY,
  referrer_id TEXT NOT NULL,
  referred_user_id TEXT NOT NULL,
  reward_amount REAL NOT NULL,
  reward_type TEXT DEFAULT 'signup',
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  paid_at DATETIME
);
INSERT INTO "referral_rewards" VALUES('rwd_1777414185835','1777414173366.0','1777414185820',10,'signup','pending','2026-04-28T22:09:45.835Z',NULL);
CREATE TABLE notification_preferences (
  user_id TEXT PRIMARY KEY,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  chat_notifications BOOLEAN DEFAULT TRUE,
  bet_notifications BOOLEAN DEFAULT TRUE,
  referral_notifications BOOLEAN DEFAULT TRUE
);
CREATE TABLE category_translations (
  category_slug TEXT NOT NULL,
  language TEXT NOT NULL,
  name TEXT NOT NULL,
  PRIMARY KEY (category_slug, language)
);
INSERT INTO "category_translations" VALUES('politics','ko','정치');
INSERT INTO "category_translations" VALUES('politics','en','Politics');
INSERT INTO "category_translations" VALUES('politics','zh','政治');
INSERT INTO "category_translations" VALUES('politics','ja','政治');
INSERT INTO "category_translations" VALUES('sports','ko','스포츠');
INSERT INTO "category_translations" VALUES('sports','en','Sports');
INSERT INTO "category_translations" VALUES('sports','zh','体育');
INSERT INTO "category_translations" VALUES('sports','ja','スポーツ');
INSERT INTO "category_translations" VALUES('technology','ko','기술');
INSERT INTO "category_translations" VALUES('technology','en','Technology');
INSERT INTO "category_translations" VALUES('technology','zh','科技');
INSERT INTO "category_translations" VALUES('technology','ja','テクノロジー');
INSERT INTO "category_translations" VALUES('cryptocurrency','ko','암호화폐');
INSERT INTO "category_translations" VALUES('cryptocurrency','en','Cryptocurrency');
INSERT INTO "category_translations" VALUES('cryptocurrency','zh','加密货币');
INSERT INTO "category_translations" VALUES('cryptocurrency','ja','暗号通貨');
INSERT INTO "category_translations" VALUES('entertainment','ko','엔터테인먼트');
INSERT INTO "category_translations" VALUES('entertainment','en','Entertainment');
INSERT INTO "category_translations" VALUES('entertainment','zh','娱乐');
INSERT INTO "category_translations" VALUES('entertainment','ja','エンターテインメント');
INSERT INTO "category_translations" VALUES('economy','ko','경제');
INSERT INTO "category_translations" VALUES('economy','en','Economy');
INSERT INTO "category_translations" VALUES('economy','zh','经济');
INSERT INTO "category_translations" VALUES('economy','ja','経済');
INSERT INTO "category_translations" VALUES('science','ko','과학');
INSERT INTO "category_translations" VALUES('science','en','Science');
INSERT INTO "category_translations" VALUES('science','zh','科学');
INSERT INTO "category_translations" VALUES('science','ja','科学');
INSERT INTO "category_translations" VALUES('climate','ko','기후');
INSERT INTO "category_translations" VALUES('climate','en','Climate');
INSERT INTO "category_translations" VALUES('climate','zh','气候');
INSERT INTO "category_translations" VALUES('climate','ja','気候');
CREATE TABLE translation_cache (
  text TEXT NOT NULL,
  source_lang TEXT NOT NULL,
  target_lang TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (text, source_lang, target_lang)
);
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" VALUES('d1_migrations',5);
INSERT INTO "sqlite_sequence" VALUES('users',1777414185820);
CREATE INDEX idx_events_category ON events(category_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_end_date ON events(end_date);
CREATE INDEX idx_outcomes_event ON outcomes(event_id);
CREATE INDEX idx_bets_user ON bets(user_id);
CREATE INDEX idx_bets_event ON bets(event_id);
CREATE INDEX idx_bets_outcome ON bets(outcome_id);
CREATE INDEX idx_bets_status ON bets(status);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_hash ON transactions(transaction_hash);
CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_created_at ON issues(created_at DESC);
CREATE INDEX idx_issues_category ON issues(category);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_kakao_id ON users(kakao_id);
CREATE INDEX idx_users_facebook_id ON users(facebook_id);
CREATE INDEX idx_users_instagram_id ON users(instagram_id);
CREATE INDEX idx_users_twitter_id ON users(twitter_id);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_referred_by ON users(referred_by);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_referral_rewards_referrer_id ON referral_rewards(referrer_id);
CREATE INDEX idx_referral_rewards_referred_user_id ON referral_rewards(referred_user_id);
CREATE INDEX idx_category_translations_slug ON category_translations(category_slug);
CREATE INDEX idx_translation_cache_lookup ON translation_cache(text, source_lang, target_lang);