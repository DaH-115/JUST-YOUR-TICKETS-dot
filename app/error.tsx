"use client";

import Link from "next/link";

export default function Error({
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
      <p className="mb-8 text-gray-600">{error.message}</p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          다시 시도하기
        </button>
        <Link
          href="/"
          className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
