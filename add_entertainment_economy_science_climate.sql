-- Add 120 new events (30 per category: Entertainment, Economy, Science, Climate)
-- Based on recent global news from USA, China, Japan, Korea media sources

-- ========================================
-- ENTERTAINMENT (30 events)
-- ========================================
INSERT INTO events (
  category_id,
  title_en, title_ko, title_zh, title_ja,
  description_en, description_ko, description_zh, description_ja,
  end_date, status, total_volume,
  resolution_criteria_en, resolution_criteria_ko, resolution_criteria_zh, resolution_criteria_ja
) VALUES
-- Hollywood & US Entertainment
(5, 'Oscars 2025: Oppenheimer wins Best Picture?', '2025 오스카: 오펜하이머 작품상 수상?', '奥斯卡2025：奥本海默获最佳影片？', 'オスカー2025：オッペンハイマー作品賞受賞？',
 'Will Oppenheimer win Best Picture at 2025 Academy Awards?', '오펜하이머가 2025 아카데미 작품상을 수상할까요?', '奥本海默将获得2025年奥斯卡最佳影片奖吗？', 'オッペンハイマーは2025年アカデミー作品賞を受賞するか？',
 '2025-03-10 23:59:59', 'active', 580000.00,
 'Official Academy Awards announcement', '아카데미 공식 발표', '奥斯卡官方公告', 'アカデミー公式発表'),

(5, 'Taylor Swift Eras Tour highest-grossing ever?', '테일러 스위프트 투어 역대 최고 수익?', '泰勒·斯威夫特巡演史上最高票房？', 'テイラー・スウィフトツアー史上最高収益？',
 'Will Eras Tour become highest-grossing concert tour in history?', '에라스 투어가 역대 최고 수익 콘서트 투어가 될까요?', '时代巡演将成为历史上票房最高的演唱会巡演吗？', 'エラスツアーは史上最高収益のコンサートツアーになるか？',
 '2025-12-31 23:59:59', 'active', 720000.00,
 'Billboard Boxscore final revenue report', 'Billboard Boxscore 최종 수익 보고서', 'Billboard Boxscore最终收入报告', 'Billboard Boxscore最終収益報告'),

(5, 'Netflix surpasses 300M subscribers in 2025?', '넷플릭스 2025년 3억 구독자 돌파?', 'Netflix 2025年突破3亿订户？', 'Netflix 2025年3億加入者突破？',
 'Will Netflix reach 300 million subscribers?', '넷플릭스가 3억 구독자를 달성할까요?', 'Netflix将达到3亿订户吗？', 'Netflixは3億加入者に達するか？',
 '2025-12-31 23:59:59', 'active', 420000.00,
 'Netflix quarterly earnings report', '넷플릭스 분기 실적 보고서', 'Netflix季度财报', 'Netflix四半期決算報告'),

(5, 'Marvel Avengers 5 releases in 2025?', '마블 어벤져스 5 2025년 개봉?', '漫威复仇者联盟5在2025年上映？', 'マーベル・アベンジャーズ5 2025年公開？',
 'Will Marvel Studios release Avengers 5 in 2025?', '마블 스튜디오가 2025년에 어벤져스 5를 개봉할까요?', '漫威影业将在2025年上映复仇者联盟5吗？', 'マーベル・スタジオは2025年にアベンジャーズ5を公開するか？',
 '2025-12-31 23:59:59', 'active', 680000.00,
 'Official Marvel Studios release date', '마블 스튜디오 공식 개봉일', '漫威影业官方上映日期', 'マーベル・スタジオ公式公開日'),

(5, 'BTS member military service completed 2025?', 'BTS 멤버 전역 완료 2025?', 'BTS成员2025年完成兵役？', 'BTSメンバー2025年兵役完了？',
 'Will all BTS members complete military service by 2025?', '모든 BTS 멤버가 2025년까지 군복무를 마칠까요?', '所有BTS成员将在2025年前完成兵役吗？', '全BTSメンバーは2025年までに兵役を完了するか？',
 '2025-12-31 23:59:59', 'active', 520000.00,
 'Official military discharge dates', '공식 전역 날짜', '官方退伍日期', '公式除隊日'),

-- K-Pop & Asian Entertainment
(5, 'BLACKPINK renews contract with YG?', '블랙핑크 YG 재계약?', 'BLACKPINK与YG续约？', 'BLACKPINK YG再契約？',
 'Will BLACKPINK members renew contracts with YG Entertainment?', '블랙핑크 멤버들이 YG 엔터테인먼트와 재계약할까요?', 'BLACKPINK成员将与YG娱乐续约吗？', 'BLACKPINKメンバーはYGエンタテインメントと再契約するか？',
 '2025-08-31 23:59:59', 'active', 480000.00,
 'Official YG Entertainment announcement', 'YG 엔터테인먼트 공식 발표', 'YG娱乐官方公告', 'YGエンタテインメント公式発表'),

(5, 'NewJeans wins Billboard Music Award 2025?', '뉴진스 빌보드 뮤직 어워드 수상?', 'NewJeans获2025年Billboard音乐奖？', 'NewJeans 2025年Billboard音楽賞受賞？',
 'Will NewJeans win at Billboard Music Awards?', '뉴진스가 빌보드 뮤직 어워드를 수상할까요?', 'NewJeans将在Billboard音乐奖获奖吗？', 'NewJeansはBillboard音楽賞を受賞するか？',
 '2025-05-15 23:59:59', 'active', 360000.00,
 'Official Billboard Music Awards results', '빌보드 뮤직 어워드 공식 결과', 'Billboard音乐奖官方结果', 'Billboard音楽賞公式結果'),

(5, 'Studio Ghibli new film in 2025?', '스튜디오 지브리 신작 2025년 개봉?', '吉卜力工作室2025年新片？', 'スタジオジブリ新作2025年公開？',
 'Will Studio Ghibli release a new animated film?', '스튜디오 지브리가 새로운 애니메이션 영화를 개봉할까요?', '吉卜力工作室将发布新动画电影吗？', 'スタジオジブリは新しいアニメ映画を公開するか？',
 '2025-12-31 23:59:59', 'active', 420000.00,
 'Official Studio Ghibli announcement', '스튜디오 지브리 공식 발표', '吉卜力工作室官方公告', 'スタジオジブリ公式発表'),

-- Gaming & Esports
(5, 'GTA 6 releases in 2025?', 'GTA 6 2025년 출시?', 'GTA 6 2025年发布？', 'GTA 6 2025年発売？',
 'Will Grand Theft Auto VI be released in 2025?', '그랜드 테프트 오토 6가 2025년에 출시될까요?', '侠盗猎车手6将在2025年发布吗？', 'グランド・セフト・オート6は2025年に発売されるか？',
 '2025-12-31 23:59:59', 'active', 890000.00,
 'Official Rockstar Games release', 'Rockstar Games 공식 출시', 'Rockstar Games官方发布', 'Rockstar Games公式発売'),

(5, 'League of Legends Worlds 2025 in Korea?', 'LoL 월드 챔피언십 2025 한국 개최?', '英雄联盟2025年世界赛在韩国？', 'LoLワールドチャンピオンシップ2025年韓国開催？',
 'Will LoL World Championship be held in Korea?', 'LoL 월드 챔피언십이 한국에서 개최될까요?', '英雄联盟世界锦标赛将在韩国举行吗？', 'LoLワールドチャンピオンシップは韓国で開催されるか？',
 '2025-11-30 23:59:59', 'active', 520000.00,
 'Riot Games official venue announcement', 'Riot Games 공식 장소 발표', 'Riot Games官方场地公告', 'Riot Games公式会場発表'),

(5, 'Nintendo Switch 2 launches in 2025?', '닌텐도 스위치 2 2025년 출시?', '任天堂Switch 2 2025年发布？', 'ニンテンドースイッチ2 2025年発売？',
 'Will Nintendo release Switch successor in 2025?', '닌텐도가 2025년에 스위치 후속작을 출시할까요?', '任天堂将在2025年发布Switch继任者吗？', '任天堂は2025年にSwitch後継機を発売するか？',
 '2025-12-31 23:59:59', 'active', 780000.00,
 'Official Nintendo product launch', '닌텐도 공식 제품 출시', '任天堂官方产品发布', '任天堂公式製品発売'),

-- Streaming & Social Media
(5, 'TikTok US ban implemented in 2025?', '틱톡 미국 금지 2025년 시행?', 'TikTok美国禁令2025年实施？', 'TikTok米国禁止2025年実施？',
 'Will TikTok be banned in United States?', '틱톡이 미국에서 금지될까요?', 'TikTok将在美国被禁止吗？', 'TikTokは米国で禁止されるか？',
 '2025-12-31 23:59:59', 'active', 920000.00,
 'Federal legislation implementation', '연방 법률 시행', '联邦立法实施', '連邦法実施'),

(5, 'YouTube Shorts overtakes TikTok users?', '유튜브 쇼츠 틱톡 사용자 초과?', 'YouTube Shorts用户超TikTok？', 'YouTube ShortsTikTokユーザー超過？',
 'Will YouTube Shorts surpass TikTok in daily users?', '유튜브 쇼츠가 일일 사용자에서 틱톡을 넘어설까요?', 'YouTube Shorts日活跃用户将超过TikTok吗？', 'YouTube ShortsはデイリーユーザーでTikTokを超えるか？',
 '2025-12-31 23:59:59', 'active', 580000.00,
 'Third-party analytics report', '제3자 분석 보고서', '第三方分析报告', 'サードパーティ分析レポート'),

-- Chinese Entertainment
(5, 'Chinese box office recovers to 2019 levels?', '중국 박스오피스 2019년 수준 회복?', '中国票房恢复至2019年水平？', '中国興行収入2019年レベル回復？',
 'Will China box office return to pre-pandemic levels?', '중국 박스오피스가 팬데믹 이전 수준으로 회복될까요?', '中国票房将恢复到疫情前水平吗？', '中国興行収入はパンデミック前のレベルに回復するか？',
 '2025-12-31 23:59:59', 'active', 420000.00,
 'China Film Administration data', '중국 영화국 데이터', '中国电影局数据', '中国映画局データ'),

