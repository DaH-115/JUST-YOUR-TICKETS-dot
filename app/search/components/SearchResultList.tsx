"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Pagination from "app/components/Pagination";
import SwiperCard from "app/components/swiper/swiper-card";
import Loading from "app/loading";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";

interface SearchMovieResponse {
  movies: MovieList[];
  totalPages: number;
  error?: string;
}

export default function SearchResultList({
  searchQuery,
}: {
  searchQuery: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const currentPage = parseInt(params.get("page") ?? "1", 10);

  const [searchResults, setSearchResults] = useState<MovieList[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const pageChangeHandler = useCallback(
    (page: number) => {
      router.replace(
        `${pathname}?query=${encodeURIComponent(searchQuery)}&page=${page}`,
      );
    },
    [pathname, searchQuery, router],
  );

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setTotalPages(0);
      return;
    }

    setIsLoading(true);
    (async () => {
      try {
        const res = await fetch(
          `/api/tmdb/search?query=${encodeURIComponent(
            searchQuery,
          )}&page=${currentPage}`,
        );
        const data: SearchMovieResponse = await res.json();

        // 에러 응답 처리
        if (!res.ok || data.error) {
          throw new Error(data.error || "검색 요청 실패");
        }

        setSearchResults(data.movies);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("영화 검색 중 오류:", (error as Error).message);
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
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {searchResults.map((movie, idx) => (
          <SwiperCard key={movie.id} movie={movie} idx={idx} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={pageChangeHandler}
      />
    </>
  );
}
