"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Movie } from "api/fetchNowPlayingMovies";
import { fetchNowPlayingMovies } from "api/fetchNowPlayingMovies";
import { IoSearchOutline } from "react-icons/io5";
import { fetchSearchMovies } from "api/fetchSearchMovies";
import { useError } from "store/error-context";
import ScrollToTopButton from "app/ui/scroll-to-top-button";
import Catchphrase from "app/ui/catchphrase";
import SwiperCard from "app/ui/swiper-card";
import SwiperCardSkeleton from "app/ui/swiper-card-skeleton";

const searchSchema = z.object({
  query: z.string().min(1, "검색어를 입력해주세요."),
});

type SearchSchema = z.infer<typeof searchSchema>;

export default function Page() {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isShowError } = useError();

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      const posts = await fetchNowPlayingMovies();
      if ("errorMessage" in posts) {
        isShowError(posts.title, posts.errorMessage, posts.status);
      } else {
        setNowPlayingMovies(posts);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [isShowError]);

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

    // 쿼리 앞뒤의 모든 공백을 제거하고 연속된 공백을 하나의 공백으로 치환합니다.
    const cleanedQuery = query.trim().replace(/\s+/g, " ");

    if (cleanedQuery === "") {
      setSearchResults([]);
      return;
    }

    const posts = await fetchSearchMovies(cleanedQuery);

    if ("errorMessage" in posts) {
      isShowError(posts.title, posts.errorMessage, posts.status);
    } else {
      setSearchResults(posts);
    }
    setIsLoading(false);
  };

  return (
    <>
      <main className="pt-6 lg:px-8 lg:pt-12">
        <section className="mx-auto w-3/4 lg:w-2/4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mb-8 flex items-center border-b border-black py-2"
          >
            <label htmlFor="search-input" className="sr-only">
              영화 검색
            </label>
            <input
              id="search-input"
              className="mr-3 w-full appearance-none border-none bg-transparent pl-1 text-lg font-bold leading-tight text-gray-800 focus:outline-none"
              type="text"
              placeholder="검색어를 입력하세요"
              {...register("query")}
            />
            <button
              className="flex cursor-pointer items-center justify-center rounded-full border-2 border-black bg-black p-2 text-white transition-colors duration-300 ease-in-out hover:bg-white hover:text-black"
              type="submit"
              disabled={isLoading}
            >
              <IoSearchOutline size={20} />
            </button>
          </form>
        </section>

        {isLoading ? (
          <section className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            <SwiperCardSkeleton />
          </section>
        ) : (
          <>
            {searchResults.length > 0 ? (
              <>
                <h1 className="pl-4 text-2xl font-bold">검색 결과</h1>
                <section className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                  {searchResults.map((result, idx) => (
                    <SwiperCard
                      key={result.id}
                      movie={result}
                      id={result.id}
                      idx={idx}
                    />
                  ))}
                </section>
              </>
            ) : touchedFields.query ? (
              <div className="flex items-center justify-center py-8 lg:py-16">
                <p className="text-center text-lg font-bold text-gray-300 lg:text-2xl">
                  검색 결과가 없습니다.
                </p>
              </div>
            ) : null}
          </>
        )}
      </main>
      {!searchResults.length ? (
        <section className="mt-14 bg-gray-100 px-2 py-6 lg:mt-28 lg:px-16 lg:py-12">
          <h2 className="pl-4 text-2xl font-bold">추천 영화</h2>
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
        </section>
      ) : null}
      <ScrollToTopButton />
      <Catchphrase />
    </>
  );
}
