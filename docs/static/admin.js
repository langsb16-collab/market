// EventBET Admin Panel - GitHub JSON Based System
// PC와 모바일 간 자동 동기화 (GitHub Repository 기반)

// ============================================
// 📌 공지 관리 (최대 30개) - GitHub JSON 기반
// ============================================

async function loadNotices() {
    try {
        const response = await fetch('/data/notices.json?_=' + Date.now());
        const notices = await response.json();
        const tbody = document.getElementById('notices-list');
        
        if (notices.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500">등록된 공지가 없습니다.</td></tr>';
            return;
        }
        
        tbody.innerHTML = notices.map((notice, index) => `
            <tr>
                <td>${index + 1}</td>
                <td class="font-semibold">${notice.title}</td>
                <td class="text-sm text-gray-600">${notice.content.substring(0, 50)}...</td>
                <td class="text-sm">${new Date(notice.createdAt).toLocaleDateString('ko-KR')}</td>
                <td>
                    <button onclick="editNotice(${index})" class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm mr-1">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteNotice(${index})" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Failed to load notices:', error);
        const tbody = document.getElementById('notices-list');
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-red-500">⚠️ 공지 로드 실패</td></tr>';
    }
}

async function openNoticeModal(index = null) {
    const modal = document.getElementById('notice-modal');
    modal.classList.add('active');
    
    if (index !== null) {
        try {
            const response = await fetch('/data/notices.json?_=' + Date.now());
            const notices = await response.json();
            const notice = notices[index];
            document.getElementById('notice-id').value = index;
            document.getElementById('notice-title').value = notice.title;
            document.getElementById('notice-content').value = notice.content;
            document.getElementById('notice-youtube').value = notice.youtubeUrl || '';
            if (notice.imageUrl) {
                document.getElementById('notice-image-preview').src = notice.imageUrl;
                document.getElementById('notice-image-preview').classList.remove('hidden');
            }
        } catch (error) {
            console.error('Failed to load notice:', error);
            alert('⚠️ 공지 로드 실패: ' + error.message);
        }
    } else {
        document.getElementById('notice-id').value = '';
        document.getElementById('notice-title').value = '';
        document.getElementById('notice-content').value = '';
        document.getElementById('notice-youtube').value = '';
        document.getElementById('notice-image-preview').classList.add('hidden');
    }
}

function closeNoticeModal() {
    document.getElementById('notice-modal').classList.remove('active');
}

function handleNoticeImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        alert('⚠️ 이미지 크기는 5MB 이하여야 합니다.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('notice-image-preview');
        preview.src = e.target.result;
        preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

async function saveNotice(event) {
    event.preventDefault();
    
    // GitHub API 설정 확인
    if (!window.githubAPI.isConfigured()) {
        alert('⚠️ GitHub 설정이 필요합니다. 설정 메뉴에서 GitHub Token을 입력해주세요.');
        return;
    }
    
    try {
        // 현재 공지 목록 가져오기
        const response = await fetch('/data/notices.json?_=' + Date.now());
        const notices = await response.json();
        
        const index = document.getElementById('notice-id').value;
        const title = document.getElementById('notice-title').value;
        const content = document.getElementById('notice-content').value;
        const youtubeUrl = document.getElementById('notice-youtube').value;
        const preview = document.getElementById('notice-image-preview');
        const imageUrl = preview.classList.contains('hidden') ? '' : preview.src;
        
        const noticeData = {
            title,
            content,
            imageUrl,
            youtubeUrl,
            createdAt: new Date().toISOString()
        };
        
        if (index === '') {
            // 새 공지 추가
            if (notices.length >= 30) {
                alert('⚠️ 최대 30개의 공지만 등록할 수 있습니다.');
                return;
            }
            notices.unshift(noticeData); // 최신 공지를 맨 위에
        } else {
            // 기존 공지 수정
            notices[parseInt(index)] = noticeData;
        }
        
        // GitHub에 저장
        await window.githubAPI.updateFile(
            'docs/data/notices.json',
            notices,
            index === '' ? '새 공지 추가' : '공지 수정'
        );
        
        closeNoticeModal();
        loadNotices();
        alert('✅ 공지가 저장되었습니다. (GitHub Pages 반영까지 1-2분 소요)');
    } catch (error) {
        console.error('Failed to save notice:', error);
        alert('⚠️ 공지 저장 실패: ' + error.message);
    }
}

async function deleteNotice(index) {
    if (!confirm('정말 이 공지를 삭제하시겠습니까?')) return;
    
    if (!window.githubAPI.isConfigured()) {
        alert('⚠️ GitHub 설정이 필요합니다.');
        return;
    }
    
    try {
        const response = await fetch('/data/notices.json?_=' + Date.now());
        const notices = await response.json();
        
        notices.splice(index, 1);
        
        await window.githubAPI.updateFile(
            'docs/data/notices.json',
            notices,
            '공지 삭제'
        );
        
        loadNotices();
        alert('✅ 공지가 삭제되었습니다.');
    } catch (error) {
        console.error('Failed to delete notice:', error);
        alert('⚠️ 공지 삭제 실패: ' + error.message);
    }
}

function editNotice(index) {
    openNoticeModal(index);
}

// ============================================
// 📌 배너 관리 (최대 3개) - GitHub JSON 기반
// ============================================

async function loadBanners() {
    try {
        const response = await fetch('/data/banners.json?_=' + Date.now());
        const banners = await response.json();
        const container = document.getElementById('banners-list');
        
        if (banners.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">등록된 배너가 없습니다.</p>';
            return;
        }
        
        container.innerHTML = banners.map((banner, index) => `
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="font-bold text-lg">${banner.title}</h3>
                    <div class="flex gap-2">
                        <button onclick="editBanner(${index})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-edit"></i> 수정
                        </button>
                        <button onclick="deleteBanner(${index})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-trash"></i> 삭제
                        </button>
                    </div>
                </div>
                ${banner.imageUrl ? `<img src="${banner.imageUrl}" class="w-full h-48 object-cover rounded-lg mb-2">` : ''}
                ${banner.link ? `<p class="text-sm text-gray-600"><i class="fas fa-link"></i> ${banner.link}</p>` : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load banners:', error);
    }
}

async function openBannerModal(index = null) {
    const modal = document.getElementById('banner-modal');
    modal.classList.add('active');
    
    if (index !== null) {
        try {
            const response = await fetch('/data/banners.json?_=' + Date.now());
            const banners = await response.json();
            const banner = banners[index];
            document.getElementById('banner-id').value = index;
            document.getElementById('banner-title').value = banner.title;
            document.getElementById('banner-link').value = banner.link || '';
            if (banner.imageUrl) {
                document.getElementById('banner-preview').src = banner.imageUrl;
                document.getElementById('banner-preview').classList.remove('hidden');
            }
        } catch (error) {
            console.error('Failed to load banner:', error);
        }
    } else {
        document.getElementById('banner-id').value = '';
        document.getElementById('banner-title').value = '';
        document.getElementById('banner-link').value = '';
        document.getElementById('banner-preview').classList.add('hidden');
    }
}

function closeBannerModal() {
    document.getElementById('banner-modal').classList.remove('active');
}

function handleBannerImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        alert('⚠️ 이미지 크기는 5MB 이하여야 합니다.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('banner-preview');
        preview.src = e.target.result;
        preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

async function saveBanner(event) {
    event.preventDefault();
    
    if (!window.githubAPI.isConfigured()) {
        alert('⚠️ GitHub 설정이 필요합니다.');
        return;
    }
    
    try {
        const response = await fetch('/data/banners.json?_=' + Date.now());
        const banners = await response.json();
        
        const index = document.getElementById('banner-id').value;
        const title = document.getElementById('banner-title').value;
        const link = document.getElementById('banner-link').value;
        const preview = document.getElementById('banner-preview');
        const imageUrl = preview.classList.contains('hidden') ? '' : preview.src;
        
        if (!imageUrl) {
            alert('⚠️ 이미지를 업로드해주세요.');
            return;
        }
        
        const bannerData = { title, link, imageUrl, createdAt: new Date().toISOString() };
        
        if (index === '') {
            if (banners.length >= 3) {
                alert('⚠️ 최대 3개의 배너만 등록할 수 있습니다.');
                return;
            }
            banners.push(bannerData);
        } else {
            banners[parseInt(index)] = bannerData;
        }
        
        await window.githubAPI.updateFile(
            'docs/data/banners.json',
            banners,
            index === '' ? '새 배너 추가' : '배너 수정'
        );
        
        closeBannerModal();
        loadBanners();
        alert('✅ 배너가 저장되었습니다.');
    } catch (error) {
        console.error('Failed to save banner:', error);
        alert('⚠️ 배너 저장 실패: ' + error.message);
    }
}

async function deleteBanner(index) {
    if (!confirm('정말 이 배너를 삭제하시겠습니까?')) return;
    
    if (!window.githubAPI.isConfigured()) {
        alert('⚠️ GitHub 설정이 필요합니다.');
        return;
    }
    
    try {
        const response = await fetch('/data/banners.json?_=' + Date.now());
        const banners = await response.json();
        
        banners.splice(index, 1);
        
        await window.githubAPI.updateFile(
            'docs/data/banners.json',
            banners,
            '배너 삭제'
        );
        
        loadBanners();
        alert('✅ 배너가 삭제되었습니다.');
    } catch (error) {
        console.error('Failed to delete banner:', error);
        alert('⚠️ 배너 삭제 실패: ' + error.message);
    }
}

function editBanner(index) {
    openBannerModal(index);
}

// ============================================
// 📌 팝업 관리 - GitHub JSON 기반
// ============================================

async function loadPopups() {
    try {
        const response = await fetch('/data/popups.json?_=' + Date.now());
        const popups = await response.json();
        const container = document.getElementById('popups-list');
        
        if (popups.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">등록된 팝업이 없습니다.</p>';
            return;
        }
        
        container.innerHTML = popups.map((popup, index) => `
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h3 class="font-bold text-lg">${popup.title}</h3>
                        <p class="text-sm text-gray-600">
                            위치: 위(${popup.top}cm), 왼쪽(${popup.left}cm)<br>
                            크기: ${popup.width}x${popup.height}px<br>
                            ${popup.startDate && popup.endDate ? `기간: ${popup.startDate} ~ ${popup.endDate}` : ''}
                        </p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="editPopup(${index})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-edit"></i> 수정
                        </button>
                        <button onclick="deletePopup(${index})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                            <i class="fas fa-trash"></i> 삭제
                        </button>
                    </div>
                </div>
                ${popup.imageUrl ? `<img src="${popup.imageUrl}" class="w-full h-48 object-cover rounded-lg">` : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load popups:', error);
    }
}

async function openPopupModal(index = null) {
    const modal = document.getElementById('popup-modal');
    modal.classList.add('active');
    
    if (index !== null) {
        try {
            const response = await fetch('/data/popups.json?_=' + Date.now());
            const popups = await response.json();
            const popup = popups[index];
            document.getElementById('popup-id').value = index;
            document.getElementById('popup-title').value = popup.title;
            document.getElementById('popup-top').value = popup.top || '';
            document.getElementById('popup-left').value = popup.left || '';
            document.getElementById('popup-width').value = popup.width || 600;
            document.getElementById('popup-height').value = popup.height || 400;
            document.getElementById('popup-start-date').value = popup.startDate || '';
            document.getElementById('popup-end-date').value = popup.endDate || '';
            if (popup.imageUrl) {
                document.getElementById('popup-preview').src = popup.imageUrl;
                document.getElementById('popup-preview').classList.remove('hidden');
            }
        } catch (error) {
            console.error('Failed to load popup:', error);
        }
    } else {
        document.getElementById('popup-id').value = '';
        document.getElementById('popup-title').value = '';
        document.getElementById('popup-top').value = '';
        document.getElementById('popup-left').value = '';
        document.getElementById('popup-width').value = 600;
        document.getElementById('popup-height').value = 400;
        document.getElementById('popup-start-date').value = '';
        document.getElementById('popup-end-date').value = '';
        document.getElementById('popup-preview').classList.add('hidden');
    }
}

function closePopupModal() {
    document.getElementById('popup-modal').classList.remove('active');
}

function handlePopupImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        alert('⚠️ 이미지 크기는 5MB 이하여야 합니다.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('popup-preview');
        preview.src = e.target.result;
        preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

async function savePopup(event) {
    event.preventDefault();
    
    if (!window.githubAPI.isConfigured()) {
        alert('⚠️ GitHub 설정이 필요합니다.');
        return;
    }
    
    try {
        const response = await fetch('/data/popups.json?_=' + Date.now());
        const popups = await response.json();
        
        const index = document.getElementById('popup-id').value;
        const title = document.getElementById('popup-title').value;
        const top = parseFloat(document.getElementById('popup-top').value) || 10;
        const left = parseFloat(document.getElementById('popup-left').value) || 10;
        const width = parseInt(document.getElementById('popup-width').value) || 600;
        const height = parseInt(document.getElementById('popup-height').value) || 400;
        const startDate = document.getElementById('popup-start-date').value;
        const endDate = document.getElementById('popup-end-date').value;
        const preview = document.getElementById('popup-preview');
        const imageUrl = preview.classList.contains('hidden') ? '' : preview.src;
        
        if (!imageUrl) {
            alert('⚠️ 이미지를 업로드해주세요.');
            return;
        }
        
        const popupData = {
            title, top, left, width, height, startDate, endDate, imageUrl,
            createdAt: new Date().toISOString()
        };
        
        if (index === '') {
            popups.push(popupData);
        } else {
            popups[parseInt(index)] = popupData;
        }
        
        await window.githubAPI.updateFile(
            'docs/data/popups.json',
            popups,
            index === '' ? '새 팝업 추가' : '팝업 수정'
        );
        
        closePopupModal();
        loadPopups();
        alert('✅ 팝업이 저장되었습니다.');
    } catch (error) {
        console.error('Failed to save popup:', error);
        alert('⚠️ 팝업 저장 실패: ' + error.message);
    }
}

async function deletePopup(index) {
    if (!confirm('정말 이 팝업을 삭제하시겠습니까?')) return;
    
    if (!window.githubAPI.isConfigured()) {
        alert('⚠️ GitHub 설정이 필요합니다.');
        return;
    }
    
    try {
        const response = await fetch('/data/popups.json?_=' + Date.now());
        const popups = await response.json();
        
        popups.splice(index, 1);
        
        await window.githubAPI.updateFile(
            'docs/data/popups.json',
            popups,
            '팝업 삭제'
        );
        
        loadPopups();
        alert('✅ 팝업이 삭제되었습니다.');
    } catch (error) {
        console.error('Failed to delete popup:', error);
        alert('⚠️ 팝업 삭제 실패: ' + error.message);
    }
}

function editPopup(index) {
    openPopupModal(index);
}

// ============================================
// 📌 섹션 전환
// ============================================

function showSection(sectionName) {
    // 모든 섹션 숨기기
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // 모든 사이드바 항목 비활성화
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 선택한 섹션 표시
    document.getElementById(sectionName + '-section').classList.add('active');
    
    // 선택한 사이드바 항목 활성화
    event.target.classList.add('active');
    
    // 데이터 로드
    if (sectionName === 'banners') loadBanners();
    if (sectionName === 'notices') loadNotices();
    if (sectionName === 'popups') loadPopups();
    if (sectionName === 'settings') loadSettings();
}

// ============================================
// 📌 GitHub 설정
// ============================================

function loadSettings() {
    const token = localStorage.getItem('github_token') || '';
    const owner = localStorage.getItem('github_owner') || '';
    const repo = localStorage.getItem('github_repo') || '';
    
    document.getElementById('github-token').value = token ? '••••••••••••••••' : '';
    document.getElementById('github-owner').value = owner;
    document.getElementById('github-repo').value = repo;
    
    const statusDiv = document.getElementById('github-status');
    if (token && owner && repo) {
        statusDiv.innerHTML = '<p class="text-green-600"><i class="fas fa-check-circle"></i> GitHub 연동 완료</p>';
    } else {
        statusDiv.innerHTML = '<p class="text-red-600"><i class="fas fa-times-circle"></i> GitHub 설정이 필요합니다</p>';
    }
}

function saveSettings(event) {
    event.preventDefault();
    
    const tokenInput = document.getElementById('github-token').value;
    const owner = document.getElementById('github-owner').value;
    const repo = document.getElementById('github-repo').value;
    
    // 토큰이 가려진 상태면 기존 값 유지
    const token = tokenInput.includes('•') ? localStorage.getItem('github_token') : tokenInput;
    
    if (!token || !owner || !repo) {
        alert('⚠️ 모든 항목을 입력해주세요.');
        return;
    }
    
    window.githubAPI.saveConfig(token, owner, repo);
    alert('✅ GitHub 설정이 저장되었습니다.');
    loadSettings();
}

// ============================================
// 📌 이슈 관리 (일괄 등록)
// ============================================

let issueFormCount = 0;
const MAX_ISSUES = 5;

// 카테고리 목록
const CATEGORIES = [
    { id: 1, slug: 'politics', name_ko: '정치', icon: '🏛️' },
    { id: 2, slug: 'sports', name_ko: '스포츠', icon: '⚽' },
    { id: 3, slug: 'technology', name_ko: '기술', icon: '💻' },
    { id: 4, slug: 'cryptocurrency', name_ko: '암호화폐', icon: '₿' },
    { id: 5, slug: 'entertainment', name_ko: '엔터테인먼트', icon: '🎬' },
    { id: 6, slug: 'economy', name_ko: '경제', icon: '📈' },
    { id: 7, slug: 'science', name_ko: '과학', icon: '🔬' },
    { id: 8, slug: 'climate', name_ko: '기후', icon: '🌍' }
];

function showBulkIssueModal() {
    const modal = document.getElementById('bulk-issue-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // 초기 폼 1개 추가
    issueFormCount = 0;
    document.getElementById('issues-container').innerHTML = '';
    addIssueForm();
}

function closeBulkIssueModal() {
    const modal = document.getElementById('bulk-issue-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    issueFormCount = 0;
    document.getElementById('issues-container').innerHTML = '';
}

function addIssueForm() {
    if (issueFormCount >= MAX_ISSUES) {
        alert(`최대 ${MAX_ISSUES}개까지만 등록할 수 있습니다.`);
        return;
    }
    
    issueFormCount++;
    const container = document.getElementById('issues-container');
    const formId = `issue-form-${issueFormCount}`;
    
    const formHTML = `
        <div id="${formId}" class="border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
            <div class="flex justify-between items-center mb-4">
                <h4 class="text-lg font-bold text-gray-800">
                    <i class="fas fa-file-alt mr-2 text-blue-600"></i>
                    이슈 #${issueFormCount}
                </h4>
                <button type="button" onclick="removeIssueForm('${formId}')" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <!-- 카테고리 선택 -->
            <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="fas fa-folder mr-1 text-purple-600"></i>카테고리 *
                </label>
                <select name="category_${issueFormCount}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    ${CATEGORIES.map(cat => `<option value="${cat.slug}">${cat.icon} ${cat.name_ko}</option>`).join('')}
                </select>
            </div>
            
            <!-- 제목 (4개 언어) -->
            <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="fas fa-heading mr-1 text-green-600"></i>제목 (4개 언어 필수) *
                </label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs text-gray-600 mb-1">🇰🇷 한국어</label>
                        <input type="text" name="title_ko_${issueFormCount}" required placeholder="예: 비트코인 $150K 돌파?" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                    </div>
                    <div>
                        <label class="block text-xs text-gray-600 mb-1">🇬🇧 English</label>
                        <input type="text" name="title_en_${issueFormCount}" required placeholder="e.g., Bitcoin reaches $150K?" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                    </div>
                    <div>
                        <label class="block text-xs text-gray-600 mb-1">🇨🇳 中文</label>
                        <input type="text" name="title_zh_${issueFormCount}" required placeholder="例如：比特币突破$150K？" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                    </div>
                    <div>
                        <label class="block text-xs text-gray-600 mb-1">🇯🇵 日本語</label>
                        <input type="text" name="title_ja_${issueFormCount}" required placeholder="例：ビットコイン$150K突破？" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                    </div>
                </div>
            </div>
            
            <!-- 내용 설명 -->
            <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                    <i class="fas fa-align-left mr-1 text-blue-600"></i>내용 설명 (선택)
                </label>
                <textarea name="description_${issueFormCount}" rows="2" placeholder="이슈에 대한 간단한 설명..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"></textarea>
            </div>
            
            <!-- 결론 결정 기간 & 배팅 설정 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        <i class="fas fa-calendar mr-1 text-red-600"></i>결론 결정 기간 *
                    </label>
                    <input type="date" name="resolve_date_${issueFormCount}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        <i class="fas fa-percentage mr-1 text-green-600"></i>Yes 배팅 비율 (%)
                    </label>
                    <input type="number" name="yes_prob_${issueFormCount}" min="0" max="100" value="50" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        <i class="fas fa-dollar-sign mr-1 text-yellow-600"></i>전체 배팅액 ($)
                    </label>
                    <input type="number" name="total_volume_${issueFormCount}" min="1000" value="100000" step="1000" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', formHTML);
}

function removeIssueForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.remove();
        issueFormCount--;
    }
}

function clearAllIssues() {
    if (confirm('모든 입력 내용을 초기화하시겠습니까?')) {
        issueFormCount = 0;
        document.getElementById('issues-container').innerHTML = '';
        addIssueForm();
    }
}

async function submitBulkIssues(event) {
    event.preventDefault();
    
    if (issueFormCount === 0) {
        alert('등록할 이슈가 없습니다.');
        return;
    }
    
    const formData = new FormData(event.target);
    const issues = [];
    
    // 각 이슈 폼에서 데이터 수집
    for (let i = 1; i <= issueFormCount; i++) {
        const category = formData.get(`category_${i}`);
        const titleKo = formData.get(`title_ko_${i}`);
        const titleEn = formData.get(`title_en_${i}`);
        const titleZh = formData.get(`title_zh_${i}`);
        const titleJa = formData.get(`title_ja_${i}`);
        const description = formData.get(`description_${i}`) || '';
        const resolveDate = formData.get(`resolve_date_${i}`);
        const yesProb = parseInt(formData.get(`yes_prob_${i}`)) / 100;
        const totalVolume = parseInt(formData.get(`total_volume_${i}`));
        
        if (titleKo && titleEn && titleZh && titleJa && resolveDate) {
            const selectedCategory = CATEGORIES.find(c => c.slug === category);
            
            issues.push({
                category_id: selectedCategory.id,
                category_slug: category,
                title_ko: titleKo,
                title_en: titleEn,
                title_zh: titleZh,
                title_ja: titleJa,
                description_ko: description || `${titleKo}에 대한 예측 마켓입니다.`,
                description_en: description || `Prediction market for ${titleEn}.`,
                description_zh: description || `关于${titleZh}的预测市场。`,
                description_ja: description || `${titleJa}についての予測市場です。`,
                resolve_date: resolveDate,
                total_volume: totalVolume,
                outcomes: [
                    { name: '예', probability: yesProb },
                    { name: '아니오', probability: 1 - yesProb }
                ]
            });
        }
    }
    
    if (issues.length === 0) {
        alert('유효한 이슈 데이터가 없습니다.');
        return;
    }
    
    // localStorage에 저장 (기존 이슈와 병합)
    try {
        const existingIssues = JSON.parse(localStorage.getItem('admin_issues') || '[]');
        const mergedIssues = [...existingIssues, ...issues];
        localStorage.setItem('admin_issues', JSON.stringify(mergedIssues));
        
        alert(`✅ ${issues.length}개의 이슈가 성공적으로 등록되었습니다!`);
        closeBulkIssueModal();
        loadAdminIssues();
    } catch (error) {
        console.error('Failed to save issues:', error);
        alert('❌ 이슈 저장에 실패했습니다.');
    }
}

function loadAdminIssues() {
    try {
        const issues = JSON.parse(localStorage.getItem('admin_issues') || '[]');
        const container = document.getElementById('issues-list');
        
        if (issues.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 text-gray-500">
                    <i class="fas fa-inbox text-6xl mb-4 opacity-50"></i>
                    <p class="text-lg">등록된 이슈가 없습니다.</p>
                    <p class="text-sm mt-2">이슈 일괄 등록 버튼을 클릭하여 이슈를 추가하세요.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">#</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">카테고리</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">제목 (한국어)</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">결론 기간</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">배팅액</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">관리</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${issues.map((issue, index) => {
                            const category = CATEGORIES.find(c => c.slug === issue.category_slug);
                            return `
                                <tr class="hover:bg-gray-50">
                                    <td class="px-4 py-3 text-sm">${index + 1}</td>
                                    <td class="px-4 py-3 text-sm">${category ? category.icon : ''} ${category ? category.name_ko : issue.category_slug}</td>
                                    <td class="px-4 py-3 text-sm font-semibold">${issue.title_ko}</td>
                                    <td class="px-4 py-3 text-sm">${issue.resolve_date}</td>
                                    <td class="px-4 py-3 text-sm">$${issue.total_volume.toLocaleString()}</td>
                                    <td class="px-4 py-3 text-sm">
                                        <button onclick="deleteAdminIssue(${index})" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="mt-6 flex justify-between items-center">
                <p class="text-sm text-gray-600">총 <span class="font-bold text-blue-600">${issues.length}</span>개의 이슈</p>
                <button onclick="syncIssuesToMainSite()" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    <i class="fas fa-sync mr-2"></i>메인 사이트에 반영
                </button>
            </div>
        `;
    } catch (error) {
        console.error('Failed to load issues:', error);
    }
}

function deleteAdminIssue(index) {
    if (!confirm('이 이슈를 삭제하시겠습니까?')) return;
    
    try {
        const issues = JSON.parse(localStorage.getItem('admin_issues') || '[]');
        issues.splice(index, 1);
        localStorage.setItem('admin_issues', JSON.stringify(issues));
        loadAdminIssues();
        alert('✅ 이슈가 삭제되었습니다.');
    } catch (error) {
        console.error('Failed to delete issue:', error);
        alert('❌ 이슈 삭제에 실패했습니다.');
    }
}

function syncIssuesToMainSite() {
    try {
        const adminIssues = JSON.parse(localStorage.getItem('admin_issues') || '[]');
        
        if (adminIssues.length === 0) {
            alert('반영할 이슈가 없습니다.');
            return;
        }
        
        // JSON 파일로 다운로드
        const dataStr = JSON.stringify(adminIssues, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'admin_issues.json';
        link.click();
        
        alert(`✅ ${adminIssues.length}개의 이슈가 JSON 파일로 다운로드되었습니다.\n\n파일을 /docs/data/issues.json 경로에 업로드하고 GitHub에 푸시하세요.`);
    } catch (error) {
        console.error('Failed to sync issues:', error);
        alert('❌ 이슈 동기화에 실패했습니다.');
    }
}

// ============================================
// 📌 초기화
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    loadNotices();
    loadBanners();
    loadPopups();
    loadSettings();
    loadAdminIssues();
});
