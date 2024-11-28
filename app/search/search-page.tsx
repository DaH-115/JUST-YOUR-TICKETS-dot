"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Movie } from "api/fetchNowPlayingMovies";
import { fetchNowPlayingMovies } from "api/fetchNowPlayingMovies";
import { IoSearchOutline } from "react-icons/io5";
import { fetchSearchMovies } from "api/fetchSearchMovies";
import ScrollToTopButton from "app/ui/scroll-to-top-button";
import Catchphrase from "app/ui/catchphrase";
import SwiperCard from "app/ui/swiper-card";

const searchSchema = z.object({
  query: z.string().min(1, "검색어를 입력해주세요."),
});

type SearchSchema = z.infer<typeof searchSchema>;

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nowPlayingMovieLoading, setNowPlayingMovieLoading] = useState(false);
  const [isError, setIsError] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
  });

  useEffect(() => {
    setNowPlayingMovieLoading(true);

    const fetchData = async () => {
      try {
        const { results } = await fetchNowPlayingMovies();
        setNowPlayingMovies(results);
      } catch (error) {
        setIsError("상영 중인 영화 정보를 불러오는데 실패했습니다.");
      } finally {
        setNowPlayingMovieLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (errors.query) {
      setSearchResults([]);
    }
  }, [errors.query]);

  const onSubmit = async ({ query }: { query: string }) => {
    setIsLoading(true);

    const cleanedQuery = query.trim().replace(/\s+/g, " ");

    if (cleanedQuery === "") {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    try {
      const { results } = await fetchSearchMovies(cleanedQuery);
      setSearchResults(results);
    } catch (error) {
      setSearchResults([]);
      setIsError("검색에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="pt-8">
        <section className="mx-auto w-3/4 pb-16 lg:w-2/4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center border-b border-black p-2"
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

        {isLoading && (
          <div className="flex items-center justify-center py-8 lg:py-16">
            <p className="animate-pulse text-center text-lg font-bold text-gray-300 lg:text-2xl">
              검색 중...
            </p>
          </div>
        )}
        {isError && (
          <div className="flex items-center justify-center py-8 lg:py-16">
            <p className="text-center text-lg font-bold text-red-500 lg:text-2xl">
              {isError}
            </p>
          </div>
        )}
        {searchResults.length > 0 ? (
          <section className="pt-0 md:p-8">
            <h1 className="mb-8 ml-8 text-4xl font-bold md:ml-0">검색 결과</h1>
            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {searchResults.map((result, idx) => (
                <SwiperCard
                  key={result.id}
                  movie={result}
                  id={result.id}
                  idx={idx}
                />
              ))}
            </div>
          </section>
        ) : touchedFields.query ? (
          <div className="flex items-center justify-center py-8 lg:py-16">
            <p className="text-center text-lg font-bold text-gray-300 lg:text-2xl">
              검색 결과가 없습니다.
            </p>
          </div>
        ) : null}
      </main>
      {nowPlayingMovieLoading && (
        <div className="flex items-center justify-center py-8 lg:py-16">
          <p className="animate-pulse text-center text-lg font-bold text-black lg:text-xl">
            불러 오는 중...
          </p>
        </div>
      )}
      {isError && (
        <div className="flex items-center justify-center py-8 lg:py-16">
          <p className="text-center text-lg font-bold text-gray-300 lg:text-2xl">
            {isError}
          </p>
        </div>
      )}
      {!searchResults.length && (
        <section className="bg-gray-100 pt-8 md:p-8">
          <h2 className="mb-8 ml-8 text-4xl font-bold md:ml-0">추천 영화</h2>
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
      )}
      <ScrollToTopButton />
      <Catchphrase />
    </>
  );
}
