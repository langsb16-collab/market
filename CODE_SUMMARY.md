# 📋 핵심 코드 요약

## 1️⃣ 메인 사이트: app.js 핵심 함수들

### 🔧 유틸리티 함수 (라인 17-74)

```javascript
// ========== 카테고리 매핑 (한글 ↔ 영문 통일) ==========
const CATEGORY_MAP = {
  "전체": "all",
  "정치": "politics",
  "장치": "politics",  // 오타 대응
  "스포츠": "sports",
  "기술": "technology",
  "암호화폐": "cryptocurrency",
  "crypto": "cryptocurrency",
  "엔터테인먼트": "entertainment",
  "경제": "economy",
  "과학": "science",
  "기후": "climate",
  // 영문은 그대로 통과
  "all": "all",
  "politics": "politics",
  "sports": "sports",
  "technology": "technology",
  "cryptocurrency": "cryptocurrency",
  "entertainment": "entertainment",
  "economy": "economy",
  "science": "science",
  "climate": "climate"
};

// ========== 숫자 파싱 유틸리티 (콤마, 문자 제거) ==========
function toNumber(v) {
  if (v == null) return 0;
  // "29,802 USDT" → "29802"
  const n = String(v).replace(/[^\d.]/g, "");
  return n ? Number(n) : 0;
}

// ========== Yes/No 퍼센트 계산 (실제 베팅액 기반) ==========
function calcYesNoPercent(issue) {
  // 여러 필드명 지원 (yesAmount, yesBet, yes_pool 등)
  const yes = toNumber(issue.yesAmount ?? issue.yesBet ?? issue.yes_pool ?? 0);
  const no = toNumber(issue.noAmount ?? issue.noBet ?? issue.no_pool ?? 0);
  
  const total = yes + no;
  if (total <= 0) {
    console.warn('EventBET: Issue has zero total bet', issue.id, issue.title);
    return { yesPct: "50.0", noPct: "50.0", yes: 0, no: 0, total: 0 };
  }
  
  const yesPct = (yes / total * 100).toFixed(1);
  const noPct = (no / total * 100).toFixed(1);
  
  console.log('EventBET: Calculated %', issue.id, 'Yes:', yesPct + '%', 'No:', noPct + '%', 'Total:', total);
  
  return { yesPct, noPct, yes, no, total };
}

// ========== 이슈 정규화 함수 (카테고리 키 통일) ==========
function normalizeIssue(issue) {
  const cat = issue.categoryKey || issue.category_slug || issue.category;
  const categoryKey = CATEGORY_MAP[cat] || cat || "technology";
  return { ...issue, categoryKey };
}
```

---

### 🎨 카테고리 렌더링 함수 (라인 624-660)

```javascript
function renderCategories() {
    const container = document.getElementById('categories-container')
    if (!container) return
    
    const allCategory = {
        id: 'all',
        slug: 'all',
        name_ko: '전체',
        name_en: 'All',
        name_zh: '全部',
        name_ja: 'すべて',
        icon: '📋'
    }
    
    const allCategories = [allCategory, ...categories]
    
    container.innerHTML = allCategories.map(category => {
        const isActive = currentCategory === category.slug
        
        // ✅ categoryKey로 카운트 (정규화된 키 사용)
        const categoryCount = category.slug === 'all' 
            ? events.length 
            : events.filter(e => (e.categoryKey || e.category_slug) === category.slug).length
        
        console.log('EventBET: Category count', category.slug, ':', categoryCount);
        
        return `
        <div class="bg-white rounded-lg shadow-sm p-2 sm:p-3 hover:shadow-md transition-shadow cursor-pointer ${isActive ? 'ring-2 ring-blue-500' : ''}"
             onclick="filterByCategory('${category.slug}')">
            <div class="text-center">
                <div class="text-xl sm:text-2xl mb-1">${category.icon}</div>
                <h4 class="text-xs sm:text-sm font-semibold text-gray-900">${getCategoryName(category)}</h4>
                <span class="text-xs text-gray-500">${categoryCount}</span>
            </div>
        </div>
        `
    }).join('')
}
```

---

### 🃏 마켓 카드 렌더링 함수 (라인 711-791, 핵심 부분만)

