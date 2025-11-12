-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_en TEXT NOT NULL,
  name_ko TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  name_ja TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Events table (prediction markets)
CREATE TABLE IF NOT EXISTS events (
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
  status TEXT DEFAULT 'active', -- active, closed, resolved, cancelled
  resolution_criteria_en TEXT,
  resolution_criteria_ko TEXT,
  resolution_criteria_zh TEXT,
  resolution_criteria_ja TEXT,
  total_volume REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Outcomes table (for each event)
CREATE TABLE IF NOT EXISTS outcomes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  name_en TEXT NOT NULL,
  name_ko TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  name_ja TEXT NOT NULL,
  probability REAL DEFAULT 0.5, -- 0 to 1
  total_bets REAL DEFAULT 0,
  is_winning_outcome BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Bets table
CREATE TABLE IF NOT EXISTS bets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  event_id INTEGER NOT NULL,
  outcome_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  crypto_type TEXT NOT NULL, -- BTC, ETH, USDT
  crypto_amount REAL NOT NULL,
  transaction_hash TEXT,
  probability_at_bet REAL NOT NULL, -- probability when bet was placed
  potential_payout REAL NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, confirmed, won, lost, refunded
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  confirmed_at DATETIME,
  settled_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (outcome_id) REFERENCES outcomes(id)
);

-- Transactions table (crypto payments)
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  bet_id INTEGER,
  transaction_hash TEXT UNIQUE NOT NULL,
  crypto_type TEXT NOT NULL,
  amount REAL NOT NULL,
  type TEXT NOT NULL, -- deposit, bet, payout, refund
  status TEXT DEFAULT 'pending', -- pending, confirmed, failed
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  confirmed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (bet_id) REFERENCES bets(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_end_date ON events(end_date);
CREATE INDEX IF NOT EXISTS idx_outcomes_event ON outcomes(event_id);
CREATE INDEX IF NOT EXISTS idx_bets_user ON bets(user_id);
CREATE INDEX IF NOT EXISTS idx_bets_event ON bets(event_id);
CREATE INDEX IF NOT EXISTS idx_bets_outcome ON bets(outcome_id);
CREATE INDEX IF NOT EXISTS idx_bets_status ON bets(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_hash ON transactions(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
