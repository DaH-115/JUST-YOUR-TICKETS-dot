import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { useReviewForm } from "app/write-review/hook/useReviewForm";
import getMovieTitle from "app/utils/getMovieTitle";
import BackGround from "app/ui/layout/BackGround";
import { MdDriveFileRenameOutline } from "react-icons/md";
import Modal from "app/ui/Modal";
import { MovieDetails } from "api/fetchMovieDetails";
import { Review } from "api/reviews/fetchUserReviews";
import ReviewFormHeader from "app/write-review/components/ReviewFormHeader";
import ReviewFormUserInfo from "app/write-review/components/ReviewFormUserInfo";
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
    formState: { errors, isDirty },
    watch,
  } = useForm<ReviewFormValues>({
    defaultValues: initialData || {
      reviewTitle: "",
      rating: 0,
      reviewContent: "",
    },
  });
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const userState = useAppSelector((state) => state.user.user);
  const movieTitle = getMovieTitle(movieInfo.original_title, movieInfo.title);
  const { onSubmitHandler } = useReviewForm(mode, movieInfo, movieId, reviewId);
  const rating = watch("rating");

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

  const pageExitHandler = useCallback(() => {
    if (isDirty) {
      setShowExitConfirmation(true);
    } else {
      router.push("/");
    }
  }, [router, isDirty]);

  const isFormValid =
    !errors.reviewTitle && !errors.reviewContent && rating >= 0;

  return (
    <>
      {movieInfo.backdrop_path && (
        <BackGround imageUrl={movieInfo.backdrop_path} />
      )}

      <main className="relative mb-16 mt-8 drop-shadow-lg lg:mb-20 lg:mt-16">
        <div className="mx-auto w-11/12 rounded-xl border-2 border-black bg-white md:w-2/4">
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <ReviewFormHeader
              movieTitle={movieTitle}
              isEditMode={mode === "edit"}
            />
            <ReviewFormUserInfo
              userName={userState?.displayName || "사용자"}
              movieTitle={movieTitle}
            />
            <div className="w-full">
              <ReviewFormTitle
                register={register}
                errors={errors}
                isEditMode={mode === "edit"}
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
              />

              <div className="flex justify-end border-t border-black p-2">
                <button
                  type="button"
                  className="mr-2 w-full rounded-xl bg-gray-200 py-4 text-sm transition-all duration-300 hover:bg-gray-300"
                  onClick={pageExitHandler}
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="group flex w-full items-center justify-center rounded-xl bg-primary-500 p-4 text-sm text-white transition-colors duration-300 hover:bg-primary-700 disabled:text-gray-500"
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
          onConfirm={() => router.push("/")}
          onClose={() => setShowExitConfirmation(false)}
        />
      )}
    </>
  );
}
