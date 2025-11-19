// EventBET Popups - Simple localStorage Based System

async function displayPopups() {
    console.log('[POPUP] Loading popups from localStorage');
    const popups = JSON.parse(localStorage.getItem('eventbet_popups') || '[]');
    
    if (popups.length === 0) {
        console.log('[POPUP] No popups to display');
        return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    popups.forEach((popup, index) => {
        // 날짜 범위 체크
        if (popup.startDate && today < popup.startDate) return;
        if (popup.endDate && today > popup.endDate) return;
        
        // 오늘 하루 보지 않기 체크
        const hideKey = `popup_hide_${index}`;
        const hideUntil = localStorage.getItem(hideKey);
        if (hideUntil && today <= hideUntil) return;
        
        // 팝업 생성
        const popupEl = document.createElement('div');
        popupEl.id = `popup-${index}`;
        popupEl.className = 'fixed z-50 bg-white rounded-lg shadow-2xl';
        
        // cm를 px로 변환 (1cm = 37.8px)
        const topPx = (popup.top || 10) * 37.8;
        const leftPx = (popup.left || 10) * 37.8;
        
        popupEl.style.top = `${topPx}px`;
        popupEl.style.left = `${leftPx}px`;
        popupEl.style.width = `${popup.width || 600}px`;
        popupEl.style.height = `${popup.height || 400}px`;
        
        popupEl.innerHTML = `
            <div class="relative w-full h-full">
                <button onclick="closePopup(${index})" class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center z-10">
                    <i class="fas fa-times"></i>
                </button>
                ${popup.imageUrl ? `<img src="${popup.imageUrl}" class="w-full h-full object-cover rounded-lg">` : ''}
                <div class="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-3 flex items-center justify-center gap-4">
                    <button onclick="hidePopupToday(${index})" class="text-sm text-gray-700 hover:text-gray-900">
                        오늘 하루 보지 않기
                    </button>
                    <button onclick="closePopup(${index})" class="text-sm text-gray-700 hover:text-gray-900">
                        닫기
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popupEl);
    });
    
    console.log(`[POPUP] Displayed ${popups.length} popups`);
}

function closePopup(index) {
    const popupEl = document.getElementById(`popup-${index}`);
    if (popupEl) {
        popupEl.remove();
    }
}

function hidePopupToday(index) {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`popup_hide_${index}`, today);
    closePopup(index);
}

// 페이지 로드 시 팝업 표시
window.addEventListener('DOMContentLoaded', displayPopups);
