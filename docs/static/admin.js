// EventBET Admin Panel - Simple localStorage Based System
// PC와 모바일 간 데이터 공유는 GitHub Pages 배포로 자동 동기화

// ============================================
// 📌 배너 관리 (최대 3개)
// ============================================

function loadBanners() {
    const banners = JSON.parse(localStorage.getItem('eventbet_banners') || '[]');
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
}

function openBannerModal(index = null) {
    const modal = document.getElementById('banner-modal');
    modal.classList.add('active');
    
    if (index !== null) {
        const banners = JSON.parse(localStorage.getItem('eventbet_banners') || '[]');
        const banner = banners[index];
        document.getElementById('banner-id').value = index;
        document.getElementById('banner-title').value = banner.title;
        document.getElementById('banner-link').value = banner.link || '';
        if (banner.imageUrl) {
            document.getElementById('banner-preview').src = banner.imageUrl;
            document.getElementById('banner-preview').classList.remove('hidden');
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

function saveBanner(event) {
    event.preventDefault();
    
    const banners = JSON.parse(localStorage.getItem('eventbet_banners') || '[]');
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
        // 새 배너 추가
        if (banners.length >= 3) {
            alert('⚠️ 최대 3개의 배너만 등록할 수 있습니다.');
            return;
        }
        banners.push(bannerData);
    } else {
        // 기존 배너 수정
        banners[parseInt(index)] = bannerData;
    }
    
    localStorage.setItem('eventbet_banners', JSON.stringify(banners));
    closeBannerModal();
    loadBanners();
    alert('✅ 배너가 저장되었습니다.');
}

function deleteBanner(index) {
    if (!confirm('정말 이 배너를 삭제하시겠습니까?')) return;
    
    const banners = JSON.parse(localStorage.getItem('eventbet_banners') || '[]');
    banners.splice(index, 1);
    localStorage.setItem('eventbet_banners', JSON.stringify(banners));
    loadBanners();
    alert('✅ 배너가 삭제되었습니다.');
}

function editBanner(index) {
    openBannerModal(index);
}

// ============================================
// 📌 공지 관리 (최대 30개)
// ============================================

function loadNotices() {
    const notices = JSON.parse(localStorage.getItem('eventbet_notices') || '[]');
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
}

function openNoticeModal(index = null) {
    const modal = document.getElementById('notice-modal');
    modal.classList.add('active');
    
    if (index !== null) {
        const notices = JSON.parse(localStorage.getItem('eventbet_notices') || '[]');
        const notice = notices[index];
        document.getElementById('notice-id').value = index;
        document.getElementById('notice-title').value = notice.title;
        document.getElementById('notice-content').value = notice.content;
        document.getElementById('notice-youtube').value = notice.youtubeUrl || '';
        if (notice.imageUrl) {
            document.getElementById('notice-image-preview').src = notice.imageUrl;
            document.getElementById('notice-image-preview').classList.remove('hidden');
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

function saveNotice(event) {
    event.preventDefault();
    
    const notices = JSON.parse(localStorage.getItem('eventbet_notices') || '[]');
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
    
    localStorage.setItem('eventbet_notices', JSON.stringify(notices));
    closeNoticeModal();
    loadNotices();
    alert('✅ 공지가 저장되었습니다.');
}

function deleteNotice(index) {
    if (!confirm('정말 이 공지를 삭제하시겠습니까?')) return;
    
    const notices = JSON.parse(localStorage.getItem('eventbet_notices') || '[]');
    notices.splice(index, 1);
    localStorage.setItem('eventbet_notices', JSON.stringify(notices));
    loadNotices();
    alert('✅ 공지가 삭제되었습니다.');
}

function editNotice(index) {
    openNoticeModal(index);
}

// ============================================
// 📌 팝업 관리
// ============================================

function loadPopups() {
    const popups = JSON.parse(localStorage.getItem('eventbet_popups') || '[]');
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
}

function openPopupModal(index = null) {
    const modal = document.getElementById('popup-modal');
    modal.classList.add('active');
    
    if (index !== null) {
        const popups = JSON.parse(localStorage.getItem('eventbet_popups') || '[]');
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

function savePopup(event) {
    event.preventDefault();
    
    const popups = JSON.parse(localStorage.getItem('eventbet_popups') || '[]');
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
        title,
        top,
        left,
        width,
        height,
        startDate,
        endDate,
        imageUrl,
        createdAt: new Date().toISOString()
    };
    
    if (index === '') {
        // 새 팝업 추가
        popups.push(popupData);
    } else {
        // 기존 팝업 수정
        popups[parseInt(index)] = popupData;
    }
    
    localStorage.setItem('eventbet_popups', JSON.stringify(popups));
    closePopupModal();
    loadPopups();
    alert('✅ 팝업이 저장되었습니다.');
}

function deletePopup(index) {
    if (!confirm('정말 이 팝업을 삭제하시겠습니까?')) return;
    
    const popups = JSON.parse(localStorage.getItem('eventbet_popups') || '[]');
    popups.splice(index, 1);
    localStorage.setItem('eventbet_popups', JSON.stringify(popups));
    loadPopups();
    alert('✅ 팝업이 삭제되었습니다.');
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
    if (sectionName === 'members') loadMembers();
    if (sectionName === 'settlement') loadSettlement();
}

// ============================================
// 📌 초기화
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    loadBanners();
    loadNotices();
    loadPopups();
});
