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
    if (section === 'issues') loadBatchIssuesForm();
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

// ============================================
// 📌 이슈 등록 기능
// ============================================

function openIssueModal() {
    const modal = document.getElementById('issue-modal');
    modal.classList.add('active');
    
    // 폼 초기화
    document.getElementById('issue-title').value = '';
    document.getElementById('issue-description').value = '';
    document.getElementById('issue-category').value = '';
    document.getElementById('issue-expiredate').value = '';
    document.getElementById('issue-image').value = '';
    
    // 기본 만료일을 7일 후로 설정
    const defaultExpireDate = new Date();
    defaultExpireDate.setDate(defaultExpireDate.getDate() + 7);
    const formattedDate = defaultExpireDate.toISOString().slice(0, 16);
    document.getElementById('issue-expiredate').value = formattedDate;
}

function closeIssueModal() {
    document.getElementById('issue-modal').classList.remove('active');
}

function saveIssue(event) {
    event.preventDefault();
    
    const title = document.getElementById('issue-title').value.trim();
    const description = document.getElementById('issue-description').value.trim();
    const category = document.getElementById('issue-category').value;
    const expireDate = document.getElementById('issue-expiredate').value;
    const image = document.getElementById('issue-image').value.trim();
    
    if (!title || !category || !expireDate) {
        alert('필수 항목을 모두 입력해주세요.');
        return;
    }
    
    // 만료일이 현재 시간보다 이후인지 확인
    if (new Date(expireDate) <= new Date()) {
        alert('만료일은 현재 시간 이후여야 합니다.');
        return;
    }
    
    const issues = JSON.parse(localStorage.getItem('eventbet_issues') || '[]');
    
    const newIssue = {
        id: Date.now().toString(),
        title: title,
        description: description,
        category: category,
        image: image || 'https://via.placeholder.com/400x200?text=EventBET',
        expireDate: expireDate,
        status: 'active',
        yesBet: 0,
        noBet: 0,
        createdAt: new Date().toISOString()
    };
    
    issues.unshift(newIssue);
    localStorage.setItem('eventbet_issues', JSON.stringify(issues));
    
    alert('이슈가 성공적으로 등록되었습니다!');
    closeIssueModal();
    loadIssues();
}

// ============================================
// 📌 이슈 일괄 등록 기능 (4개 국어 x 5개 = 20개)
// ============================================

function loadBatchIssuesForm() {
    // 폼이 이미 로드되어 있으면 아무것도 하지 않음
}

function saveBatchIssues() {
    const category = document.getElementById('issue-batch-category').value;
    const daysToExpire = parseInt(document.getElementById('issue-batch-days').value);
    const initialUsdt = parseFloat(document.getElementById('issue-batch-usdt')?.value || 60);
    
    const languages = ['en', 'ko', 'zh', 'ja'];
    const languageNames = {
        'en': 'English',
        'ko': '한국어',
        'zh': '中文',
        'ja': '日本語'
    };
    
    const issues = JSON.parse(localStorage.getItem('eventbet_issues') || '[]');
    let addedCount = 0;
    
    // 만료일 계산
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + daysToExpire);
    const expireDateISO = expireDate.toISOString().slice(0, 16);
    
    // 각 언어별로 5개씩 이슈 등록
    languages.forEach(lang => {
        for (let i = 1; i <= 5; i++) {
            const inputId = `issue-${lang}-${i}`;
            const title = document.getElementById(inputId)?.value.trim();
            
            if (title) {
                // 초기 USDT를 YES/NO에 랜덤 분배 (30-70% 비율)
                const yesRatio = 0.3 + Math.random() * 0.4; // 30-70%
                const yesBet = Math.floor(initialUsdt * yesRatio);
                const noBet = initialUsdt - yesBet;
                
                const newIssue = {
                    id: `${Date.now()}-${lang}-${i}`,
                    title: title,
                    description: `${languageNames[lang]} - Issue ${i}`,
                    category: category,
                    image: 'https://via.placeholder.com/400x200?text=EventBET',
                    expireDate: expireDateISO,
                    status: 'active',
                    yesBet: yesBet,
                    noBet: noBet,
                    initialUsdt: initialUsdt,
                    language: lang,
                    createdAt: new Date().toISOString()
                };
                
                issues.unshift(newIssue);
                addedCount++;
            }
        }
    });
    
    localStorage.setItem('eventbet_issues', JSON.stringify(issues));
    
    // 저장 확인
    const saved = JSON.parse(localStorage.getItem('eventbet_issues') || '[]');
    console.log('✅ Issues saved to localStorage:', saved.length);
    console.log('✅ First 3 issues:', saved.slice(0, 3));
    
    alert(`총 ${addedCount}개의 이슈가 성공적으로 등록되었습니다!\n\nlocalStorage에 ${saved.length}개 저장 확인됨`);
    
    // 폼 초기화
    languages.forEach(lang => {
        for (let i = 1; i <= 5; i++) {
            const inputId = `issue-${lang}-${i}`;
            const input = document.getElementById(inputId);
            if (input) input.value = '';
        }
    });
}
