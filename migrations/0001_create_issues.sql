-- Create issues table
CREATE TABLE IF NOT EXISTS issues (
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON issues(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issues_category ON issues(category);
