"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAppSelector } from "store/hooks";
import { useReviewForm } from "app/write-review/useReviewForm";
import useGetTitle from "hooks/useGetTitle";
import BackGround from "app/ui/layout/back-ground";
import { IoStar } from "react-icons/io5";
import { MdDriveFileRenameOutline } from "react-icons/md";
import ModalAlert from "app/ui/alert/modal-alert";
import { MovieDetails } from "api/fetchMovieDetails";

export interface ReviewData {
  reviewTitle: string;
  rating: number;
  review: string;
}

type ReviewFormProps = {
  mode: "create" | "edit";
  initialData?: ReviewData;
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
  } = useForm({
    defaultValues: initialData || {
      reviewTitle: "",
      rating: 0,
      review: "",
    },
  });
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const userState = useAppSelector((state) => state.user.user);
  const movieTitle = useGetTitle(movieInfo.original_title, movieInfo.title);
  const { onSubmitHandler } = useReviewForm(mode, movieInfo, movieId, reviewId);

  const handlePageExit = useCallback(() => {
    if (isDirty) {
      setShowExitConfirmation(true);
    } else {
      router.push("/");
    }
  }, [router, isDirty]);

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

  const rating = watch("rating");
  const isFormValid = !errors.reviewTitle && !errors.review && rating >= 0;

  return (
    <>
      {movieInfo.backdrop_path && (
        <BackGround
          imageUrl={movieInfo.backdrop_path}
          movieTitle={movieTitle}
        />
      )}

      <main className="relative mb-16 mt-8 drop-shadow-lg lg:mb-20 lg:mt-16">
        <div className="mx-auto w-11/12 rounded-xl border-2 border-black bg-white md:w-2/3">
          <div className="w-full p-4 pb-0">
            <div className="mb-1 flex items-end lg:mb-2">
              <h1 className="text-sm font-bold">
                {mode === "create" ? "새로운 리뷰 작성" : "리뷰 수정"}
              </h1>
            </div>
            <h2 className="mb-2 text-xl font-bold lg:text-3xl">{`${movieTitle} (${movieInfo.release_date.slice(0, 4)})`}</h2>
          </div>
          <div className="flex justify-between border-b border-black px-4 py-2 text-xs lg:text-sm">
            <span>{new Date().toLocaleDateString()}</span>
            <div>
              <span>작성자</span>
              <span className="ml-1 text-sm font-bold">
                {userState ? userState.displayName : "Guest"}
              </span>
            </div>
          </div>

          <div className="w-full">
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <div className="p-4">
                <label
                  htmlFor="date"
                  className="mb-2 inline-block text-sm font-bold"
                >
                  제목
                </label>
                <input
                  type="text"
                  id="reviewTitle"
                  {...register("reviewTitle", {
                    required: "제목을 입력해주세요.",
                  })}
                  placeholder="리뷰 제목"
                  className="w-full rounded-lg border p-2"
                />
                {errors.reviewTitle && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.reviewTitle.message as string}
                  </p>
                )}
              </div>

              <div className="p-4">
                <label
                  htmlFor="rating"
                  className="mb-2 inline-block text-sm font-bold"
                >
                  평점
                </label>
                <div className="px-8">
                  <input
                    type="range"
                    id="rating"
                    {...register("rating", { valueAsNumber: true })}
                    min="0"
                    max="10"
                    step="0.5"
                    className="w-full accent-[#8B1E3F]"
                  />
                </div>
                <div className="flex items-center justify-center text-center">
                  <div>
                    <IoStar className="mr-1 text-[#D4AF37]" size={20} />
                  </div>
                  <div className="text-lg font-bold">{rating}</div>
                  <span className="text-gray-400">/ 10</span>
                </div>
              </div>

              <div className="p-4">
                <label
                  htmlFor="review"
                  className="mb-2 inline-block text-sm font-bold"
                >
                  감상평
                </label>
                <textarea
                  id="review"
                  {...register("review", {
                    required: "내용을 입력해주세요.",
                  })}
                  placeholder="감상평을 작성해주세요."
                  className="h-32 w-full rounded-lg border p-2"
                />
                {errors.review && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.review.message as string}
                  </p>
                )}
              </div>

              <div className="flex justify-end border-t border-black p-2">
                <button
                  type="button"
                  className="mr-2 w-full rounded-xl bg-gray-200 py-4 transition-all duration-300 hover:bg-gray-300"
                  onClick={handlePageExit}
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="group flex w-full items-center justify-center rounded-xl bg-[#8B1E3F] p-4 text-white transition-colors duration-300 hover:bg-[#551226] disabled:text-gray-500"
                >
                  <MdDriveFileRenameOutline className="mr-1" size={18} />
                  작성
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Alert */}
        {showExitConfirmation && (
          <ModalAlert
            title="알림"
            description="현재 내용이 사라집니다. 나가시겠습니까?"
            onConfirm={() => router.push("/")}
            onClose={() => setShowExitConfirmation(false)}
            variant="destructive"
          />
        )}
      </main>
    </>
  );
}