(5, 'Weibo launches global English version?', '웨이보 글로벌 영문 버전 출시?', '微博推出全球英文版？', 'Weibo世界英語版ローンチ？',
 'Will Weibo release international English platform?', '웨이보가 국제 영문 플랫폼을 출시할까요?', '微博将发布国际英文平台吗？', 'Weiboは国際英語プラットフォームをリリースするか？',
 '2025-12-31 23:59:59', 'active', 280000.00,
 'Official Weibo announcement', '웨이보 공식 발표', '微博官方公告', 'Weibo公式発表'),

-- Japanese Entertainment
(5, 'Anime industry revenue exceeds $30B?', '애니메이션 산업 수익 300억 달러 초과?', '动漫产业收入超$300亿？', 'アニメ産業収益$300億超過？',
 'Will global anime industry revenue exceed $30 billion?', '글로벌 애니메이션 산업 수익이 300억 달러를 초과할까요?', '全球动漫产业收入将超过300亿美元吗？', '世界アニメ産業収益は300億ドルを超えるか？',
 '2025-12-31 23:59:59', 'active', 380000.00,
 'Association of Japanese Animations report', '일본 애니메이션 협회 보고서', '日本动画协会报告', '日本アニメーション協会レポート'),

(5, 'One Piece live action Season 2 confirmed?', '원피스 실사 시즌 2 확정?', '海贼王真人版第2季确定？', 'ワンピース実写シーズン2確定？',
 'Will Netflix confirm One Piece Season 2?', '넷플릭스가 원피스 시즌 2를 확정할까요?', 'Netflix将确定海贼王第2季吗？', 'Netflixはワンピースシーズン2を確定するか？',
 '2025-06-30 23:59:59', 'active', 520000.00,
 'Official Netflix announcement', '넷플릭스 공식 발표', 'Netflix官方公告', 'Netflix公式発表'),

-- Music Industry
(5, 'Spotify reaches 1 billion users?', '스포티파이 10억 사용자 달성?', 'Spotify达10亿用户？', 'Spotify 10億ユーザー達成？',
 'Will Spotify subscriber count reach 1 billion?', '스포티파이 구독자가 10억 명에 달할까요?', 'Spotify订户数将达到10亿吗？', 'Spotify加入者数は10億に達するか？',
 '2025-12-31 23:59:59', 'active', 480000.00,
 'Spotify quarterly earnings report', '스포티파이 분기 실적 보고서', 'Spotify季度财报', 'Spotify四半期決算報告'),

(5, 'Grammy 2025: Beyoncé most awarded artist?', '그래미 2025: 비욘세 최다 수상?', '格莱美2025：碧昂丝获奖最多？', 'グラミー2025：ビヨンセ最多受賞？',
 'Will Beyoncé become most awarded Grammy artist?', '비욘세가 그래미 최다 수상 아티스트가 될까요?', '碧昂丝将成为格莱美获奖最多艺人吗？', 'ビヨンセはグラミー最多受賞アーティストになるか？',
 '2025-02-10 23:59:59', 'active', 420000.00,
 'Official Grammy Awards ceremony', '그래미 어워드 공식 시상식', '格莱美奖官方颁奖典礼', 'グラミー賞公式授賞式'),

-- Additional Entertainment Events (19-30)
(5, 'Disney+ surpasses 200M subscribers?', '디즈니+ 2억 구독자 돌파?', 'Disney+突破2亿订户？', 'Disney+ 2億加入者突破？',
 'Will Disney Plus reach 200 million subscribers?', '디즈니 플러스가 2억 구독자를 달성할까요?', 'Disney Plus将达到2亿订户吗？', 'Disney Plusは2億加入者に達するか？',
 '2025-12-31 23:59:59', 'active', 380000.00,
 'Disney quarterly earnings report', '디즈니 분기 실적 보고서', '迪士尼季度财报', 'ディズニー四半期決算報告'),

(5, 'Korean drama wins Emmy Award 2025?', '한국 드라마 에미상 수상 2025?', '韩剧获2025年艾美奖？', '韓国ドラマエミー賞受賞2025？',
 'Will a Korean drama win Emmy in 2025?', '한국 드라마가 2025년 에미상을 수상할까요?', '韩剧将在2025年获得艾美奖吗？', '韓国ドラマは2025年にエミー賞を受賞するか？',
 '2025-09-20 23:59:59', 'active', 320000.00,
 'Emmy Awards official results', '에미상 공식 결과', '艾美奖官方结果', 'エミー賞公式結果'),

(5, 'Barbie movie sequel announced?', '바비 영화 속편 발표?', '芭比电影续集公布？', 'バービー映画続編発表？',
 'Will Warner Bros announce Barbie 2?', '워너브라더스가 바비 2를 발표할까요?', '华纳兄弟将宣布芭比2吗？', 'ワーナーブラザーズはバービー2を発表するか？',
 '2025-12-31 23:59:59', 'active', 480000.00,
 'Official Warner Bros announcement', '워너브라더스 공식 발표', '华纳兄弟官方公告', 'ワーナーブラザーズ公式発表'),

(5, 'Squid Game Season 3 confirmed?', '오징어 게임 시즌 3 확정?', '鱿鱼游戏第3季确定？', 'イカゲームシーズン3確定？',
 'Will Netflix confirm Squid Game Season 3?', '넷플릭스가 오징어 게임 시즌 3를 확정할까요?', 'Netflix将确定鱿鱼游戏第3季吗？', 'Netflixはイカゲームシーズン3を確定するか？',
 '2025-06-30 23:59:59', 'active', 680000.00,
 'Official Netflix announcement', '넷플릭스 공식 발표', 'Netflix官方公告', 'Netflix公式発表'),

(5, 'Fortnite player count exceeds 500M?', '포트나이트 플레이어 5억 돌파?', 'Fortnite玩家数超5亿？', 'フォートナイトプレイヤー5億突破？',
 'Will Fortnite registered players exceed 500 million?', '포트나이트 등록 플레이어가 5억을 넘을까요?', 'Fortnite注册玩家将超过5亿吗？', 'フォートナイト登録プレイヤーは5億を超えるか？',
 '2025-12-31 23:59:59', 'active', 420000.00,
 'Epic Games official statistics', 'Epic Games 공식 통계', 'Epic Games官方统计', 'Epic Games公式統計'),

(5, 'Avatar 3 becomes top 5 highest-grossing?', '아바타 3 역대 박스오피스 톱5?', '阿凡达3成史上票房前5？', 'アバター3歴代興行収入トップ5？',
 'Will Avatar 3 reach top 5 all-time box office?', '아바타 3가 역대 박스오피스 톱5에 들까요?', '阿凡达3将进入史上票房前5吗？', 'アバター3は歴代興行収入トップ5に入るか？',
 '2026-01-31 23:59:59', 'active', 580000.00,
 'Box Office Mojo final tallies', 'Box Office Mojo 최종 집계', 'Box Office Mojo最终统计', 'Box Office Mojo最終集計'),

(5, 'Roblox goes public market cap $50B+?', '로블록스 시가총액 500억 달러 초과?', 'Roblox市值超$500亿？', 'Roblox時価総額$500億超過？',
 'Will Roblox market cap exceed $50 billion?', '로블록스 시가총액이 500억 달러를 넘을까요?', 'Roblox市值将超过500亿美元吗？', 'Roblox時価総額は500億ドルを超えるか？',
 '2025-12-31 23:59:59', 'active', 380000.00,
 'Stock market closing price', '주식 시장 종가', '股市收盘价', '株式市場終値'),

(5, 'Chinese idol group debuts in US market?', '중국 아이돌 그룹 미국 데뷔?', '中国偶像组合在美国出道？', '中国アイドルグループ米国デビュー？',
 'Will major Chinese idol group debut in USA?', '주요 중국 아이돌 그룹이 미국에서 데뷔할까요?', '主要中国偶像组合将在美国出道吗？', '主要中国アイドルグループは米国でデビューするか？',
 '2025-12-31 23:59:59', 'active', 280000.00,
 'Official US label announcement', '미국 레이블 공식 발표', '美国唱片公司官方公告', '米国レーベル公式発表'),

(5, 'Twitch streaming hours exceed 50B?', '트위치 스트리밍 시간 500억 시간 초과?', 'Twitch直播时长超500亿小时？', 'Twitch配信時間500億時間超過？',
 'Will Twitch annual streaming hours reach 50 billion?', '트위치 연간 스트리밍 시간이 500억 시간에 도달할까요?', 'Twitch年度直播时长将达到500亿小时吗？', 'Twitch年間配信時間は500億時間に達するか？',
 '2025-12-31 23:59:59', 'active', 320000.00,
 'StreamElements analytics report', 'StreamElements 분석 보고서', 'StreamElements分析报告', 'StreamElements分析レポート'),

(5, 'Spider-Man: Beyond Spider-Verse in 2025?', '스파이더맨: 비욘드 스파이더버스 2025?', '蜘蛛侠：超越蜘蛛宇宙2025？', 'スパイダーマン：ビヨンド・スパイダーバース2025？',
 'Will Spider-Verse sequel release in 2025?', '스파이더버스 속편이 2025년에 개봉될까요?', '蜘蛛宇宙续集将在2025年上映吗？', 'スパイダーバース続編は2025年に公開されるか？',
 '2025-12-31 23:59:59', 'active', 520000.00,
 'Sony Pictures official release date', '소니 픽처스 공식 개봉일', '索尼影业官方上映日期', 'ソニー・ピクチャーズ公式公開日'),

(5, 'Japanese city pop revival hits #1 Billboard?', '일본 시티팝 부활 빌보드 1위?', '日本城市流行音乐复兴登Billboard第1？', '日本シティポップ復活Billboard1位？',
 'Will Japanese city pop song top Billboard Hot 100?', '일본 시티팝 곡이 빌보드 핫 100 1위를 차지할까요?', '日本城市流行音乐歌曲将登顶Billboard Hot 100吗？', '日本シティポップ曲はBillboard Hot 100で1位になるか？',
 '2025-12-31 23:59:59', 'active', 280000.00,
 'Official Billboard Hot 100 chart', '빌보드 핫 100 공식 차트', 'Billboard Hot 100官方榜单', 'Billboard Hot 100公式チャート');

