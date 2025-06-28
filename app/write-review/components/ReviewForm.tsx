"use client";

import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Background from "app/ui/layout/Background";
import { MdDriveFileRenameOutline, MdWarning } from "react-icons/md";
import ReviewFormHeader from "app/write-review/components/ReviewFormHeader";
import ReviewFormTitle from "app/write-review/components/ReviewFormTitle";
import ReviewFormRating from "app/write-review/components/ReviewFormRating";
import ReviewFormContent from "app/write-review/components/ReviewFormContent";
import type { MovieDetails } from "lib/movies/fetchMovieDetails";
import type { ReviewFormValues } from "app/write-review/types";
import { useReviewForm } from "app/write-review/hook/useReviewForm";

interface ReviewFormProps {
  onSubmitMode: "new" | "edit";
  movieData: MovieDetails;
  initialData?: ReviewFormValues;
  reviewId?: string;
}

export default function ReviewForm({
  onSubmitMode,
  initialData,
  movieData,
  reviewId,
}: ReviewFormProps) {
  const [isNavigating, setIsNavigating] = useState(false);

  const { onSubmit } = useReviewForm({
    mode: onSubmitMode,
    movieData,
    reviewId,
  });

  const methods = useForm<ReviewFormValues>({
    defaultValues: {
      reviewTitle: "",
      rating: 5,
      reviewContent: "",
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = methods;

  // initialData가 변경되면 폼을 리셋
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // 페이지 이탈 방지 기능
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isNavigating) {
        e.preventDefault();
        return "작성 중인 리뷰가 있습니다. 정말로 페이지를 떠나시겠습니까?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty, isNavigating]);

  // 폼 제출 시 네비게이션 허용
  const handleFormSubmit = async (data: ReviewFormValues) => {
    setIsNavigating(true);
    await onSubmit(data);
  };

  return (
    <>
      {movieData.backdrop_path && (
        <Background imageUrl={movieData.backdrop_path} />
      )}
      <main className="relative mb-16 mt-8 drop-shadow-lg lg:mb-20 lg:mt-16">
        {/* 티켓 컨테이너 */}
        <div className="mx-auto w-11/12 max-w-2xl">
          {/* 티켓 메인 부분 */}
          <div className="relative rounded-3xl border-2 border-accent-300/30 bg-white p-8 shadow-2xl">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                {/* 티켓 헤더 */}
                <div className="mb-8 border-b-2 border-dashed border-accent-300/50 pb-6">
                  <ReviewFormHeader isEditMode={onSubmitMode === "edit"} />
                </div>

                {/* 영화 정보 */}
                <div className="mb-8 text-center">
                  <div className="mb-2 font-mono text-xs font-bold tracking-wider text-accent-600">
                    MOVIE REVIEW
                  </div>
                  <h2 className="mb-1 text-2xl font-bold text-gray-800">
                    {movieData.original_title || movieData.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {movieData.release_date.replaceAll("-", ".")}
                  </p>
                </div>

                {/* 작성 중 안내 메시지 */}
                {isDirty && (
                  <div className="mb-4 rounded-lg">
                    <div className="flex items-center">
                      <MdWarning className="text-yellow-500" size={20} />
                      <div className="ml-1">
                        <p className="text-sm text-gray-700">
                          <strong>작성 중입니다!</strong> 페이지를 떠나면 작성한
                          내용이 사라집니다.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 폼 필드들 */}
                <div className="space-y-6">
                  <ReviewFormTitle />
                  <ReviewFormRating />
                  <ReviewFormContent />

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={!isValid}
                      className="w-full rounded-2xl bg-accent-400 p-4 font-semibold text-white transition-all duration-300 hover:bg-accent-500 hover:shadow-lg disabled:cursor-not-allowed disabled:text-gray-500 disabled:opacity-50"
                    >
                      <MdDriveFileRenameOutline
                        className="mr-2 inline"
                        size={18}
                      />
                      {onSubmitMode === "new"
                        ? "리뷰 작성하기"
                        : "리뷰 수정하기"}
                    </button>
                  </div>
                </div>
              </form>
            </FormProvider>

            {/* 티켓 하단 정보 */}
            <div className="mt-8 border-t-2 border-dashed border-accent-300/50 pt-6 text-center">
              <div className="space-y-1 font-mono text-xs text-gray-600">
                <div>PERSONAL REVIEW</div>
                <div>SHARE YOUR THOUGHTS</div>
                <div className="font-bold text-accent-600">
                  ★ YOUR OPINION MATTERS ★
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
