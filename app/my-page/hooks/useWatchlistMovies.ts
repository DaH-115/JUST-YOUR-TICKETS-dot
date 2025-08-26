"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "store/redux-toolkit/hooks";
import {
  fetchWatchlist,
  addWatchlist,
  removeWatchlist,
  selectWatchlist,
} from "store/redux-toolkit/slice/watchlistSlice";

export default function useWatchlistMovies(uid?: string | null) {
  const dispatch = useAppDispatch();
  const { movies, status, error } = useAppSelector(selectWatchlist);
  const lastUidRef = useRef<string | null>(null);

  // 워치리스트 데이터 가져오기 (영화 상세 정보 포함)
  useEffect(() => {
    if (!uid) return;

    // uid가 변경되었거나 아직 로딩하지 않은 경우에만 API 호출
    if (lastUidRef.current !== uid && status !== "loading") {
      console.log("🔍 useWatchlistMovies: 워치리스트 조회 시작", { uid });
      lastUidRef.current = uid;
      dispatch(fetchWatchlist(uid));
    }
  }, [uid, status, dispatch]);

  // 워치리스트에 영화 추가
  const addToWatchlist = async (movieId: number) => {
    if (!uid) return;

    try {
      await dispatch(addWatchlist({ uid, movieId })).unwrap();
      // 추가 성공 후 워치리스트 새로고침
      dispatch(fetchWatchlist(uid));
    } catch (error) {
      console.error("워치리스트 추가 실패:", error);
    }
  };

  // 워치리스트에서 영화 제거
  const removeFromWatchlist = async (movieId: number) => {
    if (!uid) return;

    try {
      await dispatch(removeWatchlist({ uid, movieId })).unwrap();
      // 제거는 Redux에서 즉시 처리되므로 별도 호출 불필요
    } catch (error) {
      console.error("워치리스트 제거 실패:", error);
    }
  };

  return {
    movies,
    loading: status === "loading",
    error,
    addToWatchlist,
    removeFromWatchlist,
  };
}