-- Add outcomes for first 5 entertainment events
INSERT INTO outcomes (event_id, name_en, name_ko, name_zh, name_ja, probability, total_bets) VALUES
-- Oscars 2025
(51, 'Yes', '예', '是', 'はい', 0.68, 394400.00),
(51, 'No', '아니오', '否', 'いいえ', 0.32, 185600.00),

-- Taylor Swift Tour
(52, 'Yes', '예', '是', 'はい', 0.82, 590400.00),
(52, 'No', '아니오', '否', 'いいえ', 0.18, 129600.00),

-- Netflix subscribers
(53, 'Yes', '예', '是', 'はい', 0.45, 189000.00),
(53, 'No', '아니오', '否', 'いいえ', 0.55, 231000.00),

-- Marvel Avengers 5
(54, 'Yes', '예', '是', 'はい', 0.38, 258400.00),
(54, 'No', '아니오', '否', 'いいえ', 0.62, 421600.00),

-- BTS military service
(55, 'Yes', '예', '是', 'はい', 0.92, 478400.00),
(55, 'No', '아니오', '否', 'いいえ', 0.08, 41600.00);


-- ========================================
-- ECONOMY (30 events)
-- ========================================
INSERT INTO events (
  category_id,
  title_en, title_ko, title_zh, title_ja,
  description_en, description_ko, description_zh, description_ja,
  end_date, status, total_volume,
  resolution_criteria_en, resolution_criteria_ko, resolution_criteria_zh, resolution_criteria_ja
) VALUES
-- US Economy
(6, 'US Federal Reserve cuts rates 3+ times 2025?', '미국 연준 2025년 3회 이상 금리 인하?', '美联储2025年降息3次以上？', '米FRB 2025年3回以上利下げ？',
 'Will Fed cut interest rates 3 or more times?', '연준이 금리를 3회 이상 인하할까요?', '美联储将降息3次或更多吗？', 'FRBは金利を3回以上引き下げるか？',
 '2025-12-31 23:59:59', 'active', 1200000.00,
 'Federal Reserve policy decisions', '연준 정책 결정', '美联储政策决定', 'FRB政策決定'),

(6, 'US enters recession in 2025?', '미국 2025년 경기 침체 진입?', '美国2025年陷入衰退？', '米国2025年不況入り？',
 'Will US economy enter official recession?', '미국 경제가 공식적인 경기 침체에 진입할까요?', '美国经济将进入正式衰退吗？', '米国経済は正式な不況に入るか？',
 '2025-12-31 23:59:59', 'active', 980000.00,
 'NBER recession declaration', 'NBER 경기 침체 선언', 'NBER衰退宣布', 'NBER不況宣言'),

(6, 'S&P 500 reaches 6000 by end 2025?', 'S&P 500 2025년 말 6000 달성?', 'S&P 500 2025年底达6000？', 'S&P 500 2025年末6000達成？',
 'Will S&P 500 index hit 6000 points?', 'S&P 500 지수가 6000 포인트를 돌파할까요?', 'S&P 500指数将达到6000点吗？', 'S&P 500指数は6000ポイントに達するか？',
 '2025-12-31 23:59:59', 'active', 850000.00,
 'Stock market closing price', '주식 시장 종가', '股市收盘价', '株式市場終値'),

(6, 'US unemployment rate above 5%?', '미국 실업률 5% 초과?', '美国失业率超5%？', '米国失業率5%超過？',
 'Will US unemployment rate exceed 5 percent?', '미국 실업률이 5%를 넘을까요?', '美国失业率将超过5%吗？', '米国失業率は5%を超えるか？',
 '2025-12-31 23:59:59', 'active', 680000.00,
 'Bureau of Labor Statistics data', '노동통계국 데이터', '劳工统计局数据', '労働統計局データ'),

-- China Economy
(6, 'China GDP growth below 4% in 2025?', '중국 GDP 성장률 2025년 4% 미만?', '中国GDP增长2025年低于4%？', '中国GDP成長率2025年4%未満？',
 'Will China GDP growth fall below 4 percent?', '중국 GDP 성장률이 4% 미만으로 떨어질까요?', '中国GDP增长将低于4%吗？', '中国GDP成長率は4%未満になるか？',
 '2025-12-31 23:59:59', 'active', 920000.00,
 'National Bureau of Statistics China', '중국 국가통계국', '中国国家统计局', '中国国家統計局'),

(6, 'Chinese yuan breaks 7.5 per USD?', '중국 위안화 달러당 7.5 돌파?', '人民币兑美元破7.5？', '人民元対ドル7.5突破？',
 'Will Chinese yuan depreciate beyond 7.5 per dollar?', '중국 위안화가 달러당 7.5를 넘어 절하될까요?', '人民币将贬值至每美元超过7.5吗？', '人民元はドル当たり7.5を超えて下落するか？',
 '2025-12-31 23:59:59', 'active', 580000.00,
 'PBOC official exchange rate', '중국 인민은행 공식 환율', '中国人民银行官方汇率', '中国人民銀行公式為替レート'),

(6, 'China property market stabilizes 2025?', '중국 부동산 시장 2025년 안정화?', '中国房地产市场2025年稳定？', '中国不動産市場2025年安定化？',
 'Will China real estate market show recovery signs?', '중국 부동산 시장이 회복 조짐을 보일까요?', '中国房地产市场将显示复苏迹象吗？', '中国不動産市場は回復の兆しを見せるか？',
 '2025-12-31 23:59:59', 'active', 720000.00,
 'National Housing Price Index', '국가 주택 가격 지수', '国家住房价格指数', '国家住宅価格指数'),

-- Japan Economy
(6, 'Bank of Japan raises rates above 1%?', '일본은행 금리 1% 초과 인상?', '日本央行加息超1%？', '日銀金利1%超引き上げ？',
 'Will BOJ raise interest rates above 1 percent?', '일본은행이 금리를 1% 이상으로 인상할까요?', '日本央行将加息至1%以上吗？', '日銀は金利を1%以上に引き上げるか？',
 '2025-12-31 23:59:59', 'active', 680000.00,
 'Bank of Japan policy decision', '일본은행 정책 결정', '日本央行政策决定', '日銀政策決定'),

(6, 'Japanese Yen strengthens below 130/USD?', '일본 엔화 달러당 130 이하 강세?', '日元兑美元升至130以下？', '円対ドル130以下に上昇？',
 'Will Japanese yen appreciate below 130 per dollar?', '일본 엔화가 달러당 130 이하로 강세를 보일까요?', '日元将升值至每美元低于130吗？', '円はドル当たり130以下に上昇するか？',
 '2025-12-31 23:59:59', 'active', 520000.00,
 'Foreign exchange market rate', '외환 시장 환율', '外汇市场汇率', '外国為替市場レート'),

(6, 'Nikkei 225 hits 40000 points?', '닛케이 225 40000 포인트 돌파?', '日经225指数达40000点？', '日経225 40000ポイント到達？',
 'Will Nikkei stock index reach 40000?', '닛케이 주가 지수가 40000에 도달할까요?', '日经股指将达到40000吗？', '日経株価指数は40000に達するか？',
 '2025-12-31 23:59:59', 'active', 620000.00,
 'Tokyo Stock Exchange closing', '도쿄 증권거래소 종가', '东京证券交易所收盘价', '東京証券取引所終値'),

-- Korea Economy
(6, 'South Korea GDP growth exceeds 3%?', '한국 GDP 성장률 3% 초과?', '韩国GDP增长超3%？', '韓国GDP成長率3%超過？',
 'Will Korean economy grow more than 3 percent?', '한국 경제가 3% 이상 성장할까요?', '韩国经济增长将超过3%吗？', '韓国経済は3%以上成長するか？',
 '2025-12-31 23:59:59', 'active', 480000.00,
 'Bank of Korea economic data', '한국은행 경제 데이터', '韩国央行经济数据', '韓国銀行経済データ'),

(6, 'Korean Won breaks 1200 per USD?', '한국 원화 달러당 1200 돌파?', '韩元兑美元破1200？', 'ウォン対ドル1200突破？',
 'Will Korean won depreciate beyond 1200 per dollar?', '한국 원화가 달러당 1200을 넘어 절하될까요?', '韩元将贬值至每美元超过1200吗？', 'ウォンはドル当たり1200を超えて下落するか？',
 '2025-12-31 23:59:59', 'active', 420000.00,
 'Foreign exchange market rate', '외환 시장 환율', '外汇市场汇率', '外国為替市場レート'),

(6, 'Samsung Electronics tops global chip sales?', '삼성전자 글로벌 반도체 매출 1위?', '三星电子全球芯片销售第一？', 'サムスン電子世界半導体売上1位？',
 'Will Samsung become #1 in global semiconductor sales?', '삼성전자가 글로벌 반도체 매출 1위를 차지할까요?', '三星电子将成为全球半导体销售第一吗？', 'サムスン電子は世界半導体売上1位になるか？',
 '2025-12-31 23:59:59', 'active', 620000.00,
 'Gartner semiconductor report', 'Gartner 반도체 보고서', 'Gartner半导体报告', 'Gartner半導体レポート'),

-- Global Trade
(6, 'Global trade volume declines in 2025?', '2025년 글로벌 무역량 감소?', '2025年全球贸易量下降？', '2025年世界貿易量減少？',
 'Will world merchandise trade volume decrease?', '세계 상품 무역량이 감소할까요?', '世界商品贸易量将下降吗？', '世界商品貿易量は減少するか？',
 '2025-12-31 23:59:59', 'active', 780000.00,
 'WTO trade statistics', 'WTO 무역 통계', 'WTO贸易统计', 'WTO貿易統計'),

(6, 'US-China trade deficit widens 20%+?', '미중 무역적자 20% 이상 확대?', '美中贸易逆差扩大20%+？', '米中貿易赤字20%以上拡大？',
 'Will US trade deficit with China increase 20%?', '미국의 대중 무역적자가 20% 증가할까요?', '美国对华贸易逆差将增加20%吗？', '米国の対中貿易赤字は20%増加するか？',
 '2025-12-31 23:59:59', 'active', 520000.00,
 'US Census Bureau trade data', '미국 인구조사국 무역 데이터', '美国人口普查局贸易数据', '米国国勢調査局貿易データ'),

