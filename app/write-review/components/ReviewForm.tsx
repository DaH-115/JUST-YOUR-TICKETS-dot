"use client";

import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import BackGround from "app/ui/layout/BackGround";
import Modal from "app/ui/Modal";
import { MdDriveFileRenameOutline } from "react-icons/md";
import ReviewFormHeader from "app/write-review/components/ReviewFormHeader";
import ReviewFormTitle from "app/write-review/components/ReviewFormTitle";
import ReviewFormRating from "app/write-review/components/ReviewFormRating";
import ReviewFormContent from "app/write-review/components/ReviewFormContent";
import type { MovieDetails } from "lib/movies/fetchMovieDetails";
import type { ReviewFormValues } from "app/write-review/[id]/page";
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
  const router = useRouter();
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const { onSubmit } = useReviewForm({
    mode: onSubmitMode,
    movieData,
    reviewId,
  });

  const methods = useForm<ReviewFormValues>({
    defaultValues: initialData || {
      reviewTitle: "",
      rating: 0,
      reviewContent: "",
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isDirty, isValid },
  } = methods;

  // 뒤로 가기 시 확인 모달
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  return (
    <>
      {movieData.backdrop_path && (
        <BackGround imageUrl={movieData.backdrop_path} />
      )}
      <main className="relative mb-16 mt-8 drop-shadow-lg lg:mb-20 lg:mt-16">
        <div className="mx-auto w-11/12 rounded-xl border-2 bg-white md:w-2/4">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ReviewFormHeader
                isEditMode={onSubmitMode === "edit"}
                setShowExitConfirmation={setShowExitConfirmation}
              />
              <div className="p-4 pb-1">
                <p className="text-3xl font-bold">
                  {movieData.original_title || movieData.title}
                </p>
                <p className="text-gray-400">
                  {movieData.release_date.replaceAll("-", ".")}
                </p>
              </div>
              <div className="w-full p-4">
                <ReviewFormTitle />
                <ReviewFormRating />
                <ReviewFormContent />
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!isValid}
                    className="group flex w-full items-center justify-center rounded-xl bg-primary-500 p-4 font-bold text-white transition-colors duration-300 hover:bg-primary-700 disabled:text-gray-500"
                  >
                    <MdDriveFileRenameOutline className="mr-1" size={18} />
                    {onSubmitMode === "new" ? "작성" : "수정"}
                  </button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </main>
      {showExitConfirmation && (
        <Modal
          title="알림"
          description="현재 내용이 사라집니다. 나가시겠습니까?"
          onConfirm={() => router.back()}
          onClose={() => setShowExitConfirmation(false)}
        />
      )}
    </>
  );
}
