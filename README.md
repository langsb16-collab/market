# EventBET Market

## 프로젝트 개요

**EventBET**은 예측 마켓 플랫폼으로, 사용자들이 다양한 이벤트에 대해 베팅하고 결과를 예측할 수 있는 웹 애플리케이션입니다.

### 주요 기능

- ✅ **다국어 지원** (한국어, 영어, 중국어, 일본어)
- ✅ **배너 관리** (이미지 또는 유튜브 영상, PC 파일 업로드 지원)
- ✅ **공지사항 시스템** (이미지 첨부 가능)
- ✅ **팝업 관리** (위치/크기 조절, 활성화 설정, PC 파일 업로드)
- ✅ **회원 관리** (로그인, 회원가입)
- ✅ **결산 페이지** (3단계 수수료 시스템: 본사-총판-부총판)
- ✅ **이벤트 베팅 시스템**
- ✅ **AI 챗봇** (24/7 고객 지원, 4개 언어 지원: 한국어/영어/중국어/일본어)

## 배포 URL

### 프로덕션
- **메인 사이트**: https://cashiq.my
- **관리자 페이지**: https://cashiq.my/admin/
- **팝업 테스트**: https://cashiq.my/test-popup.html

### GitHub 저장소
- **Repository**: https://github.com/langsb16-collab/market

## 기술 스택

### Frontend
- **HTML5** - 시맨틱 마크업
- **TailwindCSS** (CDN) - 빠른 스타일링
- **Vanilla JavaScript** - 순수 JS로 구현
- **Font Awesome** - 아이콘

### 데이터 저장
- **GitHub Repository JSON** - 공지사항, 배너, 팝업 중앙 데이터 저장소 (PC/모바일 자동 동기화)
- **GitHub API** - 관리자 페이지에서 데이터 업데이트
- Base64 인코딩으로 이미지 저장

### 배포
- **GitHub Pages** - 정적 사이트 호스팅 (docs/ 폴더)
- **Custom Domain** - cashiq.my

## 프로젝트 구조

```
webapp/
├── docs/                   # GitHub Pages 배포 폴더
│   ├── admin/
│   │   └── index.html     # 관리자 페이지
│   ├── static/
│   │   ├── admin.js       # 관리자 페이지 로직
│   │   ├── app.js         # 메인 앱 로직
│   │   ├── auth.js        # 인증 시스템
│   │   ├── chatbot.js     # AI 챗봇
│   │   ├── notices.js     # 공지사항 시스템
│   │   ├── popup.js       # 팝업 표시 시스템
│   │   └── style.css      # 커스텀 스타일
│   ├── index.html         # 메인 페이지
│   ├── test-popup.html    # 팝업 테스트 페이지
│   └── CNAME              # 커스텀 도메인 설정
├── admin/                  # 소스 파일
├── static/                # 소스 파일
├── package.json
└── README.md
```

## 배포 방법

### GitHub Pages 자동 배포

1. **설정 확인**:
   - GitHub 저장소: Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `/docs`

2. **배포 명령어**:
```bash
# docs 폴더를 GitHub Pages로 배포
npm run deploy
```

3. **수동 배포**:
```bash
# 변경사항 커밋
git add .
git commit -m "Update site"
git push origin main
```

## 데이터 구조

### 배너 (eventbet_banners)
```javascript
{
  id: string,
  title: string,
  type: 'image' | 'youtube',
  image: string,      // URL or base64
  youtube: string,
  link: string,
  createdAt: string
}
```

### 공지사항 (eventbet_notices)
```javascript
{
  id: string,
  title: string,
  content: string,
  image: string,      // URL or base64 (선택)
  createdAt: string
}
```

### 팝업 (eventbet_popups)
```javascript
{
  id: string,
  title: string,
  type: 'image' | 'youtube',
  image: string,      // URL or base64
  youtube: string,
  enabled: boolean,   // 활성화 여부
  top: number,        // cm 단위
  left: number,       // cm 단위
  width: number,      // px 단위
  height: number,     // px 단위
  createdAt: string
}
```

