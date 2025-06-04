"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import debounce from "lodash/debounce";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { IoSearchOutline } from "react-icons/io5";
import SwiperCard from "app/components/swiper/swiper-card";
import SearchResultList from "app/search/components/SearchResultList";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";

const searchSchema = z.object({ searchQuery: z.string() });
type SearchSchema = z.infer<typeof searchSchema>;

export default function SearchPage({
  nowPlayingMovies,
}: {
  nowPlayingMovies: MovieList[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const searchTerm = params.get("query") ?? "";

  const { register, watch, reset } = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
    defaultValues: { searchQuery: searchTerm },
  });

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
    <main className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-accent-300">Search</h1>
        <p className="text-sm text-white">
          찾고 싶은 영화가 있다면 검색해 보세요.
        </p>
      </div>

      {/* 검색 입력폼 */}
      <section className="mx-auto mb-16 w-3/4 lg:w-1/3">
        <div className="relative flex items-center">
          <input
            {...register("searchQuery")}
            type="search"
            placeholder="검색어를 입력하세요"
            className="w-full rounded-full bg-white py-2 pl-4 pr-12 text-sm text-black focus:outline-none focus:ring-2 focus:ring-accent-300"
          />
          <button type="button" className="absolute right-4">
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
          <h2 className="mb-4 text-2xl font-bold text-accent-300">
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
