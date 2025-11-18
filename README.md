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
- **LocalStorage** - 클라이언트 사이드 데이터 저장
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

## 최근 업데이트

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
