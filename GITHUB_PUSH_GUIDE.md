# GitHub 푸시 가이드

## ✅ 완료된 작업

모든 변경사항이 로컬 Git에 커밋되었습니다:

```
✅ 624f1c1 - Mobile UI optimization
✅ 23ac49e - Update README: Issue submission docs
✅ 80478ee - Add user issue submission feature
✅ b9d6c0b - Update hero section: EventBET branding
✅ 915f043 - Update README: 167 events documentation
✅ 6efb27c - Add 120 new events (Entertainment/Economy/Science/Climate)
```

## 📋 GitHub 푸시 방법

### 1단계: GitHub 인증 설정

**중요**: GitHub에 푸시하기 전에 먼저 인증을 완료해야 합니다.

1. 왼쪽 사이드바에서 **#github** 탭을 클릭
2. GitHub 계정 연동 및 인증 완료
3. 저장소 접근 권한 허용

### 2단계: setup_github_environment 호출

인증 완료 후, 다음 명령어로 GitHub 환경을 설정합니다:

```bash
# Claude에게 요청:
"setup_github_environment 호출해줘"
```

### 3단계: 원격 저장소 설정 및 푸시

#### 옵션 A: 새 저장소 생성하여 푸시

```bash
# 1. GitHub에서 새 저장소 생성 (예: eventbet)
# 2. 원격 저장소 추가
cd /home/user/webapp
git remote add origin https://github.com/YOUR_USERNAME/eventbet.git

# 3. 푸시 (첫 푸시는 force 사용)
git push -f origin main
```

#### 옵션 B: 기존 저장소에 푸시

```bash
# 1. 기존 저장소 URL 설정
cd /home/user/webapp
git remote add origin https://github.com/YOUR_USERNAME/EXISTING_REPO.git

# 2. 푸시
git push origin main
```

### 4단계: 푸시 확인

```bash
# 원격 저장소 확인
git remote -v

# 푸시 상태 확인
git log --oneline -5
```

## 🔧 문제 해결

### "remote already exists" 오류

```bash
cd /home/user/webapp
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/REPO.git
git push origin main
```

### 인증 실패

1. #github 탭에서 다시 인증
2. `setup_github_environment` 재실행
3. 토큰 권한 확인 (repo 권한 필요)

### Push rejected

```bash
# Force push (주의: 원격 저장소 덮어쓰기)
git push -f origin main
```

## 📦 다음 단계

푸시 완료 후:

1. ✅ GitHub 저장소에서 코드 확인
2. ✅ README.md가 올바르게 표시되는지 확인
3. ✅ 167개 이벤트 파일 확인
4. ✅ 이슈 등록 기능 소스코드 확인

## 🌐 배포된 서비스

**현재 실행 중인 서비스**: https://3000-ild5d3zcdl6lba9yuhpn5-3844e1b6.sandbox.novita.ai

## 📝 주요 기능

- ✅ 167개 예측 마켓 (4개국 언론/SNS 기반)
- ✅ 4개 언어 완전 번역 (한/영/중/일)
- ✅ 사용자 이슈 등록 기능
- ✅ 배당률/수수료 구조 설명
- ✅ 라이트/다크 모드
- ✅ **모바일 UI 최적화** 🆕
- ✅ 반응형 디자인 (PC/태블릿/모바일)

## 💾 백업

최신 백업: https://www.genspark.ai/api/files/s/KxnOOynj
