import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useReviewForm } from "app/write-review/hook/useReviewForm";
import getMovieTitle from "app/utils/getMovieTitle";
import BackGround from "app/ui/layout/BackGround";
import { MdDriveFileRenameOutline } from "react-icons/md";
import Modal from "app/ui/Modal";
import { MovieDetails } from "api/movies/fetchMovieDetails";
import { Review } from "api/reviews/fetchReviews";
import ReviewFormHeader from "app/write-review/components/ReviewFormHeader";
import ReviewFormTitle from "app/write-review/components/ReviewFormTitle";
import ReviewFormRating from "app/write-review/components/ReviewFormRating";
import ReviewFormContent from "app/write-review/components/ReviewFormContent";

export type ReviewFormValues = Pick<
  Review,
  "reviewTitle" | "reviewContent" | "rating"
>;

type ReviewFormProps = {
  mode: "create" | "edit";
  initialData?: ReviewFormValues;
  movieInfo: MovieDetails;
  movieId: string;
  reviewId?: string;
};

export default function ReviewForm({
  mode,
  initialData,
  movieInfo,
  reviewId,
  movieId,
}: ReviewFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    watch,
  } = useForm<ReviewFormValues>({
    mode: "onChange",
    defaultValues: initialData || {
      reviewTitle: "",
      rating: 0,
      reviewContent: "",
    },
  });
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const movieTitle = getMovieTitle(movieInfo.original_title, movieInfo.title);
  const { onSubmitHandler } = useReviewForm(mode, movieInfo, movieId, reviewId);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  return (
    <>
      {movieInfo.backdrop_path && (
        <BackGround imageUrl={movieInfo.backdrop_path} />
      )}

      <main className="relative mb-16 mt-8 drop-shadow-lg lg:mb-20 lg:mt-16">
        <div className="mx-auto w-11/12 rounded-xl border-2 border-gray-200 bg-white md:w-2/4">
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <ReviewFormHeader
              isEditMode={mode === "edit"}
              isDirty={isDirty}
              setShowExitConfirmation={setShowExitConfirmation}
            />
            <div className="p-4 pb-1">
              <p className="text-3xl font-bold">{movieTitle}</p>
              <p className="text-gray-400">
                {movieInfo.release_date.replaceAll("-", ".")}
              </p>
            </div>
            <div className="w-full p-4">
              <ReviewFormTitle
                register={register}
                errors={errors}
                isEditMode={mode === "edit"}
                watch={watch}
              />
              <ReviewFormRating
                register={register}
                errors={errors}
                watch={watch}
                isEditMode={mode === "edit"}
              />
              <ReviewFormContent
                register={register}
                errors={errors}
                isEditMode={mode === "edit"}
                watch={watch}
              />
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!isValid}
                  className="group flex w-full items-center justify-center rounded-xl bg-primary-500 p-4 font-bold text-white transition-colors duration-300 hover:bg-primary-700 disabled:text-gray-500"
                >
                  <MdDriveFileRenameOutline className="mr-1" size={18} />
                  작성
                </button>
              </div>
            </div>
          </form>
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
