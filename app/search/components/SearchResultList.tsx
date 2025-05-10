"use client";

import React, { useState, useEffect } from "react";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";
import Loading from "app/loading";
import SwiperCard from "app/components/swiper/swiper-card";
import Pagination from "app/components/Pagination";

interface SearchResultListProps {
  searchQuery: string;
}

interface SearchMovieResponse {
  movies: MovieList[];
  totalPages: number;
}

export default function SearchResultList({
  searchQuery,
}: SearchResultListProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchResults, setSearchResults] = useState<MovieList[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!searchQuery) return;
    setIsLoading(true);
    (async () => {
      try {
        const res = await fetch(
          `/api/tmdb/search?query=${encodeURIComponent(
            searchQuery,
          )}&page=${currentPage}`,
        );
        if (!res.ok) throw new Error("검색 요청 실패");

        const { movies, totalPages }: SearchMovieResponse = await res.json();
        setSearchResults(movies);
        setTotalPages(totalPages);
      } catch (error) {
        console.error(`영화 검색 중 오류: ${(error as Error).message}`);
        setSearchResults([]);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [searchQuery, currentPage]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-xl text-white">
          "{searchQuery}"에 대한 검색 결과가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {searchResults.map((movie, idx) => (
          <SwiperCard key={movie.id} movie={movie} idx={idx} />
        ))}
      </div>
      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