```javascript
function renderMarkets() {
    console.log('EventBET: renderMarkets() called')
    const container = document.getElementById('markets-container')
    if (!container) {
        console.error('EventBET: markets-container not found!')
        return
    }
    console.log('EventBET: markets-container found, rendering...')
    
    const filteredEvents = getFilteredEvents()
    const eventsToShow = filteredEvents.slice(0, displayedMarkets)
    
    const html = eventsToShow.map(event => {
        const category = categories.find(c => c.id === event.category_id)
        const eventImage = getEventImage(event.category_slug, event.id)
        const hasOutcomes = event.outcomes && event.outcomes.length > 0
        
        let card = '<div class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all market-card" onclick="openBetModal(' + event.id + ')">'
        
        // ... (헤더 부분 생략)
        
        if (hasOutcomes) {
            // ✅ 실제 베팅액 기반으로 퍼센트 계산
            const percentCalc = calcYesNoPercent(event);
            
            card += '<div class="grid grid-cols-2 gap-1.5">'
            event.outcomes.slice(0, 2).forEach((outcome, idx) => {
                const isYes = outcome.name === '예' || outcome.name.toLowerCase().includes('yes') || outcome.name === '是' || outcome.name === 'はい'
                const isNo = outcome.name === '아니오' || outcome.name.toLowerCase().includes('no') || outcome.name === '否' || outcome.name === 'いいえ'
                const bgColor = isYes ? 'bg-green-50' : isNo ? 'bg-red-50' : 'bg-blue-50'
                const textColor = isYes ? 'text-green-700' : isNo ? 'text-red-700' : 'text-blue-700'
                const percentColor = isYes ? 'text-green-600' : isNo ? 'text-red-600' : 'text-blue-600'
                const barColor = isYes ? 'bg-green-200' : isNo ? 'bg-red-200' : 'bg-blue-200'
                
                // ✅ calcYesNoPercent 결과 사용 (실제 베팅액 기반)
                const displayPercent = isYes ? percentCalc.yesPct : percentCalc.noPct;
                const barWidth = isYes ? parseFloat(percentCalc.yesPct) : parseFloat(percentCalc.noPct);
                
                card += '<div class="relative overflow-hidden rounded border ' + bgColor + ' hover:shadow-md transition-all">'
                card += '<div class="absolute inset-0 ' + barColor + ' opacity-20" style="width: ' + barWidth + '%; transition: width 0.3s ease;"></div>'
                card += '<div class="relative z-10 flex items-center justify-between p-1.5">'
                card += '<span class="font-bold text-xs ' + textColor + '">' + outcome.name + '</span>'
                card += '<span class="text-base font-bold ' + percentColor + '">' + displayPercent + '%</span>'
                card += '</div>'
                card += '</div>'
            })
            card += '</div>'
        }
        
        card += '</div></div></div>'
        return card
    }).join('')
    
    container.innerHTML = html
    
    // Show/hide load more button
    const loadMoreBtn = document.getElementById('load-more-btn')
    if (loadMoreBtn) {
        if (displayedMarkets < filteredEvents.length) {
            loadMoreBtn.classList.remove('hidden')
        } else {
            loadMoreBtn.classList.add('hidden')
        }
    }
    
    updateMarketCount()
}
```

---

## 2️⃣ 관리자 페이지: admin-v2.js 핵심 함수들

### 📊 이슈 목록 로드 함수 (라인 1196-1286)

```javascript
async function loadRegisteredIssues() {
    console.log('=== loadRegisteredIssues 시작 ===');
    const tbody = document.getElementById('registered-issues-list');
    
    if (!tbody) {
        console.error('registered-issues-list 요소를 찾을 수 없습니다.');
        return;
    }
    
    // 로딩 표시
    tbody.innerHTML = '<tr><td colspan="9" class="text-center text-gray-500 py-8"><i class="fas fa-spinner fa-spin mr-2"></i>로딩 중...</td></tr>';
    
    try {
        // 서버 API에서 이슈 가져오기
        const response = await fetch('/api/issues');
        const data = await response.json();
        
        console.log('API 응답:', data);
        
        if (!data.success) {
            console.error('API 오류:', data.error);
            tbody.innerHTML = '<tr><td colspan="9" class="text-center text-red-500 py-8">❌ 서버 오류: ' + (data.error || '알 수 없는 오류') + '</td></tr>';
            return;
        }
        
        const issues = data.issues || [];
        
        if (issues.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center text-gray-500 py-8">등록된 이슈가 없습니다.</td></tr>';
            return;
        }
        
        console.log(`✅ ${issues.length}개 이슈 로드 성공`);
        
        // ✅ 이슈 목록 렌더링 (테이블 행 생성)
        tbody.innerHTML = issues.map((issue, index) => {
            // 다국어 제목 처리
            const title = issue.title_ko || issue.title_en || issue.title || 'N/A';
            
            // 언어 표시
            let languageDisplay = '';
            if (issue.title_ko && issue.title_en && issue.title_zh && issue.title_ja) {
                languageDisplay = '🌍 4개 언어';
            } else if (issue.language) {
                languageDisplay = issue.language === 'ko' ? '🇰🇷 한국어' : 
                                 issue.language === 'en' ? '🇺🇸 English' : 
                                 issue.language === 'zh' ? '🇨🇳 中文' : 
                                 issue.language === 'ja' ? '🇯🇵 日本語' : issue.language;
            } else {
                languageDisplay = 'N/A';
            }
            
            // 만료일 처리
            const expireDate = issue.expire_date || issue.expireDate;
            const expireDateStr = expireDate ? new Date(expireDate).toLocaleDateString('ko-KR') : 'N/A';
            
            // 배팅액 처리
            const yesBet = issue.yes_bet || issue.yesBet || 0;
            const noBet = issue.no_bet || issue.noBet || 0;
            
            // ✅ 테이블 행 HTML 생성 (편집/삭제 버튼 포함)
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td class="max-w-xs truncate" title="${title}">${title}</td>
                    <td>${issue.category || 'N/A'}</td>
                    <td>${languageDisplay}</td>
                    <td>${expireDateStr}</td>
                    <td class="text-green-600 font-bold">${yesBet.toLocaleString()} USDT</td>
                    <td class="text-red-600 font-bold">${noBet.toLocaleString()} USDT</td>
                    <td>
                        <span class="px-2 py-1 rounded text-xs ${issue.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                            ${issue.status === 'active' ? '진행중' : '종료됨'}
                        </span>
                    </td>
                    <td>
                        <!-- ✅ 편집 버튼 (🟠) -->
                        <button onclick="editRegisteredIssue('${issue.id}')" class="btn-warning mr-2">
                            <i class="fas fa-edit"></i>
                        </button>
                        <!-- ✅ 삭제 버튼 (🔴) -->
                        <button onclick="deleteRegisteredIssue('${issue.id}')" class="btn-danger">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
        
    } catch (error) {
        console.error('이슈 로딩 오류:', error);
        tbody.innerHTML = '<tr><td colspan="9" class="text-center text-red-500 py-8">❌ 네트워크 오류: ' + error.message + '</td></tr>';
    }
}
```

