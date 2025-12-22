// EventBET Admin Panel JavaScript

// 섹션 전환
function showSection(section) {
    // 모든 섹션 숨기기
    document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
    
    // 선택된 섹션 표시
    document.getElementById(`${section}-section`).classList.add('active');
    event.target.closest('.sidebar-item').classList.add('active');
    
    // 데이터 로드
    if (section === 'banners') loadBanners();
    if (section === 'notices') loadNotices();
    if (section === 'popups') loadPopups();
    if (section === 'members') loadMembers();
}

// ========== 배너 관리 ==========
function loadBanners() {
    const banners = JSON.parse(localStorage.getItem('eventbet_banners') || '[]');
    const container = document.getElementById('banners-list');
    
    if (banners.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500 py-8">등록된 배너가 없습니다.</p>';
        return;
    }
    
    container.innerHTML = banners.map((banner, index) => `
        <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <h4 class="font-bold text-lg mb-2">${banner.title}</h4>
                    ${banner.type === 'image' ? 
                        `<img src="${banner.image}" class="w-full max-h-48 object-cover rounded-lg mb-2">` :
                        `<div class="bg-gray-100 p-4 rounded-lg mb-2">
                            <i class="fab fa-youtube text-red-600 text-2xl mr-2"></i>
                            <span class="text-sm text-gray-600">유튜브: ${banner.youtube}</span>
                        </div>`
                    }
                    ${banner.link ? `<p class="text-sm text-gray-600"><i class="fas fa-link mr-1"></i>링크: ${banner.link}</p>` : ''}
                </div>
                <div class="flex space-x-2 ml-4">
                    <button onclick="editBanner(${index})" class="btn-warning">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteBanner(${index})" class="btn-danger">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
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
        document.getElementById('banner-type').value = banner.type;
        document.getElementById('banner-link').value = banner.link || '';
        
        if (banner.type === 'image') {
            document.getElementById('banner-image').value = banner.image;
            toggleBannerInputs();
        } else {
            document.getElementById('banner-youtube').value = banner.youtube;
            toggleBannerInputs();
        }
    } else {
        document.getElementById('banner-id').value = '';
        document.getElementById('banner-title').value = '';
        document.getElementById('banner-image').value = '';
        document.getElementById('banner-youtube').value = '';
        document.getElementById('banner-link').value = '';
        toggleBannerInputs();
    }
}

function closeBannerModal() {
    document.getElementById('banner-modal').classList.remove('active');
}

function toggleBannerInputs() {
    const type = document.getElementById('banner-type').value;
    const imageInput = document.getElementById('banner-image-input');
    const youtubeInput = document.getElementById('banner-youtube-input');
    
    if (type === 'image') {
        imageInput.classList.remove('hidden');
        youtubeInput.classList.add('hidden');
    } else {
        imageInput.classList.add('hidden');
        youtubeInput.classList.remove('hidden');
    }
}

function saveBanner(event) {
    event.preventDefault();
    
    const banners = JSON.parse(localStorage.getItem('eventbet_banners') || '[]');
    const id = document.getElementById('banner-id').value;
    const type = document.getElementById('banner-type').value;
    
    // 최대 3개 체크
    if (id === '' && banners.length >= 3) {
        alert('배너는 최대 3개까지만 등록할 수 있습니다.');
        return;
    }
    
    const banner = {
        id: id !== '' ? id : Date.now().toString(),
        title: document.getElementById('banner-title').value,
        type: type,
        image: type === 'image' ? document.getElementById('banner-image').value : '',
        youtube: type === 'youtube' ? document.getElementById('banner-youtube').value : '',
        link: document.getElementById('banner-link').value,
        createdAt: id !== '' ? banners[id].createdAt : new Date().toISOString()
    };
    
    if (id !== '') {
        banners[id] = banner;
    } else {
        banners.push(banner);
    }
    
    localStorage.setItem('eventbet_banners', JSON.stringify(banners));
    closeBannerModal();
    loadBanners();
    alert('배너가 저장되었습니다.');
}

function editBanner(index) {
    openBannerModal(index);
}

function deleteBanner(index) {
    if (!confirm('이 배너를 삭제하시겠습니까?')) return;
    
    const banners = JSON.parse(localStorage.getItem('eventbet_banners') || '[]');
    banners.splice(index, 1);
    localStorage.setItem('eventbet_banners', JSON.stringify(banners));
    loadBanners();
    alert('배너가 삭제되었습니다.');
}

// ========== 공지 관리 ==========
function loadNotices() {
    const notices = JSON.parse(localStorage.getItem('eventbet_notices') || '[]');
    const tbody = document.getElementById('notices-list');
    
    if (notices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-gray-500 py-8">등록된 공지가 없습니다.</td></tr>';
        return;
    }
    
    tbody.innerHTML = notices.map((notice, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>
                ${notice.title}
                ${notice.image ? '<br><small class="text-gray-500"><i class="fas fa-image"></i> 이미지 포함</small>' : ''}
            </td>
            <td class="max-w-xs truncate">${notice.content}</td>
            <td>${new Date(notice.createdAt).toLocaleDateString('ko-KR')}</td>
            <td>
                <button onclick="editNotice(${index})" class="btn-warning mr-2">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteNotice(${index})" class="btn-danger">
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
        document.getElementById('notice-image').value = notice.image || '';
        
        // 이미지 미리보기 표시
        const preview = document.getElementById('notice-preview');
        if (notice.image) {
            preview.src = notice.image;
            preview.classList.remove('hidden');
        } else {
            preview.classList.add('hidden');
        }
    } else {
        document.getElementById('notice-id').value = '';
        document.getElementById('notice-title').value = '';
        document.getElementById('notice-content').value = '';
        document.getElementById('notice-image').value = '';
        document.getElementById('notice-image-file').value = '';
        document.getElementById('notice-preview').classList.add('hidden');
    }
}

function closeNoticeModal() {
    document.getElementById('notice-modal').classList.remove('active');
}

function saveNotice(event) {
    event.preventDefault();
    
    const notices = JSON.parse(localStorage.getItem('eventbet_notices') || '[]');
    const id = document.getElementById('notice-id').value;
    
    // 최대 30개 체크
    if (id === '' && notices.length >= 30) {
        alert('공지는 최대 30개까지만 등록할 수 있습니다.');
        return;
    }
    
    const notice = {
        id: id !== '' ? id : Date.now().toString(),
        title: document.getElementById('notice-title').value,
        content: document.getElementById('notice-content').value,
        image: document.getElementById('notice-image').value || '',
        createdAt: id !== '' ? notices[id].createdAt : new Date().toISOString()
    };
    
    if (id !== '') {
        notices[id] = notice;
    } else {
        notices.push(notice);
    }
    
    localStorage.setItem('eventbet_notices', JSON.stringify(notices));
    closeNoticeModal();
    loadNotices();
    alert('공지가 저장되었습니다.');
}

function editNotice(index) {
    openNoticeModal(index);
}

function deleteNotice(index) {
    if (!confirm('이 공지를 삭제하시겠습니까?')) return;
    
    const notices = JSON.parse(localStorage.getItem('eventbet_notices') || '[]');
    notices.splice(index, 1);
    localStorage.setItem('eventbet_notices', JSON.stringify(notices));
    loadNotices();
    alert('공지가 삭제되었습니다.');
}

// ========== 팝업 관리 ==========
function loadPopups() {
    const popups = JSON.parse(localStorage.getItem('eventbet_popups') || '[]');
    const container = document.getElementById('popups-list');
    
    if (popups.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500 py-8">등록된 팝업이 없습니다.</p>';
        return;
    }
    
    container.innerHTML = popups.map((popup, index) => `
        <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                        <h4 class="font-bold text-lg">${popup.title}</h4>
                        <span class="px-3 py-1 rounded-full text-xs font-semibold ${popup.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                            ${popup.enabled ? '활성' : '비활성'}
                        </span>
                    </div>
                    ${popup.type === 'image' ? 
                        `<img src="${popup.image}" class="w-full max-h-48 object-cover rounded-lg mb-2">` :
                        `<div class="bg-gray-100 p-4 rounded-lg mb-2">
                            <i class="fab fa-youtube text-red-600 text-2xl mr-2"></i>
                            <span class="text-sm text-gray-600">유튜브: ${popup.youtube}</span>
                        </div>`
                    }
                    <div class="text-xs text-gray-600 mt-2">
                        <i class="fas fa-map-marker-alt mr-1"></i>위치: 상단 ${popup.top || 10}cm, 좌측 ${popup.left || 10}cm
                        <span class="mx-2">|</span>
                        <i class="fas fa-expand-arrows-alt mr-1"></i>크기: ${popup.width || 600}px × ${popup.height || 400}px
                    </div>
                </div>
                <div class="flex space-x-2 ml-4">
                    <button onclick="editPopup(${index})" class="btn-warning">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deletePopup(${index})" class="btn-danger">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
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
        document.getElementById('popup-type').value = popup.type;
        document.getElementById('popup-enabled').checked = popup.enabled;
        
        if (popup.type === 'image') {
            document.getElementById('popup-image').value = popup.image;
            togglePopupInputs();
        } else {
            document.getElementById('popup-youtube').value = popup.youtube;
            togglePopupInputs();
        }
    } else {
        document.getElementById('popup-id').value = '';
        document.getElementById('popup-title').value = '';
        document.getElementById('popup-image').value = '';
        document.getElementById('popup-youtube').value = '';
        document.getElementById('popup-enabled').checked = true;
        togglePopupInputs();
    }
}

