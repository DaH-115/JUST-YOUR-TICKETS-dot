"use client";

import { useState, useEffect } from "react";
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
  const initialQuery = params.get("query") ?? "";

  // 초기값에 URL 쿼리 반영
  const { register, watch, reset } = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
    defaultValues: { searchQuery: initialQuery },
  });

  const watchedQuery = watch("searchQuery");

  // 실제 검색에 사용할 상태
  const [cleanedQuery, setCleanedQuery] = useState(initialQuery);

  useEffect(() => {
    // 1) effect 안에서 디바운스 함수 생성
    const debounceHandler = debounce((query: string) => {
      const cleanedQuery = query.trim().replace(/\s+/g, " ");

      if (!cleanedQuery) {
        setCleanedQuery("");
        router.replace(pathname);
      } else {
        setCleanedQuery(cleanedQuery);
        router.replace(`${pathname}?query=${encodeURIComponent(cleanedQuery)}`);
      }
    }, 300);

    // 2) watchedQuery 변경 시 호출
    debounceHandler(watchedQuery);

    // 3) cleanup: 이전 타이머 취소
    return () => debounceHandler.cancel();
  }, [watchedQuery, pathname, router]);

  // URL 쿼리가 바뀌면(직접 접근 등) 폼과 상태를 동기화
  useEffect(() => {
    reset({ searchQuery: initialQuery });
    setCleanedQuery(initialQuery);
  }, [initialQuery, reset]);

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
          <div className="absolute right-4">
            <IoSearchOutline size={24} />
          </div>
        </div>
      </section>

      {/* 결과 또는 Now Playing */}
      {cleanedQuery ? (
        <section>
          <h2 className="mb-6 text-2xl font-bold text-white">
            “{cleanedQuery}” 검색 결과
          </h2>
          <SearchResultList searchQuery={cleanedQuery} />
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
