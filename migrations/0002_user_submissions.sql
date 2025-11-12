-- Create user_submissions table for user-submitted prediction markets
CREATE TABLE IF NOT EXISTS user_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  -- Event details in 4 languages
  title_en TEXT NOT NULL,
  title_ko TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  title_ja TEXT NOT NULL,
  description_en TEXT,
  description_ko TEXT,
  description_zh TEXT,
  description_ja TEXT,
  
  -- Betting limits and outcomes
  bet_limit_min REAL NOT NULL DEFAULT 1.0,
  bet_limit_max REAL NOT NULL DEFAULT 1000.0,
  crypto_type TEXT NOT NULL, -- BTC, ETH, USDT
  
  -- Outcomes (JSON array)
  outcomes TEXT NOT NULL, -- JSON: [{"en":"Yes","ko":"예","zh":"是","ja":"はい"}, ...]
  
  -- User info (only visible to admin)
  wallet_address TEXT NOT NULL,
  email TEXT,
  nickname TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  admin_notes TEXT,
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME,
  approved_by INTEGER, -- admin user_id
  
  FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Create index for status queries
CREATE INDEX IF NOT EXISTS idx_user_submissions_status ON user_submissions(status);
CREATE INDEX IF NOT EXISTS idx_user_submissions_wallet ON user_submissions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_submissions_created ON user_submissions(created_at DESC);