-- Inflation & Commodities
(6, 'US inflation stays above 3% all year?', '미국 인플레이션 연중 3% 이상 유지?', '美国通胀全年保持3%以上？', '米国インフレ年間3%以上維持？',
 'Will US CPI remain above 3 percent throughout 2025?', '미국 CPI가 2025년 내내 3% 이상을 유지할까요?', '美国CPI将在2025年全年保持在3%以上吗？', '米国CPIは2025年を通じて3%以上を維持するか？',
 '2025-12-31 23:59:59', 'active', 680000.00,
 'Bureau of Labor Statistics CPI', '노동통계국 CPI', '劳工统计局CPI', '労働統計局CPI'),

(6, 'Gold price exceeds $2500 per ounce?', '금 가격 온스당 $2500 초과?', '黄金价格超每盎司$2500？', '金価格1オンス$2500超過？',
 'Will gold price surpass $2500 per troy ounce?', '금 가격이 트로이 온스당 $2500를 넘을까요?', '黄金价格将超过每金衡盎司$2500吗？', '金価格はトロイオンス当たり$2500を超えるか？',
 '2025-12-31 23:59:59', 'active', 820000.00,
 'COMEX gold futures price', 'COMEX 금 선물 가격', 'COMEX黄金期货价格', 'COMEX金先物価格'),

(6, 'Oil prices average above $100/barrel?', '유가 평균 배럴당 $100 이상?', '油价平均超每桶$100？', '原油価格平均1バレル$100以上？',
 'Will WTI crude average above $100 per barrel?', 'WTI 원유가 배럴당 $100 이상 평균을 기록할까요?', 'WTI原油平均价将超过每桶$100吗？', 'WTI原油は1バレル$100以上の平均になるか？',
 '2025-12-31 23:59:59', 'active', 920000.00,
 'WTI crude oil benchmark price', 'WTI 원유 벤치마크 가격', 'WTI原油基准价格', 'WTI原油ベンチマーク価格'),

-- Real Estate
(6, 'US housing prices decline 10%+ in 2025?', '미국 주택 가격 2025년 10% 이상 하락?', '美国房价2025年下跌10%+？', '米国住宅価格2025年10%以上下落？',
 'Will US median home prices fall 10% or more?', '미국 주택 중간 가격이 10% 이상 하락할까요?', '美国房价中位数将下跌10%或更多吗？', '米国住宅価格の中央値は10%以上下落するか？',
 '2025-12-31 23:59:59', 'active', 720000.00,
 'Case-Shiller Home Price Index', 'Case-Shiller 주택 가격 지수', 'Case-Shiller房价指数', 'Case-Shiller住宅価格指数'),

-- Additional Economy Events (19-30)
(6, 'Tesla market cap falls below $500B?', '테슬라 시가총액 5000억 달러 미만?', '特斯拉市值跌破$5000亿？', 'テスラ時価総額$5000億未満？',
 'Will Tesla market capitalization drop below $500B?', '테슬라 시가총액이 5000억 달러 미만으로 떨어질까요?', '特斯拉市值将跌破5000亿美元吗？', 'テスラ時価総額は5000億ドル未満になるか？',
 '2025-12-31 23:59:59', 'active', 580000.00,
 'Stock market valuation', '주식 시장 시가총액', '股市市值', '株式市場時価総額'),

(6, 'EU economy grows faster than US?', 'EU 경제 성장률 미국 초과?', '欧盟经济增长快于美国？', 'EU経済成長率米国超過？',
 'Will EU GDP growth exceed United States?', 'EU GDP 성장률이 미국을 초과할까요?', '欧盟GDP增长将超过美国吗？', 'EU GDP成長率は米国を超えるか？',
 '2025-12-31 23:59:59', 'active', 420000.00,
 'IMF World Economic Outlook', 'IMF 세계경제전망', 'IMF世界经济展望', 'IMF世界経済見通し'),

(6, 'Major US bank fails in 2025?', '미국 주요 은행 2025년 파산?', '美国大型银行2025年倒闭？', '米国大手銀行2025年破綻？',
 'Will a major US bank experience failure?', '미국 주요 은행이 파산할까요?', '美国大型银行将倒闭吗？', '米国大手銀行は破綻するか？',
 '2025-12-31 23:59:59', 'active', 680000.00,
 'FDIC bank failure reports', 'FDIC 은행 파산 보고서', 'FDIC银行倒闭报告', 'FDIC銀行破綻報告'),

(6, 'Global GDP growth below 2.5%?', '글로벌 GDP 성장률 2.5% 미만?', '全球GDP增长低于2.5%？', '世界GDP成長率2.5%未満？',
 'Will world GDP growth fall below 2.5 percent?', '세계 GDP 성장률이 2.5% 미만으로 떨어질까요?', '世界GDP增长将低于2.5%吗？', '世界GDP成長率は2.5%未満になるか？',
 '2025-12-31 23:59:59', 'active', 820000.00,
 'IMF global growth estimate', 'IMF 글로벌 성장 추정', 'IMF全球增长估计', 'IMF世界成長予測'),

(6, 'Bitcoin becomes legal tender in another country?', '비트코인 또 다른 국가 법정화폐 채택?', '比特币成为另一国法定货币？', 'ビットコイン別国の法定通貨採用？',
 'Will another nation adopt Bitcoin as legal tender?', '또 다른 국가가 비트코인을 법정화폐로 채택할까요?', '另一个国家将采用比特币作为法定货币吗？', '別の国がビットコインを法定通貨として採用するか？',
 '2025-12-31 23:59:59', 'active', 520000.00,
 'Official government legislation', '정부 공식 법률', '政府官方立法', '政府公式法律'),

(6, 'Apple becomes first $4 trillion company?', '애플 최초 4조 달러 기업?', '苹果成首家$4万亿公司？', 'Apple初の$4兆企業？',
 'Will Apple market cap reach $4 trillion first?', '애플 시가총액이 최초로 4조 달러에 도달할까요?', '苹果市值将首先达到4万亿美元吗？', 'Apple時価総額は最初に4兆ドルに達するか？',
 '2025-12-31 23:59:59', 'active', 720000.00,
 'Stock market capitalization', '주식 시장 시가총액', '股市市值', '株式市場時価総額'),

(6, 'US national debt exceeds $36 trillion?', '미국 국가 부채 36조 달러 초과?', '美国国债超$36万亿？', '米国国家債務$36兆超過？',
 'Will US national debt surpass $36 trillion?', '미국 국가 부채가 36조 달러를 넘을까요?', '美国国债将超过36万亿美元吗？', '米国国家債務は36兆ドルを超えるか？',
 '2025-12-31 23:59:59', 'active', 480000.00,
 'US Treasury debt data', '미국 재무부 부채 데이터', '美国财政部债务数据', '米国財務省債務データ'),

(6, 'BRICS launches common currency?', 'BRICS 공통 화폐 출시?', 'BRICS推出共同货币？', 'BRICS共通通貨ローンチ？',
 'Will BRICS nations introduce shared currency?', 'BRICS 국가들이 공통 화폐를 도입할까요?', 'BRICS国家将推出共同货币吗？', 'BRICS諸国は共通通貨を導入するか？',
 '2025-12-31 23:59:59', 'active', 620000.00,
 'Official BRICS summit announcement', 'BRICS 정상회의 공식 발표', 'BRICS峰会官方公告', 'BRICSサミット公式発表'),

(6, 'Inflation in Argentina drops below 50%?', '아르헨티나 인플레이션 50% 미만?', '阿根廷通胀降至50%以下？', 'アルゼンチンインフレ50%未満？',
 'Will Argentina annual inflation fall below 50%?', '아르헨티나 연간 인플레이션이 50% 미만으로 떨어질까요?', '阿根廷年通胀率将降至50%以下吗？', 'アルゼンチン年間インフレは50%未満になるか？',
 '2025-12-31 23:59:59', 'active', 380000.00,
 'INDEC inflation statistics', 'INDEC 인플레이션 통계', 'INDEC通胀统计', 'INDECインフレ統計'),

(6, 'Warren Buffett steps down as Berkshire CEO?', '워렌 버핏 버크셔 CEO 사임?', '沃伦·巴菲特卸任伯克希尔CEO？', 'ウォーレン・バフェットバークシャーCEO退任？',
 'Will Warren Buffett retire as Berkshire Hathaway CEO?', '워렌 버핏이 버크셔 해서웨이 CEO에서 물러날까요?', '沃伦·巴菲特将卸任伯克希尔·哈撒韦CEO吗？', 'ウォーレン・バフェットはバークシャー・ハサウェイCEOを退任するか？',
 '2025-12-31 23:59:59', 'active', 480000.00,
 'Official Berkshire announcement', '버크셔 공식 발표', '伯克希尔官方公告', 'バークシャー公式発表'),

(6, 'Semiconductor shortage resolved by 2025?', '반도체 부족 2025년까지 해소?', '芯片短缺2025年前解决？', '半導体不足2025年までに解消？',
 'Will global chip shortage be fully resolved?', '글로벌 칩 부족이 완전히 해소될까요?', '全球芯片短缺将完全解决吗？', '世界的なチップ不足は完全に解消されるか？',
 '2025-12-31 23:59:59', 'active', 580000.00,
 'Industry analyst consensus report', '업계 애널리스트 합의 보고서', '行业分析师共识报告', '業界アナリストコンセンサスレポート'),

(6, 'Electric vehicle sales exceed 20M globally?', '전기차 판매 전 세계 2000만 대 초과?', '电动车全球销量超2000万辆？', 'EV世界販売2000万台超過？',
 'Will global EV sales surpass 20 million units?', '글로벌 전기차 판매가 2000만 대를 넘을까요?', '全球电动车销量将超过2000万辆吗？', '世界EV販売は2000万台を超えるか？',
 '2025-12-31 23:59:59', 'active', 620000.00,
 'IEA Electric Vehicle Report', 'IEA 전기차 보고서', 'IEA电动车报告', 'IEA電気自動車レポート');

