"use client";

import { useEffect } from "react";
import Link from "next/link";
import WatchlistMovieCard from "app/components/movie/WatchlistMovieCard";
import { useAppDispatch, useAppSelector } from "store/redux-toolkit/hooks";
import {
  selectWatchlist,
  fetchWatchlist,
} from "store/redux-toolkit/slice/watchlistSlice";

interface WatchlistSectionProps {
  uid?: string | null;
}

export default function WatchlistSection({ uid }: WatchlistSectionProps) {
  const dispatch = useAppDispatch();
  const { movies: watchlist, status, error } = useAppSelector(selectWatchlist);
  const loading = status === "loading";

  // uid가 있을 때 워치리스트 데이터 가져오기
  useEffect(() => {
    if (uid) {
      dispatch(fetchWatchlist(uid));
    }
  }, [uid, dispatch]);

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-bold text-white">보고 싶은 영화</h2>

      {/* 로딩 상태 표시 */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-gray-400">불러오는 중...</p>
        </div>
      )}

      {/* 에러 상태 표시 */}
      {error && !loading && (
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <p className="text-sm text-red-600">
            영화 목록을 불러오는 중 오류가 발생했습니다.
          </p>
          <p className="mt-1 text-xs text-red-500">{error}</p>
        </div>
      )}

      {/* 성공 상태 - 데이터가 있는 경우 (최대 5개 표시) */}
      {!loading && !error && watchlist.length > 0 && (
        <div className="grid grid-cols-3 gap-4 md:grid-cols-5">
          {watchlist.slice(0, 5).map((movie) => (
            <WatchlistMovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {/* 성공 상태 - 데이터가 없는 경우 */}
      {!loading && !error && watchlist.length === 0 && (
        <p className="text-sm text-gray-400">보고 싶은 영화가 비어 있습니다.</p>
      )}

      {/* 더보기 링크 - 로딩 중이 아닐 때만 표시 */}
      {!loading && (
        <Link
          href="/my-page/watchlist"
          className="mt-4 block text-right text-sm text-accent-500 hover:underline"
        >
          더보기
        </Link>
      )}
    </section>
  );
}
