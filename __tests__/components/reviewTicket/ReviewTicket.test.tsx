import { screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReviewTicket from "app/components/review/ReviewTicket";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { apiCallWithTokenRefresh } from "app/utils/getIdToken";
import { render } from "__tests__/utils/test-utils";

// 필요한 모듈들을 mock 처리합니다.
jest.mock("store/redux-toolkit/hooks");
jest.mock("app/utils/getIdToken");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/ticket-list",
  useSearchParams: () => new URLSearchParams(),
}));
jest.mock("store/context/alertContext", () => ({
  useAlert: () => ({
    showSuccessHandler: jest.fn(),
    showErrorHandler: jest.fn(),
  }),
}));

const mockApiCallWithTokenRefresh = apiCallWithTokenRefresh as jest.Mock;
const mockUseAppSelector = useAppSelector as jest.Mock;

// ReviewDoc[] 타입의 테스트 데이터
const mockInitialReviews: ReviewDoc[] = [
  {
    id: "review1",
    user: {
      uid: "user1",
      displayName: "테스터1",
      photoKey: "photo1.jpg",
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
      likeCount: 10,
    },
  },
  {
    id: "review2",
    user: {
      uid: "user2",
      displayName: "테스터2",
      photoKey: null,
      activityLevel: "EXPERT",
    },
    review: {
      movieId: 2,
      movieTitle: "영화 제목2",
      originalTitle: "Movie Title 2",
      moviePosterPath: "/poster2.jpg",
      releaseYear: "2024",
      rating: 4,
      reviewTitle: "볼만한 영화2",
      reviewContent: "시간 가는 줄 몰랐네요.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likeCount: 5,
    },
  },
];

const likesMapResponse = {
  review1: true,
  review2: false,
};

