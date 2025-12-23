// EventBET Admin API Functions - 서버 API 연동

// ========== 이슈 일괄 등록 (서버 API) ==========
async function saveBatchIssues() {
    console.log('=== saveBatchIssues 시작 (API 버전) ===');
    
    const container = document.getElementById('batch-issues-container');
    const cards = container.querySelectorAll('.issue-card');
    
    if (cards.length === 0) {
        alert('등록할 이슈가 없습니다.');
        return;
    }
    
    let successCount = 0;
    let failCount = 0;
    const errors = [];
    
    // 각 카드별로 API 요청
    for (const [cardIndex, card] of Array.from(cards).entries()) {
        const cardId = card.dataset.cardId;
        
        // 데이터 수집
        const category = document.getElementById(`batch-issue-${cardId}-category`)?.value;
        const koTitle = document.getElementById(`batch-issue-${cardId}-ko`)?.value?.trim();
        const enTitle = document.getElementById(`batch-issue-${cardId}-en`)?.value?.trim();
        const zhTitle = document.getElementById(`batch-issue-${cardId}-zh`)?.value?.trim();
        const jaTitle = document.getElementById(`batch-issue-${cardId}-ja`)?.value?.trim();
        const expireDate = document.getElementById(`batch-issue-${cardId}-date`)?.value;
        const initialUsdt = parseFloat(document.getElementById(`batch-issue-${cardId}-usdt`)?.value || 100000);
        
        // 필수 필드 검증
        if (!category || !expireDate || !koTitle) {
            errors.push(`이슈 #${cardIndex + 1}: 카테고리, 한국어 제목, 만료일은 필수입니다.`);
            failCount++;
            continue;
        }
        
        // 만료일 계산 (날짜를 일수로 변환)
        const today = new Date();
        const expire = new Date(expireDate);
        const diffTime = Math.abs(expire - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // API 요청 데이터
        const issueData = {
            title_ko: koTitle,
            title_en: enTitle || koTitle,
            title_zh: zhTitle || koTitle,
            title_ja: jaTitle || koTitle,
            category: category,
            initial_usdt: initialUsdt,
            expire_days: diffDays > 0 ? diffDays : 7
        };
        
        console.log(`API 요청 #${cardIndex + 1}:`, issueData);
        
        try {
            // API 호출
            const response = await axios.post('/api/issues', issueData);
            
            if (response.data.success) {
                successCount++;
                console.log(`✅ 이슈 #${cardIndex + 1} 등록 성공:`, response.data);
                
                // localStorage에 저장 (즉시 UI 반영)
                const savedIssues = JSON.parse(localStorage.getItem('eventbet_issues') || '[]');
                savedIssues.push(response.data.issue);
                localStorage.setItem('eventbet_issues', JSON.stringify(savedIssues));
                console.log(`💾 localStorage 저장 완료: ${savedIssues.length}개 이슈`);
            } else {
                failCount++;
                errors.push(`이슈 #${cardIndex + 1}: ${response.data.error || '알 수 없는 오류'}`);
                console.error(`❌ 이슈 #${cardIndex + 1} 등록 실패:`, response.data.error);
            }
        } catch (error) {
            failCount++;
            errors.push(`이슈 #${cardIndex + 1}: ${error.message || 'API 오류'}`);
            console.error(`❌ 이슈 #${cardIndex + 1} API 오류:`, error);
        }
    }
    
    // 결과 알림
    let message = '';
    if (successCount > 0) {
        message = `✅ 완료!\n\n성공: ${successCount}개\n실패: ${failCount}개`;
        if (errors.length > 0) {
            message += `\n\n오류:\n${errors.slice(0, 3).join('\n')}`;
        }
        message += '\n\n이슈 관리 섹션에서 확인하세요!';
        alert(message);
        
        // 모달 닫기
        if (typeof closeBatchIssueModal === 'function') {
            closeBatchIssueModal();
        }
        
        // 즉시 DOM 업데이트 (loadRegisteredIssues 대체)
        updateRegisteredIssuesUI();
    } else {
        message = `❌ 등록 실패\n\n모든 이슈 등록이 실패했습니다.`;
        if (errors.length > 0) {
            message += `\n\n오류:\n${errors.slice(0, 5).join('\n')}`;
        }
        alert(message);
    }
}

// ========== 등록된 이슈 UI 업데이트 (즉시 반영) ==========
function updateRegisteredIssuesUI() {
    const issues = JSON.parse(localStorage.getItem('eventbet_issues') || '[]');
    const tbody = document.getElementById('registered-issues-list');
    
    if (!tbody) {
        console.error('❌ registered-issues-list 요소를 찾을 수 없습니다');
        return;
    }
    
    console.log(`💾 localStorage에서 ${issues.length}개 이슈 로드됨`);
    
    if (issues.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center text-gray-500 py-8">등록된 이슈가 없습니다.</td></tr>';
        return;
    }
    
    tbody.innerHTML = issues.map((issue, index) => `
        <tr>
            <td>${index + 1}</td>
            <td class="max-w-xs truncate">${issue.title_ko || issue.title || 'N/A'}</td>
            <td>${issue.category || 'N/A'}</td>
            <td>
                ${issue.language === 'ko' ? '🇰🇷 한국어' : 
                  issue.language === 'en' ? '🇺🇸 English' : 
                  issue.language === 'zh' ? '🇨🇳 中文' : 
                  issue.language === 'ja' ? '🇯🇵 日本語' : 'N/A'}
            </td>
            <td>${issue.expireDate ? new Date(issue.expireDate).toLocaleDateString('ko-KR') : 'N/A'}</td>
            <td class="text-green-600 font-bold">${(issue.yesBet || 0).toLocaleString()} USDT</td>
            <td class="text-red-600 font-bold">${(issue.noBet || 0).toLocaleString()} USDT</td>
            <td>
                <span class="px-2 py-1 rounded text-xs ${issue.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                    ${issue.status === 'active' ? '진행중' : '종료됨'}
                </span>
            </td>
            <td>
                <button onclick="editRegisteredIssue(${index})" class="btn-warning mr-2">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteRegisteredIssue(${index})" class="btn-danger">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    console.log(`✅ UI 업데이트 완료: ${issues.length}개 이슈 표시됨`);
}

// ========== 메인 사이트 확인 (등록된 이슈 불러오기) ==========
async function registerAllIssuesToMainSite() {
    console.log('=== 메인 사이트 확인 시작 ===');
    
    try {
        // API에서 등록된 이슈 가져오기
        const response = await axios.get('/api/issues');
        
        if (response.data.success) {
            const issues = response.data.issues || [];
            
            if (issues.length === 0) {
                alert('❌ 등록된 이슈가 없습니다.\n\n먼저 "이슈 일괄 등록" 버튼으로 이슈를 등록해주세요.');
                return;
            }
            
            alert(`✅ 확인 완료!\n\n총 ${issues.length}개의 이슈가 서버에 등록되어 있습니다.\n\n메인 페이지를 새로고침(Ctrl+Shift+R)하여 확인하세요!`);
            
            console.log(`✅ ${issues.length}개 이슈 확인됨:`, issues);
        } else {
            alert('❌ 이슈 확인 실패\n\n' + (response.data.error || '알 수 없는 오류'));
        }
        
    } catch (error) {
        console.error('메인 사이트 확인 실패:', error);
        alert('❌ 확인 실패\n\n' + error.message);
    }
}

// 이전 함수명 호환성
window.registerAllIssuesToMainSiteNow = registerAllIssuesToMainSite;

console.log('✅ Admin API functions loaded');
