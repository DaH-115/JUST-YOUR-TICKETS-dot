"use client";

import { useEffect, useState } from "react";
import fetchSearchMovies from "api/fetchSearchMovies";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MovieList } from "api/fetchNowPlayingMovies";
import { IoSearchOutline } from "react-icons/io5";
import ScrollToTopButton from "app/components/scroll-to-top-button";
import Catchphrase from "app/ui/layout/catchphrase";
import SwiperCard from "app/components/swiper/swiper-card";
import { FaArrowRight } from "react-icons/fa";

const searchSchema = z.object({
  query: z.string().min(1, "검색어를 입력해주세요."),
});

type SearchSchema = z.infer<typeof searchSchema>;

export default function SearchPage({
  nowPlayingMovies,
}: {
  nowPlayingMovies: MovieList[];
}) {
  const [searchResults, setSearchResults] = useState<MovieList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
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
      <main className="mt-8 md:pt-16">
        <section className="mx-auto w-3/4 py-8 lg:w-1/3">
          <form onSubmit={handleSubmit(onSubmit)} className="flex items-center">
            <label htmlFor="search-input" className="sr-only">
              영화 검색
            </label>
            <input
              id="search-input"
              className="mr-2 w-full rounded-lg bg-white px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-accent-300"
              type="search"
              placeholder="검색어를 입력하세요"
              {...register("query")}
            />
            <button
              className="cursor-pointer rounded-full bg-white p-2 transition-colors duration-300 ease-in-out hover:bg-accent-300 hover:text-black"
              type="submit"
              disabled={isLoading}
            >
              <IoSearchOutline size={24} />
            </button>
          </form>
        </section>

        {isLoading && (
          <div className="flex items-center justify-center py-8 lg:py-16">
            <p className="animate-pulse text-center text-lg font-bold text-gray-500 lg:text-2xl">
              검색 중
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
          <section className="p-4 pt-0 md:p-8">
            <h1 className="mb-6 flex items-center text-2xl font-bold text-white md:text-4xl">
              검색 결과
              <FaArrowRight size={20} className="ml-2" />
            </h1>
            <div className="grid grid-cols-3 gap-2 lg:grid-cols-4 xl:grid-cols-5">
              {searchResults.map((result, idx) => (
                <SwiperCard key={result.id} movie={result} idx={idx} />
              ))}
            </div>
          </section>
        ) : !isLoading && touchedFields.query ? (
          <div className="flex items-center justify-center">
            <p className="py-8 text-center text-lg font-bold text-gray-500">
              검색 결과가 없습니다.
            </p>
          </div>
        ) : null}
        {searchResults.length <= 0 && (
          <section className="p-4 md:p-8">
            <h2 className="mb-4 flex items-center text-2xl font-bold text-accent-300 md:text-4xl">
              Now Playing <FaArrowRight size={20} className="ml-2 mt-1" />
            </h2>
            <div className="grid grid-cols-3 gap-2 lg:grid-cols-4 xl:grid-cols-5">
              {nowPlayingMovies.map((movie, idx) => (
                <SwiperCard key={movie.id} movie={movie} idx={idx} />
              ))}
            </div>
          </section>
        )}
      </main>
      <ScrollToTopButton />
      <Catchphrase />
    </>
  );
}
