# 즉시 복구용 백업 0428 - 복구 가이드

## 📦 백업 내용
- **생성일**: 2026-04-28
- **프로젝트**: CashIQ (예측 시장 플랫폼)
- **데이터베이스**: Cloudflare D1 (cashiq-db)
- **이슈 수**: 151개 (150개 기존 + 1개 테스트)

## 📁 백업 파일 목록
```
즉시복구용0428/
├── backup-d1-local.sql          # 로컬 D1 데이터베이스 전체 백업
├── backup-d1-production.sql     # 프로덕션 D1 데이터베이스 전체 백업
├── migrations/                   # D1 마이그레이션 파일들
│   ├── 0001_initial_schema.sql
│   ├── 0001_create_issues.sql
│   └── 0002_create_issues_table.sql
├── seed-full.sql                # 150개 이슈 seed 데이터
├── wrangler.jsonc               # Cloudflare 설정 (D1 바인딩 포함)
├── src/index.tsx                # Hono 앱 (D1 통합)
├── package.json                 # 의존성 및 스크립트
└── RECOVERY.md                  # 이 파일
```

## 🔧 D1 데이터베이스 정보
```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "cashiq-db",
      "database_id": "c61bfbe7-d512-4a6b-8e61-c420eeb6a261"
    }
  ]
}
```

## 🚀 완전 복구 절차

### 1️⃣ 프로젝트 복구
```bash
# 백업 압축 해제
tar -xzf 즉시복구용0428.tar.gz
cd webapp

# 의존성 설치
npm install

# Git 초기화 (선택사항)
git init
git add .
git commit -m "Restore from backup 0428"
```

### 2️⃣ D1 데이터베이스 복구 (기존 DB 사용)
```bash
# Cloudflare API 토큰 설정
export CLOUDFLARE_API_TOKEN="your-cloudflare-api-token"

# 옵션 A: 기존 D1 사용 (권장)
# wrangler.jsonc에 이미 설정된 database_id 사용
# 데이터가 이미 있으면 별도 복구 불필요

# 옵션 B: 데이터만 복구 (기존 DB가 비어있을 경우)
npx wrangler d1 execute cashiq-db --remote --file=./backup-d1-production.sql
```

### 3️⃣ D1 데이터베이스 복구 (새 DB 생성)
```bash
# 1. 새 D1 데이터베이스 생성
npx wrangler d1 create cashiq-db-restored

# 출력 예시:
# database_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# 2. wrangler.jsonc 업데이트
# "database_id": "새로운-database-id"로 변경

# 3. 프로덕션 백업 복구
npx wrangler d1 execute cashiq-db-restored --remote --file=./backup-d1-production.sql

# 4. 데이터 확인
npx wrangler d1 execute cashiq-db-restored --remote --command="SELECT COUNT(*) as total FROM issues"
```

### 4️⃣ 로컬 개발 환경 복구
```bash
# 로컬 D1 마이그레이션
npx wrangler d1 migrations apply cashiq-db --local

# 로컬 데이터 복구
npx wrangler d1 execute cashiq-db --local --file=./backup-d1-local.sql

# 빌드
npm run build

# 개발 서버 시작
npm run dev:d1
# 또는 PM2 사용:
pm2 start ecosystem.config.cjs

# 테스트
curl http://localhost:3000/api/issues
```

### 5️⃣ Cloudflare Pages 배포
```bash
# 빌드 및 배포
npm run deploy

# 배포 확인
# https://random-id.cashiq-e8i.pages.dev 접속
```

## 🔍 데이터 검증

### 로컬 D1 검증
```bash
# 이슈 수 확인
npx wrangler d1 execute cashiq-db --local --command="SELECT COUNT(*) as total FROM issues"

# 최신 5개 이슈 확인
npx wrangler d1 execute cashiq-db --local --command="SELECT id, title_ko, yes_bet, no_bet FROM issues ORDER BY created_at DESC LIMIT 5"

# 카테고리별 이슈 수
npx wrangler d1 execute cashiq-db --local --command="SELECT category, COUNT(*) as count FROM issues GROUP BY category"
```

### 프로덕션 D1 검증
```bash
# 이슈 수 확인
npx wrangler d1 execute cashiq-db --remote --command="SELECT COUNT(*) as total FROM issues"

# API 엔드포인트 테스트
curl -s https://your-deployment.cashiq-e8i.pages.dev/api/issues | jq '.issues | length'
```

## 📊 백업 데이터 통계
- **총 이슈**: 151개
- **카테고리**: 8개 (Politics, Sports, Technology, Entertainment, Economy, Science, Climate, Culture)
- **언어**: 4개 (한국어, 영어, 중국어, 일본어)
- **테이블**: issues (+ 인덱스 3개)

## ⚠️ 주의사항

1. **Cloudflare API Token 필요**
   - D1 데이터베이스 작업에는 Cloudflare API Token이 필요합니다
   - Deploy 탭에서 발급받을 수 있습니다

2. **Database ID 확인**
   - 기존 DB를 사용할 경우: `c61bfbe7-d512-4a6b-8e61-c420eeb6a261`
   - 새 DB를 생성할 경우: wrangler.jsonc의 database_id를 업데이트하세요

3. **마이그레이션 순서**
   - 항상 마이그레이션을 먼저 적용한 후 데이터를 import하세요
   - 순서: migrations → seed/backup data

4. **환경 분리**
   - `--local`: 로컬 개발 환경 (.wrangler/state/v3/d1)
   - `--remote`: 프로덕션 환경 (Cloudflare D1)

## 🆘 문제 해결

### 문제: D1 데이터가 비어있음
```bash
# 백업 파일로 데이터 복구
npx wrangler d1 execute cashiq-db --remote --file=./backup-d1-production.sql
```

### 문제: 마이그레이션 충돌
```bash
# 마이그레이션 상태 확인
npx wrangler d1 migrations list cashiq-db --remote

# 강제로 마이그레이션 재적용 (주의: 데이터 손실 가능)
# 1. 기존 데이터 백업
# 2. 데이터베이스 삭제 후 재생성
# 3. 마이그레이션 및 데이터 복구
```

### 문제: API가 빈 배열 반환
```bash
# D1 데이터 확인
npx wrangler d1 execute cashiq-db --remote --command="SELECT COUNT(*) FROM issues"

# 데이터가 없으면 백업 복구
npx wrangler d1 execute cashiq-db --remote --file=./backup-d1-production.sql
```

## 📞 지원
- **GitHub**: https://github.com/langsb16-collab/market
- **배포 URL**: https://www.cashiq.my

## ✅ 복구 완료 체크리스트
- [ ] npm install 완료
- [ ] D1 데이터베이스 생성/연결 완료
- [ ] 마이그레이션 적용 완료
- [ ] 데이터 복구 완료 (151개 이슈)
- [ ] 로컬 개발 환경 테스트 성공
- [ ] Cloudflare Pages 배포 완료
- [ ] 프로덕션 API 테스트 성공
- [ ] 관리자 페이지 정상 작동 확인