function closePopupModal() {
    document.getElementById('popup-modal').classList.remove('active');
}

function togglePopupInputs() {
    const type = document.getElementById('popup-type').value;
    const imageInput = document.getElementById('popup-image-input');
    const youtubeInput = document.getElementById('popup-youtube-input');
    
    if (type === 'image') {
        imageInput.classList.remove('hidden');
        youtubeInput.classList.add('hidden');
    } else {
        imageInput.classList.add('hidden');
        youtubeInput.classList.remove('hidden');
    }
}

function savePopup(event) {
    event.preventDefault();
    
    const popups = JSON.parse(localStorage.getItem('eventbet_popups') || '[]');
    const id = document.getElementById('popup-id').value;
    const type = document.getElementById('popup-type').value;
    
    const popup = {
        id: id !== '' ? id : Date.now().toString(),
        title: document.getElementById('popup-title').value,
        type: type,
        image: type === 'image' ? document.getElementById('popup-image').value : '',
        youtube: type === 'youtube' ? document.getElementById('popup-youtube').value : '',
        enabled: document.getElementById('popup-enabled').checked,
        createdAt: id !== '' ? popups[id].createdAt : new Date().toISOString()
    };
    
    if (id !== '') {
        popups[id] = popup;
    } else {
        popups.push(popup);
    }
    
    localStorage.setItem('eventbet_popups', JSON.stringify(popups));
    closePopupModal();
    loadPopups();
    alert('팝업이 저장되었습니다.');
}

function editPopup(index) {
    openPopupModal(index);
}

function deletePopup(index) {
    if (!confirm('이 팝업을 삭제하시겠습니까?')) return;
    
    const popups = JSON.parse(localStorage.getItem('eventbet_popups') || '[]');
    popups.splice(index, 1);
    localStorage.setItem('eventbet_popups', JSON.stringify(popups));
    loadPopups();
    alert('팝업이 삭제되었습니다.');
}