-- Add outcomes for first 5 economy events
INSERT INTO outcomes (event_id, name_en, name_ko, name_zh, name_ja, probability, total_bets) VALUES
-- US Fed rate cuts
(81, 'Yes', '예', '是', 'はい', 0.42, 504000.00),
(81, 'No', '아니오', '否', 'いいえ', 0.58, 696000.00),

-- US recession
(82, 'Yes', '예', '是', 'はい', 0.35, 343000.00),
(82, 'No', '아니오', '否', 'いいえ', 0.65, 637000.00),

-- S&P 500
(83, 'Yes', '예', '是', 'はい', 0.55, 467500.00),
(83, 'No', '아니오', '否', 'いいえ', 0.45, 382500.00),

-- US unemployment
(84, 'Yes', '예', '是', 'はい', 0.38, 258400.00),
(84, 'No', '아니오', '否', 'いいえ', 0.62, 421600.00),

-- China GDP
(85, 'Yes', '예', '是', 'はい', 0.48, 441600.00),
(85, 'No', '아니오', '否', 'いいえ', 0.52, 478400.00);


-- ========================================
-- SCIENCE (30 events) 
-- ========================================
INSERT INTO events (
  category_id,
  title_en, title_ko, title_zh, title_ja,
  description_en, description_ko, description_zh, description_ja,
  end_date, status, total_volume,
  resolution_criteria_en, resolution_criteria_ko, resolution_criteria_zh, resolution_criteria_ja
) VALUES
-- Space Exploration
(7, 'SpaceX Starship successful Mars mission 2025?', 'SpaceX 스타십 화성 성공 임무 2025?', 'SpaceX星舰火星任务成功2025？', 'SpaceXスターシップ火星成功ミッション2025？',
 'Will SpaceX successfully launch Starship to Mars?', 'SpaceX가 스타십을 화성에 성공적으로 발사할까요?', 'SpaceX将成功向火星发射星舰吗？', 'SpaceXはスターシップの火星打ち上げに成功するか？',
 '2025-12-31 23:59:59', 'active', 1200000.00,
 'NASA and SpaceX mission confirmation', 'NASA와 SpaceX 임무 확인', 'NASA和SpaceX任务确认', 'NASAとSpaceXミッション確認'),

(7, 'Artemis III Moon landing succeeds?', '아르테미스 3 달 착륙 성공?', 'Artemis III月球着陆成功？', 'アルテミスIII月面着陸成功？',
 'Will NASA Artemis III mission land on Moon?', 'NASA 아르테미스 3 임무가 달에 착륙할까요?', 'NASA Artemis III任务将登陆月球吗？', 'NASAアルテミスIIIミッションは月面着陸するか？',
 '2025-12-31 23:59:59', 'active', 980000.00,
 'Official NASA mission report', 'NASA 공식 임무 보고서', 'NASA官方任务报告', 'NASA公式ミッション報告'),

(7, 'China Tiangong space station expands?', '중국 텐궁 우주정거장 확장?', '中国天宫空间站扩建？', '中国天宮宇宙ステーション拡張？',
 'Will China add new modules to Tiangong station?', '중국이 텐궁 우주정거장에 새 모듈을 추가할까요?', '中国将为天宫空间站增加新舱段吗？', '中国は天宮宇宙ステーションに新モジュールを追加するか？',
 '2025-12-31 23:59:59', 'active', 680000.00,
 'CNSA official announcement', 'CNSA 공식 발표', 'CNSA官方公告', 'CNSA公式発表'),

(7, 'Japan SLIM lunar probe operational?', '일본 SLIM 달 탐사선 작동?', '日本SLIM月球探测器运行？', '日本SLIM月面探査機稼働？',
 'Will JAXA SLIM remain operational on Moon?', 'JAXA SLIM이 달에서 계속 작동할까요?', 'JAXA SLIM将在月球上继续运行吗？', 'JAXA SLIMは月面で稼働し続けるか？',
 '2025-12-31 23:59:59', 'active', 420000.00,
 'JAXA mission status updates', 'JAXA 임무 상태 업데이트', 'JAXA任务状态更新', 'JAXAミッション状態更新'),

-- Medical Breakthroughs
(7, 'FDA approves Alzheimer prevention drug?', 'FDA 알츠하이머 예방 약물 승인?', 'FDA批准阿尔茨海默预防药物？', 'FDAアルツハイマー予防薬承認？',
 'Will FDA approve new Alzheimer prevention medication?', 'FDA가 새로운 알츠하이머 예방 약물을 승인할까요?', 'FDA将批准新的阿尔茨海默预防药物吗？', 'FDAは新しいアルツハイマー予防薬を承認するか？',
 '2025-12-31 23:59:59', 'active', 820000.00,
 'FDA approval announcement', 'FDA 승인 발표', 'FDA批准公告', 'FDA承認発表'),

(7, 'mRNA cancer vaccine clinical success?', 'mRNA 암 백신 임상 성공?', 'mRNA癌症疫苗临床成功？', 'mRNAがんワクチン臨床成功？',
 'Will mRNA cancer vaccine show clinical efficacy?', 'mRNA 암 백신이 임상 효능을 보일까요?', 'mRNA癌症疫苗将显示临床疗效吗？', 'mRNAがんワクチンは臨床効果を示すか？',
 '2025-12-31 23:59:59', 'active', 920000.00,
 'Peer-reviewed clinical trial results', '동료 검토 임상시험 결과', '同行评审临床试验结果', 'ピアレビュー臨床試験結果'),

(7, 'CRISPR therapy cures genetic disease?', 'CRISPR 치료 유전 질환 치료?', 'CRISPR疗法治愈遗传病？', 'CRISPR治療遺伝病治癒？',
 'Will CRISPR gene therapy cure genetic disorder?', 'CRISPR 유전자 치료가 유전 질환을 치료할까요?', 'CRISPR基因疗法将治愈遗传病吗？', 'CRISPR遺伝子治療は遺伝病を治癒するか？',
 '2025-12-31 23:59:59', 'active', 780000.00,
 'Medical journal publication', '의학 저널 발표', '医学期刊发表', '医学ジャーナル発表'),

(7, 'Anti-aging drug extends lifespan in trials?', '노화 방지 약물 임상에서 수명 연장?', '抗衰老药物试验延长寿命？', '抗老化薬試験で寿命延長？',
 'Will longevity drug show lifespan extension?', '장수 약물이 수명 연장을 보일까요?', '长寿药物将显示寿命延长吗？', '長寿薬は寿命延長を示すか？',
 '2025-12-31 23:59:59', 'active', 680000.00,
 'Clinical trial publication', '임상시험 발표', '临床试验发表', '臨床試験発表'),

-- AI & Computing
(7, 'GPT-5 released by OpenAI in 2025?', 'OpenAI GPT-5 2025년 출시?', 'OpenAI 2025年发布GPT-5？', 'OpenAI 2025年GPT-5リリース？',
 'Will OpenAI launch GPT-5 language model?', 'OpenAI가 GPT-5 언어 모델을 출시할까요?', 'OpenAI将推出GPT-5语言模型吗？', 'OpenAIはGPT-5言語モデルをローンチするか？',
 '2025-12-31 23:59:59', 'active', 1100000.00,
 'Official OpenAI product release', 'OpenAI 공식 제품 출시', 'OpenAI官方产品发布', 'OpenAI公式製品リリース'),

(7, 'Google quantum computer breaks RSA encryption?', '구글 양자컴퓨터 RSA 암호 해독?', '谷歌量子计算机破解RSA加密？', 'Google量子コンピュータRSA暗号解読？',
 'Will Google achieve RSA encryption breakthrough?', '구글이 RSA 암호화 돌파구를 달성할까요?', '谷歌将实现RSA加密突破吗？', 'GoogleはRSA暗号化のブレークスルーを達成するか？',
 '2025-12-31 23:59:59', 'active', 880000.00,
 'Peer-reviewed scientific paper', '동료 검토 과학 논문', '同行评审科学论文', 'ピアレビュー科学論文'),

(7, 'China leads in quantum communication network?', '중국 양자통신 네트워크 선도?', '中国领先量子通信网络？', '中国量子通信ネットワーク主導？',
 'Will China deploy largest quantum network?', '중국이 최대 양자 네트워크를 구축할까요?', '中国将部署最大量子网络吗？', '中国は最大の量子ネットワークを展開するか？',
 '2025-12-31 23:59:59', 'active', 620000.00,
 'Government and academic reports', '정부 및 학술 보고서', '政府和学术报告', '政府および学術報告'),

(7, 'AI passes medical licensing exam?', 'AI 의사 면허 시험 통과?', 'AI通过医师执照考试？', 'AI医師免許試験合格？',
 'Will AI system pass human medical board exam?', 'AI 시스템이 인간 의료 면허 시험을 통과할까요?', 'AI系统将通过人类医学委员会考试吗？', 'AIシステムは人間の医学委員会試験に合格するか？',
 '2025-12-31 23:59:59', 'active', 720000.00,
 'Official exam results publication', '공식 시험 결과 발표', '官方考试结果公布', '公式試験結果発表'),

-- Energy & Physics
(7, 'Nuclear fusion net energy gain repeated?', '핵융합 순에너지 증가 재현?', '核聚变净能量增益重复？', '核融合正味エネルギー増加再現？',
 'Will fusion achieve net energy gain again?', '핵융합이 순에너지 증가를 다시 달성할까요?', '核聚变将再次实现净能量增益吗？', '核融合は正味エネルギー増加を再び達成するか？',
 '2025-12-31 23:59:59', 'active', 980000.00,
 'National Ignition Facility report', 'NIF 보고서', 'NIF报告', 'NIFレポート'),

(7, 'ITER fusion reactor becomes operational?', 'ITER 핵융합로 가동?', 'ITER聚变反应堆启动？', 'ITER核融合炉稼働？',
 'Will ITER tokamak begin operations?', 'ITER 토카막이 운영을 시작할까요?', 'ITER托卡马克将开始运行吗？', 'ITERトカマクは運転を開始するか？',
 '2025-12-31 23:59:59', 'active', 820000.00,
 'ITER Organization announcement', 'ITER 기구 발표', 'ITER组织公告', 'ITER機構発表'),