---

### ✏️ 이슈 편집 함수 (라인 1288-1292)

```javascript
// 등록된 이슈 편집 (간단 버전 - ID만 표시)
function editRegisteredIssue(issueId) {
    alert(`이슈 편집 기능\n\n이슈 ID: ${issueId}\n\n현재는 삭제 후 재등록으로 수정할 수 있습니다.`);
}
```

---

### 🗑️ 이슈 삭제 함수 (라인 1294-1319)

```javascript
// 등록된 이슈 삭제 (서버 API 사용)
async function deleteRegisteredIssue(issueId) {
    if (!confirm('이 이슈를 삭제하시겠습니까?')) return;
    
    try {
        console.log('이슈 삭제 시도:', issueId);
        
        const response = await fetch(`/api/issues/${issueId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('✅ 이슈가 삭제되었습니다.');
            loadRegisteredIssues(); // 목록 새로고침
        } else {
            alert('❌ 삭제 실패: ' + (result.error || '알 수 없는 오류'));
            console.error('삭제 실패:', result);
        }
    } catch (error) {
        console.error('이슈 삭제 오류:', error);
        alert('❌ 삭제 오류: ' + error.message);
    }
}
```

---

## 🔗 함수 호출 흐름

### 메인 사이트 (app.js)
```
DOMContentLoaded
  → loadAdminIssues() [app-issues.js]
    → fetch('/api/issues')
    → normalizeIssue() 적용
  → renderCategories()
    → categoryKey로 카운트
  → renderMarkets()
    → calcYesNoPercent() 호출
    → 실제 베팅액 기반 퍼센트 표시
```

### 관리자 페이지 (admin-v2.js)
```
showSection('issues')
  → loadRegisteredIssues()
    → fetch('/api/issues')
    → 테이블 행 HTML 생성
      → 편집 버튼: onclick="editRegisteredIssue(id)"
      → 삭제 버튼: onclick="deleteRegisteredIssue(id)"

사용자 클릭
  → editRegisteredIssue(id) → alert 표시
  → deleteRegisteredIssue(id) → fetch DELETE → loadRegisteredIssues() 재호출
```

---

## 📝 핵심 수정 사항 요약

| 문제 | 원인 | 해결 |
|------|------|------|
| **카테고리 카운트 0** | 한글('정치') vs 영문('politics') 불일치 | `CATEGORY_MAP` + `normalizeIssue()` |
| **Yes/No 비율 50/50 고정** | 베팅액 파싱 실패 | `toNumber()` + `calcYesNoPercent()` |
| **편집/삭제 버튼 작동 안 함** | `loadRegisteredIssues()` 함수 누락 | 함수 추가 + HTML 생성 |

---

## ✅ 배포 상태

- **GitHub**: ✅ 푸시 완료 (commit c5a0f32)
- **로컬 빌드**: ✅ 완료 (dist/static/app.js: 45KB)
- **Cloudflare Pages**: ❌ 배포 필요 (현재 서버: 41KB - 오래된 버전)

**다음 단계**: Cloudflare Dashboard에서 수동 배포 또는 API 토큰으로 CLI 배포 필요
