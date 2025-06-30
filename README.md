# Just Your Tickets 🎬

> 영화 리뷰 검색 및 공유 플랫폼

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://just-your-tickets.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![AWS S3](https://img.shields.io/badge/AWS%20S3-569A31?style=for-the-badge&logo=amazon-s3&logoColor=white)](https://aws.amazon.com/s3/)

## 🚀 Quick Start

```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev

# 프로덕션 빌드
yarn build
```

## ✨ 주요 기능

- 🔍 **실시간 영화 검색** - TMDB API 기반 자동완성 검색 (debounce 최적화)
- 🎫 **티켓 형태 리뷰** - 영화 티켓 디자인의 리뷰 시스템
- 👤 **다중 인증 시스템** - Google, GitHub 소셜 로그인 + 이메일/비밀번호
- 🔐 **보안 기능** - 비밀번호 변경, 로그인 상태 유지 선택
- 📸 **프로필 관리** - AWS S3 Presigned URL 기반 이미지 업로드
- 💬 **커뮤니티** - 리뷰 댓글 및 좋아요 시스템 (실시간 동기화)
- 🏆 **등급 배지 시스템** - 리뷰 개수에 따른 사용자 활동 등급 표시
- 🎬 **동영상 플레이어** - YouTube 트레일러 재생 (lazy loading)
- 📊 **페이지네이션** - 효율적인 데이터 로딩

## 🛠 기술 스택

### Frontend

- **Next.js 14** - App Router, Server Components
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 기반 스타일링 + 커스텀 애니메이션
- **React Hook Form + Zod** - 폼 관리 및 유효성 검증
- **Redux Toolkit** - 전역 상태 관리
- **Headless UI** - 접근성 최적화 컴포넌트
- **React Player** - 동영상 재생 (lazy loading)

### Backend & Database

- **Firebase Authentication** - 다중 인증 (Google, GitHub, Email)
- **Firebase Admin SDK** - 서버 사이드 JWT 토큰 검증
- **Firestore** - 실시간 NoSQL 데이터베이스
- **AWS S3** - Presigned URL 기반 이미지 저장 및 스트리밍
- **TMDB API** - 영화 정보 및 트레일러

### Deployment & Tools

- **Vercel** - 배포 및 호스팅
- **Bundle Analyzer** - 번들 크기 최적화 분석

## 🌟 주요 특징

### 🔐 보안 및 인증

- **Firebase Admin SDK** - 프로덕션 레벨 JWT 토큰 검증
- **다중 인증 방식** - 이메일/비밀번호, Google, GitHub 소셜 로그인
- **비밀번호 변경** - 이메일 사용자를 위한 2단계 비밀번호 변경
- **로그인 상태 유지** - 브라우저/세션 저장소 선택 가능
- **닉네임 중복 검사** - 실시간 중복 확인 및 자동 생성
- **JWT 토큰 자동 갱신** - 만료 시 자동 재시도 로직

### 🎨 사용자 경험

- **프로필 편집 시스템** - 통합된 프로필 관리 인터페이스
- **이미지 업로드** - AWS S3 Presigned URL 보안 업로드
- **실시간 데이터 동기화** - Firestore 기반
- **등급 배지 시스템** - 사용자 활동 수준 시각화

### ⚡ 성능 최적화

- **Server Components** - 초기 로딩 최적화
- **Intersection Observer** - lazy loading 구현
- **번들 분석** - Webpack Bundle Analyzer 통합
- **API 캐싱 시스템** - 영화 등급 정보 메모리 캐시 (N+1 문제 해결)
- **백그라운드 프리페칭** - 사용자 인터랙션 예측 기반 데이터 미리 로드
- **지연 로딩** - 우선순위 기반 데이터 로딩 전략

#### 🚀 N+1 문제 해결 사례

영화 목록 조회 시 발생하는 N+1 문제를 해결하여 **API 호출 횟수를 감소**시켰습니다.

**Before (N+1 문제):**

```typescript
// 인기 영화 20개 → 21번의 API 호출
const movies = await getMovieList(); // 1번
for (const movie of movies) {
  movie.releaseDate = await getReleaseDate(movie.id); // 20번
}
```

**After (최적화):**

```typescript
// 인기 영화 20개 → 1번의 배치 호출 + 캐시 활용
const movies = await getMovieList(); // 1번
const movieIds = movies.map((m) => m.id);
const releaseDates = await getBatchReleaseDates(movieIds); // 동시 처리
```

**개선 효과:**

- API 호출 횟수: 21회 → 동시 처리로 대폭 감소
- 순차 처리 → 병렬 처리로 전환
- 중복 요청 제거 (캐시 활용)
- API 레이트 리밋 위험 감소