## 관리자 페이지 사용법

### 0. GitHub 설정 (최초 1회)
1. 관리자 페이지 접속: https://cashiq.my/admin/
2. 좌측 사이드바 "GitHub 설정" 클릭
3. GitHub Token 생성:
   - https://github.com/settings/tokens/new 접속
   - Note: "EventBET Admin" 입력
   - Expiration: "No expiration" 선택
   - Scopes: **"repo" 전체 체크** ✅
   - "Generate token" 클릭
   - 생성된 토큰 복사
4. 설정 입력:
   - GitHub Personal Access Token: 생성한 토큰 붙여넣기
   - Repository Owner: `langsb16-collab`
   - Repository Name: `market`
5. "GitHub 설정 저장" 클릭
6. ✅ 완료! 이제 공지/배너/팝업 관리 가능

### 1. 배너 관리
1. 관리자 페이지 접속: https://cashiq.my/admin/
2. "배너 관리" 클릭
3. "배너 추가" 버튼 클릭
4. 배너 정보 입력:
   - 배너 제목
   - 콘텐츠 타입 (이미지/유튜브)
   - 이미지 URL 입력 **또는** PC에서 파일 업로드
   - 링크 URL (선택)
5. 저장

### 2. 공지사항 관리
1. "공지 관리" 클릭
2. "공지 추가" 버튼 클릭
3. 공지 정보 입력:
   - 제목
   - 내용
   - 이미지 URL 입력 **또는** PC에서 파일 업로드 (선택)
4. 저장

### 3. 팝업 관리
1. "팝업 관리" 클릭
2. "팝업 추가" 버튼 클릭
3. 팝업 정보 입력:
   - 팝업 제목
   - 콘텐츠 타입 (이미지/유튜브)
   - 이미지 URL 입력 **또는** PC에서 파일 업로드
   - **팝업 활성화** 체크박스 선택 ✅
   - 위치 설정 (위에서 cm, 왼쪽에서 cm)
   - 크기 설정 (너비 px, 높이 px)
4. 저장

## 팝업 시스템

### 팝업 테스트
1. 테스트 페이지 접속: https://cashiq.my/test-popup.html
2. "✅ 테스트 팝업 생성" 클릭
3. "🚀 팝업 표시 테스트" 클릭
4. "🏠 메인 페이지로 이동" 클릭

### 팝업 기능
- 페이지 로드 1초 후 자동 표시
- 드래그하여 위치 이동 가능
- "오늘 하루 보지 않기" 기능
- 활성화된 팝업만 표시

### 위치 계산
- cm → px 변환: 1cm = 37.8px
- 예: 위에서 10cm = 378px

## 문제 해결

### 팝업이 보이지 않는 경우
1. F12 → Console 확인
2. localStorage 확인: `eventbet_popups`
3. `enabled: true` 확인
4. 브라우저 캐시 삭제
5. 시크릿 모드로 테스트

### GitHub Pages 배포 확인
1. GitHub 저장소 → Actions 탭
2. 배포 상태 확인
3. 5-10분 대기 후 접속

## AI 챗봇 다국어 지원

### 지원 언어
- 🇰🇷 **한국어** (Korean)
- 🇺🇸 **영어** (English)
- 🇨🇳 **중국어** (Chinese)
- 🇯🇵 **일본어** (Japanese)

### 주요 기능
- **21개 질문-답변** 4개 언어 완전 번역
- **자동 언어 감지**: 사용자가 선택한 언어에 따라 자동 전환
- **실시간 언어 전환**: 언어 변경 시 챗봇 내용 즉시 업데이트
- **다국어 키워드 검색**: 각 언어로 키워드 검색 가능
- **카테고리 다국어 지원**: 기본정보, 수수료/배당, 리스크, 이용방법 등

### 사용 방법
1. 웹사이트 우측 상단에서 언어 선택 (KO/EN/中文/日本語)
2. 우측 하단 AI 챗봇 아이콘 클릭
3. 선택한 언어로 질문 목록 표시
4. 질문 클릭 시 해당 언어로 답변 제공

