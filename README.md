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
- ✅ **AI 챗봇** (24/7 고객 지원)

## 배포 URL

### 프로덕션
- **메인 사이트**: https://cashiq.my
- **관리자 페이지**: https://cashiq.my/admin/

### GitHub Pages
- **메인 사이트**: https://langsb16-collab.github.io/market/
- **관리자 페이지**: https://langsb16-collab.github.io/market/admin/

### GitHub 저장소
- **Repository**: https://github.com/langsb16-collab/market

## 기술 스택

### Frontend
- **HTML5** - 시맨틱 마크업
- **TailwindCSS** (CDN) - 빠른 스타일링
- **Vanilla JavaScript** - 순수 JS로 구현
- **Font Awesome** - 아이콘

### Backend
- **Hono** - 경량 웹 프레임워크
- **Vite** - 빌드 도구

### 데이터 저장
- **LocalStorage** - 클라이언트 사이드 데이터 저장
- Base64 인코딩으로 이미지 저장

### 배포
- **GitHub Pages** - 정적 사이트 호스팅
- **Custom Domain** - cashiq.my

## 프로젝트 구조

```
webapp/
├── admin/                  # 관리자 페이지
│   └── index.html
├── public/                 # 정적 파일 (배포용)
│   ├── admin/
│   │   └── index.html
│   ├── static/
│   │   ├── admin.js       # 관리자 페이지 로직
│   │   ├── app.js         # 메인 앱 로직
│   │   ├── auth.js        # 인증 시스템
│   │   ├── chatbot.js     # AI 챗봇
│   │   ├── notices.js     # 공지사항 시스템
│   │   ├── popup.js       # 팝업 표시 시스템
│   │   └── style.css      # 커스텀 스타일
│   ├── index.html         # 메인 페이지
│   └── CNAME              # 커스텀 도메인 설정
├── static/                # 소스 파일
├── src/                   # Hono 백엔드
│   └── index.tsx
├── dist/                  # 빌드 결과물
├── package.json
├── vite.config.ts
└── README.md
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

### 수수료 설정 (eventbet_fee_settings)
```javascript
{
  total: number,           // 총 수수료 (기본 7%)
  headquarters: number,    // 본사 수수료 (기본 3%)
  distributor: number,     // 총판 수수료 (기본 2.5%)
  subdistributor: number   // 부총판 수수료 (기본 1.5%)
}
```

## 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/langsb16-collab/market.git
cd market

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
# Vite 개발 서버
npm run dev

# 또는 Wrangler Pages 개발 서버 (로컬 D1 포함)
npm run dev:sandbox
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과물은 dist/ 폴더에 생성됩니다
```

### 배포

```bash
# GitHub Pages에 배포
npm run deploy:gh-pages

# Cloudflare Pages에 배포 (선택)
npm run deploy:prod
```

## 관리자 페이지 사용법

### 1. 배너 관리
1. 관리자 페이지 접속
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

**팝업 기능:**
- 드래그하여 위치 이동 가능
- "오늘 하루 보지 않기" 기능
- 활성화된 팝업만 메인 페이지에 표시

### 4. 결산 페이지
1. "결산 페이지" 클릭
2. 수수료 설정:
   - 총 수수료 (기본 7%)
   - 본사, 총판, 부총판 비율 조정
3. 이슈별 수동 결산:
   - YES/NO 버튼으로 승자 선택
4. 만료된 이슈 일괄 결산:
   - "만료된 이슈 자동 결산" 버튼 클릭

## 팝업 시스템 상세

### 팝업 표시 로직
- 페이지 로드 1초 후 자동 표시
- `enabled: true` 인 팝업만 표시
- SessionStorage로 "오늘 하루 보지 않기" 관리

### 위치 계산
- cm → px 변환: 1cm = 37.8px
- 예: 위에서 10cm = 378px, 왼쪽에서 5cm = 189px

### 팝업 스타일
- 그라데이션 헤더 (보라색 → 자주색)
- 둥근 모서리 (12px)
- 그림자 효과
- 드래그 가능

## 최근 업데이트

### 2024-11-18
- ✅ PC 파일 업로드 기능 추가 (배너, 공지, 팝업)
- ✅ 팝업 활성화 체크박스 UI 개선
- ✅ 팝업 크기 조절 기능 추가 (너비/높이 px)
- ✅ 팝업 표시 시스템 구현 (popup.js)
- ✅ GitHub Pages 배포 자동화
- ✅ CNAME 파일 추가 (cashiq.my)
- ✅ 모든 정적 파일을 public/ 폴더로 통합

### 완료된 기능
1. **이미지 파일 업로드**
   - Base64 인코딩
   - 5MB 크기 제한
   - 실시간 미리보기
   - URL 입력과 파일 업로드 선택 가능

2. **팝업 시스템**
   - 위치 조절 (cm 단위)
   - 크기 조절 (px 단위)
   - 활성화/비활성화 토글
   - 드래그 가능
   - "오늘 하루 보지 않기" 기능

3. **결산 시스템**
   - 3단계 수수료 구조
   - 수동 결산 (이슈별)
   - 자동 결산 (만료된 이슈)
   - 날짜별 집계

## 문제 해결

### 팝업이 보이지 않는 경우
1. 브라우저 캐시 삭제 (Ctrl+Shift+Delete)
2. 관리자 페이지에서 "팝업 활성화" 체크 확인
3. localStorage 확인: `eventbet_popups`
4. 개발자 도구 콘솔 확인 (F12)

### GitHub Pages 배포 실패
1. gh-pages 브랜치 확인
2. CNAME 파일 확인
3. GitHub 저장소 Settings > Pages 설정 확인

### 이미지 업로드 실패
1. 파일 크기 확인 (5MB 이하)
2. 파일 형식 확인 (이미지만 가능)
3. 브라우저 콘솔 에러 메시지 확인

## 라이선스

MIT License

## 문의

프로젝트 관련 문의사항은 GitHub Issues를 통해 제출해주세요.

## 업데이트 상태

- **마지막 업데이트**: 2024-11-18
- **배포 상태**: ✅ Active
- **GitHub Pages**: https://cashiq.my
- **플랫폼**: GitHub Pages
