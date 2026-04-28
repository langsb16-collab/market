# CashIQ - 예측 시장 플랫폼

## 📋 프로젝트 개요
- **이름**: CashIQ
- **목표**: 글로벌 이벤트에 대한 예측 시장 플랫폼
- **기술 스택**: Hono + TypeScript + Cloudflare D1 + Cloudflare Pages
- **데이터베이스**: Cloudflare D1 (SQLite 기반 분산 데이터베이스)

## 🌐 URL
- **프로덕션 (메인 도메인)**: https://www.cashiq.my ✅
- **최신 배포 (프리뷰)**: 다음 배포 대기 중 (Cloudflare API 토큰 재설정 필요)
- **관리자 페이지**: https://www.cashiq.my/admin-new (⚠️ `.html` 없이 접속)
- **GitHub**: https://github.com/langsb16-collab/market

## ✅ 완료된 기능
- ✅ 150개 예측 이벤트 (8개 카테고리)
- ✅ 관리자 페이지에서 새 이슈 등록/수정/삭제
- ✅ 이슈 수정 기능 (파란색 수정 버튼)
- ✅ 예/아니오 비율 커스터마이징 (0%-100% 범위)
- ✅ 다국어 지원 (한국어, 영어, 중국어, 일본어)
- ✅ Cloudflare D1 데이터베이스로 전환 완료
- ✅ 실시간 데이터 업데이트
- ✅ 날짜순, 배팅규모, 참여자 수 정렬
- ✅ Premium 버튼 디자인 (Yes: Tiffany Blue, No: Premium Orange)

## 📊 데이터 구조
### D1 Database Schema
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

### API Endpoints
- `GET /api/issues` - 모든 이슈 조회 (outcomes 포함)
- `POST /api/issues` - 새 이슈 생성
- `PATCH /api/issues/:id` - 이슈 수정
- `DELETE /api/issues/:id` - 이슈 삭제
- `DELETE /api/issues/:id` - 이슈 삭제

### 응답 예시
```json
{
  "success": true,
  "issues": [
    {
      "id": "1",
      "title_ko": "2024 미국 대선: 트럼프 vs 바이든",
      "category": "Politics",
      "yes_bet": 28.59,
      "no_bet": 31.41,
      "outcomes": [
        { "name_ko": "예", "probability": 0.48 },
        { "name_ko": "아니오", "probability": 0.52 }
      ]
    }
  ]
}
```

## 🎯 사용 방법
### 관리자 - 새 이슈 등록
1. https://81ca2fdc.cashiq-e8i.pages.dev/admin-new.html 접속
2. 이슈 정보 입력:
   - 한국어/영어/중국어/일본어 제목
   - 카테고리 선택
   - 초기 USDT 금액
   - 예/아니오 비율 설정
   - 만료 기간 (일)
3. **등록** 버튼 클릭
4. 메인 페이지에서 **Ctrl+Shift+R** 새로고침

### 사용자 - 이슈 확인
1. https://81ca2fdc.cashiq-e8i.pages.dev 접속
2. 카테고리별 필터링
3. 날짜순/배팅규모/참여자 수 정렬
4. 이슈 클릭하여 상세 정보 확인

## 🚀 배포
### 로컬 개발
```bash
# D1 마이그레이션 적용
npm run db:migrate:local

# 기존 Gist 데이터 import
npm run db:import

# 개발 서버 시작
npm run build
npm run dev:d1
```

### 프로덕션 배포
```bash
# D1 마이그레이션 (프로덕션)
npm run db:migrate:prod

# 데이터 import (프로덕션)
npm run db:seed:prod

# Cloudflare Pages 배포
npm run deploy
```

### D1 데이터베이스 관리
```bash
# 로컬 DB 쿼리
npx wrangler d1 execute cashiq-db --local --command="SELECT COUNT(*) FROM issues"

# 프로덕션 DB 쿼리
npx wrangler d1 execute cashiq-db --remote --command="SELECT * FROM issues LIMIT 5"

# 마이그레이션 생성
echo "ALTER TABLE issues ADD COLUMN new_field TEXT;" > migrations/0003_add_new_field.sql

# 마이그레이션 적용
npm run db:migrate:local  # 로컬
npm run db:migrate:prod   # 프로덕션
```

## 📈 프로젝트 통계
- **총 이벤트**: 150개
- **카테고리**: 8개 (Politics, Sports, Technology, Entertainment, Economy, Science, Climate, Culture)
- **언어 지원**: 4개 (한국어, 영어, 중국어, 일본어)
- **데이터베이스**: Cloudflare D1 (분산 SQLite)
- **배포 플랫폼**: Cloudflare Pages

## 🔧 기술 상세
- **Backend**: Hono (경량 웹 프레임워크)
- **Database**: Cloudflare D1 (globally distributed SQLite)
- **Frontend**: Vanilla JS + TailwindCSS
- **Deployment**: Cloudflare Pages
- **Version Control**: Git + GitHub

## 📝 최근 업데이트
- **2026-04-28 20:58 UTC**: 히어로 섹션 텍스트 업데이트
  - "유일하게 지원되는 암호화폐" → "가장 빠른 전송 암호화폐 테더 USDT"
  - "전 세계 이슈와 당신의 예측이 만나는 곳" → "전 세계 이슈와 당신의 예측을 등록해 승부 내는 곳"
  - GitHub 푸시 완료 (커밋: 40ef6ef)
- **2026-04-28**: GitHub Gist에서 Cloudflare D1로 마이그레이션 완료
- 150개 기존 이벤트 성공적으로 import
- 관리자 페이지에서 새 이슈 등록 기능 정상 작동 확인
- 예/아니오 비율 커스터마이징 기능 추가

## 🐛 알려진 이슈
- 없음 (모든 기능 정상 작동)

## 📞 지원
- GitHub Issues: https://github.com/langsb16-collab/market/issues