(7, 'Room temperature superconductor verified?', '상온 초전도체 검증?', '室温超导体验证？', '室温超伝導体検証？',
 'Will room temperature superconductor be confirmed?', '상온 초전도체가 확인될까요?', '室温超导体将被确认吗？', '室温超伝導体は確認されるか？',
 '2025-12-31 23:59:59', 'active', 1200000.00,
 'Independent lab verification', '독립 실험실 검증', '独立实验室验证', '独立研究室検証'),

-- Pandemic & Public Health
(7, 'WHO declares Disease X outbreak?', 'WHO 질병 X 발생 선언?', 'WHO宣布X疾病暴发？', 'WHO疾病X発生宣言？',
 'Will WHO declare new pandemic threat?', 'WHO가 새로운 팬데믹 위협을 선언할까요?', 'WHO将宣布新的大流行威胁吗？', 'WHOは新しいパンデミック脅威を宣言するか？',
 '2025-12-31 23:59:59', 'active', 720000.00,
 'WHO official declaration', 'WHO 공식 선언', 'WHO官方声明', 'WHO公式宣言'),

(7, 'Universal flu vaccine developed?', '범용 독감 백신 개발?', '通用流感疫苗研发？', '万能インフルエンザワクチン開発？',
 'Will universal influenza vaccine be created?', '범용 인플루엔자 백신이 개발될까요?', '将开发通用流感疫苗吗？', '万能インフルエンザワクチンは開発されるか？',
 '2025-12-31 23:59:59', 'active', 680000.00,
 'FDA or EMA approval', 'FDA 또는 EMA 승인', 'FDA或EMA批准', 'FDAまたはEMA承認'),

(7, 'Malaria eradicated in one country?', '한 국가에서 말라리아 박멸?', '一国根除疟疾？', '一国でマラリア根絶？',
 'Will a nation achieve malaria eradication?', '한 국가가 말라리아 박멸을 달성할까요?', '一个国家将实现疟疾根除吗？', '一国はマラリア根絶を達成するか？',
 '2025-12-31 23:59:59', 'active', 520000.00,
 'WHO malaria-free certification', 'WHO 말라리아 없는 국가 인증', 'WHO无疟疾认证', 'WHOマラリアフリー認証'),

-- Additional Science Events (19-30)
(7, 'Brain-computer interface enables speech?', '뇌-컴퓨터 인터페이스 음성 가능?', '脑机接口实现语音？', '脳コンピュータインターフェース音声可能？',
 'Will BCI allow paralyzed patients to speak?', 'BCI가 마비 환자의 발화를 가능하게 할까요?', '脑机接口将使瘫痪患者说话吗？', 'BCIは麻痺患者の発話を可能にするか？',
 '2025-12-31 23:59:59', 'active', 620000.00,
 'Clinical trial results', '임상시험 결과', '临床试验结果', '臨床試験結果'),

(7, 'Lab-grown meat approved for sale in US?', '미국 배양육 판매 승인?', '美国批准培养肉销售？', '米国培養肉販売承認？',
 'Will USDA approve cultured meat products?', 'USDA가 배양육 제품을 승인할까요?', 'USDA将批准培养肉产品吗？', 'USDAは培養肉製品を承認するか？',
 '2025-12-31 23:59:59', 'active', 480000.00,
 'USDA regulatory approval', 'USDA 규제 승인', 'USDA监管批准', 'USDA規制承認'),

(7, '3D printed organs transplanted successfully?', '3D 프린팅 장기 이식 성공?', '3D打印器官移植成功？', '3Dプリント臓器移植成功？',
 'Will 3D bioprinted organ be transplanted?', '3D 바이오프린팅 장기가 이식될까요?', '3D生物打印器官将被移植吗？', '3Dバイオプリント臓器は移植されるか？',
 '2025-12-31 23:59:59', 'active', 720000.00,
 'Medical journal case report', '의학 저널 사례 보고', '医学期刊病例报告', '医学ジャーナル症例報告'),

(7, 'Quantum internet prototype demonstrated?', '양자 인터넷 프로토타입 시연?', '量子互联网原型演示？', '量子インターネットプロトタイプ実証？',
 'Will functional quantum internet be demonstrated?', '기능적 양자 인터넷이 시연될까요?', '将演示功能性量子互联网吗？', '機能的な量子インターネットは実証されるか？',
 '2025-12-31 23:59:59', 'active', 580000.00,
 'Scientific publication or demo', '과학 출판물 또는 데모', '科学出版物或演示', '科学出版物またはデモ'),

(7, 'Mars sample return mission launched?', '화성 샘플 회수 임무 발사?', '火星样本返回任务发射？', '火星サンプルリターンミッション発射？',
 'Will Mars sample return mission launch?', '화성 샘플 회수 임무가 발사될까요?', '火星样本返回任务将发射吗？', '火星サンプルリターンミッションは発射されるか？',
 '2025-12-31 23:59:59', 'active', 820000.00,
 'NASA/ESA mission launch', 'NASA/ESA 임무 발사', 'NASA/ESA任务发射', 'NASA/ESAミッション発射'),

(7, 'Neuralink human trial shows success?', '뉴럴링크 인간 임상 성공?', 'Neuralink人体试验成功？', 'Neuralink人体試験成功？',
 'Will Neuralink demonstrate successful human trial?', '뉴럴링크가 성공적인 인간 임상을 보일까요?', 'Neuralink将展示成功的人体试验吗？', 'Neuralink成功した人体試験を示すか？',
 '2025-12-31 23:59:59', 'active', 920000.00,
 'Company announcement and FDA report', '회사 발표 및 FDA 보고서', '公司公告和FDA报告', '会社発表およびFDA報告'),

(7, 'Quantum radar deployed in military?', '양자 레이더 군사 배치?', '量子雷达军事部署？', '量子レーダー軍事配備？',
 'Will quantum radar be operationally deployed?', '양자 레이더가 운영 배치될까요?', '量子雷达将投入运行吗？', '量子レーダーは運用配備されるか？',
 '2025-12-31 23:59:59', 'active', 520000.00,
 'Defense ministry announcement', '국방부 발표', '国防部公告', '国防省発表'),

(7, 'Hydrogen fuel cell cars exceed 1M sales?', '수소 연료전지차 판매 100만 대 초과?', '氢燃料电池车销量超100万？', '水素燃料電池車販売100万台超過？',
 'Will hydrogen vehicles reach 1 million sales?', '수소 차량이 100만 대 판매를 달성할까요?', '氢能源汽车将达到100万辆销量吗？', '水素自動車は100万台販売を達成するか？',
 '2025-12-31 23:59:59', 'active', 480000.00,
 'Industry sales data', '업계 판매 데이터', '行业销售数据', '業界販売データ'),

(7, 'Artificial photosynthesis efficiency breakthrough?', '인공 광합성 효율 돌파구?', '人工光合作用效率突破？', '人工光合成効率ブレークスルー？',
 'Will artificial photosynthesis exceed 10% efficiency?', '인공 광합성이 10% 효율을 넘을까요?', '人工光合作用将超过10%效率吗？', '人工光合成は10%効率を超えるか？',
 '2025-12-31 23:59:59', 'active', 580000.00,
 'Peer-reviewed research paper', '동료 검토 연구 논문', '同行评审研究论文', 'ピアレビュー研究論文'),

(7, 'DNA data storage commercially available?', 'DNA 데이터 저장 상업화?', 'DNA数据存储商业化？', 'DNAデータストレージ商業化？',
 'Will DNA storage be offered commercially?', 'DNA 저장이 상업적으로 제공될까요?', 'DNA存储将商业化吗？', 'DNAストレージは商業化されるか？',
 '2025-12-31 23:59:59', 'active', 420000.00,
 'Commercial product launch', '상업 제품 출시', '商业产品发布', '商業製品ローンチ'),

(7, 'Quantum sensing detects gravitational waves?', '양자 센싱 중력파 탐지?', '量子传感探测引力波？', '量子センシング重力波検出？',
 'Will quantum sensors improve gravitational wave detection?', '양자 센서가 중력파 탐지를 개선할까요?', '量子传感器将改善引力波探测吗？', '量子センサーは重力波検出を改善するか？',
 '2025-12-31 23:59:59', 'active', 520000.00,
 'Scientific journal publication', '과학 저널 발표', '科学期刊发表', '科学ジャーナル発表'),

(7, 'Gene therapy cures sickle cell disease?', '유전자 치료 겸상적혈구병 치료?', '基因疗法治愈镰状细胞病？', '遺伝子治療鎌状赤血球症治癒？',
 'Will gene therapy provide sickle cell cure?', '유전자 치료가 겸상적혈구병 치료를 제공할까요?', '基因疗法将治愈镰状细胞病吗？', '遺伝子治療は鎌状赤血球症治療を提供するか？',
 '2025-12-31 23:59:59', 'active', 680000.00,
 'FDA approval for gene therapy', 'FDA 유전자 치료 승인', 'FDA基因疗法批准', 'FDA遺伝子治療承認'),

(7, 'Solid-state battery in mass production?', '전고체 배터리 대량 생산?', '固态电池量产？', '全固体電池量産？',
 'Will solid-state batteries enter mass production?', '전고체 배터리가 대량 생산에 들어갈까요?', '固态电池将进入量产吗？', '全固体電池は量産に入るか？',
 '2025-12-31 23:59:59', 'active', 720000.00,
 'Manufacturer production announcement', '제조업체 생산 발표', '制造商生产公告', 'メーカー生産発表');

-- Add outcomes for first 5 science events
INSERT INTO outcomes (event_id, name_en, name_ko, name_zh, name_ja, probability, total_bets) VALUES
-- SpaceX Starship Mars
(111, 'Yes', '예', '是', 'はい', 0.28, 336000.00),
(111, 'No', '아니오', '否', 'いいえ', 0.72, 864000.00),

-- Artemis III Moon landing
(112, 'Yes', '예', '是', 'はい', 0.65, 637000.00),
(112, 'No', '아니오', '否', 'いいえ', 0.35, 343000.00),

-- China Tiangong expansion
(113, 'Yes', '예', '是', 'はい', 0.78, 530400.00),
(113, 'No', '아니오', '否', 'いいえ', 0.22, 149600.00),

