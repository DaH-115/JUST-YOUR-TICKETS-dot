# Just Your Tickets

> 영화 리뷰 검색 및 공유 플랫폼

## 🔗 링크

- [Website](https://just-movie-tickets.vercel.app)
- [GitHub](https://github.com/DaH-115/JUST-MOVIE-TICKETS-dot)

## 👨‍💻 개발 정보

- 개발 기간: 2022 - 2024
- 개발 형태: 단독 개발
- 배포 환경: Vercel 호스팅

### 버전 기록

#### Version 2.0.0 (2025.01.07)

- Next.js 14 기반 전면 업데이트 및 성능 최적화
- 주요 개선사항:
  - 번들 사이즈 62% 감소 (234KB → 88.3KB)
  - Lighthouse 성능 점수 개선 (웹: 84 → 98, 모바일: 66 → 94)
  - 최대 콘텐츠풀 페인트(LCP) 62% 개선 (8.1s → 3.1s)
  - 총 차단 시간(TBT) 96% 감소 (280ms → 10ms)

#### Version 1.1.0 (2024.08.27)

- Next.js Pages Router에서 App Router로 마이그레이션
- Server Components 도입으로 초기 로딩 성능 최적화
- 클라이언트/서버 컴포넌트 분리 아키텍처 적용

#### Version 1.0.0 (2022.12.24)

- 서비스 첫 Vercel 배포
- 기본 기능 구현:
  - TMDB API 기반 영화 검색 및 추천
  - Firebase Authentication 기반 사용자 인증
  - Firestore 실시간 리뷰 시스템

## 📌 프로젝트 개요

Just Your Tickets는 TMDB API를 기반으로 한 영화 리뷰 커뮤니티 플랫폼입니다. Next.js 14의 SSR 기능을 활용하여 초기 로딩 최적화와 SEO 개선을 구현했으며, Firebase를 통한 효율적인 백엔드 구축으로 실시간 데이터 처리가 가능한 서비스를 구현했습니다.

## 🛠 기술 스택 및 선택 이유

### Frontend

- **Next.js 14**

  - SSR을 통한 초기 로딩 최적화 및 SEO 개선
  - App Router를 활용한 효율적인 라우팅 시스템 구축
  - Client/Server Components 분리를 통한 성능 최적화

- **TypeScript**

  - 정적 타입 시스템을 통한 코드 안정성 확보
  - 개발 시 타입 추론을 통한 생산성 향상

- **Redux Toolkit**

  - 중앙 집중식 상태 관리로 데이터 일관성 유지

- **React-hook-form & Zod**

  - 선언적이고 효율적인 폼 상태 관리 및 유효성 검증

- **Tailwind CSS**
  - 유틸리티 클래스 기반의 효율적인 스타일링
  - 반응형 디자인 구현의 용이성

### Backend

- **Firebase**
  - Firebase Authentication을 통한 안전한 사용자 인증
  - Firestore의 실시간 데이터 동기화 기능 활용
  - 신속한 백엔드 구축 및 확장성 확보

## 🎯 주요 기능 및 구현 화면

### 1. 메인 페이지 및 영화 검색

- Swiper 기반의 반응형 캐러셀로 최신 영화 슬라이드 구현
- 헤더에 실시간 영화 검색 기능 구현

### 2. 영화 상세 정보 및 리뷰 시스템

- 동적 라우팅으로 SEO 최적화된 상세 페이지
- Firestore 실시간 동기화로 즉각적인 데이터 반영
- 선택한 영화와 비슷한 영화 추천 기능

### 3. 사용자 인증 및 프로필 관리

- Firebase Authentication 기반 소셜 로그인
- React-hook-form과 Zod를 활용한 폼 검증
- 개인화된 프로필 페이지 및 리뷰 관리

## 🔍 핵심 기술적 성과

- Next.js 13에서 14로의 성공적인 마이그레이션 및 성능 최적화

  - 번들 사이즈 62% 감소 (234KB → 88.3KB)
  - Lighthouse 성능 점수 개선 (웹: 84 → 98, 모바일: 66 → 94)
  - 최대 콘텐츠풀 페인트(LCP) 62% 개선 (8.1s → 3.1s)
  - 총 차단 시간(TBT) 96% 감소 (280ms → 10ms)

- Server Components를 도입하여 초기 페이지 로딩 최적화 구현

- Firebase Firestore 기반 실시간 리뷰 시스템 구축

  - useContext를 활용한 실시간 데이터 동기화 구현
  - Redux Toolkit으로 클라이언트 상태 관리 최적화

- TMDB API 연동 및 최적화

  - RESTful API 기반 영화 정보 검색 및 추천 시스템 구현
  - 효율적인 캐싱 전략으로 API 호출 최소화

- TypeScript와 정적 타입 시스템을 통한 코드 안정성 확보

- React Hook Form과 Zod를 활용한 폼 시스템 고도화
  - 로그인/회원가입과 리뷰 작성의 실시간 유효성 검증 구현