**적용된 최적화 기법:**

- **메모리 캐시**: `Map` 기반 간단한 캐시 시스템
- **배치 처리**: `Promise.all()`을 활용한 동시 API 호출
- **지능형 캐싱**: 중복 요청 자동 제거

### 🎯 SEO 및 접근성

- **동적 메타데이터** - 페이지별 최적화
- **robots.txt** - 검색 엔진 최적화
- **Open Graph** - 소셜 미디어 공유 최적화
- **ARIA 속성** - 접근성 향상
- **키보드 네비게이션** - 접근성을 위한 키보드 지원

## 🚀 RESTful API

완전한 CRUD 작업을 지원하는 RESTful API를 구현했습니다.

### 🔐 인증 API

#### `POST /api/auth/signup`

이메일 회원가입을 처리합니다.

**요청 본문:**

```json
{
  "displayName": "사용자닉네임",
  "email": "user@example.com",
  "password": "password123!"
}
```

**응답:**

```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다.",
  "data": {
    "uid": "user123",
    "email": "user@example.com",
    "displayName": "사용자닉네임"
  }
}
```

#### `POST /api/auth/social-setup`

소셜 로그인 후 사용자 프로필을 설정합니다.

**요청 헤더:**

- `Authorization: Bearer <JWT_TOKEN>`

**요청 본문:**

```json
{
  "provider": "google" // or "github"
}
```

**응답:**

```json
{
  "success": true,
  "message": "로그인 성공",
  "data": {
    "uid": "user123",
    "isNewUser": false,
    "displayName": "사용자닉네임",
    "provider": "google"
  }
}
```

#### `POST /api/auth/check-availability`

닉네임 또는 이메일 중복을 확인합니다.

**요청 본문:**

```json
{
  "type": "displayName", // or "email"
  "value": "확인할값"
}
```

**응답:**

```json
{
  "available": true,
  "message": "사용 가능한 닉네임입니다."
}
```

### 리뷰 API

#### `GET /api/reviews`

리뷰 목록을 조회합니다.

**쿼리 파라미터:**

- `page` (number): 페이지 번호 (기본값: 1)
- `pageSize` (number): 페이지 크기 (기본값: 10)
- `uid` (string, optional): 특정 사용자의 리뷰만 조회
- `search` (string, optional): 검색어

#### `POST /api/reviews`

새 리뷰를 생성합니다.

**요청 본문:**

```json
{
  "user": {
    "uid": "string",
    "displayName": "string",
    "photoURL": "string"
  },
  "review": {
    "movieId": 123,
    "movieTitle": "영화 제목",
    "reviewTitle": "리뷰 제목",
    "reviewContent": "리뷰 내용",
    "rating": 5
  }
}
```

#### `GET /api/reviews/[id]`

개별 리뷰를 조회합니다.

#### `PUT /api/reviews/[id]`

리뷰를 수정합니다.

**요청 본문:**

```json
{
  "reviewTitle": "수정된 제목",
  "reviewContent": "수정된 내용",
  "rating": 4
}
```

#### `DELETE /api/reviews/[id]`

리뷰를 삭제합니다.

### 좋아요 API

#### `POST /api/reviews/[id]/like`

리뷰에 좋아요를 추가합니다.

**요청 본문:**

```json
{
  "movieTitle": "영화 제목"
}
```

#### `DELETE /api/reviews/[id]/like`

리뷰의 좋아요를 취소합니다.

#### `GET /api/reviews/[id]/like`

현재 사용자의 좋아요 상태를 확인합니다.

**응답:**

```json
{
  "isLiked": true
}
```

### 사용자 프로필 API

#### `GET /api/users/[uid]`

사용자 프로필 정보를 조회합니다.

**응답:**

```json
{
  "provider": "google",
  "biography": "영화를 사랑하는 개발자입니다.",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-02T00:00:00.000Z"
}
```

#### `PUT /api/users/[uid]`

사용자 프로필을 업데이트합니다.

**요청 본문:**

```json
{
  "biography": "새로운 자기소개",
  "displayName": "새로운닉네임"
}
```

**응답:**

```json
{
  "success": true,
  "message": "프로필이 성공적으로 업데이트되었습니다.",
  "data": {
    "biography": "새로운 자기소개",
    "displayName": "새로운닉네임",
    "updatedAt": "2023-01-02T00:00:00.000Z"
  }
}
```

### 댓글 API

#### `GET /api/comments/[reviewId]`

특정 리뷰의 댓글 목록을 조회합니다.

**응답:**