// ========== 회원 관리 ==========
function loadMembers() {
    const users = JSON.parse(localStorage.getItem('eventbet_users') || '[]');
    
    // 통계 업데이트
    const totalMembers = users.length;
    const activeMembers = users.filter(u => u.status === 'active').length;
    const suspendedMembers = users.filter(u => u.status === 'suspended').length;
    
    document.getElementById('total-members').textContent = totalMembers;
    document.getElementById('active-members').textContent = activeMembers;
    document.getElementById('suspended-members').textContent = suspendedMembers;
    
    filterMembers();
}

function filterMembers() {
    const users = JSON.parse(localStorage.getItem('eventbet_users') || '[]');
    const searchQuery = document.getElementById('member-search').value.toLowerCase();
    const statusFilter = document.getElementById('member-status-filter').value;
    
    let filteredUsers = users;
    
    // 검색 필터
    if (searchQuery) {
        filteredUsers = filteredUsers.filter(u => 
            u.name.toLowerCase().includes(searchQuery) ||
            u.email.toLowerCase().includes(searchQuery) ||
            u.phone.includes(searchQuery)
        );
    }
    
    // 상태 필터
    if (statusFilter) {
        filteredUsers = filteredUsers.filter(u => u.status === statusFilter);
    }
    
    renderMembersList(filteredUsers);
}

function renderMembersList(users) {
    const tbody = document.getElementById('members-list');
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-gray-500 py-8">회원이 없습니다.</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td class="text-xs">${user.wallet.substring(0, 10)}...</td>
            <td>${new Date(user.createdAt).toLocaleDateString('ko-KR')}</td>
            <td>
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                    ${user.status === 'active' ? '활성' : '정지'}
                </span>
            </td>
            <td>
                ${user.status === 'active' ? 
                    `<button onclick="suspendMember('${user.id}')" class="btn-warning mr-2">
                        <i class="fas fa-pause"></i> 정지
                    </button>` :
                    `<button onclick="activateMember('${user.id}')" class="btn-success mr-2">
                        <i class="fas fa-play"></i> 활성
                    </button>`
                }
                <button onclick="deleteMember('${user.id}')" class="btn-danger">
                    <i class="fas fa-trash"></i> 삭제
                </button>
            </td>
        </tr>
    `).join('');
}

function suspendMember(userId) {
    if (!confirm('이 회원을 정지하시겠습니까?')) return;
    
    const users = JSON.parse(localStorage.getItem('eventbet_users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        users[userIndex].status = 'suspended';
        localStorage.setItem('eventbet_users', JSON.stringify(users));
        alert('회원이 정지되었습니다.');
        loadMembers();
    }
}

function activateMember(userId) {
    if (!confirm('이 회원을 활성화하시겠습니까?')) return;
    
    const users = JSON.parse(localStorage.getItem('eventbet_users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        users[userIndex].status = 'active';
        localStorage.setItem('eventbet_users', JSON.stringify(users));
        alert('회원이 활성화되었습니다.');
        loadMembers();
    }
}

function deleteMember(userId) {
    if (!confirm('이 회원을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    
    const users = JSON.parse(localStorage.getItem('eventbet_users') || '[]');
    const filteredUsers = users.filter(u => u.id !== userId);
    localStorage.setItem('eventbet_users', JSON.stringify(filteredUsers));
    alert('회원이 삭제되었습니다.');
    loadMembers();
}

// ========== 결산 페이지 ==========
function loadSettlement() {
    loadFeeSettings();
    loadIssues();
    updateSettlementStats();
}

// 수수료 설정 로드
function loadFeeSettings() {
    const settings = JSON.parse(localStorage.getItem('eventbet_fee_settings') || '{"total": 7, "headquarters": 3, "distributor": 2.5, "subdistributor": 1.5}');
    
    document.getElementById('total-fee').value = settings.total;
    document.getElementById('headquarters-fee').value = settings.headquarters;
    document.getElementById('distributor-fee').value = settings.distributor;
    document.getElementById('subdistributor-fee').value = settings.subdistributor;
}

// 수수료 설정 저장
function saveFeeSettings() {
    const settings = {
        total: parseFloat(document.getElementById('total-fee').value),
        headquarters: parseFloat(document.getElementById('headquarters-fee').value),
        distributor: parseFloat(document.getElementById('distributor-fee').value),
        subdistributor: parseFloat(document.getElementById('subdistributor-fee').value)
    };
    
    const sum = settings.headquarters + settings.distributor + settings.subdistributor;
    if (Math.abs(sum - settings.total) > 0.01) {
        alert(`수수료 합계가 맞지 않습니다. 본사 + 총판 + 부총판 = ${sum.toFixed(1)}% (총 ${settings.total}% 필요)`);
        return;
    }
    
    localStorage.setItem('eventbet_fee_settings', JSON.stringify(settings));
    alert('수수료 설정이 저장되었습니다.');
    updateSettlementStats();
}

// 이슈 목록 로드
function loadIssues() {
    const issues = JSON.parse(localStorage.getItem('eventbet_issues') || '[]');
    const filterStatus = document.getElementById('issue-status-filter')?.value || '';
    
    let filteredIssues = issues;
    if (filterStatus) {
        filteredIssues = issues.filter(issue => issue.status === filterStatus);
    }
    
    const tbody = document.getElementById('issues-list');
    
    if (filteredIssues.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-gray-500 py-8">등록된 이슈가 없습니다.</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredIssues.map((issue, index) => {
        const totalBet = (issue.yesBet || 0) + (issue.noBet || 0);
        const expireDate = new Date(issue.expireDate).toLocaleDateString('ko-KR');
        const isExpired = new Date(issue.expireDate) < new Date();
        
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${issue.title}</td>
                <td>${totalBet.toLocaleString()} USDT</td>
                <td>${(issue.yesBet || 0).toLocaleString()} USDT</td>
                <td>${(issue.noBet || 0).toLocaleString()} USDT</td>
                <td class="${isExpired ? 'text-red-600' : ''}">${expireDate}</td>
                <td>
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${issue.status === 'settled' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}">
                        ${issue.status === 'settled' ? '종료됨' : '진행중'}
                    </span>
                </td>
                <td>
                    ${issue.status !== 'settled' ? `
                        <button onclick="settleIssue('${issue.id}', 'yes')" class="btn-success mr-2">
                            YES 승리
                        </button>
                        <button onclick="settleIssue('${issue.id}', 'no')" class="btn-danger">
                            NO 승리
                        </button>
                    ` : `
                        <span class="text-sm text-gray-600">결과: ${issue.result === 'yes' ? 'YES' : 'NO'}</span>
                    `}
                </td>
            </tr>
        `;
    }).join('');
}

