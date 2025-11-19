// EventBET Notices - GitHub JSON Based System
// PC와 모바일 간 자동 동기화 (GitHub Pages를 통해 제공)

// 유튜브 URL에서 비디오 ID 추출
function extractYoutubeVideoId(url) {
    if (!url) return null;
    
    // https://www.youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) return watchMatch[1];
    
    // https://youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch) return shortMatch[1];
    
    // https://www.youtube.com/embed/VIDEO_ID
    const embedMatch = url.match(/youtube\.com\/embed\/([^?]+)/);
    if (embedMatch) return embedMatch[1];
    
    return null;
}

async function loadNotices() {
    console.log('[NOTICE] Loading notices from GitHub JSON');
    
    try {
        // GitHub Pages에서 JSON 파일 로드 (캐시 방지)
        const response = await fetch('/data/notices.json?_=' + Date.now());
        const notices = await response.json();
        
        // 공지 목록 컨테이너 찾기 (모달 안의 컨테이너)
        const container = document.getElementById('notice-list-container');
        const emptyMessage = document.getElementById('notice-empty');
        
        if (!container) {
            console.warn('[NOTICE] Container not found');
            return;
        }
        
        if (notices.length === 0) {
            container.innerHTML = '';
            if (emptyMessage) {
                emptyMessage.classList.remove('hidden');
            }
            return;
        }
        
        // 공지가 있으면 빈 메시지 숨기기
        if (emptyMessage) {
            emptyMessage.classList.add('hidden');
        }
        
        container.innerHTML = notices.map((notice, index) => {
            // 유튜브 아이콘 표시
            const youtubeIcon = notice.youtubeUrl ? '<i class="fab fa-youtube text-red-600 ml-2"></i>' : '';
            const imageIcon = notice.imageUrl ? '<i class="fas fa-image text-blue-600 ml-2"></i>' : '';
            
            return `
                <div onclick="showNoticeDetail(${index})" class="bg-white dark:bg-gray-800 rounded-lg p-4 mb-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <h3 class="text-base font-bold mb-1 flex items-center">
                                ${notice.title}
                                ${imageIcon}
                                ${youtubeIcon}
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">${notice.content}</p>
                        </div>
                        <span class="text-xs text-gray-500 ml-4">${new Date(notice.createdAt).toLocaleDateString('ko-KR', {year: 'numeric', month: 'short', day: 'numeric'})}</span>
                    </div>
                </div>
            `;
        }).join('');
        
        console.log(`[NOTICE] Loaded ${notices.length} notices from GitHub JSON`);
    } catch (error) {
        console.error('[NOTICE] Failed to load notices:', error);
        const container = document.getElementById('notice-list-container');
        const emptyMessage = document.getElementById('notice-empty');
        if (container) container.innerHTML = '';
        if (emptyMessage) emptyMessage.classList.remove('hidden');
    }
}

// 공지 상세보기
async function showNoticeDetail(index) {
    try {
        const currentLang = window.currentLang || 'ko';
        const translations = window.translations || {};
        const t = translations[currentLang] || translations.ko || {};
        
        const response = await fetch('/data/notices.json?_=' + Date.now());
        const notices = await response.json();
        const notice = notices[index];
        
        if (!notice) return;
        
        // 유튜브 임베드
        let youtubeEmbed = '';
        if (notice.youtubeUrl) {
            const videoId = extractYoutubeVideoId(notice.youtubeUrl);
            if (videoId) {
                youtubeEmbed = `
                    <div class="aspect-video mb-4">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src="https://www.youtube.com/embed/${videoId}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen
                            class="rounded-lg"
                        ></iframe>
                    </div>
                `;
            }
        }
        
        const detailView = document.getElementById('notice-detail-view');
        const listView = document.getElementById('notice-list-view');
        
        // 날짜 포맷 (언어별)
        const dateLocale = currentLang === 'ko' ? 'ko-KR' : 
                          currentLang === 'zh' ? 'zh-CN' : 
                          currentLang === 'ja' ? 'ja-JP' : 'en-US';
        
        if (detailView && listView) {
            detailView.innerHTML = `
                <button onclick="backToNoticeList()" class="text-blue-600 hover:underline mb-4 flex items-center">
                    <i class="fas fa-arrow-left mr-2"></i>
                    <span id="notice-back-text">${t.noticeBackToList || '목록으로'}</span>
                </button>
                <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
                    <h2 class="text-2xl font-bold mb-4">${notice.title}</h2>
                    ${notice.imageUrl ? `<img src="${notice.imageUrl}" class="w-full h-64 object-cover rounded-lg mb-4">` : ''}
                    ${youtubeEmbed}
                    <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4">${notice.content}</p>
                    <p class="text-sm text-gray-500">${new Date(notice.createdAt).toLocaleDateString(dateLocale)}</p>
                </div>
            `;
            
            listView.classList.add('hidden');
            detailView.classList.remove('hidden');
        }
    } catch (error) {
        console.error('[NOTICE] Failed to load notice detail:', error);
    }
}

// 공지 목록으로 돌아가기
function backToNoticeList() {
    const detailView = document.getElementById('notice-detail-view');
    const listView = document.getElementById('notice-list-view');
    
    if (detailView && listView) {
        detailView.classList.add('hidden');
        listView.classList.remove('hidden');
    }
}

// 공지 모달 텍스트 업데이트 (다국어)
function updateNoticeModalTexts() {
    const currentLang = window.currentLang || 'ko';
    const translations = window.translations || {};
    const t = translations[currentLang] || translations.ko || {};
    
    // 공지사항 제목
    const noticeModalTitle = document.getElementById('notice-modal-title');
    if (noticeModalTitle) noticeModalTitle.textContent = t.noticeModalTitle || '공지사항';
    
    // 빈 공지 메시지
    const noticeEmptyText = document.getElementById('notice-empty-text');
    if (noticeEmptyText) noticeEmptyText.textContent = t.noticeEmpty || '등록된 공지사항이 없습니다.';
    
    // 목록으로 버튼
    const noticeBackText = document.getElementById('notice-back-text');
    if (noticeBackText) noticeBackText.textContent = t.noticeBackToList || '목록으로';
}

// 공지 모달 열기
function openNoticeModal() {
    updateNoticeModalTexts(); // 다국어 텍스트 업데이트
    const modal = document.getElementById('notice-modal');
    if (modal) {
        modal.classList.add('active');
        backToNoticeList(); // 항상 목록 뷰로 시작
        loadNotices(); // 모달 열 때마다 최신 공지 로드
    }
}

// 공지 모달 닫기
function closeNoticeModal() {
    const modal = document.getElementById('notice-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// 함수들을 전역 스코프에 노출
window.openNoticeModal = openNoticeModal;
window.closeNoticeModal = closeNoticeModal;
window.showNoticeDetail = showNoticeDetail;
window.backToNoticeList = backToNoticeList;

// 공지 버튼 클릭 이벤트 리스너 등록
window.addEventListener('DOMContentLoaded', () => {
    const noticeBtn = document.getElementById('notice-btn');
    if (noticeBtn) {
        noticeBtn.addEventListener('click', openNoticeModal);
        console.log('[NOTICE] Notice button event listener attached');
    } else {
        console.warn('[NOTICE] Notice button not found');
    }
    
    // 모달 배경 클릭 시 닫기
    const modal = document.getElementById('notice-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeNoticeModal();
            }
        });
    }
    
    loadNotices();
});
