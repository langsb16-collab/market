# 🚨 바로 복구용 DB.D1 까지 - 즉시 복구 가이드

**백업 생성 시각**: 2026-04-28 21:38 UTC  
**백업 이름**: 바로 복구용 DB.D1 까지

---

## 📦 백업 내용

### ✅ D1 데이터베이스 백업
1. **로컬 개발 DB**: `backup-d1-local-final-v2.sql` (55 KB, 292 lines)
2. **프로덕션 DB**: `backup-d1-production-final.sql` (114 KB, 293 lines)

### ✅ 소스 코드
- 전체 프로젝트 파일 (`/home/user/webapp/`)
- 캐시 강제 삭제 스크립트 포함 (v3)
- 텍스트 변경사항 반영 완료

### ✅ 데이터베이스 정보
- **데이터베이스 이름**: cashiq-db
- **Database ID**: c61bfbe7-d512-4a6b-8e61-c420eeb6a261
- **바인딩 이름**: DB
- **총 이슈 수**: 151개
- **카테고리**: 8개 (Climate, Culture, Economy, Entertainment, Politics, Science, Sports, Technology)

---

## 🔧 A) 전체 시스템 즉시 복구

### 1단계: 백업 다운로드 및 압축 해제
```bash
# 백업 파일 다운로드 (download link will be provided)
wget [BACKUP_URL] -O cashiq-backup.tar.gz

# 압축 해제
tar -xzf cashiq-backup.tar.gz
cd webapp
```

### 2단계: 의존성 설치
```bash
npm install
```

### 3단계: D1 데이터베이스 복구

#### 프로덕션 DB 복구
```bash
# Cloudflare API 토큰 설정
export CLOUDFLARE_API_TOKEN="your-token-here"

# 프로덕션 데이터베이스 복구
npx wrangler d1 execute cashiq-db \
  --file=./backup-d1-production-final.sql
```

#### 로컬 개발 DB 복구
```bash
# 로컬 데이터베이스 복구
npx wrangler d1 execute cashiq-db --local \
  --file=./backup-d1-local-final-v2.sql
```

### 4단계: 빌드 및 배포
```bash
# 프로젝트 빌드
npm run build

# Cloudflare Pages 배포
npx wrangler pages deploy dist --project-name cashiq
```

### 5단계: 데이터 검증
```bash
# 이슈 수 확인
npx wrangler d1 execute cashiq-db \
  --command="SELECT COUNT(*) as total FROM issues"
# 예상 결과: 151

# 카테고리 확인
npx wrangler d1 execute cashiq-db \
  --command="SELECT DISTINCT category FROM issues"
# 예상 결과: 8개 카테고리
```

---

## 🗄️ B) 데이터베이스만 복구

### 프로덕션 DB 복구
```bash
export CLOUDFLARE_API_TOKEN="your-token-here"

npx wrangler d1 execute cashiq-db \
  --file=./backup-d1-production-final.sql

# 검증
npx wrangler d1 execute cashiq-db \
  --command="SELECT COUNT(*) FROM issues"
```

### 로컬 DB 복구
```bash
npx wrangler d1 execute cashiq-db --local \
  --file=./backup-d1-local-final-v2.sql

# 검증
npx wrangler d1 execute cashiq-db --local \
  --command="SELECT COUNT(*) FROM issues"
```

---

## 💻 C) 로컬 개발 환경 복구

```bash
# 1. 압축 해제
tar -xzf cashiq-backup.tar.gz
cd webapp

# 2. 의존성 설치
npm install

# 3. 로컬 DB 복구
npx wrangler d1 execute cashiq-db --local \
  --file=./backup-d1-local-final-v2.sql

# 4. 빌드
npm run build

# 5. 로컬 개발 서버 시작
pm2 start ecosystem.config.cjs

# 6. 테스트
curl http://localhost:3000/api/issues
```

---

## 🔍 데이터베이스 스키마

```sql
CREATE TABLE issues (
  id TEXT PRIMARY KEY,
  title_ko TEXT NOT NULL,
  title_en TEXT,
  title_zh TEXT,
  title_ja TEXT,
  category TEXT NOT NULL,
  category_slug TEXT,
  initial_usdt REAL DEFAULT 60,
  yes_bet REAL DEFAULT 0,
  no_bet REAL DEFAULT 0,
  expire_days INTEGER DEFAULT 7,
  expire_date TEXT,
  end_date TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  total_volume REAL DEFAULT 0,
  participants INTEGER DEFAULT 0
);
```

---

