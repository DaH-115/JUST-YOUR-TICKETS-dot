import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReviewTicket from "app/components/review/ReviewTicket";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { apiCallWithTokenRefresh } from "app/utils/getIdToken/apiCallWithTokenRefresh";

// 필요한 모듈만 최소한으로 mock 처리
jest.mock("store/redux-toolkit/hooks", () => ({
  useAppSelector: jest.fn(),
}));
jest.mock("app/utils/getIdToken/apiCallWithTokenRefresh", () => ({
  apiCallWithTokenRefresh: jest.fn(),
}));

const mockUseAppSelector = useAppSelector as jest.Mock;
const mockApiCallWithTokenRefresh = apiCallWithTokenRefresh as jest.Mock;

// 좋아요하지 않은 상태의 리뷰
const mockReviews = [
  {
    id: "review1",
    user: {
      uid: "user1",
      displayName: "테스터1",
      photoKey: null,
      activityLevel: "NOVICE",
    },
    review: {
      movieId: 1,
      movieTitle: "영화 제목1",
      originalTitle: "Movie Title 1",
      moviePosterPath: "/poster1.jpg",
      releaseYear: "2023",
      rating: 5,
      reviewTitle: "재미있는 영화1",
      reviewContent: "정말 재미있어요.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likeCount: 0,
    },
    isLiked: false,
  },
];

// 이미 좋아요한 상태의 리뷰
const mockReviewLiked = [
  {
    id: "review1",
    user: {
      uid: "user1",
      displayName: "테스터1",
      photoKey: null,
      activityLevel: "NOVICE",
    },
    review: {
      movieId: 1,
      movieTitle: "영화 제목1",
      originalTitle: "Movie Title 1",
      moviePosterPath: "/poster1.jpg",
      releaseYear: "2023",
      rating: 5,
      reviewTitle: "재미있는 영화1",
      reviewContent: "정말 재미있어요.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likeCount: 1,
    },
    isLiked: true,
  },
];

describe("ReviewTicket 좋아요 UI 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAppSelector.mockReturnValue({ uid: "test-user" });
    mockApiCallWithTokenRefresh.mockResolvedValue({ likeCount: 1 });
  });

  test("좋아요 버튼 클릭 시 하트와 카운트가 바뀐다", async () => {
    render(<ReviewTicket reviews={mockReviews} />);
    // 빈 하트(svg)에 data-testid가 부여되어 있는지 확인
    const likeIcon = await screen.findByTestId("like-button-empty-review1");
    expect(likeIcon).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();

    // 하트 아이콘의 부모 button을 찾아 클릭
    const likeBtn = likeIcon.closest("button");
    expect(likeBtn).not.toBeNull();
    fireEvent.click(likeBtn!);

    // 채워진 하트(svg)와 카운트 1이 보이는지 확인
    await waitFor(() => {
      expect(
        screen.getByTestId("like-button-filled-review1"),
      ).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });

  test("이미 좋아요한 상태에서 다시 클릭하면 빈 하트와 카운트 0으로 돌아온다", async () => {
    mockApiCallWithTokenRefresh.mockResolvedValue({ likeCount: 0 });
    render(<ReviewTicket reviews={mockReviewLiked} />);
    // 채워진 하트(svg)에 data-testid가 부여되어 있는지 확인
    const likeIcon = await screen.findByTestId("like-button-filled-review1");
    expect(likeIcon).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();

    // 하트 아이콘의 부모 button을 찾아 클릭
    const likeBtn = likeIcon.closest("button");
    expect(likeBtn).not.toBeNull();
    fireEvent.click(likeBtn!);

    // 빈 하트(svg)와 카운트 0이 보이는지 확인
    await waitFor(() => {
      expect(
        screen.getByTestId("like-button-empty-review1"),
      ).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });

  test("비로그인 사용자는 좋아요 버튼이 비활성화된다", async () => {
    mockUseAppSelector.mockReturnValue(null); // 로그인 안 함
    render(<ReviewTicket reviews={mockReviews} />);
    const likeIcon = await screen.findByTestId("like-button-empty-review1");
    // 하트 아이콘의 부모 button이 비활성화되어 있는지 확인
    const likeBtn = likeIcon.closest("button");
    expect(likeBtn).not.toBeNull();
    expect(likeBtn).toBeDisabled();
  });

  test("API 실패 시 UI가 원래대로 롤백된다", async () => {
    mockApiCallWithTokenRefresh.mockRejectedValue(new Error("API 실패"));
    render(<ReviewTicket reviews={mockReviews} />);
    const likeIcon = await screen.findByTestId("like-button-empty-review1");
    const likeBtn = likeIcon.closest("button");
    expect(likeBtn).not.toBeNull();
    fireEvent.click(likeBtn!);

    // optimistic UI로 잠깐 바뀌었다가, 롤백되어야 함
    await waitFor(() => {
      expect(
        screen.getByTestId("like-button-empty-review1"),
      ).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });
});
