# 🚨 긴급 배포 가이드

## 현재 상황
- ✅ GitHub에 최신 코드 푸시 완료
- ✅ dist/admin/index.html에 버튼 2개 포함
- ✅ 샌드박스 테스트 성공
- ⏳ Cloudflare Pages 배포 대기

## Cloudflare Pages 설정 (1분 작업)

### 1단계: Cloudflare Dashboard 접속
https://dash.cloudflare.com/

### 2단계: GitHub 연동 설정
1. Workers & Pages 클릭
2. predictchain 프로젝트 찾기
3. Settings → Builds & deployments
4. "Connect to Git" 또는 "Set up build configuration" 클릭
5. 아래 설정 입력:

```
Production branch: main
Build command: npm run build
Build output directory: dist
Root directory: (비워둠)
Node.js version: 20
```

6. "Save and Deploy" 클릭

### 3단계: 자동 배포 시작
- GitHub의 main 브랜치에서 자동으로 배포 시작
- 약 2-3분 소요

### 4단계: 배포 완료 후
1. https://predictchain.pages.dev/admin/ 에서 먼저 확인
2. https://cashiq.my/admin/ 에서 확인
3. 구버전 보이면: Cloudflare Dashboard → Caching → Purge Everything
4. 브라우저: Ctrl + Shift + R (강제 새로고침)

## ✅ 성공 확인
- "메인 사이트 일괄 등록" 버튼 (초록색) 보임
- "이슈 일괄 등록" 버튼 (파란색) 보임

## 문제 발생 시
contact: GitHub Issue 또는 Discord
