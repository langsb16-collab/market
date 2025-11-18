# GitHub Pages 배포 가이드

## 현재 상태

✅ **프로젝트가 GitHub Pages에 최적화되었습니다!**

- 모든 정적 파일이 `docs/` 폴더에 있습니다
- Cloudflare Workers 의존성이 제거되었습니다
- 순수 HTML/CSS/JavaScript 정적 사이트입니다

## GitHub Pages 설정 방법

### 1. GitHub 저장소 Settings로 이동

```
https://github.com/langsb16-collab/market/settings/pages
```

### 2. Pages 설정 변경

**Source 섹션:**
- **Source**: Deploy from a branch
- **Branch**: `main`
- **Folder**: `/docs` ⬅️ **중요!**
- **Save** 버튼 클릭

### 3. Custom Domain 설정 (선택)

**Custom domain 입력:**
```
cashiq.my
```

**Enforce HTTPS**: ✅ 체크

### 4. DNS 설정 (도메인 제공업체에서)

**A 레코드 추가:**
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**또는 CNAME 레코드:**
```
langsb16-collab.github.io
```

## 배포 프로세스

### 자동 배포

GitHub에 푸시하면 자동으로 배포됩니다:

```bash
# 파일 수정 후
git add .
git commit -m "Update content"
git push origin main

# 5-10분 후 자동으로 https://cashiq.my 업데이트
```

### 배포 상태 확인

```
https://github.com/langsb16-collab/market/actions
```

## 파일 구조

```
docs/
├── index.html              # 메인 페이지
├── admin/
│   └── index.html         # 관리자 페이지
├── static/
│   ├── app.js             # 메인 JavaScript
│   ├── admin.js           # 관리자 JavaScript
│   ├── popup.js           # 팝업 시스템
│   ├── auth.js            # 인증
│   ├── notices.js         # 공지사항
│   ├── chatbot.js         # 챗봇
│   └── style.css          # 스타일
├── test-popup.html        # 팝업 테스트 페이지
└── CNAME                  # 커스텀 도메인
```

## 업데이트 방법

### 1. 소스 파일 수정

```bash
# 소스 파일 위치
- index.html (루트)
- admin/index.html
- static/*.js
```

### 2. docs/ 폴더로 복사

```bash
# 메인 페이지
cp index.html docs/

# 관리자 페이지
cp admin/index.html docs/admin/

# JavaScript/CSS 파일
cp static/*.js docs/static/
cp static/*.css docs/static/
```

### 3. 커밋 및 푸시

```bash
git add .
git commit -m "Update: [설명]"
git push origin main
```

## 접속 URL

### 프로덕션
- **메인**: https://cashiq.my
- **관리자**: https://cashiq.my/admin/
- **테스트**: https://cashiq.my/test-popup.html

### GitHub Pages (대체)
- **메인**: https://langsb16-collab.github.io/market/
- **관리자**: https://langsb16-collab.github.io/market/admin/

## 문제 해결

### "404 File not found" 오류

**원인:**
- GitHub Pages 설정이 `/docs` 폴더를 가리키지 않음
- 배포가 아직 완료되지 않음 (5-10분 소요)

**해결:**
1. Settings → Pages → Branch → Folder를 `/docs`로 변경
2. 5-10분 대기
3. 브라우저 캐시 삭제 후 재접속

### 변경사항이 반영되지 않음

**해결:**
1. GitHub Actions 탭에서 배포 완료 확인
2. Hard Refresh (Ctrl + Shift + R)
3. 브라우저 캐시 삭제
4. 시크릿 모드로 테스트

### Custom Domain이 작동하지 않음

**확인 사항:**
1. DNS 설정이 올바른지 확인 (A 레코드 또는 CNAME)
2. DNS 전파 대기 (최대 48시간)
3. CNAME 파일이 docs/ 폴더에 있는지 확인
4. GitHub Pages 설정에서 "Enforce HTTPS" 체크

## 배포 체크리스트

- [ ] docs/ 폴더에 모든 파일 존재
- [ ] GitHub Settings → Pages → Branch → main, Folder → /docs
- [ ] CNAME 파일에 도메인 설정 (cashiq.my)
- [ ] git push 완료
- [ ] GitHub Actions 배포 완료 대기
- [ ] https://cashiq.my 접속 확인
- [ ] 팝업 기능 테스트

## 완료!

이제 GitHub Pages에서 정상적으로 작동합니다! 🎉

업데이트가 필요하면 소스 파일을 수정하고 docs/ 폴더로 복사한 후 git push만 하면 됩니다.
