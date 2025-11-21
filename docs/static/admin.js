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
        section.style.display = 'none';
        section.classList.remove('active');
    });
    
    // 모든 사이드바 항목 비활성화
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 선택한 섹션 표시
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
    }
    
    // 선택한 사이드바 항목 활성화
    event.target.classList.add('active');
    
    // 데이터 로드
    if (sectionName === 'banners') loadBanners();
    if (sectionName === 'notices') loadNotices();
    if (sectionName === 'popups') loadPopups();
    if (sectionName === 'issues') loadAdminIssues();
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
    
    // GitHub API 설정 확인
    if (!window.githubAPI.isConfigured()) {
        alert('⚠️ GitHub 설정이 필요합니다. 설정 메뉴에서 GitHub Token을 입력해주세요.');
        return;
    }
    
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
                id: Date.now() + i, // 고유 ID 생성
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
                status: 'pending', // pending, published
                outcomes: [
                    { name: '예', probability: yesProb },
                    { name: '아니오', probability: 1 - yesProb }
                ],
                createdAt: new Date().toISOString()
            });
        }
    }
    
    if (issues.length === 0) {
        alert('유효한 이슈 데이터가 없습니다.');
        return;
    }
    
    // GitHub JSON 파일에 저장 (기존 이슈와 병합)
    try {
        // 현재 이슈 목록 가져오기
        const response = await fetch('/data/issues.json?_=' + Date.now());
        const existingIssues = await response.json();
        
        // 기존 이슈와 병합
        const mergedIssues = [...existingIssues, ...issues];
        
        // GitHub에 저장
        await window.githubAPI.updateFile(
            'docs/data/issues.json',
            mergedIssues,
            `${issues.length}개의 새 이슈 추가`
        );
        
        // 성공 메시지 표시
        alert(
            `✅ ${issues.length}개의 이슈가 성공적으로 등록되었습니다!\n\n` +
            `💡 이슈가 pending 상태로 저장되었습니다.\n` +
            `"메인 사이트에 반영" 버튼을 클릭하여 공개하세요.\n\n` +
            `(GitHub Pages 반영까지 1-2분 소요)`
        );
        
        closeBulkIssueModal();
        loadAdminIssues();
    } catch (error) {
        console.error('Failed to save issues:', error);
        alert('❌ 이슈 저장에 실패했습니다: ' + error.message);
    }
}

// 전역 변수로 필터된 이슈 저장
let filteredIssues = [];
let selectedIssueIndices = new Set();

async function loadAdminIssues() {
    console.log('🔄 loadAdminIssues() started');
    try {
        // GitHub JSON 파일에서 이슈 목록 가져오기
        const response = await fetch('/data/issues.json?_=' + Date.now());
        const issues = await response.json();
        
        // 전역 변수에 저장
        window.adminIssues = issues;
        filteredIssues = issues;
        
        console.log('📊 Total issues loaded:', issues.length);
        
        // 각 이슈의 필드 구조 출력
        if (issues.length > 0) {
            console.log('📋 Issue data samples:');
            issues.forEach((issue, idx) => {
                console.log(`Issue ${idx + 1}:`, {
                    keys: Object.keys(issue),
                    title_ko: issue.title_ko,
                    title: issue.title,
                    name_ko: issue.name_ko,
                    category: issue.category_slug,
                    status: issue.status
                });
            });
        }
        
        selectedIssueIndices.clear(); // 선택 초기화
        
        // 카테고리 필터 옵션 생성
        const categoryFilter = document.getElementById('category-filter');
        console.log('🔍 Category filter element:', !!categoryFilter);
        if (categoryFilter) {
            categoryFilter.innerHTML = '<option value="">전체</option>' + 
                CATEGORIES.map(cat => `<option value="${cat.slug}">${cat.icon} ${cat.name_ko}</option>`).join('');
            console.log('✅ Category filter options created');
        } else {
            console.warn('⚠️ Category filter element not found');
        }
        
        console.log('🎨 Calling renderIssuesList()...');
        renderIssuesList();
        console.log('✅ loadAdminIssues() completed');
    } catch (error) {
        console.error('❌ Failed to load issues:', error);
    }
}

