"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProfileAvatar from "app/components/user/ProfileAvatar";
import ActivityBadge from "app/components/ui/feedback/ActivityBadge";
import formatDate from "app/utils/formatDate";
import { FaHeart, FaRegHeart, FaStar, FaEdit, FaTrash } from "react-icons/fa";
import CommentList from "app/components/review/comment/CommentList";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { selectUser } from "store/redux-toolkit/slice/userSlice";
import { useAlert } from "store/context/alertContext";
import { isAuth } from "firebase-config";
import MoviePoster from "app/components/movie/MoviePoster";
import { getAuthHeaders } from "app/utils/getIdToken";

interface ReviewDetailProps {
  review: ReviewDoc;
  reviewId: string;
}

export default function ReviewDetail({ review, reviewId }: ReviewDetailProps) {
  const router = useRouter();
  const currentUser = useAppSelector(selectUser);
  const { showSuccessHandler, showErrorHandler } = useAlert();

  const { user, review: content } = review;

  // 좋아요 상태 관리
  const [isLiked, setIsLiked] = useState(content.isLiked);
  const [likeCount, setLikeCount] = useState(content.likeCount);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // 본인 리뷰인지 확인
  const isOwnReview = currentUser?.uid === user.uid;

  // 로그인 상태 확인
  const isLoggedIn = !!isAuth.currentUser;

  // 좋아요 토글 핸들러
  const likeToggleHandler = useCallback(async () => {
    if (!isAuth.currentUser) {
      return;
    }

    setIsLikeLoading(true);
    try {
      const authHeaders = await getAuthHeaders();

      const requestOptions: RequestInit = {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
      };

      // DELETE 요청이 아닐 때만 body 추가
      if (!isLiked) {
        requestOptions.body = JSON.stringify({
          movieTitle: content.movieTitle,
        });
      }

      const response = await fetch(
        `/api/reviews/${reviewId}/like`,
        requestOptions,
      );

      if (response.ok) {
        const data = await response.json();
        // API 응답에서 isLiked 상태 사용
        setIsLiked(data.isLiked);
        setLikeCount(data.likeCount);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "좋아요 처리에 실패했습니다.");
      }
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
      showErrorHandler(
        "오류",
        error instanceof Error
          ? error.message
          : "좋아요 처리 중 오류가 발생했습니다.",
      );
    } finally {
      setIsLikeLoading(false);
    }
  }, [reviewId, isLiked, content.movieTitle, showErrorHandler]);

  // 리뷰 수정 핸들러
  const editHandler = useCallback(() => {
    router.push(`/write-review/edit/${reviewId}`);
  }, [router, reviewId]);

  // 리뷰 삭제 핸들러
  const deleteHandler = useCallback(async () => {
    const confirmed = window.confirm("정말로 이 리뷰를 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      const authHeaders = await getAuthHeaders();

      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          ...authHeaders,
        },
      });

      if (response.ok) {
        showSuccessHandler("삭제 완료", "리뷰가 삭제되었습니다.", () => {
          router.push("/ticket-list");
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 삭제 실패:", error);
      showErrorHandler(
        "오류",
        error instanceof Error
          ? error.message
          : "리뷰 삭제 중 오류가 발생했습니다.",
      );
    }
  }, [reviewId, showSuccessHandler, showErrorHandler, router]);

  return (
    <main className="py-24">
      {/* 영화 포스터 */}
      <div className="mx-auto aspect-[2/2.5] max-w-lg overflow-hidden rounded-t-2xl">
        <MoviePoster
          posterPath={content.moviePosterPath}
          title={content.movieTitle}
        />
      </div>

      {/* 리뷰 정보 */}
      <div className="mx-auto max-w-lg rounded-b-2xl border bg-white p-4">
        {/* 별점, 제목, 영화 정보, 좋아요 버튼 */}
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-4 flex items-center text-lg">
              <FaStar className="mr-1 text-accent-300" />
              <p className="font-bold">{content.rating}</p>
            </div>
            <div>
              <h3 className="font-bold">{content.reviewTitle}</h3>
              <div className="text-sm text-gray-500">
                <Link
                  href={`/movie-details/${content.movieId}`}
                  className="transition-colors duration-300 hover:text-gray-600 hover:underline"
                >
                  {`${content.movieTitle}(${content.releaseYear})`}
                </Link>
              </div>
            </div>
          </div>

          {/* 좋아요 버튼 */}
          <button
            onClick={likeToggleHandler}
            disabled={isLikeLoading}
            className={`flex items-center text-red-500 transition-colors hover:text-red-600 disabled:opacity-50 ${
              !isLoggedIn ? "cursor-not-allowed" : ""
            }`}
            title={!isLoggedIn ? "로그인이 필요합니다" : ""}
          >
            {isLiked ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
            <p className="ml-1 text-black">{likeCount}</p>
          </button>
        </header>

        {/* 프로필, 닉네임, 등급, 수정/삭제 버튼(본인만) */}
        <div className="mb-6 flex items-center justify-between">
          {/* 프로필, 닉네임, 등급 */}
          <div className="flex items-center gap-2">
            <ProfileAvatar
              s3photoKey={user.photoKey || undefined}
              userDisplayName={user.displayName || "사용자"}
              size={24}
              isPublic
            />
            <p className="min-w-0 truncate text-sm">
              {user.displayName || "사용자"}
            </p>
            <ActivityBadge activityLevel={user.activityLevel} size="tiny" />
          </div>

          {/* 수정/삭제 버튼(본인만) */}
          {isOwnReview && (
            <div className="flex items-center gap-1">
              {/* 수정 버튼 */}
              <button
                onClick={editHandler}
                className="group flex items-center rounded-full bg-gray-300 px-3 py-1.5 transition-colors duration-200 hover:bg-gray-400"
                title="리뷰 수정"
                type="button"
              >
                <FaEdit
                  className="text-gray-600 group-hover:text-white"
                  size={12}
                />
                <span className="ml-1 text-xs text-gray-600 transition-colors group-hover:text-white">
                  수정
                </span>
              </button>
              {/* 삭제 버튼 */}
              <button
                onClick={deleteHandler}
                className="group flex items-center rounded-full bg-gray-300 px-3 py-1.5 transition-colors duration-200 hover:bg-gray-400"
                title="리뷰 삭제"
                type="button"
              >
                <FaTrash
                  className="text-gray-600 group-hover:text-white"
                  size={12}
                />
                <span className="ml-1 text-xs text-gray-600 transition-colors group-hover:text-white">
                  삭제
                </span>
              </button>
            </div>
          )}
        </div>

        {/* 리뷰 본문 */}
        <div className="mb-2 rounded-lg bg-gray-50 p-4">
          <p className="break-keep text-sm leading-relaxed text-gray-800">
            {content.reviewContent}
          </p>
        </div>

        {/* 작성일 */}
        <div className="mb-2 text-right text-xs text-gray-400">
          {formatDate(content.createdAt)}
        </div>
      </div>

      {/* 댓글 리스트 */}
      <div className="mx-auto mt-4 max-w-lg">
        <CommentList id={reviewId} reviewAuthorId={user.uid || ""} />
      </div>
    </main>
  );
}
