"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAppSelector } from "store/hooks";
import { useReviewForm } from "app/write-review/useReviewForm";
import useGetTitle from "hooks/useGetTitle";
import { Movie } from "app/page";
import BackGround from "app/ui/back-ground";
import { IoStar } from "react-icons/io5";
import { MdDriveFileRenameOutline } from "react-icons/md";

export interface ReviewDate {
  reviewTitle: string;
  rating: number;
  review: string;
}

interface ReviewForm {
  mode: "create" | "edit";
  initialData?: ReviewDate;
  movieInfo: Movie;
  movieId: string;
  reviewId?: string;
}

export default function ReviewForm({
  mode,
  initialData,
  movieInfo,
  reviewId,
  movieId,
}: ReviewForm) {
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
  const { onSubmit } = useReviewForm(mode, movieInfo, movieId, reviewId);

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

  return (
    <>
      {movieInfo.backdrop_path && (
        <BackGround
          imageUrl={movieInfo.backdrop_path}
          movieTitle={movieTitle}
        />
      )}

      {/* POP UP */}
      {showExitConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="w-3/4 max-w-md rounded-xl border-2 border-black bg-white p-4 drop-shadow-lg">
            <div className="mb-4 border-b border-black">
              <strong className="font-bold">알림</strong>
            </div>
            <div className="mb-4 break-keep text-base lg:mb-6 lg:text-lg">
              현재 내용이 사라집니다. 나가시겠습니까?
            </div>
            <div className="flex justify-end text-sm">
              <button
                className="mr-2 rounded-lg bg-gray-200 px-3 py-2 transition-all duration-300 hover:bg-gray-300 lg:px-4 lg:py-2"
                onClick={() => setShowExitConfirmation(false)}
              >
                취소
              </button>
              <button
                className="rounded-lg bg-red-500 px-3 py-2 text-white transition-all duration-300 hover:bg-red-600 lg:px-4 lg:py-2"
                onClick={() => router.push("/")}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="relative mb-16 mt-8 drop-shadow-lg lg:mb-20 lg:mt-16">
        <div className="mx-auto w-11/12 rounded-xl border-2 border-black bg-white lg:w-1/3">
          <div className="w-full p-4 pb-0">
            <div className="mb-1 flex items-end lg:mb-2">
              <h1 className="text-sm font-bold">
                {mode === "create" ? "새로운 리뷰 작성" : "리뷰 수정"}
              </h1>
            </div>
            <h2 className="mb-2 text-xl font-bold lg:text-3xl">{`${movieTitle} (${movieInfo.release_date?.slice(0, 4)})`}</h2>
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
            <form onSubmit={handleSubmit(onSubmit)}>
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
                <input
                  type="range"
                  id="rating"
                  {...register("rating", { valueAsNumber: true })}
                  min="0"
                  max="10"
                  step="0.5"
                  className="w-full accent-black"
                />
                <div className="flex items-center justify-center text-center">
                  <div>
                    <IoStar className="mr-1" size={20} />
                  </div>
                  <div className="text-lg font-bold">{watch("rating")}</div>
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
                  className="group flex w-full items-center justify-center rounded-xl bg-black p-4 text-white transition-all duration-300 hover:bg-gray-800"
                >
                  <div>작성</div>
                  <MdDriveFileRenameOutline className="ml-1" size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
