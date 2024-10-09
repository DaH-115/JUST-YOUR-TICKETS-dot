"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Movie } from "app/page";
import { fetchNowPlayingMovies } from "api/fetchNowPlayingMovies";
import SwiperCard from "app/ui/swiper-card";
import { fetchSearchMovies } from "api/fetchSearchMovies";
import ScrollToTopButton from "app/ui/scroll-to-top-button";
import Catchphrase from "app/ui/catchphrase";

const searchSchema = z.object({
  query: z.string().min(1, "검색어를 입력해주세요."),
});

type SearchSchema = z.infer<typeof searchSchema>;

export default function Page() {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const posts = await fetchNowPlayingMovies();
        setNowPlayingMovies(posts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
  });

  useEffect(() => {
    if (errors.query) {
      setSearchResults([]);
    }
  }, [errors.query]);

  const onSubmit = async ({ query }: { query: string }) => {
    setIsLoading(true);

    try {
      // 쿼리 앞뒤의 모든 공백을 제거하고 연속된 공백을 하나의 공백으로 치환합니다.
      const cleanedQuery = query.trim().replace(/\s+/g, " ");

      if (cleanedQuery === "") {
        setSearchResults([]);
        return;
      }

      const posts = await fetchSearchMovies(cleanedQuery);
      setSearchResults(posts);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mt-8 min-h-screen px-8 py-12">
        <div className="mx-auto w-2/4">
          <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
            <div className="flex items-center border-b border-black py-2">
              <input
                className="mr-3 w-full appearance-none border-none bg-transparent px-2 py-1 text-4xl font-bold leading-tight text-gray-300 focus:outline-none"
                type="text"
                placeholder="검색어를 입력하세요"
                {...register("query")}
              />
              <button
                className="flex-shrink-0 rounded-full bg-black px-4 py-2 text-sm text-white transition-colors duration-300 ease-in-out hover:bg-gray-800"
                type="submit"
                disabled={isLoading}
              >
                검색
              </button>
            </div>
          </form>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-center text-4xl font-bold text-gray-300">
              검색 중...
            </p>
          </div>
        ) : (
          <>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                {searchResults.map((result, idx) => (
                  <div className="py-4">
                    <SwiperCard
                      key={result.id}
                      movie={result}
                      id={result.id}
                      idx={idx}
                    />
                  </div>
                ))}
              </div>
            ) : touchedFields.query ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-center text-4xl font-bold text-gray-300">
                  검색 결과가 없습니다.
                </p>
              </div>
            ) : null}
          </>
        )}

        {!searchResults.length ? (
          <div className="mt-28">
            <div className="text-2xl font-bold">추천 검색 영화</div>
            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {nowPlayingMovies.map((movie, idx) => (
                <SwiperCard
                  key={movie.id}
                  movie={movie}
                  idx={idx}
                  id={movie.id}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <ScrollToTopButton />
      <Catchphrase />
    </>
  );
}
