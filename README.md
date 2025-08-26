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

# 테스트 실행
yarn test
```

## ✨ 주요 기능

- 🔍 **실시간 영화 검색** - TMDB API 기반 자동완성 검색
- 👤 **다중 인증 시스템** - Google, GitHub 소셜 로그인 + 이메일/비밀번호
- 📸 **프로필 관리** - AWS S3 Presigned URL 기반 이미지 업로드
- 💬 **커뮤니티** - 리뷰 댓글 및 좋아요 시스템
- 🏆 **등급 배지 시스템** - 사용자 활동 등급 표시
- 🎬 **동영상 플레이어** - YouTube 트레일러 재생
- 🎠 **캐러셀 UI** - Swiper 기반 반응형 영화 목록
- 📚 **보고 싶은 영화(Watchlist)** - 보고 싶은 영화 저장 및 관리
- 🧪 **테스트 환경** - Jest Mock 기반 포괄적인 테스트 환경

## 🛠 기술 스택

### Frontend

- **Next.js 14** - App Router, Server Components
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **React Hook Form + Zod** - 폼 관리 및 유효성 검증
- **Redux Toolkit + Redux Persist** - 전역 상태 관리
- **Swiper** - 반응형 캐러셀 컴포넌트
- **Plaiceholder** - 이미지 최적화

### Backend & Database

- **Firebase Authentication** - 다중 인증
- **Firebase Admin SDK** - 서버 사이드 JWT 토큰 검증
- **Firestore** - 실시간 NoSQL 데이터베이스
- **AWS S3** - Presigned URL 기반 이미지 저장
- **TMDB API** - 영화 정보 및 트레일러

### Testing & Development

- **Jest + React Testing Library** - 테스트 프레임워크
- **Jest Mock** - 모듈 및 API 모킹
- **ESLint + Prettier** - 코드 품질 관리

## 🌟 주요 특징

### 🔐 보안 및 인증

- **Firebase Admin SDK** - 프로덕션 레벨 JWT 토큰 검증
- **다중 인증 방식** - 이메일/비밀번호, Google, GitHub 소셜 로그인
- **JWT 토큰 자동 갱신** - 만료 시 자동 재시도 로직

### ⚡ 성능 최적화

- **Server Components** - 초기 로딩 최적화
- **API 캐싱 시스템** - 영화 등급 정보 메모리 캐시 (N+1 문제 해결)
- **이미지 최적화** - Plaiceholder 기반 플레이스홀더
- **Swiper 최적화** - 터치 제스처 및 반응형 브레이크포인트

### 🧪 테스트 환경

- **Jest + React Testing Library** - 포괄적인 테스트 환경
- **Jest Mock** - 모듈 및 API 모킹
- **Firebase 모킹** - Firebase 서비스 모킹

## 🚀 RESTful API

### 🔐 인증 API

- `POST /api/auth/signup` - 이메일 회원가입
- `POST /api/auth/social-setup` - 소셜 로그인 설정
- `POST /api/auth/check-availability` - 닉네임/이메일 중복 확인

### 리뷰 API

- `GET /api/reviews` - 리뷰 목록 조회
- `POST /api/reviews` - 새 리뷰 생성
- `GET /api/reviews/[id]` - 개별 리뷰 조회
- `PUT /api/reviews/[id]` - 리뷰 수정
- `DELETE /api/reviews/[id]` - 리뷰 삭제

### 좋아요 API

- `POST /api/reviews/[id]/like` - 좋아요 추가
- `DELETE /api/reviews/[id]/like` - 좋아요 취소
- `GET /api/reviews/[id]/like` - 좋아요 상태 확인

### 사용자 API

- `GET /api/users/[uid]` - 사용자 프로필 조회
- `PUT /api/users/[uid]` - 프로필 업데이트

### 댓글 API

- `GET /api/comments/[reviewId]` - 댓글 목록 조회
- `POST /api/comments/[reviewId]` - 새 댓글 생성
- `PUT /api/comments/[reviewId]/[commentId]` - 댓글 수정
- `DELETE /api/comments/[reviewId]/[commentId]` - 댓글 삭제

### 와치리스트 API

- `GET /api/watchlist?uid=[uid]` - 사용자의 보고 싶은 영화 목록 조회
- `POST /api/watchlist` - 영화를 보고 싶은 영화 목록에 추가
- `DELETE /api/watchlist` - 보고 싶은 영화 목록에서 영화 제거

### 기타 API

- `GET /api/s3`, `POST /api/s3` - AWS S3 파일 업로드
- `GET /api/tmdb/search` - TMDB 영화 검색

## 📁 프로젝트 구조

```
├── app/                 # Next.js App Router
│   ├── components/      # 공통 컴포넌트
│   ├── api/            # RESTful API 라우트
│   ├── my-page/        # 프로필 관리 페이지
│   └── [pages]/        # 페이지 컴포넌트
├── __tests__/          # 테스트 파일
├── lib/                # 유틸리티 함수
├── store/              # 상태 관리 (Redux)
├── firebase-config/    # Firebase 설정
└── firebase-admin-config/ # Firebase Admin SDK 설정
```

## 🔐 Firebase Admin SDK 보안

- **JWT 토큰 검증**: Firebase ID Token 사용
- **자동 토큰 만료**: 1시간 후 자동 만료
- **서명 검증**: Firebase 공개키로 토큰 무결성 검증
- **자동 갱신**: 토큰 만료 시 자동 갱신

모든 인증이 필요한 API는 JWT 토큰 검증을 통과해야 합니다.

## 📝 버전 히스토리

### v2.4.0 (2025-08-27)

- **와치리스트 시스템**: 보고 싶은 영화 저장 및 관리 기능 추가
- **영화 북마크**: 영화 상세 페이지에서 와치리스트 추가/제거
- **개인화된 영화 관리**: 사용자별 보고 싶은 영화 목록 관리
- **Redux 상태 관리**: 와치리스트 전역 상태 관리 및 실시간 동기화

### v2.3.0 (2025-07-09)

- **테스트 환경 구축**: Jest Mock 기반 포괄적인 테스트 환경
- **Swiper 캐러셀**: 반응형 영화 목록 UI 개선
- **이미지 최적화**: Plaiceholder 기반 플레이스홀더 시스템
- **Redux Persist**: 상태 지속성으로 사용자 경험 개선
- **코드 품질**: ESLint + Prettier 설정 강화

### v2.2.0 (2025-06-16)

- **등급 배지 시스템**: 사용자 활동 등급 표시 기능 추가
- **리뷰 작성자 등급**: 리뷰 작성자 활동 등급 표시
- **댓글 작성자 등급**: 댓글 작성자 활동 등급 표시

### v2.1.0 (2025.01.08)

- **비밀번호 변경**: 이메일 사용자 비밀번호 변경 기능
- **프로필 편집**: 통합된 프로필 관리 시스템 개선
- **로그인 상태 유지**: 브라우저/세션 저장소 선택 기능

### v2.0.0 (2025.01.07)

- **App Router 마이그레이션**: Next.js App Router 도입
- **Server Components**: 서버 컴포넌트 전면 적용
- **Next.js 14 업데이트**: 최신 버전으로 전면 업그레이드
- **성능 최적화**: 번들 크기 62% 감소

### v1.0.0 (2022.12.24)

- **첫 배포**: 기본 기능 구현 및 초기 배포

## 🔗 링크

- **배포 사이트**: [https://just-your-tickets-git-main-dah115s-projects.vercel.app/](https://just-your-tickets-git-main-dah115s-projects.vercel.app/)
