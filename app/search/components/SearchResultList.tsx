"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";
import Loading from "app/loading";
import SwiperCard from "app/components/swiper/swiper-card";
import Pagination from "app/components/Pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const currentPage = parseInt(params.get("page") || "1", 10);

  const [searchResults, setSearchResults] = useState<MovieList[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }

    setIsLoading(true);

    (async () => {
      try {
        const res = await fetch(
          `${pathname}?query=${encodeURIComponent(searchQuery)}&page=1`,
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

  const pageChangeHandler = useCallback(
    (page: number) => {
      router.push(
        `${pathname}?search=${encodeURIComponent(searchQuery)}&page=${page}`,
      );
    },
    [router, pathname, searchQuery],
  );

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
        onPageChange={pageChangeHandler}
      />
    </div>
  );
}
