"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import ActivityBadge from "app/components/ui/feedback/ActivityBadge";
import MoviePoster from "app/components/movie/MoviePoster";
import ProfileImage from "app/components/user/ProfileImage";
import ReviewDetailsModal from "app/components/review/ReviewDetailsModal";
import { firebaseErrorHandler } from "app/utils/firebaseError";
import { apiCallWithTokenRefresh } from "app/utils/getIdToken";
import { ReviewDoc, ReviewWithLike } from "lib/reviews/fetchReviewsPaginated";
import { useAlert } from "store/context/alertContext";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { selectUser } from "store/redux-toolkit/slice/userSlice";
import { ImSpinner2 } from "react-icons/im";

interface ReviewTicketProps {
  reviews: ReviewDoc[];
  reviewId?: string | null;
  onLikeToggled?: (
    reviewId: string,
    newLikeCount: number,
    isLiked: boolean,
  ) => void;
}

export default function ReviewTicket({
  reviews: initialReviews,
  reviewId,
  onLikeToggled,
}: ReviewTicketProps) {
  const [reviews, setReviews] = useState<ReviewWithLike[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewWithLike>();
  const { showSuccessHandler, showErrorHandler } = useAlert();
  const router = useRouter();
  const userState = useAppSelector(selectUser);
  const [likingReviewId, setLikingReviewId] = useState<string | null>(null);

  const openModalHandler = useCallback((selectedReview: ReviewWithLike) => {
    setSelectedReview(selectedReview);
    setIsModalOpen(true);
  }, []);

  const closeModalHandler = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    const openModalForReview = async (id: string) => {
      let reviewToOpen: ReviewWithLike | undefined = reviews.find(
        (r) => r.id === id,
      );

      if (!reviewToOpen) {
        // If review is not in the list, fetch it directly
        try {
          const fetchedReview: ReviewDoc = await apiCallWithTokenRefresh(
            async (authHeaders) => {
              const res = await fetch(`/api/reviews/${id}`, {
                headers: authHeaders,
              });
              if (!res.ok) throw new Error("리뷰를 가져오지 못했습니다.");
              return res.json();
            },
          );

          // Manually check like status for this single review
          if (userState?.uid) {
            const likesResponse = await apiCallWithTokenRefresh(
              async (authHeaders) => {
                const response = await fetch(
                  `/api/reviews/${fetchedReview.id}/like`,
                  {
                    method: "GET",
                    headers: authHeaders,
                  },
                );
                if (!response.ok) {
                  throw new Error("Failed to fetch like status");
                }
                return response.json();
              },
            );
            const isLiked = likesResponse.isLiked || false;
            reviewToOpen = { ...fetchedReview, isLiked };
          } else {
            reviewToOpen = { ...fetchedReview, isLiked: false };
          }
        } catch (error: unknown) {
          console.error("특정 리뷰를 가져오는 데 실패했습니다.", error);
          showErrorHandler("오류", "리뷰를 불러오는 데 실패했습니다.");
          return;
        }
      }

      if (reviewToOpen) {
        openModalHandler(reviewToOpen);
      }
    };

    if (reviewId && !isLoading) {
      openModalForReview(reviewId);
    }
  }, [
    reviewId,
    openModalHandler,
    reviews,
    showErrorHandler,
    userState?.uid,
    isLoading,
  ]);

  useEffect(() => {
    if (!userState?.uid) {
      setReviews(
        initialReviews.map((review) => ({ ...review, isLiked: false })),
      );
      setIsLoading(false);
      return;
    }

    const fetchLikeStatuses = async () => {
      if (initialReviews.length === 0) {
        setReviews([]);
        setIsLoading(false);
        return;
      }
      try {
        const reviewIds = initialReviews.map((review) => review.id);
        const likesResponse = await apiCallWithTokenRefresh(
          async (authHeaders) => {
            const response = await fetch(`/api/reviews/like-statuses`, {
              method: "POST",
              headers: { "Content-Type": "application/json", ...authHeaders },
              body: JSON.stringify({ reviewIds }),
            });
            if (!response.ok) {
              throw new Error("Failed to fetch like statuses");
            }
            return response.json();
          },
        );

        const likesMap = likesResponse.likes;
        const statuses = initialReviews.map((review) => ({
          ...review,
          isLiked: likesMap[review.id] || false,
        }));
        setReviews(statuses);
      } catch (error) {
        console.error("Error fetching like statuses:", error);
        // On error, set all as not liked
        setReviews(
          initialReviews.map((review) => ({ ...review, isLiked: false })),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikeStatuses();
  }, [initialReviews, userState?.uid]);

  const onReviewDeleteHandler = useCallback(
    async (id: string) => {
      if (!userState?.uid) {
        showErrorHandler("오류", "로그인이 필요합니다.");
        return;
      }

      const confirmed = window.confirm("정말 삭제하시겠습니까?");
      if (!confirmed) {
        return;
      } else {
        closeModalHandler(); // confirm 확인 즉시 모달 닫기
      }

      try {
        await apiCallWithTokenRefresh(async (authHeaders) => {
          const response = await fetch(`/api/reviews/${id}`, {
            method: "DELETE",
            headers: {
              ...authHeaders,
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "삭제에 실패했습니다.");
          }

          return response.json();
        });

        showSuccessHandler("알림", "리뷰가 성공적으로 삭제되었습니다.", () => {
          router.refresh();
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("리뷰 티켓 삭제 중 오류 발생:", error.message);
          showErrorHandler("오류", error.message);
        } else {
          const { title, message } = firebaseErrorHandler(error);
          showErrorHandler(title, message);
        }
      }
    },
    [
      closeModalHandler,
      showErrorHandler,
      showSuccessHandler,
      router,
      userState,
    ],
  );

  const handleLikeToggle = useCallback(
    async (reviewId: string) => {
      if (!userState?.uid) {
        showErrorHandler("오류", "로그인이 필요합니다.");
        return;
      }

      const reviewToUpdate = reviews.find((r) => r.id === reviewId);
      if (!reviewToUpdate) return;

      setLikingReviewId(reviewId);
      const currentLikedStatus = reviewToUpdate.isLiked;
      const newLikedStatus = !currentLikedStatus;
      const originalLikeCount = reviewToUpdate.review.likeCount;
      const newLikeCount = newLikedStatus
        ? originalLikeCount + 1
        : originalLikeCount - 1;

      // Optimistic UI update for main list
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                isLiked: newLikedStatus,
                review: { ...review.review, likeCount: newLikeCount },
              }
            : review,
        ),
      );

      // Update selectedReview if it's the same review
      if (selectedReview?.id === reviewId) {
        setSelectedReview((prev: ReviewWithLike | undefined) =>
          prev
            ? {
                ...prev,
                isLiked: newLikedStatus,
                review: { ...prev.review, likeCount: newLikeCount },
              }
            : undefined,
        );
      }

      try {
        const { likeCount: updatedLikeCount } = await apiCallWithTokenRefresh(
          async (authHeaders) => {
            const response = await fetch(`/api/reviews/${reviewId}/like`, {
              method: newLikedStatus ? "POST" : "DELETE",
              headers: { "Content-Type": "application/json", ...authHeaders },
              body: newLikedStatus
                ? JSON.stringify({
                    movieTitle: reviewToUpdate.review.movieTitle,
                  })
                : undefined,
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error);
            }
            return response.json();
          },
        );

        // 서버로부터 받은 최신 likeCount로 UI 업데이트
        setReviews((prev) =>
          prev.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  review: { ...review.review, likeCount: updatedLikeCount },
                }
              : review,
          ),
        );

        if (selectedReview?.id === reviewId) {
          setSelectedReview((prev: ReviewWithLike | undefined) =>
            prev
              ? {
                  ...prev,
                  review: { ...prev.review, likeCount: updatedLikeCount },
                }
              : undefined,
          );
        }

        onLikeToggled?.(reviewId, updatedLikeCount, newLikedStatus);
      } catch (error: unknown) {
        // Revert on error for main list
        setReviews((prev) =>
          prev.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  isLiked: currentLikedStatus,
                  review: { ...review.review, likeCount: originalLikeCount },
                }
              : review,
          ),
        );

        // Revert selectedReview on error
        if (selectedReview?.id === reviewId) {
          setSelectedReview((prev: ReviewWithLike | undefined) =>
            prev
              ? {
                  ...prev,
                  isLiked: currentLikedStatus,
                  review: { ...prev.review, likeCount: originalLikeCount },
                }
              : undefined,
          );
        }

        if (error instanceof Error) {
          showErrorHandler("오류", error.message);
        } else {
          showErrorHandler("오류", "좋아요 처리에 실패했습니다.");
        }
      } finally {
        setLikingReviewId(null);
      }
    },
    [reviews, selectedReview, userState?.uid, showErrorHandler, onLikeToggled],
  );

  return (
    <>
      {/* 리뷰 상세 모달 */}
      {selectedReview && (
        <ReviewDetailsModal
          selectedReview={selectedReview}
          isModalOpen={isModalOpen}
          closeModalHandler={closeModalHandler}
          onReviewDeleted={onReviewDeleteHandler}
          onLikeToggle={handleLikeToggle}
        />
      )}

      {/* 리뷰 리스트 */}
      {isLoading ? (
        <div className="py-4 text-center">
          <p className="text-gray-500">리뷰를 불러오는 중...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {reviews.map((data) => (
            <article
              key={data.id}
              className="group relative flex cursor-pointer flex-col items-stretch drop-shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-6 hover:drop-shadow-2xl"
            >
              {/* 포스터 이미지 */}
              <div
                className="aspect-[2/3] w-full overflow-hidden rounded-xl"
                onClick={() => openModalHandler(data)}
              >
                <MoviePoster
                  posterPath={data.review.moviePosterPath}
                  title={data.review.movieTitle}
                />
              </div>

              {/* 정보 카드 */}
              <section className="relative z-10 mt-[-3rem] flex flex-col rounded-b-xl border bg-white p-2 text-black transition-all duration-500 group-hover:bg-gray-200">
                {/* 프로필 사진 & 닉네임 & 등급 */}
                <div
                  className="flex items-center"
                  onClick={() => openModalHandler(data)}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-1.5">
                    <ProfileImage
                      photoKey={data.user.photoKey || undefined}
                      userDisplayName={data.user.displayName || "사용자"}
                    />
                    <p className="min-w-0 truncate text-xs">
                      {data.user.displayName || "Guest"}
                    </p>
                  </div>
                  <ActivityBadge
                    activityLevel={data.user.activityLevel}
                    size="tiny"
                  />
                </div>

                {/* 리뷰 제목 */}
                <div
                  className="mt-2 flex items-center"
                  onClick={() => openModalHandler(data)}
                >
                  <div className="mr-1.5 flex items-center">
                    <IoStar className="text-accent-300" size={16} />
                    <p className="ml-1 text-sm font-bold">
                      {data.review.rating}
                    </p>
                  </div>
                  <p className="w-full truncate font-semibold">
                    {data.review.reviewTitle}
                  </p>
                </div>

                {/* 영화 타이틀 & 좋아요 */}
                <div className="mt-2 flex items-center justify-between border-t-4 border-dotted pt-1.5">
                  {/* 클릭하면 영화 상세 정보로 이동 */}
                  <div
                    className="flex-1 truncate pr-1.5 text-[10px] hover:underline"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Link href={`/movie-details/${data.review.movieId}`}>
                      {`${data.review.movieTitle} (${data.review.releaseYear})`}
                    </Link>
                  </div>
                  {/* 좋아요 버튼 */}
                  <button
                    className="flex items-center text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeToggle(data.id);
                    }}
                    disabled={!userState?.uid || likingReviewId === data.id}
                  >
                    <div className="text-red-500 transition-transform duration-200 group-hover:scale-110">
                      {data.isLiked ? (
                        <FaHeart
                          size={10}
                          data-testid={`like-button-filled-${data.id}`}
                        />
                      ) : (
                        <FaRegHeart
                          size={10}
                          data-testid={`like-button-empty-${data.id}`}
                        />
                      )}
                    </div>
                    <div className="ml-1 flex items-center justify-center">
                      {likingReviewId === data.id ? (
                        <ImSpinner2 className="animate-spin" />
                      ) : (
                        <span className="min-w-[1rem] text-center">
                          {data.review.likeCount}
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              </section>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
