"use client";

import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MdWarning } from "react-icons/md";
import Background from "app/components/ui/layout/Background";
import ReviewFormContent from "app/write-review/components/ReviewFormContent";
import ReviewFormHeader from "app/write-review/components/ReviewFormHeader";
import ReviewFormRating from "app/write-review/components/ReviewFormRating";
import ReviewFormTitle from "app/write-review/components/ReviewFormTitle";
import { useReviewForm } from "app/write-review/hook/useReviewForm";
import type { ReviewFormValues } from "app/write-review/types";
import type { MovieDetails } from "lib/movies/fetchMovieDetails";
import LevelUpModal from "app/my-page/components/LevelUpModal";

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
  const { onSubmit, currentLevel, levelUpOpen, setLevelUpOpen } = useReviewForm(
    {
      mode: onSubmitMode,
      movieData,
      reviewId,
    },
  );

  const methods = useForm<ReviewFormValues>({
    defaultValues: {
      reviewTitle: "",
      rating: 5,
      reviewContent: "",
      isLiked: false,
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

  // 폼 제출 핸들러는 훅의 onSubmit만 호출
  const submitHandler = async (data: ReviewFormValues) => {
    await onSubmit(data);
  };

  return (
    <>
      {/* 등급 업그레이드 시 축하 모달 */}
      <LevelUpModal
        open={levelUpOpen}
        onClose={() => setLevelUpOpen(false)}
        newLevel={currentLevel || ""}
      />
      {movieData.backdrop_path && (
        <Background imageUrl={movieData.backdrop_path} isFixed={true} />
      )}
      <main className="relative mb-16 mt-8 drop-shadow-lg lg:mb-20 lg:mt-16">
        {/* 티켓 컨테이너 */}
        <div className="mx-auto w-11/12 max-w-2xl">
          {/* 티켓 메인 부분 */}
          <div className="relative rounded-3xl border-2 bg-white p-8 shadow-2xl">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(submitHandler)}>
                {/* 티켓 헤더 */}
                <div className="mb-8 border-b-4 border-dotted pb-6">
                  <ReviewFormHeader isEditMode={onSubmitMode === "edit"} />
                </div>

                {/* 영화 정보 */}
                <div className="mb-8 text-center">
                  <div className="mb-2 font-mono text-xs font-bold tracking-wider text-accent-600">
                    MOVIE REVIEW
                  </div>
                  <h2 className="mb-1 text-2xl font-bold text-gray-800">
                    {`${movieData.title}(${movieData.original_title})`}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {movieData.release_date
                      ? movieData.release_date.replaceAll("-", ".")
                      : "개봉일 미정"}
                  </p>
                </div>

                {/* 작성 중 안내 메시지 */}
                {isDirty && (
                  <div className="mb-4 rounded-lg">
                    <div className="flex items-center justify-center">
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
                      className="w-full rounded-xl bg-accent-400 p-4 text-base font-semibold text-white transition-all duration-300 hover:bg-accent-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!isValid}
                    >
                      {onSubmitMode === "edit" ? "리뷰 수정" : "리뷰 등록"}
                    </button>
                  </div>
                </div>
              </form>
            </FormProvider>

            {/* 티켓 하단 정보 */}
            <div className="mt-8 border-t-4 border-dotted pt-6 text-center">
              <div className="space-y-1 font-mono text-xs text-gray-600">
                <div>PERSONAL REVIEW</div>
                <div>SHARE YOUR THOUGHTS</div>
                <div className="font-bold text-accent-600">
                  YOUR OPINION MATTERS
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