function renderIssuesList() {
    console.log('🎨 renderIssuesList() started');
    const container = document.getElementById('issues-list');
    
    if (!container) {
        console.error('❌ issues-list container not found!');
        return;
    }
    console.log('✅ Container found:', container);
    
    const allIssues = window.adminIssues || [];
    console.log('📊 All issues:', allIssues.length, 'Filtered:', filteredIssues.length);
    
    if (filteredIssues.length === 0) {
        // 전체 이슈가 없는 경우 vs 검색 결과가 없는 경우 구분
        if (allIssues.length === 0) {
            container.innerHTML = `
                <div class="text-center py-16 text-gray-500">
                    <i class="fas fa-inbox text-8xl mb-6 opacity-30"></i>
                    <p class="text-2xl font-bold text-gray-700 mb-2">등록된 이슈가 없습니다</p>
                    <p class="text-base text-gray-600 mb-6">
                        아래 방법 중 하나를 선택하여 이슈를 추가하세요
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button 
                            onclick="showBulkIssueModal()" 
                            class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg flex items-center gap-2"
                        >
                            <i class="fas fa-plus-circle"></i>
                            <span>이슈 일괄 등록</span>
                        </button>
                        <button 
                            onclick="createTestIssues()" 
                            class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-lg flex items-center gap-2"
                        >
                            <i class="fas fa-flask"></i>
                            <span>테스트 데이터 생성</span>
                        </button>
                    </div>
                    <p class="text-sm text-gray-500 mt-6">
                        💡 테스트 데이터는 정치/스포츠/기술 카테고리에 각 1개씩 생성됩니다
                    </p>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="text-center py-12 text-gray-500">
                    <i class="fas fa-search text-6xl mb-4 opacity-50"></i>
                    <p class="text-lg font-semibold text-gray-700">검색 결과가 없습니다</p>
                    <p class="text-sm mt-2 text-gray-600">다른 검색어나 필터를 시도해보세요</p>
                    <button 
                        onclick="document.getElementById('issue-search-input').value=''; document.getElementById('category-filter').value=''; searchIssues();" 
                        class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <i class="fas fa-redo mr-2"></i>검색 초기화
                    </button>
                </div>
            `;
        }
        updateSelectedCount();
        return;
    }
    
    container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="px-4 py-3 text-center">
                            <input 
                                type="checkbox" 
                                id="select-all-checkbox"
                                onchange="toggleSelectAll(this.checked)"
                                class="w-4 h-4 cursor-pointer"
                            >
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">#</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">카테고리</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">제목 (한국어)</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">결론 기간</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">배팅액</th>
                        <th class="px-4 py-3 text-center text-xs font-semibold text-gray-700">상태</th>
                        <th class="px-4 py-3 text-center text-xs font-semibold text-gray-700">관리</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    ${filteredIssues.map((issue, displayIndex) => {
                        // 더 유연한 인덱스 찾기 (다양한 필드명 지원)
                        const originalIndex = allIssues.findIndex(i => {
                            const titleMatch = (i.title_ko || i.title) === (issue.title_ko || issue.title);
                            const categoryMatch = i.category_slug === issue.category_slug;
                            const dateMatch = (i.resolve_date || i.end_date) === (issue.resolve_date || issue.end_date);
                            return titleMatch && categoryMatch && dateMatch;
                        });
                        const category = CATEGORIES.find(c => c.slug === issue.category_slug);
                        const isChecked = selectedIssueIndices.has(originalIndex);
                        return `
                            <tr class="hover:bg-gray-50 ${isChecked ? 'bg-blue-50' : ''}">
                                <td class="px-4 py-3 text-center">
                                    <input 
                                        type="checkbox" 
                                        ${isChecked ? 'checked' : ''}
                                        onchange="toggleIssueSelection(${originalIndex}, this.checked)"
                                        class="w-4 h-4 cursor-pointer"
                                    >
                                </td>
                                <td class="px-4 py-3 text-sm">${displayIndex + 1}</td>
                                <td class="px-4 py-3 text-sm">${category ? category.icon : ''} ${category ? category.name_ko : issue.category_slug}</td>
                                <td class="px-4 py-3 text-sm font-semibold">${issue.title_ko || issue.title || issue.name_ko || issue.name || '제목 없음'}</td>
                                <td class="px-4 py-3 text-sm">${issue.resolve_date || issue.end_date || '-'}</td>
                                <td class="px-4 py-3 text-sm">$${(issue.total_volume || issue.volume || 0).toLocaleString()}</td>
                                <td class="px-4 py-3 text-center">
                                    ${issue.status === 'published' 
                                        ? '<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"><i class="fas fa-check-circle mr-1"></i>공개됨</span>' 
                                        : '<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800"><i class="fas fa-clock mr-1"></i>대기중</span>'}
                                </td>
                                <td class="px-4 py-3 text-sm text-center">
                                    <button onclick="editAdminIssue(${originalIndex})" class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs mr-1" title="편집">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="deleteAdminIssue(${originalIndex})" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs" title="삭제">
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
            <p class="text-sm text-gray-600">총 <span class="font-bold text-blue-600">${filteredIssues.length}</span>개의 이슈</p>
            <button onclick="syncIssuesToMainSite()" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                <i class="fas fa-sync mr-2"></i>메인 사이트에 반영
            </button>
        </div>
    `;
    
    updateSelectedCount();
}

function searchIssues() {
    console.log('🔍 searchIssues() called');
    const searchInput = document.getElementById('issue-search-input');
    const categoryFilter = document.getElementById('category-filter');
    
    if (!searchInput || !categoryFilter) {
        console.error('❌ Search elements not found');
        return;
    }
    
    const searchValue = searchInput.value.toLowerCase().trim();
    const categoryValue = categoryFilter.value;
    const allIssues = window.adminIssues || [];
    
    console.log('🔍 Search params:', { searchValue, categoryValue, totalIssues: allIssues.length });
    
    // 첫 번째 이슈 구조 확인 (디버깅)
    if (allIssues.length > 0) {
        console.log('📋 First issue structure:', allIssues[0]);
        console.log('📋 Available keys:', Object.keys(allIssues[0]));
    }
    
    // 검색어가 없으면 카테고리 필터만 적용
    if (!searchValue) {
        console.log('ℹ️ No search value, applying category filter only');
        filteredIssues = categoryValue 
            ? allIssues.filter(issue => issue.category_slug === categoryValue)
            : allIssues;
        console.log('✅ Filtered by category:', filteredIssues.length);
        selectedIssueIndices.clear();
        renderIssuesList();
        return;
    }
    
    filteredIssues = allIssues.filter((issue, idx) => {
        // 카테고리 필터
        if (categoryValue && issue.category_slug !== categoryValue) {
            console.log(`❌ Issue ${idx + 1} filtered by category:`, issue.category_slug, '!==', categoryValue);
            return false;
        }
        
        // 모든 속성 값을 검색 대상으로 만듦
        const searchableValues = [];
        
        // 객체의 모든 속성을 순회
        for (const key in issue) {
            if (issue.hasOwnProperty(key)) {
                const value = issue[key];
                
                // 문자열이나 숫자인 경우 직접 추가
                if (typeof value === 'string') {
                    searchableValues.push(value);
                } else if (typeof value === 'number') {
                    searchableValues.push(String(value));
                } else if (Array.isArray(value)) {
                    // 배열인 경우 (outcomes 등)
                    value.forEach(item => {
                        if (typeof item === 'string') {
                            searchableValues.push(item);
                        } else if (typeof item === 'object' && item !== null) {
                            Object.values(item).forEach(v => {
                                if (typeof v === 'string' || typeof v === 'number') {
                                    searchableValues.push(String(v));
                                }
                            });
                        }
                    });
                }
            }
        }
        
        // 전체 검색 가능한 텍스트 (공백 제거)
        const searchableText = searchableValues
            .join(' ')
            .toLowerCase()
            .replace(/\s+/g, '');
        
        const searchValueNoSpace = searchValue.replace(/\s+/g, '');
        const matches = searchableText.includes(searchValueNoSpace);
        
        console.log(`${matches ? '✅' : '❌'} Issue ${idx + 1}:`, {
            title: issue.title_ko || issue.title || 'No title',
            searchValue: searchValueNoSpace,
            searchablePreview: searchableText.substring(0, 100),
            matches: matches
        });
        
        return matches;
    });
    
    console.log('✅ Filtered issues:', filteredIssues.length, '/', allIssues.length);
    selectedIssueIndices.clear(); // 검색 시 선택 초기화
    renderIssuesList();
}

function toggleSelectAll(checked) {
    const allIssues = window.adminIssues || [];
    
    if (checked) {
        // 현재 필터된 이슈들의 원본 인덱스를 모두 선택
        filteredIssues.forEach(issue => {
            const originalIndex = allIssues.findIndex(i => 
                i.title_ko === issue.title_ko && 
                i.category_slug === issue.category_slug &&
                i.resolve_date === issue.resolve_date
            );
            if (originalIndex !== -1) {
                selectedIssueIndices.add(originalIndex);
            }
        });
    } else {
        selectedIssueIndices.clear();
    }
    
    renderIssuesList();
}

function toggleIssueSelection(index, checked) {
    if (checked) {
        selectedIssueIndices.add(index);
    } else {
        selectedIssueIndices.delete(index);
    }
    
    updateSelectedCount();
    
    // 체크박스 배경색 업데이트
    const row = event.target.closest('tr');
    if (row) {
        if (checked) {
            row.classList.add('bg-blue-50');
        } else {
            row.classList.remove('bg-blue-50');
        }
    }
}

function updateSelectedCount() {
    const countElement = document.getElementById('selected-count');
    const deleteBtn = document.getElementById('bulk-delete-btn');
    
    if (countElement) {
        countElement.textContent = selectedIssueIndices.size;
    }
    
    if (deleteBtn) {
        deleteBtn.disabled = selectedIssueIndices.size === 0;
    }
}

async function bulkDeleteIssues() {
    console.log('🗑️ bulkDeleteIssues() called');
    console.log('Selected indices:', Array.from(selectedIssueIndices));
    
    // GitHub API 설정 확인
    if (!window.githubAPI.isConfigured()) {
        alert('⚠️ GitHub 설정이 필요합니다. 설정 메뉴에서 GitHub Token을 입력해주세요.');
        return;
    }
    
    if (selectedIssueIndices.size === 0) {
        alert('삭제할 이슈를 선택해주세요.');
        return;
    }
    
    if (!confirm(`선택한 ${selectedIssueIndices.size}개의 이슈를 삭제하시겠습니까?`)) {
        console.log('User cancelled deletion');
        return;
    }
    
    try {
        const issues = window.adminIssues || [];
        console.log('Before deletion:', issues.length);
        
        // 선택된 인덱스를 내림차순으로 정렬하여 삭제 (뒤에서부터 삭제해야 인덱스가 안 꼬임)
        const sortedIndices = Array.from(selectedIssueIndices).sort((a, b) => b - a);
        console.log('Deleting indices (sorted):', sortedIndices);
        
        sortedIndices.forEach(index => {
            console.log(`Deleting issue at index ${index}:`, issues[index]?.title_ko);
            issues.splice(index, 1);
        });
        
        console.log('After deletion:', issues.length);
        
        // GitHub에 저장
        await window.githubAPI.updateFile(
            'docs/data/issues.json',
            issues,
            `${sortedIndices.length}개의 이슈 삭제`
        );
        
        selectedIssueIndices.clear();
        
        alert(`✅ ${sortedIndices.length}개의 이슈가 삭제되었습니다. (GitHub Pages 반영까지 1-2분 소요)`);
        loadAdminIssues();
    } catch (error) {
        console.error('❌ Failed to delete issues:', error);
        alert('❌ 이슈 삭제에 실패했습니다.');
    }
}

async function deleteAdminIssue(index) {
    console.log('🗑️ deleteAdminIssue() called with index:', index);
    
    // GitHub API 설정 확인
    if (!window.githubAPI.isConfigured()) {
        alert('⚠️ GitHub 설정이 필요합니다. 설정 메뉴에서 GitHub Token을 입력해주세요.');
        return;
    }
    
    try {
        const issues = window.adminIssues || [];
        console.log('Total issues before deletion:', issues.length);
        
        if (!issues[index]) {
            console.error('❌ Issue not found at index:', index);
            alert('이슈를 찾을 수 없습니다.');
            return;
        }
        
        const issueToDelete = issues[index];
        console.log('Issue to delete:', issueToDelete.title_ko);
        
        if (!confirm(`이 이슈를 삭제하시겠습니까?\n\n"${issueToDelete.title_ko}"`)) {
            console.log('User cancelled deletion');
            return;
        }
        
        issues.splice(index, 1);
        
        // GitHub에 저장
        await window.githubAPI.updateFile(
            'docs/data/issues.json',
            issues,
            `이슈 삭제: ${issueToDelete.title_ko}`
        );
        console.log('✅ Issue deleted. Remaining:', issues.length);
        
        alert(`✅ 이슈 "${issueToDelete.title_ko}"가 삭제되었습니다.`);
        loadAdminIssues();
    } catch (error) {
        console.error('❌ Failed to delete issue:', error);
        alert('❌ 이슈 삭제에 실패했습니다.');
    }
}

function editAdminIssue(index) {
    try {
        const issues = window.adminIssues || [];
        const issue = issues[index];
        
        if (!issue) {
            alert('이슈를 찾을 수 없습니다.');
            return;
        }
        
        // 모달 열기
        document.getElementById('edit-issue-modal').style.display = 'flex';
        
        // 카테고리 옵션 생성
        const categorySelect = document.getElementById('edit-category');
        categorySelect.innerHTML = '<option value="">카테고리 선택</option>' + 
            CATEGORIES.map(cat => `<option value="${cat.slug}">${cat.icon} ${cat.name_ko}</option>`).join('');
        
        // 폼에 데이터 채우기
        document.getElementById('edit-issue-index').value = index;
        document.getElementById('edit-category').value = issue.category_slug;
        document.getElementById('edit-title-ko').value = issue.title_ko;
        document.getElementById('edit-title-en').value = issue.title_en;
        document.getElementById('edit-title-zh').value = issue.title_zh;
        document.getElementById('edit-title-ja').value = issue.title_ja;
        document.getElementById('edit-resolve-date').value = issue.resolve_date;
        document.getElementById('edit-total-volume').value = issue.total_volume;
    } catch (error) {
        console.error('Failed to edit issue:', error);
        alert('❌ 이슈 불러오기에 실패했습니다.');
    }
}

function closeEditIssueModal() {
    document.getElementById('edit-issue-modal').style.display = 'none';
}

async function saveEditedIssue(event) {
    event.preventDefault();
    
    // GitHub API 설정 확인
    if (!window.githubAPI.isConfigured()) {
        alert('⚠️ GitHub 설정이 필요합니다. 설정 메뉴에서 GitHub Token을 입력해주세요.');
        return;
    }
    
    try {
        const index = parseInt(document.getElementById('edit-issue-index').value);
        const issues = window.adminIssues || [];
        
        if (!issues[index]) {
            alert('이슈를 찾을 수 없습니다.');
            return;
        }
        
        // 수정된 데이터 가져오기
        const updatedIssue = {
            ...issues[index], // 기존 데이터 유지
            category_slug: document.getElementById('edit-category').value,
            title_ko: document.getElementById('edit-title-ko').value,
            title_en: document.getElementById('edit-title-en').value,
            title_zh: document.getElementById('edit-title-zh').value,
            title_ja: document.getElementById('edit-title-ja').value,
            resolve_date: document.getElementById('edit-resolve-date').value,
            total_volume: parseInt(document.getElementById('edit-total-volume').value),
            updatedAt: new Date().toISOString()
        };
        
        // 카테고리 변경 시 outcomes도 업데이트
        const category = CATEGORIES.find(c => c.slug === updatedIssue.category_slug);
        if (category && issues[index].category_slug !== updatedIssue.category_slug) {
            // 카테고리가 변경된 경우 기본 outcomes 재생성
            const yesProb = 0.5 + (Math.random() * 0.3 - 0.15);
            updatedIssue.outcomes = [
                { name: '예', probability: yesProb },
                { name: '아니오', probability: 1 - yesProb }
            ];
        }
        
        // 배열에서 업데이트
        issues[index] = updatedIssue;
        
        // GitHub에 저장
        await window.githubAPI.updateFile(
            'docs/data/issues.json',
            issues,
            `이슈 수정: ${updatedIssue.title_ko}`
        );
        
        alert(`✅ 이슈 "${updatedIssue.title_ko}"가 수정되었습니다. (GitHub Pages 반영까지 1-2분 소요)`);
        closeEditIssueModal();
        loadAdminIssues();
    } catch (error) {
        console.error('Failed to save issue:', error);
        alert('❌ 이슈 저장에 실패했습니다.');
    }
}

async function syncIssuesToMainSite() {
    try {
        // GitHub API 설정 확인
        if (!window.githubAPI.isConfigured()) {
            alert('⚠️ GitHub 설정이 필요합니다. 설정 메뉴에서 GitHub Token을 입력해주세요.');
            return;
        }
        
        // 현재 이슈 목록 가져오기
        const response = await fetch('/data/issues.json?_=' + Date.now());
        const allIssues = await response.json();
        
        if (allIssues.length === 0) {
            alert('반영할 이슈가 없습니다.');
            return;
        }
        
        // pending 상태의 이슈만 카운트
        const pendingIssues = allIssues.filter(issue => issue.status === 'pending');
        const publishedIssues = allIssues.filter(issue => issue.status === 'published');
        
        if (pendingIssues.length === 0) {
            alert(
                `ℹ️ 대기 중인 이슈가 없습니다.\n\n` +
                `이미 공개된 이슈: ${publishedIssues.length}개\n` +
                `전체 이슈: ${allIssues.length}개`
            );
            return;
        }
        
        // 확인 모달 표시
        const confirmed = confirm(
            `📢 메인 사이트에 반영하기\n\n` +
            `대기 중인 ${pendingIssues.length}개의 이슈를 공개합니다.\n` +
            `(이미 공개된 이슈: ${publishedIssues.length}개)\n\n` +
            `진행하시겠습니까?`
        );
        
        if (!confirmed) {
            return;
        }
        
        // 모든 pending 이슈를 published로 변경
        const updatedIssues = allIssues.map(issue => {
            if (issue.status === 'pending') {
                return { ...issue, status: 'published', publishedAt: new Date().toISOString() };
            }
            return issue;
        });
        
        // GitHub에 저장
        await window.githubAPI.updateFile(
            'docs/data/issues.json',
            updatedIssues,
            `${pendingIssues.length}개의 이슈를 메인 사이트에 공개`
        );
        
        // 메인 페이지 URL
        const mainPageUrl = window.location.origin;
        
        // 성공 메시지
        alert(
            `✅ ${pendingIssues.length}개의 이슈가 메인 사이트에 공개되었습니다!\n\n` +
            `💡 메인 페이지를 열어서 확인하세요:\n${mainPageUrl}\n\n` +
            `(GitHub Pages 반영까지 1-2분 소요)`
        );
        
        // 메인 페이지 자동 열기 옵션
        const openMainPage = confirm('메인 페이지를 새 탭으로 열까요?');
        if (openMainPage) {
            window.open(mainPageUrl, '_blank');
        }
        
        // 이슈 목록 새로고침
        loadAdminIssues();
        
    } catch (error) {
        console.error('Failed to sync issues:', error);
        alert('❌ 이슈 동기화에 실패했습니다: ' + error.message);
    }
}

// ============================================
// 📌 초기화
// ============================================

// 테스트 데이터 생성 함수 (디버깅용)
async function createTestIssues() {
    // GitHub API 설정 확인
    if (!window.githubAPI.isConfigured()) {
        alert('⚠️ GitHub 설정이 필요합니다. 설정 메뉴에서 GitHub Token을 입력해주세요.');
        return;
    }
    
    const testIssues = [
        {
            id: Date.now() + 1,
            category_id: 1,
            category_slug: 'politics',
            title_ko: '2024년 대선 결과 예측',
            title_en: '2024 Presidential Election Results',
            title_zh: '2024年总统选举结果',
            title_ja: '2024年大統領選挙結果',
            description_ko: '2024년 대선 결과 예측 마켓입니다.',
            description_en: 'Prediction market for 2024 Presidential Election Results.',
            description_zh: '关于2024年总统选举结果的预测市场。',
            description_ja: '2024年大統領選挙結果についての予測市場です。',
            resolve_date: '2024-12-31',
            total_volume: 50000,
            status: 'pending',
            outcomes: [
                { name: '예', probability: 0.55 },
                { name: '아니오', probability: 0.45 }
            ],
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() + 2,
            category_id: 2,
            category_slug: 'sports',
            title_ko: '월드컵 우승팀 예측',
            title_en: 'World Cup Winner Prediction',
            title_zh: '世界杯冠军预测',
            title_ja: 'ワールドカップ優勝チーム予想',
            description_ko: '월드컵 우승팀 예측 마켓입니다.',
            description_en: 'Prediction market for World Cup Winner.',
            description_zh: '关于世界杯冠军的预测市场。',
            description_ja: 'ワールドカップ優勝チームについての予測市場です。',
            resolve_date: '2024-11-30',
            total_volume: 30000,
            status: 'pending',
            outcomes: [
                { name: '예', probability: 0.60 },
                { name: '아니오', probability: 0.40 }
            ],
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() + 3,
            category_id: 3,
            category_slug: 'technology',
            title_ko: 'AI 기술 발전 전망',
            title_en: 'AI Technology Development',
            title_zh: 'AI技术发展展望',
            title_ja: 'AI技術発展の展望',
            description_ko: 'AI 기술 발전 전망 마켓입니다.',
            description_en: 'Prediction market for AI Technology Development.',
            description_zh: '关于AI技术发展展望的预测市场。',
            description_ja: 'AI技術発展の展望についての予測市場です。',
            resolve_date: '2024-10-15',
            total_volume: 20000,
            status: 'pending',
            outcomes: [
                { name: '예', probability: 0.70 },
                { name: '아니오', probability: 0.30 }
            ],
            createdAt: new Date().toISOString()
        }
    ];
    
    try {
        // 현재 이슈 목록 가져오기
        const response = await fetch('/data/issues.json?_=' + Date.now());
        const existingIssues = await response.json();
        
        // 기존 이슈와 병합
        const mergedIssues = [...existingIssues, ...testIssues];
        
        // GitHub에 저장
        await window.githubAPI.updateFile(
            'docs/data/issues.json',
            mergedIssues,
            '테스트 이슈 3개 추가'
        );
        
        alert('✅ 테스트 이슈 3개가 생성되었습니다! (GitHub Pages 반영까지 1-2분 소요)');
        loadAdminIssues();
    } catch (error) {
        console.error('Failed to create test issues:', error);
        alert('❌ 테스트 이슈 생성 실패: ' + error.message);
    }
}

// 전역 함수로 노출 (콘솔에서 호출 가능)
window.createTestIssues = createTestIssues;
window.showIssues = function() {
    const issues = window.adminIssues || [];
    console.log('📦 Current issues:', issues);
    return issues;
};

// 카테고리 필터 초기화
function initializeCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    if (!categoryFilter) {
        console.error('❌ Category filter element not found');
        return;
    }
    
    // 기존 옵션 제거 (전체 옵션 제외)
    while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
    }
    
    // 카테고리 옵션 추가
    CATEGORIES.forEach(category => {
        const option = document.createElement('option');
        option.value = category.slug;
        option.textContent = `${category.icon} ${category.name_ko}`;
        categoryFilter.appendChild(option);
    });
    
    console.log('✅ Category filter initialized with', CATEGORIES.length, 'categories');
}

window.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Admin page DOMContentLoaded');
    
    // 카테고리 필터 초기화
    initializeCategoryFilter();
    
    // 데이터 로드
    loadNotices();
    loadBanners();
    loadPopups();
    loadSettings();
    
    // 이슈 관리 섹션 디버깅
    console.log('🔍 Checking issues section...');
    const issuesSection = document.getElementById('issues-section');
    console.log('Issues section found:', !!issuesSection);
    
    const issuesList = document.getElementById('issues-list');
    console.log('Issues list found:', !!issuesList);
    
    // 이슈 로드
    loadAdminIssues();
    console.log('✅ loadAdminIssues() called');
});