// 개별 이슈 정산
function settleIssue(issueId, result) {
    if (!confirm(`이 이슈를 ${result.toUpperCase()} 승리로 정산하시겠습니까?`)) return;
    
    const issues = JSON.parse(localStorage.getItem('eventbet_issues') || '[]');
    const issueIndex = issues.findIndex(i => i.id === issueId);
    
    if (issueIndex === -1) return;
    
    const issue = issues[issueIndex];
    const totalBet = (issue.yesBet || 0) + (issue.noBet || 0);
    const feeSettings = JSON.parse(localStorage.getItem('eventbet_fee_settings') || '{"total": 7, "headquarters": 3, "distributor": 2.5, "subdistributor": 1.5}');
    
    const feeAmount = totalBet * (feeSettings.total / 100);
    const headquartersAmount = totalBet * (feeSettings.headquarters / 100);
    const distributorAmount = totalBet * (feeSettings.distributor / 100);
    const subdistributorAmount = totalBet * (feeSettings.subdistributor / 100);
    
    // 정산 내역 저장
    const settlements = JSON.parse(localStorage.getItem('eventbet_settlements') || '[]');
    settlements.push({
        id: Date.now().toString(),
        issueId: issue.id,
        issueTitle: issue.title,
        totalBet: totalBet,
        result: result,
        feeAmount: feeAmount,
        headquarters: headquartersAmount,
        distributor: distributorAmount,
        subdistributor: subdistributorAmount,
        settledAt: new Date().toISOString()
    });
    
    localStorage.setItem('eventbet_settlements', JSON.stringify(settlements));
    
    // 이슈 상태 업데이트
    issues[issueIndex].status = 'settled';
    issues[issueIndex].result = result;
    issues[issueIndex].settledAt = new Date().toISOString();
    
    localStorage.setItem('eventbet_issues', JSON.stringify(issues));
    
    alert('정산이 완료되었습니다.');
    loadIssues();
    updateSettlementStats();
}

// 만기일자 일괄 종료
function settleAllExpiredIssues() {
    const issues = JSON.parse(localStorage.getItem('eventbet_issues') || '[]');
    const today = new Date();
    const expiredIssues = issues.filter(issue => 
        issue.status !== 'settled' && new Date(issue.expireDate) < today
    );
    
    if (expiredIssues.length === 0) {
        alert('만기된 이슈가 없습니다.');
        return;
    }
    
    if (!confirm(`${expiredIssues.length}개의 만기된 이슈를 정산하시겠습니까?\n(자동으로 더 많은 베팅액을 받은 쪽이 승리로 처리됩니다)`)) return;
    
    expiredIssues.forEach(issue => {
        const result = (issue.yesBet || 0) >= (issue.noBet || 0) ? 'yes' : 'no';
        settleIssue(issue.id, result);
    });
    
    alert(`${expiredIssues.length}개의 이슈가 정산되었습니다.`);
}

// 정산 통계 업데이트
function updateSettlementStats() {
    const settlements = JSON.parse(localStorage.getItem('eventbet_settlements') || '[]');
    
    const totalSettled = settlements.reduce((sum, s) => sum + s.feeAmount, 0);
    const totalHeadquarters = settlements.reduce((sum, s) => sum + s.headquarters, 0);
    const totalDistributor = settlements.reduce((sum, s) => sum + s.distributor, 0);
    const totalSubdistributor = settlements.reduce((sum, s) => sum + s.subdistributor, 0);
    
    document.getElementById('total-settled').textContent = totalSettled.toLocaleString();
    document.getElementById('headquarters-amount').textContent = totalHeadquarters.toLocaleString();
    document.getElementById('distributor-amount').textContent = totalDistributor.toLocaleString();
    document.getElementById('subdistributor-amount').textContent = totalSubdistributor.toLocaleString();
}

