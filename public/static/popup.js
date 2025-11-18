// EventBET Popup System - 팝업 시스템

// 팝업 표시 함수
function displayPopups() {
    const popups = JSON.parse(localStorage.getItem('eventbet_popups') || '[]');
    const container = document.getElementById('popup-container');
    
    if (!container) return;
    
    // 활성화된 팝업만 필터링
    const activePopups = popups.filter(popup => popup.enabled === true);
    
    if (activePopups.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    // 각 팝업 표시
    activePopups.forEach((popup, index) => {
        const popupId = `popup-${popup.id}`;
        
        // 이미 표시된 팝업이고 오늘 닫기를 선택한 경우 스킵
        const closedToday = sessionStorage.getItem(`${popupId}-closed-today`);
        if (closedToday === 'true') return;
        
        // 팝업 HTML 생성
        const popupHtml = createPopupHtml(popup, popupId);
        container.insertAdjacentHTML('beforeend', popupHtml);
        
        // 이벤트 리스너 추가
        setupPopupEvents(popupId);
    });
}

// 팝업 HTML 생성
function createPopupHtml(popup, popupId) {
    // 위치 계산 (cm를 px로 변환: 1cm = 37.8px)
    const top = (popup.top || 10) * 37.8;
    const left = (popup.left || 10) * 37.8;
    const width = popup.width || 600;
    const height = popup.height || 400;
    
    let content = '';
    if (popup.type === 'image') {
        content = `<img src="${popup.image}" alt="${popup.title}" style="width: 100%; height: 100%; object-fit: contain;">`;
    } else if (popup.type === 'youtube') {
        const videoId = extractYoutubeId(popup.youtube);
        content = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
    
    return `
        <div id="${popupId}" class="popup-overlay" style="
            position: fixed;
            top: ${top}px;
            left: ${left}px;
            width: ${width}px;
            height: ${height}px;
            z-index: 9999;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        ">
            <div style="
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
            ">
                <!-- 팝업 헤더 -->
                <div style="
                    padding: 12px 16px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
                ">
                    <h3 style="
                        margin: 0;
                        font-size: 16px;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                    ">
                        <i class="fas fa-bullhorn" style="margin-right: 8px;"></i>
                        ${popup.title}
                    </h3>
                    <button class="popup-close-btn" data-popup-id="${popupId}" style="
                        background: rgba(255, 255, 255, 0.2);
                        border: none;
                        color: white;
                        width: 28px;
                        height: 28px;
                        border-radius: 50%;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s;
                        font-size: 18px;
                    ">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <!-- 팝업 컨텐츠 -->
                <div style="
                    flex: 1;
                    overflow: auto;
                    background: #f8f9fa;
                ">
                    ${content}
                </div>
                
                <!-- 팝업 푸터 -->
                <div style="
                    padding: 12px 16px;
                    background: white;
                    border-top: 1px solid #e0e0e0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <label style="
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        font-size: 13px;
                        color: #666;
                    ">
                        <input type="checkbox" class="popup-close-today-checkbox" data-popup-id="${popupId}" style="
                            margin-right: 6px;
                            width: 16px;
                            height: 16px;
                            cursor: pointer;
                        ">
                        오늘 하루 보지 않기
                    </label>
                    <button class="popup-close-btn" data-popup-id="${popupId}" style="
                        padding: 8px 16px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 13px;
                        font-weight: 600;
                        transition: transform 0.2s;
                    ">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    `;
}

// 팝업 이벤트 설정
function setupPopupEvents(popupId) {
    const popup = document.getElementById(popupId);
    if (!popup) return;
    
    // 닫기 버튼들
    const closeBtns = popup.querySelectorAll('.popup-close-btn');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const checkbox = popup.querySelector('.popup-close-today-checkbox');
            if (checkbox && checkbox.checked) {
                // 오늘 하루 보지 않기 체크된 경우
                sessionStorage.setItem(`${popupId}-closed-today`, 'true');
            }
            closePopup(popupId);
        });
    });
    
    // 닫기 버튼 호버 효과
    closeBtns.forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
            if (e.target.style.transform !== undefined) {
                e.target.style.transform = 'scale(1.05)';
            }
            if (e.target.style.background.includes('rgba')) {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            }
        });
        btn.addEventListener('mouseleave', (e) => {
            if (e.target.style.transform !== undefined) {
                e.target.style.transform = 'scale(1)';
            }
            if (e.target.style.background.includes('rgba')) {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }
        });
    });
    
    // 드래그 가능하게 만들기
    makePopupDraggable(popupId);
}

// 팝업 드래그 기능
function makePopupDraggable(popupId) {
    const popup = document.getElementById(popupId);
    if (!popup) return;
    
    const header = popup.querySelector('div');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    
    header.style.cursor = 'move';
    
    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    
    function dragStart(e) {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'I') return;
        
        initialX = e.clientX - popup.offsetLeft;
        initialY = e.clientY - popup.offsetTop;
        isDragging = true;
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        
        popup.style.left = currentX + 'px';
        popup.style.top = currentY + 'px';
    }
    
    function dragEnd() {
        isDragging = false;
    }
}

// 팝업 닫기
function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.transition = 'opacity 0.3s, transform 0.3s';
        popup.style.opacity = '0';
        popup.style.transform = 'scale(0.9)';
        setTimeout(() => {
            popup.remove();
        }, 300);
    }
}

// 유튜브 ID 추출
function extractYoutubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// 페이지 로드 시 팝업 표시
document.addEventListener('DOMContentLoaded', () => {
    // 1초 후에 팝업 표시 (페이지 로딩 완료 후)
    setTimeout(() => {
        displayPopups();
    }, 1000);
});

// 관리자가 팝업을 수정할 때마다 새로고침
window.addEventListener('storage', (e) => {
    if (e.key === 'eventbet_popups') {
        // 기존 팝업 모두 제거
        const container = document.getElementById('popup-container');
        if (container) {
            container.innerHTML = '';
        }
        // 새로운 팝업 표시
        displayPopups();
    }
});
