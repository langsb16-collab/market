# 즉시 복구용 DB.D1 까지 - 완전 복구 가이드

## 📦 백업 정보
- **백업 일시**: 2026-04-28 20:51 UTC
- **백업 이름**: 즉시 복구용 DB.D1 까지
- **프로젝트**: CashIQ (EventBET)
- **상태**: 완전 백업 (소스코드 + D1 데이터베이스)

## 📊 백업 내역

### 1. 소스코드
- ✅ 전체 프로젝트 파일 (`/home/user/webapp/`)
- ✅ Git 히스토리 (`.git/`)
- ✅ 설정 파일 (`wrangler.jsonc`, `package.json`, `vite.config.ts`)
- ✅ 소스 코드 (`src/`, `public/`, `migrations/`)
- ✅ 빌드 스크립트 (`scripts/`)

### 2. D1 데이터베이스 백업
- ✅ **로컬 D1**: `backup-d1-local-final.sql` (55 KB, 292 라인)
- ✅ **프로덕션 D1**: `backup-d1-production-final.sql` (114 KB, 293 라인)
- ✅ **마이그레이션 파일**: `migrations/*.sql`
- ✅ **시드 데이터**: `seed-full.sql`

### 3. D1 데이터베이스 상세 정보
```json
{
  "database_name": "cashiq-db",
  "database_id": "c61bfbe7-d512-4a6b-8e61-c420eeb6a261",
  "binding": "DB",
  "total_issues": 151,
  "categories": 8,
  "tables": [
    "d1_migrations",
    "users",
    "categories",
    "events",
    "issues",
    "_cf_KV"
  ]
}
```

## 🚀 복구 시나리오

### 시나리오 A: 전체 복구 (제로부터 시작)

#### **1단계: 백업 파일 다운로드 및 압축 해제**
```bash
# 백업 파일 다운로드
wget https://www.genspark.ai/api/files/s/[BACKUP_URL]

# 압축 해제 (백업 시 생성된 tar.gz 파일)
tar -xzf backup-즉시복구용-DB.D1까지.tar.gz

# 프로젝트 디렉토리로 이동
cd /home/user/webapp
```

#### **2단계: npm 패키지 설치**
```bash
npm install
```

#### **3단계: Cloudflare D1 데이터베이스 생성**
```bash
# Cloudflare API 토큰 설정
export CLOUDFLARE_API_TOKEN="your-cloudflare-api-token"

# 옵션 A: 기존 데이터베이스 사용 (권장)
# wrangler.jsonc에 이미 설정되어 있음
# database_id: c61bfbe7-d512-4a6b-8e61-c420eeb6a261

# 옵션 B: 새 데이터베이스 생성 (필요시)
npx wrangler d1 create cashiq-db-new
# 생성된 database_id를 wrangler.jsonc에 업데이트
```

#### **4단계: D1 데이터베이스 복구**

**옵션 1: 프로덕션 백업 사용 (권장)**
```bash
# 프로덕션 데이터베이스로 복구
npx wrangler d1 execute cashiq-db --remote --file=./backup-d1-production-final.sql

# 복구 확인
npx wrangler d1 execute cashiq-db --remote --command="SELECT COUNT(*) as total FROM issues"
# 결과: total = 151
```

**옵션 2: 로컬 백업 사용**
```bash
# 로컬 데이터베이스로 복구
npx wrangler d1 execute cashiq-db --local --file=./backup-d1-local-final.sql

# 복구 확인
npx wrangler d1 execute cashiq-db --local --command="SELECT COUNT(*) as total FROM issues"
# 결과: total = 151
```

#### **5단계: 빌드 및 배포**
```bash
# 프로젝트 빌드
npm run build

# Cloudflare Pages 배포
npx wrangler pages deploy dist --project-name cashiq

# 또는 프로덕션 배포
npx wrangler pages deploy dist --project-name cashiq --branch main
```

#### **6단계: 검증**
```bash
# API 테스트
curl https://your-deployment-url/api/issues | jq '{success, total: (.issues | length)}'

# 관리자 페이지 접속
# https://your-deployment-url/admin-new

# 메인 페이지 접속
# https://your-deployment-url
```

---

### 시나리오 B: 데이터베이스만 복구 (기존 프로젝트 유지)

#### **1단계: 백업 파일에서 D1 SQL 추출**
```bash
# 압축 해제
tar -xzf backup-즉시복구용-DB.D1까지.tar.gz

# SQL 파일만 복사
cp backup-d1-production-final.sql /path/to/your/project/
```

#### **2단계: D1 데이터베이스 복구**
```bash
# 기존 데이터 백업 (선택사항)
npx wrangler d1 export cashiq-db --remote --output ./old-backup.sql

# 새 데이터로 복구
npx wrangler d1 execute cashiq-db --remote --file=./backup-d1-production-final.sql

# 복구 확인
npx wrangler d1 execute cashiq-db --remote --command="SELECT COUNT(*) as total FROM issues"
```

---

### 시나리오 C: 로컬 개발 환경 복구

#### **1단계: 프로젝트 압축 해제**
```bash
tar -xzf backup-즉시복구용-DB.D1까지.tar.gz
cd /home/user/webapp
```

#### **2단계: 패키지 설치**
```bash
npm install
```