## GitHub Gist 설정 (공지사항 동기화)

### 왜 필요한가요?
PC와 모바일의 localStorage는 완전히 분리되어 있습니다. PC 관리자 페이지에서 등록한 공지사항을 모바일에서도 보려면 **중앙 데이터 저장소**가 필요합니다.

### 1. GitHub Gist 생성
1. GitHub 로그인 → https://gist.github.com/
2. **New gist** 클릭
3. 설정:
   - Filename: `eventbet_notices.json`
   - Content: `[]` (빈 배열)
   - **Public** gist로 생성 (Private 아님!)
4. **Create public gist** 클릭
5. URL에서 Gist ID 복사:
   ```
   https://gist.github.com/username/abc123def456...
                                   ↑ 이 부분이 Gist ID
   ```

### 2. Personal Access Token 생성
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. **Generate new token (classic)** 클릭
3. 설정:
   - Note: `EventBET Notices Read`
   - Expiration: No expiration (또는 1년)
   - Scopes: **gist** 체크 ✅
4. **Generate token** 클릭
5. 토큰 복사 (한 번만 보여줍니다!)

### 3. notices.js 파일 수정
`/home/user/webapp/docs/static/notices.js` 파일 상단:

```javascript
const GIST_CONFIG = {
    GIST_ID: 'abc123def456...',  // ← 여기에 Gist ID 입력
    FILE_NAME: 'eventbet_notices.json',
    ACCESS_TOKEN: 'ghp_xxxxxxxxxxxx'  // ← 여기에 토큰 입력
};
```

### 4. 배포 및 테스트
```bash
git add docs/static/notices.js
git commit -m "Configure GitHub Gist for notices sync"
git push origin main
```

### 5. 초기 데이터 입력
PC에서 관리자 페이지로 공지 등록 후, 브라우저 콘솔에서:
```javascript
// 현재 localStorage 데이터 확인
const notices = JSON.parse(localStorage.getItem('eventbet_notices') || '[]');
console.log(JSON.stringify(notices, null, 2));

// 위 JSON을 복사하여 Gist에 수동으로 붙여넣기
```

**또는 자동 업로드 함수 사용** (콘솔에서 실행):
```javascript
async function uploadToGist() {
    const notices = JSON.parse(localStorage.getItem('eventbet_notices') || '[]');
    const response = await fetch('https://api.github.com/gists/YOUR_GIST_ID', {
        method: 'PATCH',
        headers: {
            'Authorization': 'Bearer YOUR_TOKEN',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            files: {
                'eventbet_notices.json': {
                    content: JSON.stringify(notices, null, 2)
                }
            }
        })
    });
    console.log('Upload result:', await response.json());
}
uploadToGist();
```

## 최근 업데이트

### 2025-01-20
- ✅ **모바일 공지사항 표시 오류 수정**
  - 근본 원인: PC와 모바일 localStorage 분리 문제
  - 해결: GitHub Gist를 중앙 데이터 저장소로 사용
  - PC/모바일 공지사항 완전 동기화 지원

### 2024-11-19
- ✅ **AI 챗봇 다국어 지원 완전 구현**
  - 21개 질문-답변 4개 언어 번역 완료
  - 실시간 언어 전환 기능 추가
  - 챗봇 열 때마다 현재 언어로 자동 업데이트
  - 다국어 키워드 검색 지원
  - 중국어 선택 시 한국어 표시 오류 수정

### 2024-11-18
- ✅ GitHub Pages 전용 구조로 단순화
- ✅ docs/ 폴더 사용으로 배포 간소화
- ✅ Cloudflare Workers 의존성 제거
- ✅ 순수 정적 사이트로 재구성
- ✅ 팝업 시스템 완전 구현
- ✅ PC 파일 업로드 기능 추가

## 라이선스

MIT License

## 문의

프로젝트 관련 문의사항은 GitHub Issues를 통해 제출해주세요.
