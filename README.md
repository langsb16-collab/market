# PredictChain - 탈중앙화 예측 시장 플랫폼

## 프로젝트 개요

**PredictChain**은 Polymarket을 개선한 탈중앙화 예측 시장 플랫폼입니다. 사용자들은 세계 각국의 정치, 경제, 스포츠, 기술 등 다양한 이슈의 결과를 예측하고 암호화폐로 베팅할 수 있습니다.

### 주요 기능

✅ **다국어 지원**: 한국어, 영어, 중국어, 일본어 완벽 지원  
✅ **암호화폐 결제**: Bitcoin(BTC), Ethereum(ETH), Tether(USDT) 지원  
✅ **반응형 디자인**: PC와 모바일 모두 최적화된 UI  
✅ **실시간 확률**: 베팅량에 따른 실시간 확률 업데이트  
✅ **투명한 정산**: 명확한 정산 기준과 베팅 내역 추적  
✅ **다양한 카테고리**: 정치, 스포츠, 기술, 암호화폐, 경제, 과학 등

## Polymarket 대비 개선 사항

### 1. **투명성 강화**
- ✅ 명확한 정산 기준 (Resolution Criteria) 다국어 제공
- ✅ 실시간 베팅 내역 및 확률 변동 추적
- ✅ 수수료 구조 명시적 표시

### 2. **보안 개선**
- ✅ 지갑 주소 기반 탈중앙화 인증
- ✅ 트랜잭션 해시 투명성
- ✅ Cloudflare D1 데이터베이스로 데이터 무결성 보장

### 3. **사용자 경험 향상**
- ✅ 모바일 최적화 (작은 글자, 터치 친화적 UI)
- ✅ 다국어 완벽 지원 (UI와 콘텐츠 모두)
- ✅ 직관적인 베팅 프로세스
- ✅ 실시간 잠재 수익 계산

### 4. **디자인 개선**
- ✅ 군청색(Navy Blue) 기반 전문적인 색상 테마
- ✅ 그라데이션과 호버 효과로 현대적인 UI
- ✅ 카드 기반 레이아웃으로 정보 가독성 향상

## 기술 스택

### Backend
- **Hono Framework**: 경량 고성능 웹 프레임워크
- **Cloudflare Workers**: 엣지 컴퓨팅 플랫폼
- **Cloudflare D1**: 글로벌 분산 SQLite 데이터베이스

### Frontend
- **Vanilla JavaScript**: 빠른 로딩과 최적화
- **TailwindCSS**: 반응형 디자인
- **Font Awesome**: 아이콘 라이브러리
- **Axios**: HTTP 클라이언트

### 암호화폐 통합
- Bitcoin (BTC)
- Ethereum (ETH)
- Tether USDT

## 데이터베이스 구조

### 주요 테이블

1. **users**: 사용자 지갑 주소 및 선호 언어
2. **categories**: 마켓 카테고리 (다국어)
3. **events**: 예측 이벤트 (다국어 제목/설명/정산기준)
4. **outcomes**: 각 이벤트의 결과 옵션 (다국어)
5. **bets**: 사용자 베팅 내역
6. **transactions**: 암호화폐 트랜잭션 기록

### 데이터 흐름

```
사용자 → 지갑 연결 → 이벤트 선택 → 결과 선택 → 암호화폐 베팅 
→ 트랜잭션 기록 → 확률 업데이트 → 정산 → 수익 지급
```

## URL 및 접속 정보

### 개발 서버 (Sandbox)
- **URL**: https://3000-ild5d3zcdl6lba9yuhpn5-3844e1b6.sandbox.novita.ai
- **상태**: ✅ Active

### API 엔드포인트

#### 카테고리
- `GET /api/categories?lang={en|ko|zh|ja}` - 카테고리 목록

#### 이벤트
- `GET /api/events?lang={lang}&category={slug}` - 이벤트 목록
- `GET /api/events/:id?lang={lang}` - 특정 이벤트 상세

#### 베팅
- `POST /api/bets` - 베팅 생성
- `GET /api/bets/:wallet?lang={lang}` - 사용자 베팅 내역

