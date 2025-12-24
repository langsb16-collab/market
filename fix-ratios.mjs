#!/usr/bin/env node

// 기존 이슈들의 yes_bet/no_bet을 랜덤 비율로 업데이트
const API_BASE = 'https://www.cashiq.my/api/issues';

async function fixRatios() {
  console.log('📥 기존 이슈 가져오기...');
  
  // 1. 기존 이슈 목록 가져오기
  const response = await fetch(API_BASE);
  const data = await response.json();
  
  if (!data.success || !data.issues) {
    console.error('❌ 이슈를 가져올 수 없습니다.');
    return;
  }
  
  const issues = data.issues;
  console.log(`✅ ${issues.length}개 이슈 발견`);
  
  // 2. 각 이슈를 업데이트
  for (const issue of issues) {
    const initial = issue.initial_usdt || 60;
    
    // 랜덤 비율 생성 (30-70%)
    const randomYesRatio = 0.3 + Math.random() * 0.4;
    const newYesBet = Math.floor(initial * randomYesRatio);
    const newNoBet = initial - newYesBet;
    
    console.log(`🔄 업데이트 중: ${issue.title_ko}`);
    console.log(`   기존: Yes=${issue.yes_bet}, No=${issue.no_bet}`);
    console.log(`   신규: Yes=${newYesBet}, No=${newNoBet} (${(randomYesRatio * 100).toFixed(1)}%)`);
    
    try {
      const updateResponse = await fetch(`${API_BASE}/${issue.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          yes_bet: newYesBet,
          no_bet: newNoBet
        })
      });
      
      const result = await updateResponse.json();
      
      if (result.success) {
        console.log(`   ✅ 성공`);
      } else {
        console.log(`   ❌ 실패: ${result.error}`);
      }
    } catch (error) {
      console.error(`   ❌ 오류: ${error.message}`);
    }
    
    // API 부하 방지를 위한 딜레이
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n🎉 모든 이슈 업데이트 완료!');
}

fixRatios().catch(console.error);
