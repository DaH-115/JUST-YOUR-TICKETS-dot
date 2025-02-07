"use client";

import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold text-gray-300">
        죄송합니다. 오류가 발생했습니다.
      </h2>
      <p className="mb-8 text-gray-600">
        {process.env.NODE_ENV === "production"
          ? "잠시 후 다시 시도해주세요."
          : error.message}
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-accent-500 hover:bg-accent-700 rounded-lg px-4 py-2 text-black"
        >
          다시 시도하기
        </button>
        <Link
          href="/"
          className="bg-accent-500 hover:bg-accent-700 rounded-lg px-4 py-2 text-black"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
