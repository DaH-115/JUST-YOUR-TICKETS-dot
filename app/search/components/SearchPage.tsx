"use client";

import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import debounce from "lodash/debounce";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { IoSearchOutline } from "react-icons/io5";
import SwiperCard from "app/components/swiper/swiper-card";
import SearchResultList from "app/search/components/SearchResultList";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";

const searchSchema = z.object({
  searchQuery: z.string(),
});
type SearchSchema = z.infer<typeof searchSchema>;

export default function SearchPage({
  nowPlayingMovies,
}: {
  nowPlayingMovies: MovieList[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const searchTerm = params.get("search") ?? "";

  // 초기값에 URL 쿼리 반영
  const { register, watch } = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
    defaultValues: { searchQuery: searchTerm },
  });

  // 검색어가 바뀔 때마다 URL 쿼리 업데이트
  const watchedQuery = watch("searchQuery");

  const debounceHandler = useCallback(
    debounce((query: string) => {
      const cleanedQuery = query.trim().replace(/\s+/g, " ");

      if (!cleanedQuery) {
        router.replace(pathname);
      } else {
        router.replace(
          `${pathname}?search=${encodeURIComponent(cleanedQuery)}&page=1`,
        );
      }
    }, 300),
    [router, pathname, watchedQuery],
  );

  useEffect(() => {
    debounceHandler(watchedQuery);
    return () => debounceHandler.cancel();
  }, [watchedQuery, debounceHandler]);

  return (
    <main className="p-8">
      {/* 헤더 */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-accent-300">Search</h1>
        <p className="mt-4 text-white">
          찾고 싶은 영화가 있다면 검색해 보세요.
        </p>
      </div>

      {/* 검색 입력창 */}
      <section className="mx-auto mb-16 w-3/4 lg:w-1/3">
        <div className="relative flex items-center">
          <input
            {...register("searchQuery")}
            type="search"
            placeholder="검색어를 입력하세요"
            className="w-full rounded-lg bg-white py-2 pl-4 pr-12 text-sm text-black focus:outline-none focus:ring-2 focus:ring-accent-300"
          />
          <button type="submit" className="absolute right-4">
            <IoSearchOutline size={24} />
          </button>
        </div>
      </section>

      {/* 결과 또는 Now Playing */}
      {searchTerm ? (
        <section>
          <h2 className="mb-6 text-2xl font-bold text-white">
            “{searchTerm}” 검색 결과
          </h2>
          <SearchResultList searchQuery={searchTerm} />
        </section>
      ) : (
        <section>
          <h2 className="mb-8 text-2xl font-bold text-accent-300">
            Now Playing
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {nowPlayingMovies.map((movie, idx) => (
              <SwiperCard key={movie.id} movie={movie} idx={idx} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
