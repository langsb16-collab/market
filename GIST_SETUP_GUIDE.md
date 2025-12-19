# GitHub Gist 기반 이슈 관리 시스템 설정 가이드

## 📋 개요

cashiq.my (GitHub Pages)에서 관리자 페이지의 이슈가 메인 페이지에 즉시 표시되도록 하기 위해 **GitHub Gist를 데이터베이스로 사용**하는 시스템을 구현했습니다.

## 🔧 구조

```
관리자 페이지 (admin-new.html)
    ↓
Cloudflare Workers API (/api/issues)
    ↓
GitHub Gist (eventbet-issues.json)
    ↓
메인 페이지 (index.html)
```

## 🚀 설정 단계

### 1단계: GitHub Gist 생성

1. https://gist.github.com/ 접속
2. "New gist" 클릭
3. 아래 내용으로 Gist 생성:

**Filename:** `eventbet-issues.json`

**Content:**
```json
{
  "version": 1,
  "updatedAt": "2025-12-19T00:00:00.000Z",
  "items": []
}
```

4. "Create public gist" 클릭
5. 생성된 Gist의 ID 복사 (URL에서: `https://gist.github.com/USERNAME/[GIST_ID]`)

### 2단계: Cloudflare에 GitHub Token 설정

1. GitHub Personal Access Token 생성:
   - https://github.com/settings/tokens 접속
   - "Generate new token (classic)" 클릭
   - **Scopes 선택:** `gist` 체크
   - 토큰 생성 후 복사

2. Cloudflare Pages에 Secrets 설정:
   ```bash
   # GIST_ID 설정
   npx wrangler pages secret put GIST_ID --project-name webapp
   # 위에서 복사한 Gist ID 입력
   
   # GITHUB_TOKEN 설정
   npx wrangler pages secret put GITHUB_TOKEN --project-name webapp
   # 위에서 생성한 Personal Access Token 입력
   ```

### 3단계: wrangler.jsonc 업데이트

`/home/user/webapp/wrangler.jsonc` 파일에서:

```jsonc
{
  "vars": {
    "GIST_ID": "YOUR_ACTUAL_GIST_ID_HERE"  // 1단계에서 복사한 Gist ID로 변경
  }
}
```

### 4단계: 배포

```bash
cd /home/user/webapp
npm run build  # 빌드 (있을 경우)
npx wrangler pages deploy dist --project-name webapp
```

## ✅ 동작 확인

### 로컬 테스트:
```bash
# 서비스 재시작
pm2 restart webapp

# API 테스트
curl http://localhost:3000/api/issues
```

### 프로덕션 테스트:
1. 관리자 페이지 접속: https://cashiq.my/admin-new.html
2. 새 이슈 등록
3. 메인 페이지 새로고침: https://cashiq.my
4. 등록한 이슈가 즉시 표시되는지 확인

## 📡 API 엔드포인트

- **GET** `/api/issues` - 모든 이슈 조회
- **POST** `/api/issues` - 새 이슈 생성
- **PUT** `/api/issues/:id` - 이슈 수정
- **DELETE** `/api/issues/:id` - 이슈 삭제

## 🔒 보안

- ✅ GitHub Token은 Cloudflare Secrets에 안전하게 저장
- ✅ 브라우저에 토큰 노출 없음
- ✅ Raw Gist URL로 읽기 (토큰 불필요)
- ✅ Cloudflare Workers를 통해서만 쓰기 가능

## 📝 데이터 형식

```json
{
  "version": 1,
  "updatedAt": "2025-12-19T07:30:00.000Z",
  "items": [
    {
      "id": "iss_1734567890123",
      "title_ko": "비트코인 10만불 돌파?",
      "title_en": "Will Bitcoin hit $100k?",
      "title_zh": "比特币突破10万美元?",
      "title_ja": "ビットコインが10万ドル突破?",
      "category": "crypto",
      "initial_usdt": 60,
      "yes_bet": 30,
      "no_bet": 30,
      "expire_days": 7,
      "expire_date": "2025-12-26T00:00:00.000Z",
      "status": "active",
      "createdAt": "2025-12-19T00:00:00.000Z",
      "updatedAt": "2025-12-19T00:00:00.000Z"
    }
  ]
}
```

## 🐛 문제 해결

### API가 작동하지 않을 때:
1. Cloudflare Secrets 확인: `npx wrangler pages secret list --project-name webapp`
2. Gist가 Public인지 확인
3. GitHub Token에 `gist` 권한이 있는지 확인

### 이슈가 표시되지 않을 때:
1. 브라우저 캐시 삭제
2. Gist URL 직접 접속하여 데이터 확인:
   `https://gist.githubusercontent.com/langsb16-collab/[GIST_ID]/raw/eventbet-issues.json`
3. 브라우저 콘솔에서 에러 확인

## 📞 지원

문제가 발생하면 다음을 확인하세요:
- GitHub Gist가 정상적으로 생성되었는지
- Cloudflare Secrets이 올바르게 설정되었는지
- wrangler.jsonc의 GIST_ID가 올바른지