```json
{
  "comments": [
    {
      "id": "string",
      "authorId": "string",
      "displayName": "string",
      "photoURL": "string",
      "content": "댓글 내용",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### `POST /api/comments/[reviewId]`

새 댓글을 생성합니다.

**요청 본문:**

```json
{
  "authorId": "string",
  "displayName": "string",
  "photoURL": "string",
  "content": "댓글 내용"
}
```

#### `PUT /api/comments/[reviewId]/[commentId]`

댓글을 수정합니다.

**요청 본문:**

```json
{
  "content": "수정된 댓글 내용"
}
```

#### `DELETE /api/comments/[reviewId]/[commentId]`

댓글을 삭제합니다.

### 기타 API

#### `GET /api/reviews/liked`

좋아요한 리뷰 목록을 조회합니다.

#### `GET /api/reviews/search`

리뷰를 검색합니다.

#### `GET /api/s3`, `POST /api/s3`

AWS S3 파일 업로드용 Presigned URL을 생성합니다.

#### `GET /api/tmdb/search`

TMDB API를 통해 영화를 검색합니다.

## 📁 프로젝트 구조

```
├── app/                 # Next.js App Router
│   ├── components/      # 공통 컴포넌트
│   ├── api/            # RESTful API 라우트
│   │   ├── reviews/    # 리뷰 CRUD API
│   │   ├── comments/   # 댓글 CRUD API
│   │   ├── s3/        # 파일 업로드 API
│   │   └── tmdb/      # 영화 검색 API
│   ├── my-page/        # 프로필 관리 페이지
│   └── [pages]/        # 페이지 컴포넌트
├── lib/                # 유틸리티 함수
├── store/              # 상태 관리 (Redux, Context)
└── firebase-config/    # Firebase 설정
```

## 🔐 Firebase Admin SDK 보안

프로덕션 레벨의 보안을 위해 Firebase Admin SDK를 도입했습니다.

### 보안 강화 사항

- **JWT 토큰 검증**: 위조 불가능한 Firebase ID Token 사용
- **자동 토큰 만료**: 1시간 후 자동 만료로 보안 위험 최소화
- **서명 검증**: Firebase 공개키로 토큰 무결성 검증
- **토큰 취소**: 계정 보안 침해 시 즉시 토큰 무효화 가능
- **자동 갱신**: 토큰 만료 시 사용자 개입 없이 자동 갱신

### 인증 플로우

```typescript
// 클라이언트: Firebase ID Token 발급
const idToken = await user.getIdToken();

// 서버: Admin SDK로 토큰 검증
const decodedToken = await admin.auth().verifyIdToken(idToken);
const uid = decodedToken.uid; // 검증된 사용자 ID
```

### 보안 API 엔드포인트

모든 인증이 필요한 API는 JWT 토큰 검증을 통과해야 합니다:

- `POST /api/reviews` - 리뷰 생성 (작성자 본인만)
- `PUT /api/reviews/[id]` - 리뷰 수정 (작성자 본인만)
- `DELETE /api/reviews/[id]` - 리뷰 삭제 (작성자 본인만)
- `POST /api/comments/[reviewId]` - 댓글 생성 (인증된 사용자)
- `PUT /api/comments/[reviewId]/[commentId]` - 댓글 수정 (작성자 본인만)
- `DELETE /api/comments/[reviewId]/[commentId]` - 댓글 삭제 (작성자 본인만)

자세한 구현 가이드는 [Firebase Admin SDK 가이드](./docs/FIREBASE_ADMIN_SDK_GUIDE.md)를 참조하세요.

## 📝 버전 히스토리

### v2.3.0 (2025-01-13)

- **N+1 문제 해결**: 영화 API 호출 최적화로 성능 대폭 개선
- **배치 처리 시스템**: Promise.all() 기반 동시 API 처리
- **메모리 캐시 도입**: Map 기반 중복 요청 제거
- **성능 모니터링**: API 호출 횟수 및 응답 시간 최적화

### v2.2.0 (2025-06-16)

- 등급 배지 시스템 추가
- 리뷰 작성자 및 댓글 작성자 활동 등급 표시
- 성능 최적화된 비동기 배지 로딩

### v2.1.0 (2025.01.08)

- 비밀번호 변경 기능 추가
- 프로필 편집 시스템 개선
- 로그인 상태 유지 선택 기능
- AWS S3 이미지 스트리밍 최적화

### v2.0.0 (2025.01.07)

- App Router 마이그레이션
- Server Components 도입
- Next.js 14 전면 업데이트
- 성능 최적화 (번들 크기 62% 감소)
- Lighthouse 점수 대폭 개선

### v1.0.0 (2022.12.24)

- 첫 배포
- 기본 기능 구현

## 🔗 링크

- **배포 사이트**: [https://just-your-tickets-git-main-dah115s-projects.vercel.app/](https://just-your-tickets-git-main-dah115s-projects.vercel.app/)
