/**
 * GitHub Issues Sync Library
 * Gist 기반 이슈 동기화 (서버 API 사용)
 */

class GitHubIssuesSync {
    constructor(config = {}) {
        // 서버 API를 사용하므로 GitHub 설정 불필요
        this.apiEndpoint = '/api/issues';
        this.initialized = false;
        console.log('[GitHubSync] Initialized with server API mode');
    }

    /**
     * 초기화
     */
    async initialize() {
        console.log('[GitHubSync] initialize() called');
        this.initialized = true;
        return true;
    }

    /**
     * 이슈 목록 가져오기
     */
    async getIssues() {
        try {
            console.log('[GitHubSync] Fetching issues from server API...');
            const response = await fetch(this.apiEndpoint);
            const data = await response.json();
            
            if (data.success) {
                console.log(`[GitHubSync] ✅ Loaded ${data.issues.length} issues`);
                return data.issues || [];
            } else {
                console.error('[GitHubSync] Failed to load issues:', data.error);
                return [];
            }
        } catch (error) {
            console.error('[GitHubSync] Error fetching issues:', error);
            return [];
        }
    }

    /**
     * 이슈 추가
     */
    async addIssue(issue) {
        try {
            console.log('[GitHubSync] Adding issue via server API...', issue);
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(issue)
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log('[GitHubSync] ✅ Issue added successfully:', data.id);
                return { success: true, id: data.id, issue: data.issue };
            } else {
                console.error('[GitHubSync] Failed to add issue:', data.error);
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('[GitHubSync] Error adding issue:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 이슈 업데이트
     */
    async updateIssue(id, updates) {
        try {
            console.log('[GitHubSync] Updating issue via server API...', id, updates);
            const response = await fetch(`${this.apiEndpoint}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log('[GitHubSync] ✅ Issue updated successfully');
                return { success: true };
            } else {
                console.error('[GitHubSync] Failed to update issue:', data.error);
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('[GitHubSync] Error updating issue:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 이슈 삭제
     */
    async deleteIssue(id) {
        try {
            console.log('[GitHubSync] Deleting issue via server API...', id);
            const response = await fetch(`${this.apiEndpoint}/${id}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log('[GitHubSync] ✅ Issue deleted successfully');
                return { success: true };
            } else {
                console.error('[GitHubSync] Failed to delete issue:', data.error);
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('[GitHubSync] Error deleting issue:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * 동기화 상태 확인
     */
    isInitialized() {
        return this.initialized;
    }
}

console.log('[GitHubSync] ✅ GitHubIssuesSync class loaded');