describe("ReviewTicket 컴포넌트", () => {
  const mockOnLikeToggled = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAppSelector.mockReturnValue({ uid: "test-user" });
    mockApiCallWithTokenRefresh.mockResolvedValue({
      likes: likesMapResponse,
    });
  });

  test("초기 리뷰 목록을 올바르게 렌더링해야 합니다.", async () => {
    render(<ReviewTicket reviews={mockInitialReviews} />);
    await waitFor(() => {
      expect(screen.getByText("영화 제목1 (2023)")).toBeInTheDocument();
    });
    expect(screen.getByText("영화 제목2 (2024)")).toBeInTheDocument();
    expect(screen.getAllByRole("article").length).toBe(2);
  });

  test("초기 로딩 중에는 로딩 메시지를 표시해야 합니다.", () => {
    // API 응답을 지연시켜 로딩 상태를 확인
    mockApiCallWithTokenRefresh.mockImplementation(
      () => new Promise(() => {}), // 영구 대기
    );

    render(<ReviewTicket reviews={mockInitialReviews} />);
    expect(screen.getByText("리뷰를 불러오는 중...")).toBeInTheDocument();
  });

  test("isLiked가 true인 리뷰는 채워진 하트로 표시되어야 합니다.", async () => {
    render(<ReviewTicket reviews={mockInitialReviews} />);
    await waitFor(() => {
      expect(
        screen.getByTestId("like-button-filled-review1"),
      ).toBeInTheDocument();
    });
    expect(screen.queryByTestId("like-button-empty-review1")).toBeNull();
  });

  test("isLiked가 false인 리뷰는 빈 하트로 표시되어야 합니다.", async () => {
    render(<ReviewTicket reviews={mockInitialReviews} />);
    await waitFor(() => {
      expect(
        screen.getByTestId("like-button-empty-review2"),
      ).toBeInTheDocument();
    });
    expect(screen.queryByTestId("like-button-filled-review2")).toBeNull();
  });

  test("좋아요 버튼을 클릭하면 UI가 즉시 업데이트되고 스피너가 표시되어야 합니다.", async () => {
    // 간소화된 mock 설정
    mockApiCallWithTokenRefresh
      .mockResolvedValueOnce({ likes: likesMapResponse })
      .mockResolvedValueOnce({ likeCount: 6 });

    render(<ReviewTicket reviews={mockInitialReviews} />);

    const likeButton = await screen.findByTestId("like-button-empty-review2");
    const likeCountContainer = likeButton.parentElement?.nextElementSibling;

    expect(likeCountContainer).toHaveTextContent("5");

    // 좋아요 버튼 클릭
    fireEvent.click(likeButton);

    // 스피너가 나타나는지 확인
    await waitFor(() => {
      expect(
        likeCountContainer?.querySelector(".animate-spin"),
      ).toBeInTheDocument();
    });

    // 최종 상태 확인
    await waitFor(() => {
      expect(likeCountContainer?.querySelector(".animate-spin")).toBeNull();
      expect(
        screen.getByTestId("like-button-filled-review2"),
      ).toBeInTheDocument();
      expect(likeCountContainer).toHaveTextContent("6");
    });
  });

  test("좋아요 API 실패 시 이전 상태로 롤백되어야 합니다.", async () => {
    mockApiCallWithTokenRefresh
      .mockResolvedValueOnce({ likes: likesMapResponse })
      .mockRejectedValueOnce(new Error("네트워크 오류"));

    render(<ReviewTicket reviews={mockInitialReviews} />);

    const likeButton = await screen.findByTestId("like-button-empty-review2");
    const likeCountContainer = likeButton.parentElement?.nextElementSibling;

    // 초기 상태 확인
    expect(likeCountContainer).toHaveTextContent("5");

    // 좋아요 버튼 클릭
    fireEvent.click(likeButton);

    // 에러 후 롤백 확인
    await waitFor(() => {
      expect(
        screen.getByTestId("like-button-empty-review2"),
      ).toBeInTheDocument();
      expect(likeCountContainer).toHaveTextContent("5");
    });
  });

  test("onLikeToggled 콜백이 올바르게 호출되어야 합니다.", async () => {
    mockApiCallWithTokenRefresh
      .mockResolvedValueOnce({ likes: likesMapResponse })
      .mockResolvedValueOnce({ likeCount: 6 });

    render(
      <ReviewTicket
        reviews={mockInitialReviews}
        onLikeToggled={mockOnLikeToggled}
      />,
    );

    const likeButton = await screen.findByTestId("like-button-empty-review2");
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(mockOnLikeToggled).toHaveBeenCalledWith("review2", 6, true);
    });
  });

  test("리뷰 카드 클릭 시 상세 모달이 열려야 합니다.", async () => {
    render(<ReviewTicket reviews={mockInitialReviews} />);

    // 리뷰 로딩 완료까지 대기
    await waitFor(() => {
      expect(screen.getByText("영화 제목1 (2023)")).toBeInTheDocument();
    });

    const reviewArticle = screen.getAllByRole("article")[0];
    fireEvent.click(reviewArticle);

    // 모달이 열렸는지 확인 (모달 내 특정 요소로 확인)
    await waitFor(() => {
      // ReviewDetailsModal이 렌더링되면 나타나는 요소들 확인
      expect(screen.getByText("재미있는 영화1")).toBeInTheDocument();
    });
  });

  test("로그인하지 않은 사용자는 좋아요 버튼을 누를 수 없습니다.", async () => {
    mockUseAppSelector.mockReturnValue(null); // 로그아웃 상태

    render(<ReviewTicket reviews={mockInitialReviews} />);

    // 비로그인 시 모든 리뷰는 '좋아요 안함'으로 표시됩니다.
    const likeButton1 = await screen.findByTestId("like-button-empty-review1");
    const likeButton2 = await screen.findByTestId("like-button-empty-review2");

    // 아이콘을 감싸는 버튼이 비활성화되었는지 확인합니다.
    expect(likeButton1.closest("button")).toBeDisabled();
    expect(likeButton2.closest("button")).toBeDisabled();
  });

  test("영화 제목 링크 클릭 시 영화 상세 페이지로 이동해야 합니다.", async () => {
    render(<ReviewTicket reviews={mockInitialReviews} />);

    await waitFor(() => {
      expect(screen.getByText("영화 제목1 (2023)")).toBeInTheDocument();
    });

    const movieLink = screen.getByText("영화 제목1 (2023)").closest("a");
    expect(movieLink).toHaveAttribute("href", "/movie-details/1");
  });

  test("빈 리뷰 배열에 대해서도 정상적으로 처리해야 합니다.", async () => {
    render(<ReviewTicket reviews={[]} />);

    await waitFor(() => {
      expect(screen.queryByRole("article")).toBeNull();
    });

    // 로딩 메시지가 사라졌는지 확인
    expect(screen.queryByText("리뷰를 불러오는 중...")).toBeNull();
  });
});
