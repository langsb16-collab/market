// 배포 상태 확인 스크립트
const https = require('https');

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`\n📍 ${url}`);
        console.log(`✅ 상태: ${res.statusCode}`);
        
        // app.js 파일 크기 확인 (최신 버전인지)
        if (url.includes('app.js')) {
          console.log(`📦 파일 크기: ${data.length} bytes (로컬: 42KB = 43008 bytes)`);
          
          // 핵심 함수 존재 확인
          const hasCategoryMap = data.includes('CATEGORY_MAP');
          const hasToNumber = data.includes('toNumber');
          const hasCalcYesNo = data.includes('calcYesNoPercent');
          
          console.log(`🔍 CATEGORY_MAP: ${hasCategoryMap ? '✅' : '❌'}`);
          console.log(`🔍 toNumber: ${hasToNumber ? '✅' : '❌'}`);
          console.log(`🔍 calcYesNoPercent: ${hasCalcYesNo ? '✅' : '❌'}`);
        }
        
        resolve();
      });
    }).on('error', (err) => {
      console.log(`❌ ${url}: ${err.message}`);
      resolve();
    });
  });
}

async function main() {
  console.log('🔍 Cloudflare Pages 배포 상태 확인...\n');
  
  await checkUrl('https://www.cashiq.my/static/app.js');
  await checkUrl('https://www.cashiq.my/static/admin.js');
  
  console.log('\n✅ 확인 완료!');
}

main();