#### **3단계: 로컬 D1 데이터베이스 복구**
```bash
# 로컬 마이그레이션 실행
npx wrangler d1 migrations apply cashiq-db --local

# 백업 데이터 복구
npx wrangler d1 execute cashiq-db --local --file=./backup-d1-local-final.sql

# 복구 확인
npx wrangler d1 execute cashiq-db --local --command="SELECT COUNT(*) as total FROM issues"
```

#### **4단계: 로컬 개발 서버 실행**
```bash
# 빌드
npm run build

# PM2로 개발 서버 실행
pm2 start ecosystem.config.cjs

# 또는 직접 실행
npx wrangler pages dev dist --d1=cashiq-db --local --ip 0.0.0.0 --port 3000
```

---

## 📋 복구 체크리스트

### 필수 파일 확인
- [ ] `backup-d1-production-final.sql` (114 KB)
- [ ] `backup-d1-local-final.sql` (55 KB)
- [ ] `migrations/*.sql` (마이그레이션 파일)
- [ ] `wrangler.jsonc` (D1 설정 포함)
- [ ] `package.json` (의존성 목록)
- [ ] `src/index.tsx` (메인 애플리케이션)
- [ ] `public/static/style.css` (프리미엄 버튼 스타일)

### 복구 후 검증
- [ ] D1 데이터베이스 연결 확인
- [ ] 이슈 개수: 151개
- [ ] 카테고리 개수: 8개
- [ ] API `/api/issues` 응답 확인
- [ ] 관리자 페이지 `/admin-new` 접근 확인
- [ ] 버튼 색상 표시 확인 (Tiffany Blue & Premium Orange)
- [ ] CRUD 작동 확인 (생성, 읽기, 수정, 삭제)

---

## 🔧 문제 해결

### 문제 1: D1 데이터베이스 연결 실패
```bash
# 데이터베이스 ID 확인
npx wrangler d1 list

# wrangler.jsonc의 database_id 업데이트
# "database_id": "c61bfbe7-d512-4a6b-8e61-c420eeb6a261"
```

### 문제 2: 마이그레이션 실패
```bash
# 마이그레이션 상태 확인
npx wrangler d1 migrations list cashiq-db --local

# 마이그레이션 강제 재실행
rm -rf .wrangler/state/v3/d1
npx wrangler d1 migrations apply cashiq-db --local
```

### 문제 3: 빌드 오류
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install

# 캐시 클리어 후 빌드
npm run build
```

### 문제 4: CSS 스타일 미적용
```bash
# index.html에 CSS 링크 확인
grep "style.css" public/index.html

# 빌드 후 dist 확인
ls -lh dist/static/style.css
```

---

## 📊 백업 파일 구조

```
backup-즉시복구용-DB.D1까지.tar.gz
├── src/
│   ├── index.tsx              # 메인 애플리케이션
│   └── ...
├── public/
│   ├── index.html             # 메인 페이지
│   ├── admin-new.html         # 관리자 페이지
│   └── static/
│       ├── style.css          # 프리미엄 버튼 스타일
│       ├── app.js             # 프론트엔드 로직
│       └── ...
├── migrations/
│   ├── 0001_initial_schema.sql
│   ├── 0001_create_issues.sql
│   └── 0002_create_issues_table.sql
├── backup-d1-local-final.sql      # 로컬 D1 백업 (55 KB)
├── backup-d1-production-final.sql # 프로덕션 D1 백업 (114 KB)
├── seed-full.sql                  # 시드 데이터 (150 이슈)
├── wrangler.jsonc                 # Cloudflare 설정
├── package.json                   # npm 의존성
├── vite.config.ts                 # Vite 빌드 설정
├── ecosystem.config.cjs           # PM2 설정
├── .git/                          # Git 히스토리
└── RECOVERY_GUIDE_FINAL.md        # 이 파일
```

---

## 🎯 중요 사항

### 1. 데이터베이스 ID
```
cashiq-db
ID: c61bfbe7-d512-4a6b-8e61-c420eeb6a261
Binding: DB
```

### 2. 환경 변수
```bash
# Cloudflare API Token (필수)
export CLOUDFLARE_API_TOKEN="your-token"

# 로컬 개발 시 .dev.vars 파일 생성
# (이 파일은 git에 커밋하지 않음)
```

### 3. 프로덕션 URL
```
메인 도메인: https://www.cashiq.my
관리자: https://www.cashiq.my/admin-new
API: https://www.cashiq.my/api/issues
```

---

## 📞 지원

문제가 발생하면:
1. 이 가이드를 처음부터 다시 확인
2. D1 데이터베이스 상태 확인: `npx wrangler d1 list`
3. 로그 확인: `pm2 logs cashiq-d1 --nostream`
4. GitHub 이슈: https://github.com/langsb16-collab/market/issues

---

## ✅ 빠른 복구 명령어 요약

```bash
# 1. 압축 해제
tar -xzf backup-즉시복구용-DB.D1까지.tar.gz
cd /home/user/webapp

# 2. 패키지 설치
npm install

# 3. D1 복구 (프로덕션)
export CLOUDFLARE_API_TOKEN="your-token"
npx wrangler d1 execute cashiq-db --remote --file=./backup-d1-production-final.sql

# 4. 빌드 및 배포
npm run build
npx wrangler pages deploy dist --project-name cashiq

# 5. 확인
curl https://www.cashiq.my/api/issues | jq '.issues | length'
# 결과: 151
```

**복구 완료!** 🎉
