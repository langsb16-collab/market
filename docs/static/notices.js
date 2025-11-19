// EventBET Notices - Simple localStorage Based System

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
    console.log('[NOTICE] Loading notices from localStorage');
    const notices = JSON.parse(localStorage.getItem('eventbet_notices') || '[]');
    
    const container = document.getElementById('notices-container');
    if (!container) {
        console.warn('[NOTICE] Container not found');
        return;
    }
    
    if (notices.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500 py-8">등록된 공지사항이 없습니다.</p>';
        return;
    }
    
    container.innerHTML = notices.map((notice, index) => {
        // 유튜브 URL을 embed URL로 변환
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
        
        return `
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 shadow-sm hover:shadow-md transition-shadow">
                <h3 class="text-xl font-bold mb-2">${notice.title}</h3>
                ${notice.imageUrl ? `<img src="${notice.imageUrl}" class="w-full h-64 object-cover rounded-lg mb-4">` : ''}
                ${youtubeEmbed}
                <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">${notice.content}</p>
                <p class="text-sm text-gray-500 mt-4">${new Date(notice.createdAt).toLocaleDateString('ko-KR')}</p>
            </div>
        `;
    }).join('');
    
    console.log(`[NOTICE] Loaded ${notices.length} notices`);
}

// 페이지 로드 시 공지사항 로드
window.addEventListener('DOMContentLoaded', loadNotices);
