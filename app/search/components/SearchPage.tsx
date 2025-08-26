"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash/debounce";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoSearchOutline } from "react-icons/io5";
import * as z from "zod";
import SwiperItem from "app/components/swiper/SwiperItem";
import SearchResultList from "app/search/components/SearchResultList";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";

const searchSchema = z.object({ searchQuery: z.string() });
type SearchSchema = z.infer<typeof searchSchema>;

export default function SearchPage({
  nowPlayingMovies,
}: {
  nowPlayingMovies: MovieList[];
}) {
  const resultsRef = useRef<HTMLElement>(null);
  const nowPlayingRef = useRef<HTMLElement>(null);

  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [isNowPlayingVisible, setIsNowPlayingVisible] = useState(false);

  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const searchTerm = params.get("query") ?? "";

  const { register, watch, reset } = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
    defaultValues: { searchQuery: searchTerm },
  });

  // 검색 결과 섹션 Observer
  useEffect(() => {
    const currentResults = resultsRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsResultsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" },
    );

    if (currentResults) {
      observer.observe(currentResults);
    }

    return () => {
      if (currentResults) {
        observer.unobserve(currentResults);
      }
    };
  }, []);

  // Now Playing 섹션 Observer
  useEffect(() => {
    const currentNowPlaying = nowPlayingRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNowPlayingVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" },
    );

    if (currentNowPlaying) {
      observer.observe(currentNowPlaying);
    }

    return () => {
      if (currentNowPlaying) {
        observer.unobserve(currentNowPlaying);
      }
    };
  }, []);

  useEffect(() => {
    reset({ searchQuery: searchTerm });
  }, [searchTerm, reset]);

  const watchedQuery = watch("searchQuery");

  const debounceHandler = useMemo(
    () =>
      debounce((query: string) => {
        const cleaned = query.trim().replace(/\s+/g, " ");
        const queryString = cleaned
          ? `?query=${encodeURIComponent(cleaned)}&page=1`
          : "";
        router.replace(`${pathname}${queryString}`);
      }, 300),
    [router, pathname],
  );

  useEffect(() => {
    debounceHandler(watchedQuery);
    return () => {
      debounceHandler.cancel();
    };
  }, [watchedQuery, debounceHandler]);

  return (
    <main className="p-6">
      {/* 헤더 영역 */}
      <div className="mb-8 transition-all duration-700 ease-out">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">
          Search
        </h1>
        <p className="text-sm text-gray-300">
          찾고 싶은 영화가 있다면 검색해 보세요
        </p>
      </div>

      {/* 검색 입력폼 */}
      <section className="mx-auto mb-16 w-3/4 lg:w-1/3">
        <div className="relative flex items-center">
          <input
            {...register("searchQuery")}
            type="search"
            placeholder="검색어를 입력하세요"
            className="w-full rounded-full bg-white py-3 pl-4 pr-12 text-sm text-black focus:outline-none focus:ring-1 focus:ring-accent-300 focus:ring-offset-1"
          />
          <button type="button" className="absolute right-4">
            <IoSearchOutline size={24} />
          </button>
        </div>
      </section>

      {/* 결과 또는 Now Playing */}
      {searchTerm ? (
        <section ref={resultsRef}>
          <div
            className={`mb-6 transition-all duration-700 ease-out ${
              isResultsVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-white">
              Search Results
            </h2>
            <p className="text-sm text-gray-300">
              {`"${searchTerm}" 검색 결과입니다`}
            </p>
          </div>
          <div
            className={`transition-all duration-700 ease-out ${
              isResultsVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <SearchResultList searchQuery={searchTerm} />
          </div>
        </section>
      ) : (
        <section ref={nowPlayingRef} className="mb-16">
          <div
            className={`mb-8 transition-all duration-700 ease-out ${
              isNowPlayingVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-white">
              Now Playing
            </h2>
            <p className="text-sm text-gray-300">
              지금 상영 중인 영화들을 확인하고 리뷰를 작성하세요
            </p>
          </div>
          <div
            className={`grid grid-cols-3 gap-x-2 gap-y-6 transition-all duration-700 ease-out sm:grid-cols-4 sm:gap-x-3 sm:gap-y-8 md:grid-cols-5 md:gap-x-3 md:gap-y-8 lg:grid-cols-8 lg:gap-x-4 lg:gap-y-10 xl:grid-cols-10 xl:gap-x-4 xl:gap-y-12 ${
              isNowPlayingVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            {nowPlayingMovies.map((movie, idx) => (
              <SwiperItem key={movie.id} movie={movie} idx={idx} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
