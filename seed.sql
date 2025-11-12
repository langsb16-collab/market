-- Seed data for prediction market platform

-- Insert categories
INSERT OR IGNORE INTO categories (id, name_en, name_ko, name_zh, name_ja, slug, icon) VALUES 
  (1, 'Politics', '정치', '政治', '政治', 'politics', '🏛️'),
  (2, 'Sports', '스포츠', '体育', 'スポーツ', 'sports', '⚽'),
  (3, 'Technology', '기술', '技术', 'テクノロジー', 'technology', '💻'),
  (4, 'Cryptocurrency', '암호화폐', '加密货币', '暗号通貨', 'cryptocurrency', '₿'),
  (5, 'Entertainment', '엔터테인먼트', '娱乐', 'エンターテインメント', 'entertainment', '🎬'),
  (6, 'Economy', '경제', '经济', '経済', 'economy', '💰'),
  (7, 'Science', '과학', '科学', '科学', 'science', '🔬'),
  (8, 'Climate', '기후', '气候', '気候', 'climate', '🌍');

-- Insert sample events
INSERT OR IGNORE INTO events (
  id, category_id, 
  title_en, title_ko, title_zh, title_ja,
  description_en, description_ko, description_zh, description_ja,
  end_date, status, total_volume,
  resolution_criteria_en, resolution_criteria_ko, resolution_criteria_zh, resolution_criteria_ja
) VALUES 
  (
    1, 1,
    'Will AI regulation pass in the US by 2025?', '2025년까지 미국에서 AI 규제법이 통과될까요?', '美国将在2025年前通过AI监管法规吗？', '2025年までに米国でAI規制が通過するか？',
    'Prediction market for comprehensive AI regulation in the United States', '미국의 포괄적인 AI 규제에 대한 예측 시장', '美国综合AI监管的预测市场', '米国の包括的なAI規制に関する予測市場',
    '2025-12-31 23:59:59', 'active', 125000.50,
    'Resolved based on official US government legislation passed and signed into law', '미국 정부의 공식 법안 통과 및 서명 기준으로 결정', '根据美国政府通过并签署的正式立法解决', '米国政府の正式な法案可決と署名に基づいて解決'
  ),
  (
    2, 4,
    'Bitcoin to reach $100,000 by end of 2025?', '2025년 말까지 비트코인이 $100,000에 도달할까요?', '比特币将在2025年底达到$100,000吗？', 'ビットコインは2025年末までに$100,000に達するか？',
    'Will Bitcoin price exceed $100,000 USD by December 31, 2025?', '2025년 12월 31일까지 비트코인 가격이 $100,000 USD를 초과할까요?', '比特币价格将在2025年12月31日前超过$100,000美元吗？', '2025年12月31日までにビットコイン価格が$100,000 USDを超えるか？',
    '2025-12-31 23:59:59', 'active', 2450000.00,
    'Resolved based on CoinMarketCap price data at 23:59:59 UTC on December 31, 2025', '2025년 12월 31일 23:59:59 UTC의 CoinMarketCap 가격 데이터 기준', '根据2025年12月31日23:59:59 UTC的CoinMarketCap价格数据解决', '2025年12月31日23:59:59 UTCのCoinMarketCap価格データに基づいて解決'
  ),
  (
    3, 2,
    '2026 FIFA World Cup Winner', '2026 FIFA 월드컵 우승 팀', '2026年FIFA世界杯冠军', '2026 FIFAワールドカップ優勝チーム',
    'Which country will win the 2026 FIFA World Cup?', '어느 국가가 2026 FIFA 월드컵에서 우승할까요?', '哪个国家将赢得2026年FIFA世界杯？', 'どの国が2026 FIFAワールドカップで優勝するか？',
    '2026-07-19 23:59:59', 'active', 850000.00,
    'Resolved based on official FIFA announcement of the tournament winner', 'FIFA의 공식 우승 팀 발표 기준', '根据FIFA官方宣布的锦标赛获胜者解决', 'FIFAの公式トーナメント優勝者発表に基づいて解決'
  ),
  (
    4, 3,
    'Apple to release AR glasses in 2025?', '애플이 2025년에 AR 안경을 출시할까요?', '苹果将在2025年发布AR眼镜吗？', 'Appleは2025年にARグラスをリリースするか？',
    'Will Apple officially announce and release consumer AR glasses in 2025?', '애플이 2025년에 소비자용 AR 안경을 공식 발표하고 출시할까요?', '苹果将在2025年正式宣布并发布消费者AR眼镜吗？', 'Appleは2025年に消費者向けARグラスを正式に発表してリリースするか？',
    '2025-12-31 23:59:59', 'active', 320000.00,
    'Resolved based on official Apple product announcement and availability for purchase', '애플의 공식 제품 발표 및 구매 가능 여부 기준', '根据苹果官方产品发布和购买可用性解决', 'Appleの公式製品発表と購入可能性に基づいて解決'
  ),
  (
    5, 6,
    'Global recession in 2025?', '2025년 세계 경기 침체?', '2025年全球经济衰退？', '2025年の世界不況？',
    'Will major economic indicators confirm a global recession in 2025?', '주요 경제 지표가 2025년 세계 경기 침체를 확인할까요?', '主要经济指标将确认2025年全球衰退吗？', '主要経済指標は2025年の世界不況を確認するか？',
    '2025-12-31 23:59:59', 'active', 680000.00,
    'Resolved based on IMF and World Bank economic reports and GDP data', 'IMF 및 세계은행 경제 보고서와 GDP 데이터 기준', '根据IMF和世界银行经济报告及GDP数据解决', 'IMFと世界銀行の経済レポートとGDPデータに基づいて解決'
  );

