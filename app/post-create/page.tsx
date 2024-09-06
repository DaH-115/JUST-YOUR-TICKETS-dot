"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";

type PostData = {
  date: string;
  title: string;
  rating: number;
  review: string;
};

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const backdrop_path = searchParams.get("backdrop_path");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<PostData>({
    defaultValues: {
      date: new Date().toLocaleDateString(),
      title: "",
      rating: 0,
      review: "",
    },
  });

  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const onSubmit = (data: PostData) => {
    console.log("Post saved:", data);
  };

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
    // TO DO: 반응형 디자인 적용
    <div className="relative left-0 top-0 mt-16">
      {backdrop_path && (
        <div className="w-full">
          <Image
            src={`https://image.tmdb.org/t/p/original${decodeURIComponent(backdrop_path)}`}
            alt="Backdrop"
            width={1280}
            height={720}
            className="h-full w-full"
          />
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1/3 border-2 border-black bg-white">
          {/* TOP SIDE */}
          <div className="w-full border-b-2 border-black p-4">
            <h1 className="text-4xl font-bold">Review 리뷰 작성</h1>
          </div>

          {/* POP UP */}
          {showExitConfirmation && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-bold">
                  현재 내용이 사라집니다. 정말로 나가시겠습니까?
                </h2>
                <div className="flex justify-end">
                  <button
                    className="mr-2 rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
                    onClick={() => setShowExitConfirmation(false)}
                  >
                    아니오
                  </button>
                  <button
                    className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    onClick={() => router.push("/")}
                  >
                    네
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* BOTTOM SIDE */}
          <div className="w-full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-4 py-6">
                <div className="mb-4">
                  <label htmlFor="date" className="mb-2 block font-bold">
                    Date 날짜
                  </label>
                  <input
                    type="text"
                    id="date"
                    {...register("date")}
                    className="w-full rounded-lg border p-2"
                    disabled
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="title" className="mb-2 block font-bold">
                    Title 제목
                  </label>
                  <input
                    type="text"
                    id="title"
                    {...register("title", {
                      required: "제목을 입력해주세요.",
                    })}
                    className="w-full rounded-lg border p-2"
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="rating" className="mb-2 block font-bold">
                    Rating 평점
                  </label>
                  <input
                    type="range"
                    id="rating"
                    {...register("rating", { valueAsNumber: true })}
                    min="0"
                    max="10"
                    step="0.5"
                    className="w-full"
                  />
                  <div className="text-center">{watch("rating")} / 10</div>
                </div>

                <div className="">
                  <label htmlFor="review" className="mb-2 block font-bold">
                    Review 리뷰
                  </label>
                  <textarea
                    id="review"
                    {...register("review", {
                      required: "내용을 입력해주세요.",
                    })}
                    className="h-32 w-full rounded-lg border p-2"
                  ></textarea>
                  {errors.review && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.review.message}
                    </p>
                  )}
                </div>
              </div>

              {/* BUTTON AREA */}
              <div className="flex justify-end border-t-2 border-black bg-slate-100">
                <button
                  type="button"
                  className="w-full bg-white px-6 py-4 hover:bg-gray-200"
                  onClick={handlePageExit}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full bg-slate-800 px-6 py-4 text-white hover:bg-slate-900"
                >
                  Save Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
