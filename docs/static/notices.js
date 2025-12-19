// EventBET Notices System - 공지사항 시스템

// 다국어 번역
const noticeTranslations = {
    ko: {
        noticeBtn: '공지',
        noticeModalTitle: '공지사항',
        noticeEmpty: '등록된 공지사항이 없습니다.',
        noticeBackText: '목록으로',
        submitIssueBtn: '이슈 등록',
        loginBtn: '로그인',
        registerBtn: '회원가입'
    },
    en: {
        noticeBtn: 'Notice',
        noticeModalTitle: 'Announcements',
        noticeEmpty: 'No announcements available.',
        noticeBackText: 'Back to List',
        submitIssueBtn: 'Submit Issue',
        loginBtn: 'Login',
        registerBtn: 'Register'
    },
    zh: {
        noticeBtn: '公告',
        noticeModalTitle: '公告通知',
        noticeEmpty: '暂无公告',
        noticeBackText: '返回列表',
        submitIssueBtn: '提交问题',
        loginBtn: '登录',
        registerBtn: '注册'
    },
    ja: {
        noticeBtn: 'お知らせ',
        noticeModalTitle: 'お知らせ',
        noticeEmpty: 'お知らせはありません',
        noticeBackText: 'リストに戻る',
        submitIssueBtn: '問題を報告',
        loginBtn: 'ログイン',
        registerBtn: '新規登録'
    }
};

// 공지 모달 열기
function openNoticeModal() {
    const modal = document.getElementById('notice-modal');
    modal.classList.add('active');
    loadNotices();
    showNoticeList();
}

// 공지 모달 닫기
function closeNoticeModal() {
    const modal = document.getElementById('notice-modal');
    modal.classList.remove('active');
}

// 공지 목록 뷰 표시
function showNoticeList() {
    document.getElementById('notice-list-view').classList.remove('hidden');
    document.getElementById('notice-detail-view').classList.add('hidden');
}

// 공지 상세 뷰로 전환
function showNoticeDetail(noticeIndex) {
    const notices = JSON.parse(localStorage.getItem('eventbet_notices') || '[]');
    const notice = notices[noticeIndex];
    
    if (!notice) return;
    
    document.getElementById('notice-detail-title').textContent = notice.title;
    document.getElementById('notice-detail-date').textContent = new Date(notice.createdAt).toLocaleString();
    
    // 이미지가 있는 경우 표시
    const contentElement = document.getElementById('notice-detail-content');
    if (notice.image) {
        contentElement.innerHTML = `
            <img src="${notice.image}" alt="Notice Image" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 15px;">
            <p style="white-space: pre-wrap;">${notice.content}</p>
        `;
    } else {
        contentElement.textContent = notice.content;
    }
    
    document.getElementById('notice-list-view').classList.add('hidden');
    document.getElementById('notice-detail-view').classList.remove('hidden');
}

// 목록으로 돌아가기
function backToNoticeList() {
    showNoticeList();
}

// 공지 목록 로드
function loadNotices() {
    const notices = JSON.parse(localStorage.getItem('eventbet_notices') || '[]');
    const container = document.getElementById('notice-list-container');
    const emptyMsg = document.getElementById('notice-empty');
    
    if (notices.length === 0) {
        container.innerHTML = '';
        emptyMsg.classList.remove('hidden');
        return;
    }
    
    emptyMsg.classList.add('hidden');
    
    // 최신 공지부터 표시 (역순)
    const sortedNotices = [...notices].reverse();
    
    container.innerHTML = sortedNotices.map((notice, originalIndex) => {
        const reverseIndex = notices.length - 1 - originalIndex;
        const date = new Date(notice.createdAt);
        const dateStr = date.toLocaleDateString();
        
        return `
            <div class="notice-list-item bg-white border border-gray-200 rounded-lg" onclick="showNoticeDetail(${reverseIndex})">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900 mb-1">${notice.title}</h4>
                        <p class="text-sm text-gray-600 truncate">${notice.content.substring(0, 100)}...</p>
                        <p class="text-xs text-gray-400 mt-2">
                            <i class="far fa-calendar mr-1"></i>${dateStr}
                        </p>
                    </div>
                    <i class="fas fa-chevron-right text-gray-400 ml-4"></i>
                </div>
            </div>
        `;
    }).join('');
}

// 버튼 번역 업데이트
function updateNoticeButtonTranslations(lang) {
    const trans = noticeTranslations[lang] || noticeTranslations.ko;
    
    // 공지 버튼
    const noticeBtnText = document.getElementById('notice-btn-text');
    if (noticeBtnText) noticeBtnText.textContent = trans.noticeBtn;
    
    // 이슈 등록 버튼
    const submitIssueBtnText = document.getElementById('submit-issue-btn-text');
    if (submitIssueBtnText) submitIssueBtnText.textContent = trans.submitIssueBtn;
    
    // 로그인 버튼
    const loginBtnText = document.getElementById('login-btn-text');
    if (loginBtnText) loginBtnText.textContent = trans.loginBtn;
    
    // 회원가입 버튼
    const registerBtnText = document.getElementById('register-btn-text');
    if (registerBtnText) registerBtnText.textContent = trans.registerBtn;
    
    // 모달 텍스트
    const noticeModalTitle = document.getElementById('notice-modal-title');
    if (noticeModalTitle) noticeModalTitle.textContent = trans.noticeModalTitle;
    
    const noticeEmptyText = document.getElementById('notice-empty-text');
    if (noticeEmptyText) noticeEmptyText.textContent = trans.noticeEmpty;
    
    const noticeBackText = document.getElementById('notice-back-text');
    if (noticeBackText) noticeBackText.textContent = trans.noticeBackText;
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 공지 버튼 클릭 이벤트
    const noticeBtn = document.getElementById('notice-btn');
    if (noticeBtn) {
        noticeBtn.addEventListener('click', openNoticeModal);
    }
    
    // 언어 변경 감지
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        // 초기 언어 설정
        updateNoticeButtonTranslations(languageSelector.value);
        
        // 언어 변경 이벤트
        languageSelector.addEventListener('change', (e) => {
            updateNoticeButtonTranslations(e.target.value);
        });
    }
    
    // 모달 외부 클릭 시 닫기
    const noticeModal = document.getElementById('notice-modal');
    if (noticeModal) {
        noticeModal.addEventListener('click', (e) => {
            if (e.target === noticeModal) {
                closeNoticeModal();
            }
        });
    }
});
