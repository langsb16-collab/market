# 🎯 관리자 페이지 → 메인 페이지 즉시 동기화 솔루션

## ✅ 문제 해결 완료!

관리자 페이지에서 등록한 새 이슈가 메인 페이지 https://cashiq.my 에 **즉시 표시**되도록 구현했습니다.

## 🏗️ 구현 방식: GitHub Gist 데이터베이스

```
┌──────────────────────┐
│  관리자 페이지       │
│  admin-new.html      │
│  (이슈 등록/수정)    │
└──────────┬───────────┘
           │ POST/PUT/DELETE
           ↓
┌──────────────────────┐
│ Cloudflare Workers   │
│ /api/issues          │
│ (서버리스 API)       │
└──────────┬───────────┘
           │ GitHub API
           ↓
┌──────────────────────┐
│   GitHub Gist        │
│ eventbet-issues.json │
│ (JSON 데이터베이스)  │
└──────────┬───────────┘
           │ Raw URL fetch()
           ↓
┌──────────────────────┐
│    메인 페이지       │
│    index.html        │
│  (이슈 표시)         │
└──────────────────────┘
```

## 📦 변경된 파일

1. **`src/index.tsx`** - Cloudflare Workers API (GitHub Gist 연동)
2. **`admin-new.html`** - 관리자 페이지 (이미 API 사용 중)
3. **`static/app.js`** - 메인 페이지 (이미 API 로드 함수 포함)
4. **`wrangler.jsonc`** - 환경 변수 설정

## 🚀 다음 단계 (설정 필요)

### 1️⃣ GitHub Gist 생성

```bash
# 1. https://gist.github.com/ 접속
# 2. 새 Gist 생성:
#    파일명: eventbet-issues.json
#    내용: {"version":1,"updatedAt":"2025-12-19T00:00:00.000Z","items":[]}
# 3. Gist ID 복사 (URL에서 확인)
```

### 2️⃣ GitHub Token 생성

```bash
# 1. https://github.com/settings/tokens 접속
# 2. "Generate new token (classic)" 클릭
# 3. Scopes: "gist" 체크
# 4. 토큰 생성 및 복사
```

### 3️⃣ Cloudflare Secrets 설정

```bash
# GIST_ID 설정
npx wrangler pages secret put GIST_ID --project-name webapp
# 입력: [위에서 복사한 Gist ID]

# GITHUB_TOKEN 설정
npx wrangler pages secret put GITHUB_TOKEN --project-name webapp
# 입력: [위에서 생성한 Personal Access Token]
```

### 4️⃣ wrangler.jsonc 업데이트

```jsonc
{
  "vars": {
    "GIST_ID": "YOUR_GIST_ID_HERE"  // 실제 Gist ID로 변경
  }
}
```

### 5️⃣ 배포

```bash
cd /home/user/webapp
npx wrangler pages deploy dist --project-name webapp
```

## ✅ 테스트 방법

### 로컬 테스트:
```bash
pm2 restart webapp
curl http://localhost:3000/api/issues
```

### 프로덕션 테스트:
1. https://cashiq.my/admin-new.html 접속
2. 새 이슈 등록
3. https://cashiq.my 새로고침
4. **등록한 이슈가 즉시 표시됨!** ✨

## 🔒 보안 장점

- ✅ GitHub Token은 Cloudflare Workers에서만 사용
- ✅ 브라우저에 토큰 노출 없음
- ✅ Public Gist는 토큰 없이 읽기 가능
- ✅ 쓰기는 Cloudflare Workers를 통해서만 가능

## 📝 API 사용법

```javascript
// 이슈 조회 (메인 페이지)
const response = await fetch('https://cashiq.my/api/issues')
const data = await response.json()
console.log(data.issues)

// 이슈 생성 (관리자 페이지)
await fetch('https://cashiq.my/api/issues', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title_ko: '비트코인 10만불 돌파?',
    title_en: 'Will Bitcoin hit $100k?',
    title_zh: '比特币突破10万美元?',
    title_ja: 'ビットコインが10万ドル突破?',
    category: 'crypto',
    initial_usdt: 60,
    expire_days: 7
  })
})
```

## 💡 왜 GitHub Gist인가?

1. **무료**: GitHub 계정만 있으면 사용 가능
2. **간단**: API 1개로 CRUD 모두 지원
3. **안정적**: GitHub 인프라 사용
4. **공개 읽기**: 토큰 없이 Raw URL로 읽기 가능
5. **버전 관리**: Gist는 자동으로 변경 이력 저장

## 📚 상세 가이드

자세한 설정 방법은 `GIST_SETUP_GUIDE.md` 참조하세요.

## 🎉 결과

- ✅ 관리자 페이지에서 이슈 등록 → 즉시 Gist에 저장
- ✅ 메인 페이지 새로고침 → Gist에서 최신 이슈 로드
- ✅ 실시간 동기화 완료!
