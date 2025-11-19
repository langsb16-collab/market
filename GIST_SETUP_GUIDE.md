# 🔧 GitHub Gist 설정 가이드 - 완전한 PC/모바일 동기화

## 문제 상황
PC 관리자 페이지에서 등록한 **공지사항, 배너, 팝업**이 **모바일에서 보이지 않는 이유**는:
- PC 브라우저 localStorage ≠ 모바일 브라우저 localStorage
- 각 기기의 브라우저가 독립적인 저장소를 사용

## 해결 방법
GitHub Gist를 **중앙 데이터베이스**로 사용하여 PC와 모바일이 동일한 데이터를 공유합니다.

**적용 범위**:
- ✅ 공지사항 (eventbet_notices.json)
- ✅ 배너 (eventbet_banners.json)  
- ✅ 팝업 (eventbet_popups.json)

---

## 📋 설정 단계

### 1단계: GitHub Gist 생성 (3개 파일)

1. **브라우저에서 접속**: https://gist.github.com/
2. **로그인**: langsb16-collab 계정으로 로그인
3. **New gist 클릭**
4. **3개 파일 동시 생성** (Add file 버튼 사용):
   
   **파일 1**:
   ```
   Filename: eventbet_notices.json
   Content: []
   ```
   
   **파일 2**:
   ```
   Filename: eventbet_banners.json
   Content: []
   ```
   
   **파일 3**:
   ```
   Filename: eventbet_popups.json
   Content: []
   ```

5. **Create public gist** 버튼 클릭 (⚠️ Public으로 생성!)

6. **Gist ID 복사**:
   ```
   https://gist.github.com/langsb16-collab/abc123def456789...
                                         ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                                         이 부분을 복사
   ```

---

### 2단계: Personal Access Token 생성

1. **GitHub Settings 접속**: https://github.com/settings/tokens
2. **"Tokens (classic)"** 클릭
3. **"Generate new token (classic)"** 클릭
4. **설정**:
   - **Note**: `EventBET Gist Access`
   - **Expiration**: `No expiration` (만료 없음)
   - **Select scopes**: ✅ **gist** 체크
5. **"Generate token"** 버튼 클릭
6. **생성된 토큰 복사** (⚠️ 한 번만 보여줍니다! 꼭 복사하세요)
   ```
   ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

### 3단계: 소스 코드에 Gist ID와 토큰 입력

#### 📁 파일: `docs/static/gist-sync.js` (한 곳만 수정!)

파일 상단(약 5-13번째 줄)에서 다음 부분을 찾아 수정:

```javascript
const GIST_CONFIG = {
    GIST_ID: 'YOUR_GIST_ID_HERE',
    ACCESS_TOKEN: 'YOUR_TOKEN_HERE',
    FILES: {
        NOTICES: 'eventbet_notices.json',
        BANNERS: 'eventbet_banners.json',
        POPUPS: 'eventbet_popups.json'
    }
};
```

**수정 후:**
```javascript
const GIST_CONFIG = {
    GIST_ID: 'abc123def456789...',  // ← 실제 Gist ID 입력
    ACCESS_TOKEN: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',  // ← 실제 토큰 입력
    FILES: {
        NOTICES: 'eventbet_notices.json',
        BANNERS: 'eventbet_banners.json',
        POPUPS: 'eventbet_popups.json'
    }
};
```

⚠️ **주의**: 이전에는 2개 파일을 수정해야 했지만, 이제는 **gist-sync.js 한 곳만** 수정하면 됩니다!

---

### 4단계: GitHub에 푸시

```bash
cd /home/user/webapp
git add docs/static/gist-sync.js
git commit -m "Configure GitHub Gist for complete PC/Mobile sync"
git push origin main
```

---

### 5단계: 초기 데이터 업로드

PC 관리자 페이지(https://cashiq.my/admin/)에서:

#### 방법 1: 개별 동기화
1. **배너 관리** → **"Gist 동기화"** 버튼 클릭
2. **공지 관리** → **"Gist 동기화"** 버튼 클릭
3. **팝업 관리** → **"Gist 동기화"** 버튼 클릭

#### 방법 2: 전체 동기화 (추천!)
1. **배너 관리** 페이지 열기
2. 상단 녹색 안내 박스에서 **"전체 동기화"** 버튼 클릭
3. 성공 메시지 확인:
   ```
   ✅ 모든 데이터가 Gist에 동기화되었습니다!
   
   공지: 3개
   배너: 2개
   팝업: 1개
   ```

#### 방법 3: 콘솔에서 수동 실행
브라우저 F12 콘솔에서:
```javascript
syncAllToGist()  // 모든 데이터 동기화
```

---

## 🎯 작동 방식

### PC 관리자 페이지:
1. **배너/공지/팝업 등록**
2. localStorage에 저장
3. **자동으로 Gist에 업로드** ✅
4. 수정/삭제 시에도 자동 동기화 ✅

### PC/모바일 사용자 페이지:
1. **페이지 로드**
2. **Gist에서 최신 데이터 다운로드** ✅
3. 화면에 표시
4. localStorage에 캐시 (오프라인 대비)

### 데이터 흐름:
```
PC 관리자 등록 → Gist 업로드 → PC 사용자 다운로드 ✅
                              → 모바일 사용자 다운로드 ✅
