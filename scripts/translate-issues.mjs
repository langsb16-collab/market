// Auto-translate all issues to en/zh/ja
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Find the local D1 database
import { globSync } from 'glob';
import { execSync } from 'child_process';

// Try to find database files
let dbPath = join(__dirname, '../.wrangler/state/v3/d1/**/*.sqlite');
let dbFiles = globSync(dbPath.replace(/\\/g, '/'));

if (dbFiles.length === 0) {
  console.error('❌ Local D1 database not found.');
  console.log('💡 Trying to find database using system command...');
  
  try {
    const findCmd = 'find /home/user/webapp/.wrangler -name "*.sqlite" -type f 2>/dev/null';
    const result = execSync(findCmd, { encoding: 'utf-8' }).trim();
    dbFiles = result.split('\n').filter(f => f && f.includes('cashiq'));
  } catch (e) {
    console.error('❌ Could not find database files');
    process.exit(1);
  }
}

if (dbFiles.length === 0) {
  console.error('❌ No database files found. Please ensure the local D1 database is initialized.');
  process.exit(1);
}

const db = new Database(dbFiles[0]);
console.log('✅ Connected to local D1 database:', dbFiles[0]);

import { manualTranslations } from './translation-map.mjs';

// Simple translation mappings for common terms
const translations = manualTranslations;

// Auto-generate basic translations for titles not in mapping
function autoTranslate(koreanText) {
  // Check if we have a manual translation
  if (translations[koreanText]) {
    return translations[koreanText];
  }
  
  // Simple pattern-based translation for common patterns
  let en = koreanText;
  let zh = koreanText;
  let ja = koreanText;
  
  // Common pattern replacements
  const patterns = {
    // Years
    '2024': { en: '2024', zh: '2024年', ja: '2024年' },
    '2025': { en: '2025', zh: '2025年', ja: '2025年' },
    '2026': { en: '2026', zh: '2026年', ja: '2026年' },
    
    // Common terms
    '출시': { en: 'Release', zh: '发布', ja: 'リリース' },
    '달성': { en: 'Achievement', zh: '达成', ja: '達成' },
    '돌파': { en: 'Breakthrough', zh: '突破', ja: '突破' },
    '우승': { en: 'Championship', zh: '冠军', ja: '優勝' },
    '성공': { en: 'Success', zh: '成功', ja: '成功' },
    '제작': { en: 'Production', zh: '制作', ja: '制作' },
    '상승': { en: 'Rise', zh: '上升', ja: '上昇' },
    '하락': { en: 'Fall', zh: '下降', ja: '下落' },
    '완성': { en: 'Completion', zh: '完成', ja: '完成' },
    '시작': { en: 'Start', zh: '开始', ja: '開始' }
  };
  
  // Try to apply simple replacements
  for (const [ko, trans] of Object.entries(patterns)) {
    if (koreanText.includes(ko)) {
      en = en.replace(ko, trans.en);
      zh = zh.replace(ko, trans.zh);
      ja = ja.replace(ko, trans.ja);
    }
  }
  
  return { en, zh, ja };
}

// Get all issues with Korean-only titles
const issues = db.prepare(`
  SELECT id, title_ko, title_en, title_zh, title_ja 
  FROM issues 
  WHERE title_en = title_ko OR title_zh = title_ko OR title_ja = title_ko
`).all();

console.log(`\n📊 Found ${issues.length} issues needing translation\n`);

// Update translations
let updatedCount = 0;
const updateStmt = db.prepare(`
  UPDATE issues 
  SET title_en = ?, title_zh = ?, title_ja = ?
  WHERE id = ?
`);

for (const issue of issues) {
  const translated = autoTranslate(issue.title_ko);
  
  try {
    updateStmt.run(
      translated.en,
      translated.zh,
      translated.ja,
      issue.id
    );
    
    updatedCount++;
    console.log(`✅ [${issue.id}] ${issue.title_ko}`);
    console.log(`   EN: ${translated.en}`);
    console.log(`   ZH: ${translated.zh}`);
    console.log(`   JA: ${translated.ja}\n`);
  } catch (error) {
    console.error(`❌ Failed to update issue ${issue.id}:`, error.message);
  }
}

db.close();

console.log(`\n🎉 Translation complete! Updated ${updatedCount} issues`);
console.log('\n⚠️  Note: Some translations are basic. For production, integrate OpenAI API for better translations.\n');
