// GitHub API Helper for EventBET Admin
// PC와 모바일 간 자동 동기화를 위한 GitHub Repository 기반 데이터 저장

class GitHubAPI {
    constructor() {
        this.token = localStorage.getItem('github_token') || '';
        this.owner = localStorage.getItem('github_owner') || '';
        this.repo = localStorage.getItem('github_repo') || '';
        this.branch = 'main';
    }
    
    // GitHub 설정 저장
    saveConfig(token, owner, repo) {
        this.token = token;
        this.owner = owner;
        this.repo = repo;
        localStorage.setItem('github_token', token);
        localStorage.setItem('github_owner', owner);
        localStorage.setItem('github_repo', repo);
    }
    
    // GitHub 설정 확인
    isConfigured() {
        return this.token && this.owner && this.repo;
    }
    
    // 파일 가져오기
    async getFile(path) {
        try {
            const response = await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`,
                {
                    headers: {
                        'Authorization': `token ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );
            
            if (!response.ok) {
                if (response.status === 404) {
                    return null; // 파일이 없음
                }
                throw new Error(`GitHub API Error: ${response.status}`);
            }
            
            const data = await response.json();
            return {
                content: JSON.parse(atob(data.content)),
                sha: data.sha
            };
        } catch (error) {
            console.error('Failed to get file:', error);
            throw error;
        }
    }
    
    // 파일 업데이트 (생성 또는 수정)
    async updateFile(path, content, message) {
        try {
            // 기존 파일의 SHA 가져오기
            const existingFile = await this.getFile(path);
            
            const body = {
                message: message,
                content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
                branch: this.branch
            };
            
            // 파일이 존재하면 SHA 추가
            if (existingFile) {
                body.sha = existingFile.sha;
            }
            
            const response = await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`GitHub API Error: ${response.status} - ${errorData.message}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to update file:', error);
            throw error;
        }
    }
}

// 전역 인스턴스
window.githubAPI = new GitHubAPI();
