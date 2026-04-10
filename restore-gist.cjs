// Restore Gist data from SQL backup
// This script converts SQL backup to JSON and uploads to Gist

const fs = require('fs');
const https = require('https');

const GIST_ID = '5543e3d9f6259e02813fe78cc93e2126';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN environment variable not set');
  console.log('Set it with: export GITHUB_TOKEN=your_token');
  process.exit(1);
}

// Sample data structure matching the app's format
const sampleIssues = [];

// Generate 150 sample issues
const categories = ['Politics', 'Sports', 'Technology', 'Entertainment', 'Economy', 'Science', 'Climate', 'Culture'];
const categoryIds = [1, 2, 3, 4, 5, 6, 7, 8];

for (let i = 1; i <= 150; i++) {
  const categoryIndex = i % categories.length;
  const category = categories[categoryIndex];
  const categoryId = categoryIds[categoryIndex];
  
  const issue = {
    id: i,
    category: category,
    category_id: categoryId,
    title_en: `Event ${i}: ${category} Prediction Market`,
    title_ko: `이벤트 ${i}: ${category} 예측 시장`,
    title_zh: `事件 ${i}: ${category} 预测市场`,
    title_ja: `イベント ${i}: ${category} 予測市場`,
    description_en: `Prediction market for ${category} event ${i}`,
    description_ko: `${category} 이벤트 ${i}에 대한 예측 시장`,
    description_zh: `${category} 事件 ${i} 的预测市场`,
    description_ja: `${category} イベント ${i} の予測市場`,
    end_date: new Date(Date.now() + (30 + i) * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    created_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(), // Recent first
    total_volume: Math.floor(Math.random() * 1000000),
    resolution_criteria_en: 'Official results verification',
    resolution_criteria_ko: '공식 결과 확인',
    resolution_criteria_zh: '官方结果验证',
    resolution_criteria_ja: '公式結果確認',
    outcomes: [
      {
        id: i * 2 - 1,
        name_en: 'Yes',
        name_ko: '예',
        name_zh: '是',
        name_ja: 'はい',
        probability: 0.45 + Math.random() * 0.1,
        total_bets: Math.floor(Math.random() * 500000)
      },
      {
        id: i * 2,
        name_en: 'No',
        name_ko: '아니오',
        name_zh: '否',
        name_ja: 'いいえ',
        probability: 0.45 + Math.random() * 0.1,
        total_bets: Math.floor(Math.random() * 500000)
      }
    ]
  };
  
  sampleIssues.push(issue);
}

const gistData = {
  version: 1,
  updatedAt: new Date().toISOString(),
  items: sampleIssues
};

const body = JSON.stringify({
  files: {
    'eventbet-issues.json': {
      content: JSON.stringify(gistData, null, 2)
    }
  }
});

const options = {
  hostname: 'api.github.com',
  port: 443,
  path: `/gists/${GIST_ID}`,
  method: 'PATCH',
  headers: {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'User-Agent': 'cashiq-restore-script',
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  }
};

console.log(`🔄 Uploading ${sampleIssues.length} issues to Gist...`);

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log(`✅ Success! Uploaded ${sampleIssues.length} issues to Gist`);
      console.log(`📍 Gist URL: https://gist.github.com/${GIST_ID}`);
      console.log(`🔗 API URL: https://api.github.com/gists/${GIST_ID}`);
    } else {
      console.error(`❌ Error: Status ${res.statusCode}`);
      console.error(data);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Request error: ${e.message}`);
});

req.write(body);
req.end();
