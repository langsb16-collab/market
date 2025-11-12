# 모달이 열리지 않는 문제 디버깅 가이드

## 문제 증상
마켓 카드를 클릭해도 베팅 모달이 열리지 않습니다.

## 디버깅 방법

### 1. 브라우저 개발자 도구 콘솔 확인

1. **브라우저에서 F12 키를 누르거나 마우스 오른쪽 클릭 → "검사" 선택**
2. **"Console" 탭 선택**
3. **마켓 카드를 클릭**
4. **콘솔에 표시되는 메시지 확인**

### 2. 예상되는 콘솔 로그

정상적인 경우 다음과 같은 로그가 표시되어야 합니다:

```
openBetModalByEventId called with eventId: 36
Events array length: 192
Found event: 비트코인 2025년까지 $150,000 도달?
Creating default outcome for event without outcomes
openBetModal called
Event: {id: 36, title: "...", ...}
Outcome: {id: 0, name: "예", probability: 0.5, total_bets: 0}
Modal elements found successfully
Wallet connected: false
Setting modal content complete
Removing hidden class from modal
Modal should now be visible
openBetModal completed successfully
```

### 3. 오류 메시지 확인

만약 오류가 발생하면 다음과 같은 메시지가 표시됩니다:

- `Event not found: [ID]` - 이벤트를 찾을 수 없음
- `Modal element not found!` - 모달 HTML 요소가 없음
- `Modal content element not found!` - 모달 콘텐츠 요소가 없음
- `Error in openBetModal: [오류 내용]` - 기타 JavaScript 오류

### 4. 일반적인 해결 방법

#### A. 페이지 새로고침
- **Ctrl+F5** (Windows) 또는 **Cmd+Shift+R** (Mac)을 눌러 캐시를 지우고 새로고침

#### B. 브라우저 캐시 삭제
1. F12 개발자 도구 열기
2. Network 탭 선택
3. "Disable cache" 체크박스 선택
4. 페이지 새로고침

#### C. 다른 브라우저에서 테스트
- Chrome, Firefox, Safari 등 다른 브라우저에서 시도

#### D. JavaScript가 활성화되어 있는지 확인
- 브라우저 설정에서 JavaScript가 차단되지 않았는지 확인

### 5. 문제가 계속되는 경우

콘솔에 표시되는 오류 메시지를 복사하여 개발자에게 제공하면 빠르게 해결할 수 있습니다.

## 현재 상태

- ✅ API 응답: 정상 (192개 이벤트)
- ✅ HTML 구조: 정상 (betModal, betModalContent 존재)
- ✅ JavaScript 파일: 정상 로드 (/static/app.js)
- ✅ 디버깅 로그: 추가됨

## 접속 URL

https://3000-ild5d3zcdl6lba9yuhpn5-3844e1b6.sandbox.novita.ai

## 추가 정보

- 모든 마켓 카드는 클릭 가능하도록 설정되어 있습니다
- Outcomes가 없는 이벤트는 자동으로 기본 "예/Yes" outcome이 생성됩니다
- 지갑 연결 없이도 모달을 열 수 있습니다 (조회만 가능)
