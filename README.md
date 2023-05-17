# ✨ 나의 감상. Just My Ticket!

💻 **Website**: [https://just-movie-tickets.vercel.app](https://just-movie-tickets.vercel.app/)

<img src="https://i.ibb.co/Yb2ksft/P2-mobile.png" alt="TSC-TodoList-mobile-view" />
<img src="https://i.ibb.co/nCLdG6x/P2-desktop.png" alt="TSC-TodoList-desktop-view" />

**< Just Movie Tickets >는 영화를 검색하고 감상을 기록하는 리뷰 앱입니다.** 하지만 일반적인 글로 쓰인 감상평이 아닌, 영화를 본 사람이라면 가지게 되는 '티켓'에 초점을 맞추었습니다. 이 앱은 사용자가 감상문 대신 영화 감상 티켓을 컬렉션하는 느낌을 주기 위해, 티켓을 보기 쉽게 나열하는 방식을 사용하였습니다.

# 사용 기술

- **TypeScript**
- **React**
- **Next.js**
- **Styled-components**
- **Firebase**

# 설명

- 메인 화면에 진입하면 Open API에서 받아온 <인기 영화 10>을 볼 수 있습니다. 포스터 하단의 티켓 버튼을 클릭하여 감상을 쓸 수 있는 페이지로 이동합니다.

  - Next.js의 SSR 방식의 렌더링을 사용합니다.

- <검색> 아이콘 버튼을 클릭하면 검색 페이지로 이동합니다.

  - 검색 결과의 좌측 상단의 <info> 아이콘 버튼을 클릭하여 포스터, 줄거리 등 상세 정보를 확인할 수 있습니다.
  - 검색 페이지는 CSR 방식의 렌더링을 사용합니다.

- 이메일과 비밀번호를 사용하여 로그인하거나 소셜 로그인이 가능합니다.

  - 로그인하지 않으면 접근이 불가능한 페이지가 존재합니다.
  - 그 경우 팝업으로 로그인 페이지로 안내합니다.

- 로그인 이후 헤더 메뉴의 <My Tickets>를 클릭하면 현재 내가 가진 티켓들을 확인할 수 있습니다.
  - 정렬, 수정, 삭제가 가능합니다.
  - 티켓 우측 상단의 <info> 아이콘 버튼을 클릭하여 상세 페이지로 이동합니다.
