import { render, screen, fireEvent } from "@testing-library/react";
import ProfileAvatar from "app/components/user/ProfileAvatar";

// 간단한 렌더링 테스트
it("이름의 첫 글자가 fallback으로 보인다", () => {
  render(<ProfileAvatar userDisplayName="홍길동" />);
  expect(screen.getByText("홍")).toBeInTheDocument();
});

// 외부 이미지가 정상적으로 렌더링되는지 테스트
it("previewSrc가 있으면 이미지를 렌더링한다", () => {
  render(
    <ProfileAvatar
      userDisplayName="테스트"
      previewSrc="https://image.tmdb.org/t/p/w185/test.jpg"
    />,
  );
  // alt 속성으로 img 태그를 직접 찾음
  const img = screen.getByAltText("테스트");
  expect(img).toHaveAttribute("src", expect.stringContaining("test.jpg"));
});

// 이미지 로딩 실패 시 fallback(이니셜)이 보이는지 테스트
it("이미지 로딩 실패 시 fallback(이니셜)이 보인다", () => {
  render(
    <ProfileAvatar
      userDisplayName="김철수"
      previewSrc="https://broken-url.jpg"
    />,
  );
  // alt로 img 태그를 명확히 찾음
  const img = screen.getByAltText("김철수");
  // 강제로 에러 발생시켜 fallback 동작 유도
  fireEvent.error(img!);
  // 이니셜이 보이는지 검증
  expect(screen.getByText("김")).toBeInTheDocument();
});
