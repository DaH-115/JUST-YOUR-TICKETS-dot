"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import fetchSearchMovies from "api/movies/fetchSearchMovies";
import { MovieList } from "api/movies/fetchNowPlayingMovies";
import Loading from "app/loading";
import SwiperCard from "app/components/swiper/swiper-card";
import Pagination from "app/components/Pagination";

export default function SearchResultList({
  searchQuery,
}: {
  searchQuery: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;
  const [searchResults, setSearchResults] = useState<MovieList[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const fetchMovies = async () => {
      try {
        const { movies, totalPages } = await fetchSearchMovies(
          searchQuery,
          currentPage,
        );
        setSearchResults(movies);
        setTotalPages(totalPages);
      } catch (error) {
        setSearchResults([]);
        setTotalPages(0);
        if (error instanceof Error) {
          console.error("영화 검색 중 오류가 발생했습니다:", error.message);
        } else {
          console.error("알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage, searchQuery]);

  const pageChangeHandler = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        router.push(`?page=${newPage}`);
      }
    },
    [totalPages],
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
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