#### 다국어
- `GET /api/translations/:lang` - 번역 데이터

## 사용 방법

### 1. 지갑 연결
- 우측 상단 "Connect Wallet" 버튼 클릭
- 본인의 지갑 주소 입력 (0x로 시작하는 42자리)
- 실제 서비스에서는 MetaMask 등 Web3 지갑 연동

### 2. 마켓 탐색
- 카테고리별 필터링
- 인기 마켓 확인 (거래량 순)
- 각 이벤트의 결과 확률 확인

### 3. 베팅하기
- 원하는 이벤트의 결과 클릭
- 암호화폐 선택 (BTC, ETH, USDT)
- 베팅 금액 입력 (USD 기준)
- 예상 수익 확인 후 베팅

### 4. 베팅 내역 확인
- "My Bets" 섹션에서 모든 베팅 추적
- 현재 확률과 베팅 시점 확률 비교
- 예상 수익 실시간 확인

## 로컬 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- npm 또는 pnpm

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/YOUR_USERNAME/webapp.git
cd webapp

# 의존성 설치
npm install

# 빌드
npm run build

# 로컬 데이터베이스 마이그레이션
npm run db:migrate:local

# 샘플 데이터 삽입
npm run db:seed

# 개발 서버 실행
npm run dev:sandbox
```

### PM2로 실행

```bash
# PM2로 시작
pm2 start ecosystem.config.cjs

# 로그 확인
pm2 logs webapp --nostream

# 재시작
fuser -k 3000/tcp 2>/dev/null || true
pm2 restart webapp

# 중지
pm2 stop webapp
```

## 배포

### Cloudflare Pages 배포

```bash
# Cloudflare API 키 설정 필요
# Deploy 탭에서 API 키 설정

# 프로덕션 데이터베이스 생성
npx wrangler d1 create webapp-production

# wrangler.jsonc에 database_id 업데이트

# 프로덕션 마이그레이션
npm run db:migrate:prod

# 배포
npm run deploy:prod
```

### GitHub Pages 배포

```bash
# GitHub 환경 설정
# #github 탭에서 인증 완료

# Git 커밋
git add .
git commit -m "Production ready"

# GitHub에 푸시
git remote add origin https://github.com/YOUR_USERNAME/webapp.git
git push -u origin main
```

## 프로젝트 구조

```
webapp/
├── src/
│   └── index.tsx           # Hono 백엔드 API & 메인 페이지
├── public/
│   └── static/
│       └── app.js          # 프론트엔드 JavaScript
├── migrations/
│   └── 0001_initial_schema.sql  # 데이터베이스 스키마
├── seed.sql                # 샘플 데이터
├── wrangler.jsonc          # Cloudflare 설정
├── ecosystem.config.cjs    # PM2 설정
├── package.json            # 의존성 및 스크립트
└── README.md               # 문서
```

## 현재 완료된 기능

✅ 다국어 지원 (한/영/중/일)  
✅ 카테고리별 이벤트 필터링  
✅ 실시간 확률 및 거래량 표시  
✅ 암호화폐 베팅 (BTC, ETH, USDT)  
✅ 지갑 연결 및 사용자 베팅 내역  
✅ 모바일 반응형 디자인  
✅ 군청색 테마 UI  
✅ 베팅 시뮬레이션  

## 향후 개발 계획

⏳ 실제 Web3 지갑 통합 (MetaMask, WalletConnect)  
⏳ 스마트 컨트랙트 배포 (자동 정산)  
⏳ 실시간 암호화폐 환율 API 연동  
⏳ 오라클 통합 (Chainlink 등)  
⏳ 관리자 대시보드 (이벤트 생성 및 정산)  
⏳ 소셜 공유 기능  
⏳ 사용자 평판 시스템  
⏳ 고급 차트 및 통계  

## 라이선스

MIT License

## 기여

기여는 언제나 환영합니다! Pull Request를 보내주세요.

## 문의

문제가 발생하면 GitHub Issues를 통해 문의해주세요.

---

**Made with ❤️ using Hono + Cloudflare Workers**
