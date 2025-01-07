"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Movie } from "api/fetchNowPlayingMovies";
import { IoSearchOutline } from "react-icons/io5";
import { fetchSearchMovies } from "api/fetchSearchMovies";
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
  nowPlayingMovies: Movie[];
}) {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
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
      <main className="pt-20">
        <section className="mx-auto w-3/4 lg:w-1/3">
          <form onSubmit={handleSubmit(onSubmit)} className="flex items-center">
            <label htmlFor="search-input" className="sr-only">
              영화 검색
            </label>
            <input
              id="search-input"
              className="focus:ring-accent-300 mr-2 w-full rounded-lg bg-white px-4 py-2 text-sm text-black focus:outline-none focus:ring-2"
              type="search"
              placeholder="검색어를 입력하세요"
              {...register("query")}
            />
            <button
              className="hover:bg-accent-300 cursor-pointer rounded-full p-2 text-white transition-colors duration-300 ease-in-out hover:text-black"
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
          <section className="pt-0 md:p-8">
            <h1 className="mb-6 flex items-center text-2xl font-bold text-white md:text-4xl">
              검색 결과
              <FaArrowRight size={26} className="ml-2" />
            </h1>
            <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
      </main>
      {!searchResults.length && (
        <section className="p-4 md:p-8">
          <h2 className="text-accent-300 mb-6 flex items-center text-2xl font-bold md:text-4xl">
            Now Playing <FaArrowRight size={28} className="ml-2 mt-4" />
          </h2>
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {nowPlayingMovies.map((movie, idx) => (
              <SwiperCard key={movie.id} movie={movie} idx={idx} />
            ))}
          </div>
        </section>
      )}
      <ScrollToTopButton />
      <Catchphrase />
    </>
  );
}