```

### 오프라인 대비:
- Gist 연결 실패 시 localStorage 폴백
- 캐시된 데이터로 오프라인에서도 작동
- 인터넷 연결 시 자동으로 최신 데이터 동기화

---

## ✅ 테스트 방법

### PC 테스트:
1. **관리자 페이지**에서 배너/공지/팝업 등록
2. F12 콘솔에서 확인:
   ```javascript
   [GIST] Uploading 3 items to eventbet_notices.json...
   [GIST] Successfully uploaded eventbet_notices.json
   [ADMIN] Notices synced to Gist
   ```
3. **Gist 페이지 새로고침**하여 데이터 확인
4. **메인 페이지**에서 데이터 표시 확인

### 모바일 테스트:
1. **모바일 브라우저 캐시 완전 삭제**
2. https://cashiq.my/ 접속
3. **배너**: 자동으로 상단에 표시 ✅
4. **공지**: 공지 버튼 클릭하여 확인 ✅
5. **팝업**: 페이지 로드 1초 후 자동 표시 ✅
6. PC에서 등록한 내용과 100% 동일한지 확인

### 동기화 확인:
1. **PC 관리자**에서 새 공지 등록
2. **모바일**에서 페이지 새로고침
3. 즉시 새 공지가 보이는지 확인 ✅

---

## 🚨 문제 해결

### "Gist 설정이 필요합니다" 경고:
- `GIST_ID`가 `'YOUR_GIST_ID_HERE'`로 되어 있음
- 3단계를 다시 확인하여 실제 값으로 수정

### "HTTP 403: Resource not accessible" 오류:
- Personal Access Token이 잘못됨
- 2단계를 다시 진행하여 새 토큰 생성
- **gist** scope가 체크되었는지 확인

### "Gist file not found" 오류:
- Gist ID가 잘못되었거나
- 파일 이름이 `eventbet_notices.json`이 아님
- 1단계를 다시 확인

### 모바일에서 여전히 "등록된 공지사항이 없습니다":
- 브라우저 캐시를 완전히 삭제했는지 확인
- 시크릿 모드로 테스트
- F12 콘솔에서 오류 메시지 확인

---

## 📊 데이터 흐름

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Gist                               │
│              (중앙 데이터 저장소)                              │
│         eventbet_notices.json                                │
└─────────────────┬───────────────────────┬───────────────────┘
                  │                       │
          ↑ 업로드 │                       │ 다운로드 ↓
                  │                       │
    ┌─────────────┴─────────────┐   ┌───┴──────────────────┐
    │    PC 브라우저             │   │   모바일 브라우저      │
    │                            │   │                       │
    │  ┌──────────────────────┐ │   │  ┌─────────────────┐ │
    │  │ 관리자 페이지        │ │   │  │ 메인 페이지     │ │
    │  │ - 공지 등록/수정     │ │   │  │ - 공지 확인     │ │
    │  │ - 자동 Gist 동기화  │ │   │  │ - 자동 다운로드 │ │
    │  └──────────────────────┘ │   │  └─────────────────┘ │
    │                            │   │                       │
    │  localStorage (캐시)       │   │  localStorage (캐시)  │
    └────────────────────────────┘   └───────────────────────┘
```

---

## 🔐 보안 고려사항

### Public Gist 사용:
- ✅ 공지사항은 공개 정보이므로 Public Gist 사용 가능
- ⚠️ 민감한 정보(비밀번호, API 키)는 절대 저장하지 마세요

### Access Token 보호:
- ⚠️ 소스 코드에 토큰이 포함되므로 GitHub 저장소가 Private인지 확인
- ✅ 토큰은 gist scope만 가지므로 다른 권한 없음
- 🔄 토큰이 노출되면 즉시 폐기하고 새로 생성

---

## 💡 팁

### 수동 동기화:
관리자 페이지에서 **"Gist 동기화"** 버튼(보라색) 클릭

### 자동 동기화:
공지 등록/수정/삭제 시 자동으로 Gist에 업로드됨

### Gist 데이터 직접 확인:
브라우저에서 Gist 페이지 접속하여 JSON 데이터 확인 가능

---

## 📞 문의

문제가 계속되면 다음 정보를 제공해주세요:
1. 브라우저 F12 콘솔의 오류 메시지
2. Gist ID (앞 4자리만)
3. 어떤 단계에서 문제가 발생했는지

---

**작성일**: 2025-01-20  
**버전**: 1.0
