"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import ActivityBadge from "app/components/ActivityBadge";
import MoviePoster from "app/components/MoviePoster";
import ProfileImage from "app/components/ProfileImage";
import ReviewDetailsModal from "app/components/reviewTicket/ReviewDetailsModal";
import { firebaseErrorHandler } from "app/utils/firebaseError";
import { apiCallWithTokenRefresh } from "app/utils/getIdToken";
import { ReviewDoc, ReviewWithLike } from "lib/reviews/fetchReviewsPaginated";
import { useAlert } from "store/context/alertContext";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { selectUser } from "store/redux-toolkit/slice/userSlice";

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
  const [reviews, setReviews] = useState<ReviewWithLike[]>(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewWithLike>();
  const { showSuccessHandler, showErrorHandler } = useAlert();
  const router = useRouter();
  const userState = useAppSelector(selectUser);

  const openModalHandler = useCallback((selectedReview: ReviewWithLike) => {
    setSelectedReview(selectedReview);
    setIsModalOpen(true);
  }, []);

  const closeModalHandler = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    const openModalForReview = async (id: string) => {
      let reviewToOpen = reviews.find((r) => r.id === id);

      if (!reviewToOpen) {
        // If review is not in the list, fetch it directly
        try {
          const fetchedReview = await apiCallWithTokenRefresh(
            async (authHeaders) => {
              const res = await fetch(`/api/reviews/${id}`, {
                headers: authHeaders,
              });
              if (!res.ok) throw new Error("리뷰를 가져오지 못했습니다.");
              return res.json();
            },
          );
          reviewToOpen = fetchedReview;
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

    if (reviewId) {
      openModalForReview(reviewId);
    }
  }, [reviewId, openModalHandler, reviews, showErrorHandler]);

  useEffect(() => {
    if (!userState?.uid) {
      setReviews(
        initialReviews.map((review) => ({ ...review, isLiked: false })),
      );
      return;
    }

    const fetchLikeStatuses = async () => {
      if (initialReviews.length === 0) {
        setReviews([]);
        return;
      }
      try {
        const reviewIds = initialReviews.map((review) => review.id);
        const likesResponse = await apiCallWithTokenRefresh(
          async (authHeaders) => {
            const response = await fetch(`/api/reviews/likes`, {
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

      const newLikedStatus = !reviewToUpdate.isLiked;
      const originalLikeCount = reviewToUpdate.review.likeCount;
      const newLikeCount = newLikedStatus
        ? originalLikeCount + 1
        : originalLikeCount - 1;

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
        await apiCallWithTokenRefresh(async (authHeaders) => {
          const response = await fetch(`/api/reviews/${reviewId}/like`, {
            method: newLikedStatus ? "POST" : "DELETE",
            headers: { "Content-Type": "application/json", ...authHeaders },
            body: newLikedStatus
              ? JSON.stringify({ movieTitle: reviewToUpdate.review.movieTitle })
              : undefined,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
          }
        });

        onLikeToggled?.(reviewId, newLikeCount, newLikedStatus);
      } catch (error: unknown) {
        setReviews((prev) =>
          prev.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  isLiked: reviewToUpdate.isLiked,
                  review: { ...review.review, likeCount: originalLikeCount },
                }
              : review,
          ),
        );
        if (selectedReview?.id === reviewId) {
          setSelectedReview((prev: ReviewWithLike | undefined) =>
            prev
              ? {
                  ...prev,
                  isLiked: reviewToUpdate.isLiked,
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
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {reviews.map((data) => (
          <div
            key={data.id}
            onClick={() => openModalHandler(data)}
            className="cursor-pointer drop-shadow-md transition-transform duration-300 hover:-translate-y-1"
          >
            {/* 포스터 이미지 */}
            <div className="relative aspect-[2/3] w-24 overflow-hidden rounded-lg md:w-40">
              <MoviePoster
                posterPath={data.review.moviePosterPath}
                title={data.review.movieTitle}
              />
            </div>
            <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-black via-transparent to-transparent opacity-80" />

            <div className="absolute bottom-4 right-4 flex items-center gap-1 text-sm text-white">
              {/* 영화 타이틀 & 좋아요 */}
              <div className="flex items-center justify-between border-b-4 border-dotted px-1 pb-1">
                {/* 클릭하면 영화 상세 정보로 이동 */}
                <div
                  className="flex-1 truncate pr-1.5 text-[11px] hover:underline"
                  onClick={(event) => event.stopPropagation()}
                >
                  <Link href={`/movie-details/${data.review.movieId}`}>
                    {`${data.review.movieTitle}(${data.review.releaseYear})`}
                  </Link>
                </div>
                {/* 좋아요 카운트 */}
                <div className="flex items-center">
                  <FaHeart size={11} className="mr-1 text-red-500" />
                  <p className="text-xs">{data.review.likeCount}</p>
                </div>
              </div>

              {/* 리뷰 제목 */}
              <div className="flex items-center border-b-4 border-dotted px-1 py-1">
                <div className="mr-1.5 flex items-center justify-center border-r-4 border-dotted pr-1.5">
                  <IoStar className="text-accent-300" size={14} />
                  <p className="ml-1 text-xs font-bold">{data.review.rating}</p>
                </div>
                <p className="w-full truncate text-sm">
                  {data.review.reviewTitle}
                </p>
              </div>

              {/* 프로필 사진 & 닉네임 & 등급 */}
              <div className="flex items-center justify-between px-1 pt-1.5 text-xs">
                <div className="flex min-w-0 flex-1 items-center gap-1">
                  <ProfileImage
                    photoKey={data.user.photoKey || undefined}
                    userDisplayName={data.user.displayName || "사용자"}
                  />
                  <p className="min-w-0 truncate text-xs">
                    {data.user.displayName ? data.user.displayName : "Guest"}
                  </p>
                  <ActivityBadge
                    activityLevel={data.user.activityLevel}
                    size="tiny"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
