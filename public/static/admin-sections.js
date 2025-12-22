// EventBET Admin - Section Management (완전히 새로운 버전)

(() => {
  const SECTION_SELECTOR = ".content-section";
  const MENU_SELECTOR = ".sidebar-item";
  const DEFAULT_SECTION_ID = "banners-section"; // 초기 기본 섹션

  function hideAllSections() {
    document.querySelectorAll(SECTION_SELECTOR).forEach(sec => {
      sec.classList.remove("active");
    });
  }

  function showSection(sectionId, options = { pushHash: true }) {
    if (!sectionId) return;

    const target = document.getElementById(sectionId);
    if (!target) {
      console.error("[showSection] section not found:", sectionId);
      return;
    }

    console.log("[showSection] 표시:", sectionId);

    hideAllSections();
    target.classList.add("active");

    // 메뉴 active 표시
    document.querySelectorAll(MENU_SELECTOR).forEach(btn => {
      btn.classList.remove("active");
    });

    // 해시 라우팅(뒤로가기/새로고침 유지)
    if (options.pushHash) {
      const newHash = `#${sectionId}`;
      if (location.hash !== newHash) history.replaceState(null, "", newHash);
    }
    
    // 데이터 로드
    const section = sectionId.replace('-section', '');
    if (section === 'banners' && typeof loadBanners === 'function') loadBanners();
    if (section === 'notices' && typeof loadNotices === 'function') loadNotices();
    if (section === 'popups' && typeof loadPopups === 'function') loadPopups();
    if (section === 'members' && typeof loadMembers === 'function') loadMembers();
    if (section === 'issues') {
      if (typeof loadBatchIssuesForm === 'function') loadBatchIssuesForm();
      if (typeof loadRegisteredIssues === 'function') loadRegisteredIssues();
    }
  }

  function bindSidebar() {
    document.querySelectorAll(MENU_SELECTOR).forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        
        // onclick 속성에서 섹션 이름 추출
        const onclick = btn.getAttribute('onclick');
        if (onclick && onclick.includes('showSection')) {
          const match = onclick.match(/showSection\(['"](.+)['"]\)/);
          if (match && match[1]) {
            const sectionName = match[1];
            showSection(`${sectionName}-section`, { pushHash: true });
            btn.classList.add('active');
          }
        }
      });
    });
  }

  function initialRoute() {
    // 1) URL 해시가 있으면 그 섹션으로
    const hashId = (location.hash || "").replace("#", "").trim();
    if (hashId && document.getElementById(hashId)) {
      showSection(hashId, { pushHash: false });
      return;
    }

    // 2) 없으면 기본 섹션으로
    showSection(DEFAULT_SECTION_ID, { pushHash: true });
  }

  document.addEventListener("DOMContentLoaded", () => {
    console.log("[admin-sections] 초기화");
    bindSidebar();
    initialRoute();
  });

  // 브라우저 뒤로가기/앞으로가기 시 해시 변경 대응
  window.addEventListener("hashchange", () => {
    const hashId = (location.hash || "").replace("#", "").trim();
    if (hashId) showSection(hashId, { pushHash: false });
  });

  // 전역 함수로 노출 (기존 코드 호환)
  window.showSection = function(section) {
    showSection(`${section}-section`, { pushHash: true });
  };
})();