// 날짜별 정산 조회
function loadSettlementByDate() {
    const startDate = document.getElementById('settlement-start-date').value;
    const endDate = document.getElementById('settlement-end-date').value;
    
    if (!startDate || !endDate) {
        alert('시작일과 종료일을 선택해주세요.');
        return;
    }
    
    const settlements = JSON.parse(localStorage.getItem('eventbet_settlements') || '[]');
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    const filteredSettlements = settlements.filter(s => {
        const settledDate = new Date(s.settledAt);
        return settledDate >= start && settledDate <= end;
    });
    
    // 날짜별로 그룹화
    const dailyData = {};
    filteredSettlements.forEach(s => {
        const date = new Date(s.settledAt).toLocaleDateString('ko-KR');
        if (!dailyData[date]) {
            dailyData[date] = {
                count: 0,
                totalBet: 0,
                feeAmount: 0,
                headquarters: 0,
                distributor: 0,
                subdistributor: 0
            };
        }
        
        dailyData[date].count++;
        dailyData[date].totalBet += s.totalBet;
        dailyData[date].feeAmount += s.feeAmount;
        dailyData[date].headquarters += s.headquarters;
        dailyData[date].distributor += s.distributor;
        dailyData[date].subdistributor += s.subdistributor;
    });
    
    const tbody = document.getElementById('daily-settlement-list');
    
    if (Object.keys(dailyData).length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-gray-500 py-8">해당 기간에 정산 내역이 없습니다.</td></tr>';
        return;
    }
    
    tbody.innerHTML = Object.entries(dailyData)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
        .map(([date, data]) => `
            <tr>
                <td>${date}</td>
                <td>${data.count}건</td>
                <td>${data.totalBet.toLocaleString()} USDT</td>
                <td>${data.feeAmount.toLocaleString()} USDT</td>
                <td>${data.headquarters.toLocaleString()} USDT</td>
                <td>${data.distributor.toLocaleString()} USDT</td>
                <td>${data.subdistributor.toLocaleString()} USDT</td>
            </tr>
        `).join('');
}

// 이슈 필터링
function filterIssues() {
    loadIssues();
}

// ========== 팝업 관리 (위치 조정 포함) ==========
// openPopupModal 함수 수정 (크기 조절 추가)
const originalOpenPopupModal = window.openPopupModal;
window.openPopupModal = function(index = null) {
    const modal = document.getElementById('popup-modal');
    modal.classList.add('active');
    
    if (index !== null) {
        const popups = JSON.parse(localStorage.getItem('eventbet_popups') || '[]');
        const popup = popups[index];
        
        document.getElementById('popup-id').value = index;
        document.getElementById('popup-title').value = popup.title;
        document.getElementById('popup-type').value = popup.type;
        document.getElementById('popup-enabled').checked = popup.enabled !== false; // 명시적 체크
        document.getElementById('popup-top').value = popup.top || 10;
        document.getElementById('popup-left').value = popup.left || 10;
        document.getElementById('popup-width').value = popup.width || 600;
        document.getElementById('popup-height').value = popup.height || 400;
        
        if (popup.type === 'image') {
            document.getElementById('popup-image').value = popup.image;
            togglePopupInputs();
        } else {
            document.getElementById('popup-youtube').value = popup.youtube;
            togglePopupInputs();
        }
    } else {
        document.getElementById('popup-id').value = '';
        document.getElementById('popup-title').value = '';
        document.getElementById('popup-image').value = '';
        document.getElementById('popup-youtube').value = '';
        document.getElementById('popup-enabled').checked = true;
        document.getElementById('popup-top').value = 10;
        document.getElementById('popup-left').value = 10;
        document.getElementById('popup-width').value = 600;
        document.getElementById('popup-height').value = 400;
        togglePopupInputs();
    }
};

// savePopup 함수에 위치 및 크기 정보 추가
const originalSavePopup = window.savePopup;
window.savePopup = function(event) {
    event.preventDefault();
    
    const popups = JSON.parse(localStorage.getItem('eventbet_popups') || '[]');
    const id = document.getElementById('popup-id').value;
    const type = document.getElementById('popup-type').value;
    const enabledCheckbox = document.getElementById('popup-enabled');
    
    const popup = {
        id: id !== '' ? id : Date.now().toString(),
        title: document.getElementById('popup-title').value,
        type: type,
        image: type === 'image' ? document.getElementById('popup-image').value : '',
        youtube: type === 'youtube' ? document.getElementById('popup-youtube').value : '',
        enabled: enabledCheckbox.checked === true, // 명시적 불린 변환
        top: parseFloat(document.getElementById('popup-top').value) || 10,
        left: parseFloat(document.getElementById('popup-left').value) || 10,
        width: parseInt(document.getElementById('popup-width').value) || 600,
        height: parseInt(document.getElementById('popup-height').value) || 400,
        createdAt: id !== '' ? popups[id].createdAt : new Date().toISOString()
    };
    
    if (id !== '') {
        popups[id] = popup;
    } else {
        popups.push(popup);
    }
    
    localStorage.setItem('eventbet_popups', JSON.stringify(popups));
    closePopupModal();
    loadPopups();
    alert('팝업이 저장되었습니다.');
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    loadBanners();
    
    // 섹션 전환 함수 업데이트
    const originalShowSection = window.showSection;
    window.showSection = function(section) {
        // 모든 섹션 숨기기
        document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
        
        // 선택된 섹션 표시
        document.getElementById(`${section}-section`).classList.add('active');
        event.target.closest('.sidebar-item').classList.add('active');
        
        // 데이터 로드
        if (section === 'banners') loadBanners();
        if (section === 'notices') loadNotices();
        if (section === 'popups') loadPopups();
        if (section === 'members') loadMembers();
        if (section === 'settlement') loadSettlement();
    };
});

// ========== 이미지 업로드 핸들러 ==========

