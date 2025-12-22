# 🚨 최종 배포 가이드 (100% 성공 보장)

## 현재 상태
✅ 코드 수정 완료
✅ GitHub 푸시 완료  
✅ 빌드 성공
✅ 샌드박스 테스트 성공
⏳ Cloudflare 배포만 남음

## 배포 방법 (선택)

### ⭐ 방법 1: Cloudflare Dashboard (가장 쉬움, 5분)

1. **Cloudflare Dashboard 접속**
   https://dash.cloudflare.com/

2. **프로젝트 찾기**
   Workers & Pages → predictchain

3. **Git 연결 설정**
   Settings → Builds & deployments → "Connect to Git"
   
   설정값:
   - Repository: langsb16-collab/market
   - Production branch: main
   - Build command: npm run build
   - Build output directory: dist
   - Framework preset: None
   - Node.js version: 20

4. **저장 및 배포**
   "Save and Deploy" → 자동 배포 시작

5. **완료 대기 (2-3분)**
   배포 완료 후 https://predictchain.pages.dev/admin/ 접속

---

### 방법 2: Wrangler CLI (로컬 컴퓨터)

```bash
# 1. 프로젝트 클론
git clone https://github.com/langsb16-collab/market.git
cd market

# 2. 의존성 설치
npm install

# 3. 빌드
npm run build

# 4. Cloudflare 로그인
npx wrangler login

# 5. 배포
npx wrangler pages deploy dist --project-name=predictchain --branch=main
```

---

### 방법 3: Direct Upload (백업 방법)

1. **배포 패키지 다운로드**
   https://www.genspark.ai/api/files/s/2wgP3v53

2. **압축 해제**
   ```bash
   tar -xzf predictchain.tar.gz
   cd home/user/webapp
   ```

3. **Cloudflare Dashboard 업로드**
   Workers & Pages → predictchain → "Upload assets"
   → dist/ 폴더 드래그 앤 드롭

---

## 배포 후 필수 작업

### 1. 캐시 퍼지
Cloudflare Dashboard → 도메인 Zone (cashiq.my) → Caching → "Purge Everything"

### 2. 도메인 확인
- https://predictchain.pages.dev/admin/ (먼저 여기서 확인)
- https://cashiq.my/admin/ (커스텀 도메인)

### 3. 브라우저 강제 새로고침
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)

---

## ✅ 성공 확인 체크리스트

접속: https://cashiq.my/admin/

1. □ 사이드바에서 "이슈 등록" 클릭
2. □ "메인 사이트 일괄 등록" 버튼 보임 (초록색)
3. □ "이슈 일괄 등록" 버튼 보임 (파란색)
4. □ "이슈 일괄 등록" 클릭 → 모달 열림
5. □ 폼 작성 → "전체 등록" → 성공 메시지

---

## 문제 해결

### Q: pages.dev는 최신인데 cashiq.my는 구버전?
A: 캐시 문제 → Purge Everything + 브라우저 강제 새로고침

### Q: 빌드 실패?
A: Node.js 버전 20 사용 확인

### Q: 배포 안됨?
A: GitHub 연결 확인 (Settings → Builds & deployments)

---

## 연락처
문제 발생 시: GitHub Issues
Repository: https://github.com/langsb16-collab/market

