# Firebase 설정 가이드

## 1단계: Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. 새 프로젝트 생성: 이름은 `publy-career` (또는 원하는 이름)
3. Google Analytics 활성화 (선택사항)

## 2단계: Realtime Database 설정

1. Firebase Console → Realtime Database
2. "데이터베이스 만들기" 클릭
3. 위치: `asia-northeast1` (서울)
4. 보안 규칙:
```json
{
  "rules": {
    ".read": false,
    ".write": false,
    "entries": {
      ".read": "auth.uid != null",
      ".write": "auth.uid != null"
    }
  }
}
```

## 3단계: 인증 활성화 (선택사항)

- Firebase Console → Authentication
- Anonymous 로그인 활성화

## 4단계: 환경변수 설정

프로젝트 설정에서 Web SDK config를 복사하여 `.env.local` 파일 생성:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# 로그인 비밀번호 (원하는 것으로 설정)
NEXT_PUBLIC_PASSWORD=publy2026
```

## 5단계: 패키지 설치

```bash
npm install firebase
```

완료! 이제 Firebase가 준비되었습니다.