-- Japan SLIM operational
(114, 'Yes', '예', '是', 'はい', 0.42, 176400.00),
(114, 'No', '아니오', '否', 'いいえ', 0.58, 243600.00),

-- FDA Alzheimer drug
(115, 'Yes', '예', '是', 'はい', 0.55, 451000.00),
(115, 'No', '아니오', '否', 'いいえ', 0.45, 369000.00);


-- ========================================
-- CLIMATE (30 events)
-- ========================================  
INSERT INTO events (
  category_id,
  title_en, title_ko, title_zh, title_ja,
  description_en, description_ko, description_zh, description_ja,
  end_date, status, total_volume,
  resolution_criteria_en, resolution_criteria_ko, resolution_criteria_zh, resolution_criteria_ja
) VALUES
-- Temperature & Records
(8, '2025 becomes hottest year on record?', '2025년 역대 최고 기온 기록?', '2025年成史上最热年份？', '2025年観測史上最高気温記録？',
 'Will 2025 be the warmest year globally?', '2025년이 전 세계적으로 가장 더운 해가 될까요?', '2025年将成为全球最热年份吗？', '2025年は世界で最も暑い年になるか？',
 '2026-01-31 23:59:59', 'active', 920000.00,
 'NASA GISS temperature data', 'NASA GISS 온도 데이터', 'NASA GISS温度数据', 'NASA GISS温度データ'),

(8, 'Arctic sea ice reaches record low?', '북극 해빙 최저 기록?', '北极海冰创新低？', '北極海氷最低記録？',
 'Will Arctic sea ice hit all-time minimum?', '북극 해빙이 사상 최저치를 기록할까요?', '北极海冰将创历史最低吗？', '北極海氷は史上最低を記録するか？',
 '2025-09-30 23:59:59', 'active', 780000.00,
 'NSIDC sea ice extent data', 'NSIDC 해빙 범위 데이터', 'NSIDC海冰范围数据', 'NSIDC海氷範囲データ'),

(8, 'Global temperatures exceed 1.5°C above baseline?', '지구 온도 기준선 대비 1.5°C 초과?', '全球温度超基线1.5°C？', '地球温度ベースライン比1.5°C超過？',
 'Will global warming pass 1.5°C threshold?', '지구 온난화가 1.5°C 임계점을 넘을까요?', '全球变暖将超过1.5°C阈值吗？', '地球温暖化は1.5°C閾値を超えるか？',
 '2025-12-31 23:59:59', 'active', 1100000.00,
 'IPCC climate data', 'IPCC 기후 데이터', 'IPCC气候数据', 'IPCC気候データ'),

(8, 'Antarctic ice shelf collapses in 2025?', '2025년 남극 빙붕 붕괴?', '2025年南极冰架崩塌？', '2025年南極棚氷崩壊？',
 'Will major Antarctic ice shelf collapse?', '주요 남극 빙붕이 붕괴될까요?', '主要南极冰架将崩塌吗？', '主要な南極棚氷は崩壊するか？',
 '2025-12-31 23:59:59', 'active', 820000.00,
 'Glaciology research reports', '빙하학 연구 보고서', '冰川学研究报告', '氷河学研究報告'),

-- Emissions & Policy
(8, 'US rejoins Paris Climate Agreement?', '미국 파리 기후협정 재가입?', '美国重新加入巴黎气候协定？', '米国パリ気候協定再加入？',
 'Will United States rejoin Paris accord?', '미국이 파리 협정에 재가입할까요?', '美国将重新加入巴黎协定吗？', '米国はパリ協定に再加入するか？',
 '2025-12-31 23:59:59', 'active', 680000.00,
 'UNFCCC official records', 'UNFCCC 공식 기록', 'UNFCCC官方记录', 'UNFCCC公式記録'),

(8, 'China emissions peak in 2025?', '중국 탄소 배출 2025년 정점?', '中国碳排放2025年达峰？', '中国炭素排出2025年ピーク？',
 'Will China reach peak carbon emissions?', '중국이 탄소 배출 정점에 도달할까요?', '中国将达到碳排放峰值吗？', '中国は炭素排出ピークに達するか？',
 '2025-12-31 23:59:59', 'active', 980000.00,
 'IEA emissions data', 'IEA 배출 데이터', 'IEA排放数据', 'IEA排出データ'),

(8, 'EU achieves 55% emissions reduction target?', 'EU 배출 55% 감축 목표 달성?', '欧盟实现55%减排目标？', 'EU排出55%削減目標達成？',
 'Will EU meet 2030 emissions reduction goal?', 'EU가 2030 배출 감축 목표를 달성할까요?', '欧盟将实现2030年减排目标吗？', 'EUは2030年排出削減目標を達成するか？',
 '2025-12-31 23:59:59', 'active', 720000.00,
 'European Environment Agency data', '유럽환경청 데이터', '欧洲环境署数据', '欧州環境庁データ'),

(8, 'Japan carbon neutral coal plants operational?', '일본 탄소 중립 석탄 발전소 가동?', '日本碳中和煤电厂运行？', '日本カーボンニュートラル石炭発電所稼働？',
 'Will Japan deploy carbon capture coal plants?', '일본이 탄소 포집 석탄 발전소를 배치할까요?', '日本将部署碳捕获煤电厂吗？', '日本は炭素回収石炭発電所を配備するか？',
 '2025-12-31 23:59:59', 'active', 520000.00,
 'METI official announcement', 'METI 공식 발표', 'METI官方公告', 'METI公式発表'),

-- Renewable Energy
(8, 'Solar power exceeds 2000 GW globally?', '태양광 발전 전 세계 2000GW 초과?', '全球太阳能发电超2000GW？', '世界太陽光発電2000GW超過？',
 'Will global solar capacity reach 2000 gigawatts?', '전 세계 태양광 용량이 2000기가와트에 도달할까요?', '全球太阳能容量将达到2000吉瓦吗？', '世界太陽光容量は2000ギガワットに達するか？',
 '2025-12-31 23:59:59', 'active', 820000.00,
 'IRENA renewable energy statistics', 'IRENA 재생에너지 통계', 'IRENA可再生能源统计', 'IRENA再生可能エネルギー統計'),

(8, 'Wind power capacity doubles in China?', '중국 풍력 발전 용량 2배 증가?', '中国风电容量翻倍？', '中国風力発電容量2倍増加？',
 'Will China double wind energy capacity?', '중국이 풍력 에너지 용량을 2배로 늘릴까요?', '中国将使风能容量翻倍吗？', '中国は風力エネルギー容量を2倍にするか？',
 '2025-12-31 23:59:59', 'active', 680000.00,
 'China Energy Administration data', '중국 에너지청 데이터', '中国能源局数据', '中国エネルギー局データ'),

(8, 'US renewable energy exceeds 30% of grid?', '미국 재생에너지 전력망 30% 초과?', '美国可再生能源超电网30%？', '米国再生可能エネルギー送電網30%超過？',
 'Will US renewable share exceed 30 percent?', '미국 재생에너지 비율이 30%를 넘을까요?', '美国可再生能源份额将超过30%吗？', '米国再生可能エネルギー割合は30%を超えるか？',
 '2025-12-31 23:59:59', 'active', 580000.00,
 'EIA electricity data', 'EIA 전력 데이터', 'EIA电力数据', 'EIA電力データ'),

(8, 'Korea nuclear power expansion approved?', '한국 원전 확대 승인?', '韩国核电扩建批准？', '韓国原発拡大承認？',
 'Will South Korea approve new nuclear plants?', '한국이 신규 원자력 발전소를 승인할까요?', '韩国将批准新核电厂吗？', '韓国は新規原子力発電所を承認するか？',
 '2025-12-31 23:59:59', 'active', 520000.00,
 'Government policy announcement', '정부 정책 발표', '政府政策公告', '政府政策発表'),

-- Extreme Weather
(8, 'Category 5 hurricane hits US mainland?', '카테고리 5 허리케인 미국 본토 강타?', '5级飓风袭击美国本土？', 'カテゴリー5ハリケーン米国本土襲来？',
 'Will Category 5 hurricane make US landfall?', '카테고리 5 허리케인이 미국에 상륙할까요?', '5级飓风将在美国登陆吗？', 'カテゴリー5ハリケーンは米国に上陸するか？',
 '2025-11-30 23:59:59', 'active', 720000.00,
 'NOAA hurricane reports', 'NOAA 허리케인 보고서', 'NOAA飓风报告', 'NOAAハリケーン報告'),

(8, 'Deadly heatwave in Asia kills 1000+?', '아시아 치명적 폭염 1000명 이상 사망?', '亚洲致命热浪致死1000+？', 'アジア致命的熱波1000人以上死亡？',
 'Will Asian heatwave cause 1000+ deaths?', '아시아 폭염이 1000명 이상의 사망자를 발생시킬까요?', '亚洲热浪将导致1000人以上死亡吗？', 'アジア熱波は1000人以上の死者を出すか？',
 '2025-09-30 23:59:59', 'active', 620000.00,
 'Official mortality statistics', '공식 사망 통계', '官方死亡统计', '公式死亡統計'),

(8, 'Wildfire area in US exceeds 10M acres?', '미국 산불 면적 1000만 에이커 초과?', '美国野火面积超1000万英亩？', '米国山火面積1000万エーカー超過？',
 'Will US wildfire burn area exceed 10 million acres?', '미국 산불 면적이 1000만 에이커를 넘을까요?', '美国野火燃烧面积将超过1000万英亩吗？', '米国山火燃焼面積は1000万エーカーを超えるか？',
 '2025-12-31 23:59:59', 'active', 680000.00,
 'National Interagency Fire Center', '국가 기관 간 화재 센터', '国家机构间火灾中心', '国家機関間火災センター'),

-- Climate Technology
(8, 'Carbon capture plant removes 1M tons CO2?', '탄소 포집 시설 CO2 100만 톤 제거?', '碳捕获工厂清除100万吨CO2？', '炭素回収施設CO2 100万トン除去？',
 'Will carbon capture facility remove 1M tons?', '탄소 포집 시설이 100만 톤을 제거할까요?', '碳捕获设施将清除100万吨吗？', '炭素回収施設は100万トンを除去するか？',
 '2025-12-31 23:59:59', 'active', 720000.00,
 'Facility operational reports', '시설 운영 보고서', '设施运营报告', '施設運営報告'),

