// EventBET Gist Sync System - 통합 데이터 동기화
// GitHub Gist를 중앙 데이터 저장소로 사용하여 PC와 모바일 간 데이터 공유

// GitHub Gist 설정
// 보안상 토큰을 직접 코드에 넣지 않고 브라우저에서 입력받습니다
const GIST_CONFIG = {
    GIST_ID: '1c5fc81907b3069183cd64afa04abfbb',
    get ACCESS_TOKEN() {
        return localStorage.getItem('gist_token') || 'YOUR_TOKEN_HERE';
    },
    FILES: {
        NOTICES: 'eventbet_notices.json',
        BANNERS: 'eventbet_banners.json',
        POPUPS: 'eventbet_popups.json'
    }
};

// 토큰 설정 함수 (관리자 페이지에서 한 번만 실행)
function setGistToken(token) {
    localStorage.setItem('gist_token', token);
    console.log('[GIST] Token saved to localStorage');
    alert('✅ Gist 토큰이 저장되었습니다!\n\n이제 동기화 버튼을 사용할 수 있습니다.');
}

// Gist에서 데이터 가져오기 (범용)
async function fetchFromGist(fileName, localStorageKey) {
    try {
        console.log(`[GIST] Fetching ${fileName} from Gist...`);
        
        if (GIST_CONFIG.GIST_ID === 'YOUR_GIST_ID_HERE') {
            console.warn(`[GIST] Gist not configured, using localStorage`);
            return JSON.parse(localStorage.getItem(localStorageKey) || '[]');
        }
        
        const response = await fetch(`https://api.github.com/gists/${GIST_CONFIG.GIST_ID}`);
        
        if (!response.ok) {
            console.error(`[GIST] Fetch failed:`, response.status);
            return JSON.parse(localStorage.getItem(localStorageKey) || '[]');
        }
        
        const gist = await response.json();
        const fileContent = gist.files[fileName]?.content;
        
        if (!fileContent) {
            console.warn(`[GIST] File ${fileName} not found in Gist`);
            return JSON.parse(localStorage.getItem(localStorageKey) || '[]');
        }
        
        const data = JSON.parse(fileContent);
        console.log(`[GIST] Fetched ${data.length} items from ${fileName}`);
        
        // localStorage에 캐시 (오프라인 대비)
        localStorage.setItem(localStorageKey, JSON.stringify(data));
        
        return data;
    } catch (error) {
        console.error(`[GIST] Fetch error for ${fileName}:`, error);
        return JSON.parse(localStorage.getItem(localStorageKey) || '[]');
    }
}

// Gist에 데이터 업로드 (범용)
async function uploadToGist(fileName, localStorageKey) {
    try {
        if (GIST_CONFIG.GIST_ID === 'YOUR_GIST_ID_HERE') {
            console.warn('[GIST] Gist not configured, skipping upload');
            return false;
        }
        
        const data = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
        console.log(`[GIST] Uploading ${data.length} items to ${fileName}...`);
        
        const response = await fetch(`https://api.github.com/gists/${GIST_CONFIG.GIST_ID}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${GIST_CONFIG.ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                files: {
                    [fileName]: {
                        content: JSON.stringify(data, null, 2)
                    }
                }
            })
        });
        
        if (!response.ok) {
            console.error(`[GIST] Upload failed:`, response.status);
            return false;
        }
        
        console.log(`[GIST] Successfully uploaded ${fileName}`);
        return true;
    } catch (error) {
        console.error(`[GIST] Upload error for ${fileName}:`, error);
        return false;
    }
}

// 공지사항 동기화
async function syncNotices() {
    return {
        fetch: () => fetchFromGist(GIST_CONFIG.FILES.NOTICES, 'eventbet_notices'),
        upload: () => uploadToGist(GIST_CONFIG.FILES.NOTICES, 'eventbet_notices')
    };
}

// 배너 동기화
async function syncBanners() {
    return {
        fetch: () => fetchFromGist(GIST_CONFIG.FILES.BANNERS, 'eventbet_banners'),
        upload: () => uploadToGist(GIST_CONFIG.FILES.BANNERS, 'eventbet_banners')
    };
}

// 팝업 동기화
async function syncPopups() {
    return {
        fetch: () => fetchFromGist(GIST_CONFIG.FILES.POPUPS, 'eventbet_popups'),
        upload: () => uploadToGist(GIST_CONFIG.FILES.POPUPS, 'eventbet_popups')
    };
}

// 모든 데이터 동기화
async function syncAllData() {
    console.log('[GIST] Syncing all data...');
    
    const results = await Promise.all([
        uploadToGist(GIST_CONFIG.FILES.NOTICES, 'eventbet_notices'),
        uploadToGist(GIST_CONFIG.FILES.BANNERS, 'eventbet_banners'),
        uploadToGist(GIST_CONFIG.FILES.POPUPS, 'eventbet_popups')
    ]);
    
    const successCount = results.filter(r => r).length;
    console.log(`[GIST] Sync complete: ${successCount}/3 successful`);
    
    return successCount === 3;
}

// 전역 함수로 노출
window.GistSync = {
    syncNotices,
    syncBanners,
    syncPopups,
    syncAllData,
    fetchFromGist,
    uploadToGist,
    GIST_CONFIG
};

console.log('[GIST] Sync system loaded');
