# 🚀 Cloudflare Pages 배포 가이드

## 수정 사항 요약

### ✅ 완료된 수정사항:
1. **관리자 페이지 이슈 편집/삭제 기능 추가**
   - `loadRegisteredIssues()` 함수 - 이슈 목록 표시
   - `editIssue()` 함수 - 이슈 편집
   - `deleteIssue()` 함수 - 이슈 삭제
   - `filterIssues()` 함수 - 상태별 필터링
   - `settleAllExpiredIssues()` 함수 - 만기 이슈 일괄 종료

2. **카테고리 카운트 수정**
   - 카테고리 값을 영어 slug로 통일 (politics, cryptocurrency, sports 등)
   - 카테고리 매핑 개선

3. **로딩 속도 개선**
   - DNS prefetch와 preconnect 추가
   - Tailwind CSS defer 로딩

## 📦 배포 방법

### 방법 1: Cloudflare API Token 사용 (추천)

1. **Cloudflare API Token 설정**
   ```bash
   # Deploy 탭에서 API 키 설정하거나
   # 직접 환경변수 설정
   export CLOUDFLARE_API_TOKEN="your-api-token-here"
   ```

2. **배포 실행**
   ```bash
   cd /home/user/webapp
   npm run build
   npx wrangler pages deploy dist --project-name cashiq
   ```

### 방법 2: Wrangler Login 사용

1. **Wrangler 로그인**
   ```bash
   cd /home/user/webapp
   npx wrangler login
   ```

2. **배포 실행**
   ```bash
   npm run build
   npx wrangler pages deploy dist --project-name cashiq
   ```

### 방법 3: GitHub 연동 자동 배포 (가장 간단)

1. **GitHub에 푸시**
   ```bash
   cd /home/user/webapp
   git push origin main
   ```

2. **Cloudflare Pages 대시보드에서 자동 배포**
   - https://dash.cloudflare.com/
   - Pages 프로젝트 "cashiq" 선택
   - GitHub 연동이 설정되어 있으면 자동으로 배포됨

## 🔍 배포 후 확인사항

### 관리자 페이지 (https://www.cashiq.my/admin/#issues-section)
- [x] "결산 페이지" → "등록된 이슈 목록" 섹션 확인
- [x] 편집 버튼 (🟠) 클릭 → 제목/베팅액 수정 가능
- [x] 삭제 버튼 (🔴) 클릭 → 이슈 삭제 가능
- [x] 상태 필터 작동 (전체/진행중/종료됨)
- [x] "만기일자 일괄 종료" 버튼 작동

### 메인 사이트 (https://www.cashiq.my)
- [x] 페이지 로딩 속도 개선 확인
- [x] 카테고리별 이슈 개수 정확히 표시
- [x] 카테고리 필터링 작동

## 📝 변경된 파일 목록

- `public/static/admin.js` - 이슈 관리 함수 추가
- `public/static/app.js` - 카테고리 매핑 수정
- `index.html` - 로딩 최적화 (DNS prefetch, preconnect)
- `dist/` - 빌드 완료된 파일들

## 🐛 문제 해결

### 배포 실패 시:
1. Cloudflare API Token 확인
2. 프로젝트 이름 확인 (`cashiq`)
3. 빌드 에러 확인: `npm run build`

### 변경사항이 반영되지 않을 때:
1. 브라우저 캐시 강제 새로고침: `Ctrl + Shift + R` (Windows) / `Cmd + Shift + R` (Mac)
2. Cloudflare 캐시 퍼지: Cloudflare Dashboard → Caching → Purge Everything

## 📞 추가 지원

문제가 계속되면:
1. 브라우저 개발자 도구 열기 (F12)
2. Console 탭에서 에러 확인
3. 에러 메시지 복사하여 문의
