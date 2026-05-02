-- Add category translations table
CREATE TABLE IF NOT EXISTS category_translations (
  category_slug TEXT NOT NULL,
  language TEXT NOT NULL,
  name TEXT NOT NULL,
  PRIMARY KEY (category_slug, language)
);

-- Insert default category translations
-- Politics
INSERT OR IGNORE INTO category_translations (category_slug, language, name) VALUES 
  ('politics', 'ko', '정치'),
  ('politics', 'en', 'Politics'),
  ('politics', 'zh', '政治'),
  ('politics', 'ja', '政治');

-- Sports
INSERT OR IGNORE INTO category_translations (category_slug, language, name) VALUES 
  ('sports', 'ko', '스포츠'),
  ('sports', 'en', 'Sports'),
  ('sports', 'zh', '体育'),
  ('sports', 'ja', 'スポーツ');

-- Technology
INSERT OR IGNORE INTO category_translations (category_slug, language, name) VALUES 
  ('technology', 'ko', '기술'),
  ('technology', 'en', 'Technology'),
  ('technology', 'zh', '技术'),
  ('technology', 'ja', 'テクノロジー');

-- Cryptocurrency
INSERT OR IGNORE INTO category_translations (category_slug, language, name) VALUES 
  ('cryptocurrency', 'ko', '암호화폐'),
  ('cryptocurrency', 'en', 'Cryptocurrency'),
  ('cryptocurrency', 'zh', '加密货币'),
  ('cryptocurrency', 'ja', '暗号通貨');

-- Entertainment
INSERT OR IGNORE INTO category_translations (category_slug, language, name) VALUES 
  ('entertainment', 'ko', '엔터테인먼트'),
  ('entertainment', 'en', 'Entertainment'),
  ('entertainment', 'zh', '娱乐'),
  ('entertainment', 'ja', 'エンターテインメント');

-- Economy
INSERT OR IGNORE INTO category_translations (category_slug, language, name) VALUES 
  ('economy', 'ko', '경제'),
  ('economy', 'en', 'Economy'),
  ('economy', 'zh', '经济'),
  ('economy', 'ja', '経済');

-- Science
INSERT OR IGNORE INTO category_translations (category_slug, language, name) VALUES 
  ('science', 'ko', '과학'),
  ('science', 'en', 'Science'),
  ('science', 'zh', '科学'),
  ('science', 'ja', '科学');

-- Climate
INSERT OR IGNORE INTO category_translations (category_slug, language, name) VALUES 
  ('climate', 'ko', '기후'),
  ('climate', 'en', 'Climate'),
  ('climate', 'zh', '气候'),
  ('climate', 'ja', '気候');

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_category_translations_slug ON category_translations(category_slug);

-- Create translation cache table for performance
CREATE TABLE IF NOT EXISTS translation_cache (
  text TEXT NOT NULL,
  source_lang TEXT NOT NULL,
  target_lang TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (text, source_lang, target_lang)
);

CREATE INDEX IF NOT EXISTS idx_translation_cache_lookup ON translation_cache(text, source_lang, target_lang);