(8, 'Direct air capture becomes cost-effective?', '직접 공기 포집 비용 효율적?', '直接空气捕获变得经济？', '直接空気回収コスト効率的？',
 'Will DAC technology reach under $100 per ton?', 'DAC 기술이 톤당 100달러 미만에 도달할까요?', 'DAC技术将达到每吨低于100美元吗？', 'DAC技術はトン当たり100ドル未満に達するか？',
 '2025-12-31 23:59:59', 'active', 820000.00,
 'Industry cost analysis reports', '업계 비용 분석 보고서', '行业成本分析报告', '業界コスト分析報告'),

(8, 'Green hydrogen production reaches 10M tons?', '그린 수소 생산 1000만 톤 달성?', '绿氢生产达1000万吨？', 'グリーン水素生産1000万トン達成？',
 'Will green hydrogen production hit 10 million tons?', '그린 수소 생산이 1000만 톤에 도달할까요?', '绿氢产量将达到1000万吨吗？', 'グリーン水素生産は1000万トンに達するか？',
 '2025-12-31 23:59:59', 'active', 680000.00,
 'International Energy Agency data', '국제에너지기구 데이터', '国际能源署数据', '国際エネルギー機関データ'),

-- Additional Climate Events (19-30)
(8, 'Sea level rise exceeds 10cm this decade?', '해수면 상승 이번 10년간 10cm 초과?', '海平面上升本十年超10cm？', '海面上昇今十年間10cm超過？',
 'Will sea levels rise over 10 centimeters?', '해수면이 10센티미터 이상 상승할까요?', '海平面将上升超过10厘米吗？', '海面は10センチ以上上昇するか？',
 '2030-12-31 23:59:59', 'active', 880000.00,
 'Satellite altimetry measurements', '위성 고도 측정', '卫星测高测量', '衛星高度測定'),

(8, 'COP30 agrees on loss and damage fund?', 'COP30 손실 및 피해 기금 합의?', 'COP30同意损失和损害基金？', 'COP30損失と損害基金合意？',
 'Will COP30 establish loss and damage funding?', 'COP30이 손실 및 피해 기금을 설립할까요?', 'COP30将建立损失和损害资金吗？', 'COP30は損失と損害資金を設立するか？',
 '2025-11-30 23:59:59', 'active', 720000.00,
 'UNFCCC COP30 outcome document', 'UNFCCC COP30 결과 문서', 'UNFCCC COP30成果文件', 'UNFCCC COP30成果文書'),

(8, 'Coral bleaching affects 50%+ Great Barrier Reef?', '산호 백화 그레이트 배리어 리프 50% 이상 영향?', '珊瑚白化影响大堡礁50%+？', 'サンゴ白化グレートバリアリーフ50%以上影響？',
 'Will coral bleaching impact majority of reef?', '산호 백화가 리프의 대부분에 영향을 미칠까요?', '珊瑚白化将影响大部分珊瑚礁吗？', 'サンゴ白化はリーフの大部分に影響するか？',
 '2025-12-31 23:59:59', 'active', 620000.00,
 'Australian Institute Marine Science', '호주 해양과학연구소', '澳大利亚海洋科学研究所', 'オーストラリア海洋科学研究所'),

(8, 'Electric vehicles reach 20% of new car sales?', '전기차 신차 판매 20% 달성?', '电动车占新车销量20%？', 'EV新車販売20%達成？',
 'Will EVs reach 20% market share of new sales?', '전기차가 신차 판매의 20% 시장 점유율을 달성할까요?', '电动车将达到新车销量20%市场份额吗？', 'EVは新車販売の20%市場シェアに達するか？',
 '2025-12-31 23:59:59', 'active', 780000.00,
 'Global automotive sales data', '글로벌 자동차 판매 데이터', '全球汽车销售数据', '世界自動車販売データ'),

(8, 'Amazon rainforest deforestation slows 50%?', '아마존 열대우림 벌채 50% 감소?', '亚马逊雨林砍伐减少50%？', 'アマゾン熱帯雨林伐採50%減少？',
 'Will Amazon deforestation decrease by half?', '아마존 벌채가 절반으로 감소할까요?', '亚马逊砍伐将减半吗？', 'アマゾン伐採は半分に減少するか？',
 '2025-12-31 23:59:59', 'active', 680000.00,
 'Brazil INPE satellite monitoring', '브라질 INPE 위성 모니터링', '巴西INPE卫星监测', 'ブラジルINPE衛星監視'),

(8, 'Methane emissions regulations enforced globally?', '메탄 배출 규제 전 세계 시행?', '全球实施甲烷排放法规？', '世界的にメタン排出規制実施？',
 'Will global methane regulations be implemented?', '글로벌 메탄 규제가 시행될까요?', '将实施全球甲烷法规吗？', '世界的メタン規制は実施されるか？',
 '2025-12-31 23:59:59', 'active', 580000.00,
 'International policy agreements', '국제 정책 협약', '国际政策协议', '国際政策協定'),

(8, 'Plastic pollution treaty signed by 100+ nations?', '플라스틱 오염 조약 100개국 이상 서명?', '100+国签署塑料污染条约？', 'プラスチック汚染条約100カ国以上署名？',
 'Will plastic pollution treaty gain 100 signatories?', '플라스틱 오염 조약이 100개 서명국을 얻을까요?', '塑料污染条约将获得100个签署国吗？', 'プラスチック汚染条約は100署名国を獲得するか？',
 '2025-12-31 23:59:59', 'active', 520000.00,
 'UN treaty signature records', 'UN 조약 서명 기록', 'UN条约签署记录', 'UN条約署名記録'),

(8, 'Greenland ice loss exceeds 500 gigatons?', '그린란드 빙하 손실 5000억 톤 초과?', '格陵兰冰层损失超5000亿吨？', 'グリーンランド氷河損失5000億トン超過？',
 'Will Greenland ice sheet lose 500+ gigatons?', '그린란드 빙상이 5000억 톤 이상 손실될까요?', '格陵兰冰盖将损失5000亿吨以上吗？', 'グリーンランド氷床は5000億トン以上失われるか？',
 '2025-12-31 23:59:59', 'active', 720000.00,
 'NASA/ESA satellite data', 'NASA/ESA 위성 데이터', 'NASA/ESA卫星数据', 'NASA/ESA衛星データ'),

(8, 'Ocean acidification reaches critical pH level?', '해양 산성화 임계 pH 수준 도달?', '海洋酸化达临界pH水平？', '海洋酸性化臨界pH水準到達？',
 'Will ocean pH drop to critical acidification level?', '해양 pH가 임계 산성화 수준으로 떨어질까요?', '海洋pH将降至临界酸化水平吗？', '海洋pHは臨界酸性化レベルに低下するか？',
 '2025-12-31 23:59:59', 'active', 620000.00,
 'NOAA ocean monitoring data', 'NOAA 해양 모니터링 데이터', 'NOAA海洋监测数据', 'NOAA海洋監視データ'),

(8, 'Sahara Desert solar farms exceed 100 GW?', '사하라 사막 태양광 발전소 100GW 초과?', '撒哈拉沙漠太阳能农场超100GW？', 'サハラ砂漠ソーラーファーム100GW超過？',
 'Will Sahara solar capacity exceed 100 gigawatts?', '사하라 태양광 용량이 100기가와트를 넘을까요?', '撒哈拉太阳能容量将超过100吉瓦吗？', 'サハラ太陽光容量は100ギガワットを超えるか？',
 '2025-12-31 23:59:59', 'active', 580000.00,
 'Regional energy production data', '지역 에너지 생산 데이터', '区域能源生产数据', '地域エネルギー生産データ'),

(8, 'Permafrost thaw releases 1 gigaton methane?', '영구동토층 해빙 메탄 10억 톤 방출?', '永久冻土融化释放10亿吨甲烷？', '永久凍土融解メタン10億トン放出？',
 'Will permafrost thawing release 1 Gt methane?', '영구동토층 해빙이 10억 톤의 메탄을 방출할까요?', '永久冻土融化将释放10亿吨甲烷吗？', '永久凍土融解は10億トンのメタンを放出するか？',
 '2025-12-31 23:59:59', 'active', 680000.00,
 'Arctic research consortium data', '북극 연구 컨소시엄 데이터', '北极研究联盟数据', '北極研究コンソーシアムデータ'),

(8, 'Battery storage capacity exceeds 500 GWh?', '배터리 저장 용량 500GWh 초과?', '电池储能容量超500GWh？', 'バッテリー蓄電容量500GWh超過？',
 'Will global battery storage reach 500 gigawatt-hours?', '글로벌 배터리 저장이 500기가와트시에 도달할까요?', '全球电池储能将达到500吉瓦时吗？', '世界バッテリー蓄電は500ギガワット時に達するか？',
 '2025-12-31 23:59:59', 'active', 720000.00,
 'BloombergNEF energy storage report', 'BloombergNEF 에너지 저장 보고서', 'BloombergNEF储能报告', 'BloombergNEFエネルギー貯蔵レポート');

-- Add outcomes for first 5 climate events
INSERT INTO outcomes (event_id, name_en, name_ko, name_zh, name_ja, probability, total_bets) VALUES
-- 2025 hottest year
(141, 'Yes', '예', '是', 'はい', 0.72, 662400.00),
(141, 'No', '아니오', '否', 'いいえ', 0.28, 257600.00),

-- Arctic sea ice record low
(142, 'Yes', '예', '是', 'はい', 0.58, 452400.00),
(142, 'No', '아니오', '否', 'いいえ', 0.42, 327600.00),

-- 1.5°C threshold
(143, 'Yes', '예', '是', 'はい', 0.48, 528000.00),
(143, 'No', '아니오', '否', 'いいえ', 0.52, 572000.00),

-- Antarctic ice shelf collapse
(144, 'Yes', '예', '是', 'はい', 0.35, 287000.00),
(144, 'No', '아니오', '否', 'いいえ', 0.65, 533000.00),

-- US Paris Agreement
(145, 'Yes', '예', '是', 'はい', 0.62, 421600.00),
(145, 'No', '아니오', '否', 'いいえ', 0.38, 258400.00);
