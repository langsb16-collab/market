# CashIQ - 예측 시장 플랫폼

## 📋 프로젝트 개요
- **이름**: CashIQ
- **목표**: 글로벌 이벤트에 대한 예측 시장 플랫폼 (소셜 로그인 & 친구 초대 리워드 시스템 포함)
- **기술 스택**: Hono + TypeScript + Cloudflare D1 + Cloudflare Pages
- **데이터베이스**: Cloudflare D1 (SQLite 기반 분산 데이터베이스)

## 🌐 URL
- **프로덕션 (메인 도메인)**: https://www.cashiq.my
- **테스트 서버 (Sandbox)**: https://3000-ild5d3zcdl6lba9yuhpn5-3844e1b6.sandbox.novita.ai
- **관리자 페이지**: https://www.cashiq.my/admin-new (⚠️ `.html` 없이 접속)
- **GitHub**: https://github.com/langsb16-collab/market

## ✅ 완료된 기능

### 기본 기능
- ✅ 151개 예측 이벤트 (8개 카테고리)
- ✅ 관리자 페이지에서 새 이슈 등록/수정/삭제
- ✅ 이슈 수정 기능 (파란색 수정 버튼)
- ✅ 예/아니오 비율 커스터마이징 (0%-100% 범위)
- ✅ 다국어 지원 (한국어, 영어, 중국어, 일본어)
- ✅ Cloudflare D1 데이터베이스로 전환 완료
- ✅ 실시간 데이터 업데이트
- ✅ 날짜순, 배팅규모, 참여자 수 정렬
- ✅ Premium 버튼 디자인 (Yes: #00ABA5→#007A75, No: #FF9500→#E67E22)
- ✅ 반응형 UI (모바일/PC 최적화)

### 🆕 소셜 로그인 & 인증 시스템
- ✅ 이메일 회원가입/로그인
- ✅ 카카오 로그인 (OAuth 2.0)
- ⏳ 페이스북 로그인 (준비 중)
- ⏳ 인스타그램 로그인 (준비 중)
- ⏳ X(트위터) 로그인 (준비 중)
- ✅ 회원 전용 기능 (이슈 등록, 채팅)

### 🆕 채팅 시스템
- ✅ 실시간 관리자 채팅 (Telegram 스타일 UI)
- ✅ 좌하단 Tiffany Blue 채팅 버튼
- ✅ 메시지 전송 & 조회
- ✅ 5초 폴링으로 새 메시지 확인
- ⏳ 자동 번역 (준비 중)
- ⏳ 사진 업로드 (준비 중)
- ⏳ 30초 음성 녹음 (준비 중)
- ⏳ 영상/음성 통화 (준비 중)

### 🆕 친구 초대 리워드 시스템
- ✅ 추천인 코드 자동 생성 (8자리 영숫자)
- ✅ 회원가입 시 추천인 코드 입력
- ✅ 추천인에게 10 USDT 보너스 지급
- ✅ 추천인 통계 조회 API
- ✅ 리워드 청구 API
- ✅ 추천인 수 & 총 리워드 추적

## 📊 데이터 구조

### D1 Database Schema

#### Issues Table
\`\`\`sql
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
\`\`\`

#### Users Table (소셜 로그인 & 추천인 시스템)
\`\`\`sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  phone TEXT,
  wallet_address TEXT,
  password_hash TEXT,
  
  -- 소셜 로그인
  kakao_id TEXT,
  facebook_id TEXT,
  instagram_id TEXT,
  twitter_id TEXT,
  social_provider TEXT,
  avatar_url TEXT,
  
  -- 추천인 시스템
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  referral_count INTEGER DEFAULT 0,
  referral_rewards REAL DEFAULT 0,
  
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);
\`\`\`

#### Chat Messages Table
\`\`\`sql
CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  admin_id TEXT,
  message TEXT NOT NULL,
  translated_message TEXT,
  message_type TEXT DEFAULT 'text',
  file_url TEXT,
  is_admin_reply BOOLEAN DEFAULT FALSE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

#### Referral Rewards Table
\`\`\`sql
CREATE TABLE referral_rewards (
  id TEXT PRIMARY KEY,
  referrer_id TEXT NOT NULL,
  referred_user_id TEXT NOT NULL,
  reward_amount REAL NOT NULL,
  reward_type TEXT DEFAULT 'signup',
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  paid_at DATETIME
);
\`\`\`

## 🔌 API Endpoints

### Issues API
- `GET /api/issues` - 모든 이슈 조회 (outcomes 포함)
- `POST /api/issues` - 새 이슈 생성
- `PATCH /api/issues/:id` - 이슈 수정
- `DELETE /api/issues/:id` - 이슈 삭제

### Auth API
- `POST /api/auth/register` - 이메일 회원가입
- `POST /api/auth/login` - 이메일 로그인
- `POST /api/auth/social/kakao` - 카카오 로그인
- `POST /api/auth/social/facebook` - 페이스북 로그인 (준비 중)
- `POST /api/auth/social/instagram` - 인스타그램 로그인 (준비 중)
- `POST /api/auth/social/twitter` - X(트위터) 로그인 (준비 중)

### Chat API
- `GET /api/chat/messages/:userId` - 사용자 채팅 내역 조회
- `POST /api/chat/messages` - 메시지 전송
- `POST /api/chat/admin/reply` - 관리자 답변

### Referral API
- `GET /api/referrals/stats/:userId` - 추천인 통계 조회
- `POST /api/referrals/claim` - 리워드 청구

## 🎯 사용 방법

### 사용자 - 회원가입 & 소셜 로그인
1. 메인 페이지에서 **회원가입** 버튼 클릭
2. 이메일 방식 또는 소셜 로그인 선택
   - **카카오**: 카카오 계정으로 1초 가입
   - **페이스북, 인스타, X**: 준비 중
3. 추천인 코드 입력 시 **10 USDT 보너스** 획득!

### 사용자 - 친구 초대하기
1. 로그인 후 내 추천인 코드 확인
2. 친구에게 추천인 코드 공유
3. 친구가 가입 시 자동으로 10 USDT 보너스 지급
4. `/api/referrals/stats/:userId`에서 통계 확인
5. `/api/referrals/claim`으로 리워드 청구

### 사용자 - 채팅 문의
1. 좌하단 Tiffany Blue 채팅 버튼 클릭
2. 관리자에게 문의 메시지 전송
3. 실시간 답변 수신 (5초마다 자동 업데이트)

### 관리자 - 새 이슈 등록
1. https://www.cashiq.my/admin-new 접속
2. 이슈 정보 입력 (4개 언어 제목, 카테고리, 비율 등)
3. **등록** 버튼 클릭
4. 메인 페이지에서 즉시 반영

## 🚀 배포

### 로컬 개발
\`\`\`bash
# D1 마이그레이션 적용
npm run db:migrate:local

# 테스트 데이터 import
npm run db:seed

# 개발 서버 시작 (PM2)
npm run build
pm2 start ecosystem.config.cjs

# 테스트
curl http://localhost:3000
\`\`\`

### Cloudflare Pages 배포
\`\`\`bash
# 1. D1 마이그레이션 적용 (프로덕션)
npx wrangler d1 migrations apply cashiq-db

# 2. 빌드
npm run build

# 3. 배포
npx wrangler pages deploy dist --project-name cashiq
\`\`\`

## 📈 통계
- **151개** 이슈
- **8개** 카테고리 (Climate, Culture, Economy, Entertainment, Politics, Science, Sports, Technology)
- **4개** 언어 지원 (한국어, 영어, 중국어, 일본어)
- **소셜 로그인** 4개 플랫폼 (카카오, 페이스북, 인스타, X)
- **추천인 보너스**: 10 USDT per referral

## 🔧 최근 업데이트 (2026-04-28)
- ✅ 소셜 로그인 시스템 추가 (카카오, 페이스북, 인스타, X)
- ✅ 채팅 시스템 구현 (Telegram 스타일 UI)
- ✅ 친구 초대 리워드 시스템 구현
- ✅ 추천인 코드 자동 생성
- ✅ 회원가입 시 10 USDT 보너스 지급
- ✅ D1 데이터베이스에 users, chat_messages, referral_rewards 테이블 추가
- ✅ API 라우트 확장 (Auth, Chat, Referral)

## 📞 문의
- **GitHub Issues**: https://github.com/langsb16-collab/market/issues
- **채팅**: 웹사이트 좌하단 채팅 버튼 클릭

---

**마지막 업데이트**: 2026-04-28  
**버전**: v4 (소셜 로그인 & 리워드 시스템)