-- Insert outcomes for each event
INSERT OR IGNORE INTO outcomes (id, event_id, name_en, name_ko, name_zh, name_ja, probability, total_bets) VALUES 
  -- Event 1: AI regulation
  (1, 1, 'Yes', '예', '是', 'はい', 0.62, 77500.25),
  (2, 1, 'No', '아니오', '否', 'いいえ', 0.38, 47500.25),
  
  -- Event 2: Bitcoin $100k
  (3, 2, 'Yes', '예', '是', 'はい', 0.71, 1739500.00),
  (4, 2, 'No', '아니오', '否', 'いいえ', 0.29, 710500.00),
  
  -- Event 3: World Cup (multiple outcomes)
  (5, 3, 'Brazil', '브라질', '巴西', 'ブラジル', 0.18, 153000.00),
  (6, 3, 'France', '프랑스', '法国', 'フランス', 0.15, 127500.00),
  (7, 3, 'Argentina', '아르헨티나', '阿根廷', 'アルゼンチン', 0.16, 136000.00),
  (8, 3, 'Germany', '독일', '德国', 'ドイツ', 0.12, 102000.00),
  (9, 3, 'Spain', '스페인', '西班牙', 'スペイン', 0.11, 93500.00),
  (10, 3, 'England', '잉글랜드', '英格兰', 'イングランド', 0.10, 85000.00),
  (11, 3, 'Other', '기타', '其他', 'その他', 0.18, 153000.00),
  
  -- Event 4: Apple AR glasses
  (12, 4, 'Yes', '예', '是', 'はい', 0.44, 140800.00),
  (13, 4, 'No', '아니오', '否', 'いいえ', 0.56, 179200.00),
  
  -- Event 5: Global recession
  (14, 5, 'Yes', '예', '是', 'はい', 0.35, 238000.00),
  (15, 5, 'No', '아니오', '否', 'いいえ', 0.65, 442000.00);

-- Insert sample users (test data)
INSERT OR IGNORE INTO users (id, wallet_address, username, preferred_language) VALUES 
  (1, '0x1234567890abcdef1234567890abcdef12345678', 'CryptoTrader', 'en'),
  (2, '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', '코인투자자', 'ko'),
  (3, '0x9876543210fedcba9876543210fedcba98765432', '加密交易员', 'zh'),
  (4, '0xfedcbafedcbafedcbafedcbafedcbafedcbafed', '暗号トレーダー', 'ja');

-- Insert sample bets
INSERT OR IGNORE INTO bets (
  user_id, event_id, outcome_id, amount, crypto_type, crypto_amount, 
  probability_at_bet, potential_payout, status, transaction_hash
) VALUES 
  (1, 1, 1, 1000.00, 'USDT', 1000.00, 0.62, 1612.90, 'confirmed', '0xabc123def456'),
  (2, 2, 3, 500.00, 'ETH', 0.15, 0.71, 704.23, 'confirmed', '0xdef789ghi012'),
  (3, 3, 5, 300.00, 'BTC', 0.003, 0.18, 1666.67, 'confirmed', '0xghi345jkl678'),
  (4, 4, 13, 750.00, 'USDT', 750.00, 0.56, 1339.29, 'confirmed', '0xjkl901mno234');