## 📊 복구 후 검증 쿼리

### 1. 전체 이슈 수 확인
```bash
npx wrangler d1 execute cashiq-db \
  --command="SELECT COUNT(*) as total FROM issues"
```
**예상 결과**: 151

### 2. 카테고리별 이슈 수
```bash
npx wrangler d1 execute cashiq-db \
  --command="SELECT category, COUNT(*) as count FROM issues GROUP BY category"
```

### 3. 최근 생성된 이슈 5개
```bash
npx wrangler d1 execute cashiq-db \
  --command="SELECT id, title_ko, category FROM issues ORDER BY created_at DESC LIMIT 5"
```

### 4. 샘플 데이터 조회
```bash
npx wrangler d1 execute cashiq-db \
  --command="SELECT id, title_ko, yes_bet, no_bet FROM issues LIMIT 3"
```

---

## 🌐 배포 URL 확인

### API 테스트
```bash
# 전체 이슈 조회
curl https://www.cashiq.my/api/issues

# 특정 이슈 조회
curl https://www.cashiq.my/api/issues/iss_1777381451907
```

### 프론트엔드 확인
- **프로덕션**: https://www.cashiq.my
- **관리자**: https://www.cashiq.my/admin-new
- **최신 배포**: https://e136a8a9.cashiq-e8i.pages.dev

---

## 🎯 변경된 텍스트 확인

복구 후 다음 텍스트가 올바르게 표시되는지 확인:

1. **"가장 빠른 전송 암호화폐 테더 USDT"**
   - 위치: 메인 페이지 히어로 섹션, "₮ USDT (Tether)" 아래

2. **"전 세계 이슈와 당신의 예측을 등록해 승부 내는 곳"**
   - 위치: 메인 페이지 히어로 부제목, "Where Global Events Meet Your Predictions" 아래

### 검증 명령어
```bash
curl -s "https://www.cashiq.my" | grep "가장 빠른 전송"
curl -s "https://www.cashiq.my" | grep "예측을 등록해 승부"
```

---

## 🚨 긴급 복구 체크리스트

- [ ] 백업 파일 다운로드 및 압축 해제
- [ ] npm install 실행
- [ ] D1 데이터베이스 복구 (로컬 또는 프로덕션)
- [ ] 데이터 검증 (SELECT COUNT(*) FROM issues = 151)
- [ ] npm run build 실행
- [ ] Cloudflare Pages 배포
- [ ] API 엔드포인트 테스트 (/api/issues)
- [ ] 프론트엔드 텍스트 확인
- [ ] 관리자 페이지 동작 확인 (/admin-new)

---

## 📞 중요 정보

### Cloudflare 설정
- **Account ID**: e5dd8903a1e55abe924fd98b8636bbfe
- **Project**: cashiq
- **Database ID**: c61bfbe7-d512-4a6b-8e61-c420eeb6a261
- **Production Branch**: main

### GitHub
- **저장소**: https://github.com/langsb16-collab/market
- **최신 커밋**: a4bd892 (cache busting v3)

### 기술 스택
- **Backend**: Hono (TypeScript)
- **Database**: Cloudflare D1 (SQLite)
- **Frontend**: Vanilla JS + TailwindCSS
- **Deployment**: Cloudflare Pages

---

## ✅ 백업 무결성 확인

### 로컬 DB 백업
```bash
# 파일 크기
ls -lh backup-d1-local-final-v2.sql
# 예상: 55 KB

# 라인 수
wc -l backup-d1-local-final-v2.sql
# 예상: 292 lines
```

### 프로덕션 DB 백업
```bash
# 파일 크기
ls -lh backup-d1-production-final.sql
# 예상: 114 KB

# 라인 수
wc -l backup-d1-production-final.sql
# 예상: 293 lines
```

---

## 💡 추가 팁

1. **캐시 강제 삭제 기능**
   - 복구된 사이트는 자동으로 캐시를 삭제합니다
   - Service Worker, Cache API, localStorage 모두 자동 클리어
   - 버전 변경 시 자동 리로드

2. **로컬 개발**
   - `--local` 플래그로 로컬 D1 사용
   - `.wrangler/state/v3/d1/` 에 SQLite 파일 생성
   - 프로덕션과 동일한 스키마

3. **마이그레이션**
   - `migrations/` 폴더의 SQL 파일로 스키마 관리
   - 순서대로 실행됨 (0001, 0002, ...)

---

🎊 **백업 완료!** 이 가이드로 언제든지 시스템을 완전 복구할 수 있습니다!