// 배너 이미지 파일 업로드
function handleBannerImageUpload() {
    const fileInput = document.getElementById('banner-image-file');
    const file = fileInput.files[0];
    
    if (file) {
        // 파일 크기 체크 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
            alert('이미지 파일 크기는 5MB를 초과할 수 없습니다.');
            fileInput.value = '';
            return;
        }
        
        // 이미지 파일인지 확인
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드할 수 있습니다.');
            fileInput.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Data = e.target.result;
            
            // URL 입력 필드에 base64 데이터 설정
            document.getElementById('banner-image').value = base64Data;
            
            // 미리보기 표시
            const preview = document.getElementById('banner-preview');
            preview.src = base64Data;
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

// 배너 URL 미리보기
function previewBannerUrl() {
    const url = document.getElementById('banner-image').value;
    const preview = document.getElementById('banner-preview');
    
    if (url) {
        preview.src = url;
        preview.classList.remove('hidden');
        
        // 파일 입력 초기화
        document.getElementById('banner-image-file').value = '';
    } else {
        preview.classList.add('hidden');
    }
}

// 공지 이미지 파일 업로드
function handleNoticeImageUpload() {
    const fileInput = document.getElementById('notice-image-file');
    const file = fileInput.files[0];
    
    if (file) {
        // 파일 크기 체크 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
            alert('이미지 파일 크기는 5MB를 초과할 수 없습니다.');
            fileInput.value = '';
            return;
        }
        
        // 이미지 파일인지 확인
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드할 수 있습니다.');
            fileInput.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Data = e.target.result;
            
            // URL 입력 필드에 base64 데이터 설정
            document.getElementById('notice-image').value = base64Data;
            
            // 미리보기 표시
            const preview = document.getElementById('notice-preview');
            preview.src = base64Data;
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

// 공지 URL 미리보기
function previewNoticeUrl() {
    const url = document.getElementById('notice-image').value;
    const preview = document.getElementById('notice-preview');
    
    if (url) {
        preview.src = url;
        preview.classList.remove('hidden');
        
        // 파일 입력 초기화
        document.getElementById('notice-image-file').value = '';
    } else {
        preview.classList.add('hidden');
    }
}

// 팝업 이미지 파일 업로드
function handlePopupImageUpload() {
    const fileInput = document.getElementById('popup-image-file');
    const file = fileInput.files[0];
    
    if (file) {
        // 파일 크기 체크 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
            alert('이미지 파일 크기는 5MB를 초과할 수 없습니다.');
            fileInput.value = '';
            return;
        }
        
        // 이미지 파일인지 확인
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드할 수 있습니다.');
            fileInput.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Data = e.target.result;
            
            // URL 입력 필드에 base64 데이터 설정
            document.getElementById('popup-image').value = base64Data;
            
            // 미리보기 표시
            const preview = document.getElementById('popup-preview');
            preview.src = base64Data;
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

// 팝업 URL 미리보기
function previewPopupUrl() {
    const url = document.getElementById('popup-image').value;
    const preview = document.getElementById('popup-preview');
    
    if (url) {
        preview.src = url;
        preview.classList.remove('hidden');
        
        // 파일 입력 초기화
        document.getElementById('popup-image-file').value = '';
    } else {
        preview.classList.add('hidden');
    }
}

// 4개국어 일괄 이슈 등록
let issueBoxCount = 1;

function addNewIssueBox() {
    if (issueBoxCount >= 5) {
        alert('최대 5개까지만 등록할 수 있습니다.');
        return;
    }
    issueBoxCount++;
    
    const container = document.getElementById('issue-boxes-container');
    const newBox = document.createElement('div');
    newBox.className = 'border-2 border-green-500 rounded-xl p-6 mb-6 bg-white shadow-sm';
    newBox.id = `issue-box-${issueBoxCount}`;
    newBox.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-bold text-gray-800">📝 이슈 #${issueBoxCount}</h4>
            <button type="button" onclick="removeIssueBox(${issueBoxCount})" class="text-red-500 hover:text-red-700">
                <i class="fas fa-times-circle text-xl"></i>
            </button>
        </div>
        
        <div class="mb-4">
            <label class="block text-sm font-semibold mb-2 text-purple-700">🟣 카테고리 *</label>
            <select id="issue-${issueBoxCount}-category" class="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                <option value="정치">정치</option>
                <option value="crypto">암호화폐</option>
                <option value="sports">스포츠</option>
                <option value="entertainment">엔터테인먼트</option>
                <option value="economy">경제</option>
                <option value="science">과학/기술</option>
                <option value="climate">기후/환경</option>
                <option value="other">기타</option>
            </select>
        </div>
        
        <div class="mb-4">
            <label class="block text-sm font-semibold mb-3 text-gray-800">H 제목 (4개 언어 입력) *</label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-semibold mb-1 text-gray-600">🇰🇷 한국어</label>
                    <input type="text" id="issue-${issueBoxCount}-ko" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="예: 비트코인이 $150K 도달?" required>
                </div>
                <div>
                    <label class="block text-xs font-semibold mb-1 text-gray-600">🇺🇸 en English</label>
                    <input type="text" id="issue-${issueBoxCount}-en" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g., Bitcoin reaches $150K?">
                </div>
                <div>
                    <label class="block text-xs font-semibold mb-1 text-gray-600">🇨🇳 cn 中文</label>
                    <input type="text" id="issue-${issueBoxCount}-zh" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="例：比特币突破$150K？">
                </div>
                <div>
                    <label class="block text-xs font-semibold mb-1 text-gray-600">🇯🇵 jp 日本語</label>
                    <input type="text" id="issue-${issueBoxCount}-ja" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="例：ビットコインが$150K突破？">
                </div>
            </div>
        </div>
        
        <div class="mb-4">
            <label class="block text-sm font-semibold mb-2 text-gray-700">큰 내용 설명 (선택)</label>
            <textarea id="issue-${issueBoxCount}-description" rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm" placeholder="이슈에 대한 상세한 설명을 입력하세요..."></textarea>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
            <div>
                <label class="block text-sm font-semibold mb-2 text-red-700">🟥 결론 설정 기간 *</label>
                <input type="date" id="issue-${issueBoxCount}-date" class="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
            </div>
            <div>
                <label class="block text-sm font-semibold mb-2 text-green-700">🟩 Yes 배당률 (%)</label>
                <input type="number" id="issue-${issueBoxCount}-yes-odds" value="50" min="0" max="100" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
            </div>
            <div>
                <label class="block text-sm font-semibold mb-2 text-yellow-700">🟨 전체 배팅액 (USDT)</label>
                <input type="number" id="issue-${issueBoxCount}-usdt" value="100000" min="0" step="1000" class="w-full px-4 py-3 border border-gray-300 rounded-lg">
            </div>
        </div>
    `;
    container.appendChild(newBox);
}

function removeIssueBox(id) {
    if (issueBoxCount <= 1) {
        alert('최소 1개는 남겨야 합니다.');
        return;
    }
    const box = document.getElementById(`issue-box-${id}`);
    if (box) {
        box.remove();
        issueBoxCount--;
    }
}

async function saveBatchIssues(event) {
    event.preventDefault();
    
    const issues = [];
    for (let i = 1; i <= 5; i++) {
        const box = document.getElementById(`issue-box-${i}`);
        if (!box) continue;
        
        const ko = document.getElementById(`issue-${i}-ko`)?.value.trim();
        const en = document.getElementById(`issue-${i}-en`)?.value.trim();
        const zh = document.getElementById(`issue-${i}-zh`)?.value.trim();
        const ja = document.getElementById(`issue-${i}-ja`)?.value.trim();
        const category = document.getElementById(`issue-${i}-category`)?.value;
        const description = document.getElementById(`issue-${i}-description`)?.value.trim();
        const date = document.getElementById(`issue-${i}-date`)?.value;
        const yesOdds = document.getElementById(`issue-${i}-yes-odds`)?.value || 50;
        const usdt = document.getElementById(`issue-${i}-usdt`)?.value || 100000;
        
        if (ko && category && date) {
            issues.push({
                title_ko: ko,
                title_en: en || ko,
                title_zh: zh || ko,
                title_ja: ja || ko,
                category,
                description,
                expire_date: new Date(date).toISOString(),
                yes_odds: parseFloat(yesOdds),
                initial_usdt: parseFloat(usdt)
            });
        }
    }
    
    if (issues.length === 0) {
        alert('최소 1개 이슈를 입력하세요.');
        return;
    }
    
    // localStorage에 저장
    const existingIssues = JSON.parse(localStorage.getItem('eventbet_issues') || '[]');
    issues.forEach(issue => {
        existingIssues.push({
            ...issue,
            id: `iss_${Date.now()}_${Math.random()}`,
            status: 'active',
            yes_bet: Math.floor(issue.initial_usdt * (issue.yes_odds / 100)),
            no_bet: Math.floor(issue.initial_usdt * ((100 - issue.yes_odds) / 100)),
            createdAt: new Date().toISOString()
        });
    });
    localStorage.setItem('eventbet_issues', JSON.stringify(existingIssues));
    
    alert(`✅ ${issues.length}개 이슈가 등록되었습니다!`);
    closeIssueModal();
    location.reload();
}

// ========== 이슈 일괄 등록 모달 ==========
let issueCardCount = 0;

function openBatchIssueModal() {
    document.getElementById('batch-issue-modal').style.display = 'flex';
    issueCardCount = 0;
    document.getElementById('batch-issues-container').innerHTML = '';
    addIssueCard(); // 첫 번째 카드 자동 추가
}

function closeBatchIssueModal() {
    document.getElementById('batch-issue-modal').style.display = 'none';
}

function addIssueCard() {
    if (issueCardCount >= 5) {
        alert('⚠️ 최대 5개까지만 추가할 수 있습니다.');
        return;
    }
    
    issueCardCount++;
    const container = document.getElementById('batch-issues-container');
    
    const cardHtml = `
        <div class="border-2 border-gray-200 rounded-xl p-6 mb-6 bg-white shadow-sm" id="issue-card-${issueCardCount}">
            <div class="flex justify-between items-center mb-4">
                <h4 class="text-lg font-bold text-blue-600">
                    <i class="fas fa-file-alt mr-2"></i>이슈 #${issueCardCount}
                </h4>
                <button onclick="removeIssueCard(${issueCardCount})" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-times-circle text-xl"></i>
                </button>
            </div>
            
            <!-- 카테고리 -->
            <div class="mb-4">
                <label class="block text-sm font-bold mb-2">
                    <i class="fas fa-folder text-purple-600 mr-1"></i>카테고리 *
                </label>
                <select id="category-${issueCardCount}" class="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                    <option value="">선택</option>
                    <option value="crypto">💰 암호화폐</option>
                    <option value="politics">🏛️ 정치</option>
                    <option value="sports">⚽ 스포츠</option>
                    <option value="entertainment">🎬 엔터테인먼트</option>
                    <option value="economy">📊 경제</option>
                    <option value="science">🔬 과학/기술</option>
                    <option value="climate">🌍 기후/환경</option>
                    <option value="other">📌 기타</option>
                </select>
            </div>
            
            <!-- 4개 언어 제목 -->
            <div class="mb-4">
                <label class="block text-sm font-bold mb-2">
                    <i class="fas fa-heading text-green-600 mr-1"></i>제목 (4개 언어 필수) *
                </label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label class="text-xs text-gray-600">🇰🇷 한국어</label>
                        <input type="text" id="title-ko-${issueCardCount}" 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg" 
                            placeholder="예: 비트코인이 $150K 돌파?" required>
                    </div>
                    <div>
                        <label class="text-xs text-gray-600">🇺🇸 English</label>
                        <input type="text" id="title-en-${issueCardCount}" 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg" 
                            placeholder="e.g., Bitcoin reaches $150K?" required>
                    </div>
                    <div>
                        <label class="text-xs text-gray-600">🇨🇳 中文</label>
                        <input type="text" id="title-zh-${issueCardCount}" 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg" 
                            placeholder="例如：比特币突破$150K？" required>
                    </div>
                    <div>
                        <label class="text-xs text-gray-600">🇯🇵 日本語</label>
                        <input type="text" id="title-ja-${issueCardCount}" 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg" 
                            placeholder="例：ビットコイン$150K突破？" required>
                    </div>
                </div>
            </div>
            
            <!-- 내용 설명 (선택) -->
            <div class="mb-4">
                <label class="block text-sm font-bold mb-2">
                    <i class="fas fa-align-left text-blue-600 mr-1"></i>내용 설명 (선택)
                </label>
                <textarea id="description-${issueCardCount}" rows="3" 
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg" 
                    placeholder="이슈에 대한 간단한 설명..."></textarea>
            </div>
            
            <!-- 설정 그리드 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-bold mb-2">
                        <i class="fas fa-calendar text-red-600 mr-1"></i>결론 결정 기간 *
                    </label>
                    <input type="datetime-local" id="expiredate-${issueCardCount}" 
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                </div>
                <div>
                    <label class="block text-sm font-bold mb-2">
                        <i class="fas fa-percentage text-green-600 mr-1"></i>Yes 배팅 비율 (%)
                    </label>
                    <input type="number" id="yes-odds-${issueCardCount}" value="50" min="0" max="100" 
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-bold mb-2">
                        <i class="fas fa-coins text-yellow-600 mr-1"></i>초기 배팅액 (USDT)
                    </label>
                    <input type="number" id="initial-usdt-${issueCardCount}" value="100000" min="0" step="1000" 
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg">
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', cardHtml);
}

function removeIssueCard(cardId) {
    const card = document.getElementById(`issue-card-${cardId}`);
    if (card) {
        card.remove();
        issueCardCount--;
        
        // 카드 번호 재정렬
        const cards = document.querySelectorAll('[id^="issue-card-"]');
        cards.forEach((card, index) => {
            const newIndex = index + 1;
            const oldId = card.id.match(/\d+/)[0];
            
            // ID 업데이트
            card.id = `issue-card-${newIndex}`;
            card.querySelector('h4').innerHTML = `<i class="fas fa-file-alt mr-2"></i>이슈 #${newIndex}`;
            
            // 내부 input ID도 업데이트
            card.querySelectorAll('[id]').forEach(el => {
                const currentId = el.id;
                el.id = currentId.replace(/-\d+$/, `-${newIndex}`);
            });
            
            // 삭제 버튼 onclick 업데이트
            card.querySelector('button').onclick = () => removeIssueCard(newIndex);
        });
        
        issueCardCount = cards.length;
    }
}

function saveBatchIssues() {
    const issues = [];
    
    for (let i = 1; i <= issueCardCount; i++) {
        const card = document.getElementById(`issue-card-${i}`);
        if (!card) continue;
        
        const category = document.getElementById(`category-${i}`).value;
        const titleKo = document.getElementById(`title-ko-${i}`).value.trim();
        const titleEn = document.getElementById(`title-en-${i}`).value.trim();
        const titleZh = document.getElementById(`title-zh-${i}`).value.trim();
        const titleJa = document.getElementById(`title-ja-${i}`).value.trim();
        const description = document.getElementById(`description-${i}`).value.trim();
        const expiredate = document.getElementById(`expiredate-${i}`).value;
        const yesOdds = parseInt(document.getElementById(`yes-odds-${i}`).value);
        const initialUsdt = parseInt(document.getElementById(`initial-usdt-${i}`).value);
        
        // 필수 필드 검증
        if (!category) {
            alert(`⚠️ 이슈 #${i}: 카테고리를 선택해주세요.`);
            return;
        }
        if (!titleKo || !titleEn || !titleZh || !titleJa) {
            alert(`⚠️ 이슈 #${i}: 4개 언어 제목을 모두 입력해주세요.`);
            return;
        }
        if (!expiredate) {
            alert(`⚠️ 이슈 #${i}: 결론 결정 기간을 선택해주세요.`);
            return;
        }
        
        // 4개 언어별로 각각 이슈 생성
        const languages = [
            { code: 'ko', title: titleKo, name: '한국어' },
            { code: 'en', title: titleEn, name: 'English' },
            { code: 'zh', title: titleZh, name: '中文' },
            { code: 'ja', title: titleJa, name: '日本語' }
        ];
        
        languages.forEach(lang => {
            issues.push({
                id: Date.now() + Math.random(),
                category: category,
                language: lang.code,
                title: lang.title,
                description: description || `${lang.name} 버전`,
                expiredate: expiredate,
                yes_odds: yesOdds,
                initial_usdt: initialUsdt,
                yes_bet: Math.floor(initialUsdt * (yesOdds / 100)),
                no_bet: Math.floor(initialUsdt * ((100 - yesOdds) / 100)),
                createdAt: new Date().toISOString()
            });
        });
    }
    
    if (issues.length === 0) {
        alert('⚠️ 등록할 이슈가 없습니다. 최소 1개 이상의 이슈를 추가해주세요.');
        return;
    }
    
    // localStorage에 저장
    const existingIssues = JSON.parse(localStorage.getItem('eventbet_issues') || '[]');
    existingIssues.push(...issues);
    localStorage.setItem('eventbet_issues', JSON.stringify(existingIssues));
    
    alert(`✅ ${issues.length}개 이슈가 등록되었습니다!\n(${issueCardCount}개 이슈 x 4개 언어 = ${issues.length}개)`);
    closeBatchIssueModal();
    location.reload();
}
