# 🐦 Twitter Clone

## 📖 프로젝트 소개

이 프로젝트는 인기 있는 소셜 미디어 플랫폼인 Twitter의 주요 기능을 구현한 클론 애플리케이션입니다. Next.js와 React를 기반으로 구축되었으며, 사용자 친화적인 인터페이스와 실시간 업데이트 기능을 제공합니다.

## 🖼️ 프로젝트 썸네일

![Twitter Clone 썸네일](https://github.com/user-attachments/assets/3edfa04a-2054-4b6e-8701-70a9e7cae67b)

## 🚀 주요 기능

- 사용자 인증 (회원가입/로그인)
- 트윗 작성, 수정, 삭제
- 리트윗 및 좋아요 기능
- 사용자 프로필 관리
- 실시간 트윗 피드
- 반응형 디자인 (모바일 지원)

## 🛠 기술 스택

### 핵심 프레임워크 및 라이브러리
- **Next.js (v14.2.4)**: React 기반의 서버 사이드 렌더링(SSR) 프레임워크
- **React (v18)**: 사용자 인터페이스 구축을 위한 JavaScript 라이브러리
- **TypeScript**: 정적 타입 검사를 통한 개발 경험 향상

### 스타일링
- **Tailwind CSS**: 유틸리티-퍼스트 CSS 프레임워크

### 상태 관리 및 폼 처리
- **Zustand**: 간단하고 확장 가능한 상태 관리 라이브러리
- **React Hook Form**: 성능이 뛰어난 폼 유효성 검사 라이브러리
- **Zod**: TypeScript-first 스키마 선언 및 유효성 검사 라이브러리

### 데이터베이스 및 ORM
- **Prisma**: 현대적인 데이터베이스 ORM

### 인증 및 보안
- **Iron Session**: 암호화된 세션 데이터를 쿠키에 저장하는 유틸리티
- **bcrypt**: 패스워드 해싱 라이브러리

### 기타 유틸리티
- **Heroicons**: SVG 아이콘 세트
- **Firebase**: 백엔드 서비스 제공 플랫폼

## 📁 프로젝트 구조

```
code-challenges-01
├─ app
│  ├─ (home)
│  │  ├─ explore
│  │  ├─ profile
│  │  └─ tweets
│  ├─ (not-home)
│  │  ├─ create-account
│  │  └─ log-in
│  ├─ actions.ts
│  ├─ fonts
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ loading.tsx
├─ components
│  ├─ AddTweet.tsx
│  ├─ LoginForm.tsx
│  ├─ TweetForm.tsx
│  ├─ TweetItem.tsx
│  └─ TweetList.tsx
├─ hooks
│  ├─ useDebounce.ts
│  └─ useResponseState.ts
├─ lib
│  ├─ auth.ts
│  ├─ db.ts
│  ├─ firebase.ts
│  └─ session.ts
├─ prisma
│  ├─ migrations
│  └─ schema.prisma
├─ public
│  ├─ default-avatar.png
│  ├─ login_bg.gif
│  └─ logo0.png
└─ store
   └─ TweetStore.ts
```

## 🚀 시작하기

1. 저장소를 클론합니다:
   ```
   git clone https://github.com/your-username/twitter-clone.git
   ```

2. 프로젝트 디렉토리로 이동합니다:
   ```
   cd twitter-clone
   ```

3. 의존성을 설치합니다:
   ```
   npm install
   ```

4. 개발 서버를 실행합니다:
   ```
   npm run dev
   ```

5. 브라우저에서 `http://localhost:3000`을 열어 애플리케이션을 확인합니다.

## 📝 환경 변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하고 다음 변수를 설정하세요:

```
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_nextauth_secret
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
```

## 🤝 기여하기

프로젝트 개선에 기여하고 싶으시다면 언제든 Pull Request를 보내주세요. 대규모 변경사항의 경우, 먼저 이슈를 열어 논의해 주시기 바랍니다.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 연락처

프로젝트에 대한 질문이나 피드백이 있으시면 [이메일 주소]로 연락 주시기 바랍니다.

---

🐦 Twitter Clone 프로젝트를 즐겨보세요!
