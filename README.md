# Just Your Tickets 🎬

> 영화 리뷰 검색 및 공유 플랫폼

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://just-movie-tickets.vercel.app)
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
- 🎫 **티켓 형태 리뷰** - 독창적인 영화 티켓 디자인의 리뷰 시스템
- 👤 **소셜 로그인** - Google, GitHub 연동 인증 + 닉네임 중복 검사
- 📸 **프로필 이미지 관리** - AWS S3 Presigned URL 보안 업로드
- 💬 **커뮤니티** - 리뷰 댓글 및 좋아요 시스템 (실시간 동기화)
- 📱 **앱 설치 지원** - 홈 화면에 추가 가능 (manifest.json)
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

- **Firebase Authentication** - 소셜 로그인 (Google, GitHub)
- **Firestore** - 실시간 NoSQL 데이터베이스
- **AWS S3** - Presigned URL 기반 이미지 저장
- **TMDB API** - 영화 정보 및 트레일러

### Deployment & Tools

- **Vercel** - 배포 및 호스팅
- **Bundle Analyzer** - 번들 크기 최적화 분석
- **Sharp** - 이미지 최적화 (WebP 변환)

## 📊 성능 최적화 성과

| 지표                | Before | After  | 개선율    |
| ------------------- | ------ | ------ | --------- |
| 번들 사이즈         | 234KB  | 88.3KB | **62% ↓** |
| Lighthouse (웹)     | 84     | 98     | **16% ↑** |
| Lighthouse (모바일) | 66     | 94     | **42% ↑** |
| LCP                 | 8.1s   | 3.1s   | **62% ↓** |
| TBT                 | 280ms  | 10ms   | **96% ↓** |

## 🌟 주요 특징

- **Server Components** 활용한 초기 로딩 최적화
- **실시간 데이터 동기화** Firestore 기반
- **Presigned URL** AWS S3 보안 이미지 업로드
- **SEO 최적화** 동적 메타데이터, robots.txt, Open Graph
- **앱 설치 지원** 홈 화면에 추가 가능 (manifest.json)
- **성능 최적화** Intersection Observer, lazy loading, WebP 이미지
- **접근성** Headless UI 컴포넌트, ARIA 속성
- **타입 안전성** TypeScript + Zod 스키마 검증
- **번들 분석** Webpack Bundle Analyzer 통합

## 📁 프로젝트 구조

```
├── app/                 # Next.js App Router
│   ├── components/      # 공통 컴포넌트
│   ├── api/            # API 라우트 (S3, TMDB)
│   └── [pages]/        # 페이지 컴포넌트
├── lib/                # 유틸리티 함수
├── store/              # 상태 관리 (Redux, Context)
└── firebase-config/    # Firebase 설정
```

## 📝 버전 히스토리

### v2.0.0 (2025.01.07)

- Next.js 14 전면 업데이트
- 성능 최적화 (번들 크기 62% 감소)
- Lighthouse 점수 대폭 개선

### v1.1.0 (2024.08.27)

- App Router 마이그레이션
- Server Components 도입

### v1.0.0 (2022.12.24)

- 첫 배포
- 기본 기능 구현

## 🔗 링크

- **배포 사이트**: [just-movie-tickets.vercel.app](https://just-movie-tickets.vercel.app)
- **상세 포트폴리오**: [포트폴리오.md](./포트폴리오.md)
