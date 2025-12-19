-- Issues table for admin
CREATE TABLE IF NOT EXISTS issues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title_ko TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  title_ja TEXT NOT NULL,
  category TEXT NOT NULL,
  initial_usdt REAL DEFAULT 60,
  yes_bet REAL DEFAULT 0,
  no_bet REAL DEFAULT 0,
  expire_date TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_category ON issues(category);
