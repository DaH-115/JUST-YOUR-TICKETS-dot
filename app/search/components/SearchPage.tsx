"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";
import { IoSearchOutline } from "react-icons/io5";
import SwiperCard from "app/components/swiper/swiper-card";
import SearchResultList from "app/search/components/SearchResultList";

const searchSchema = z.object({
  query: z.string().min(1, "검색어를 입력해주세요."),
});

type SearchSchema = z.infer<typeof searchSchema>;

export default function SearchPage({
  nowPlayingMovies,
}: {
  nowPlayingMovies: MovieList[];
}) {
  const [cleanedQuery, setCleandeQuery] = useState("");
  const { register, handleSubmit, watch } = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = async ({ query }: { query: string }) => {
    setCleandeQuery(query.trim().replace(/\s+/g, " "));
  };

  return (
    <main className="p-8">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-accent-300">Search</h1>
        <p className="mt-4 text-white">
          찾고 싶은 영화가 있다면 검색해 보세요.
        </p>
      </div>
      <section className="mx-auto mb-16 w-3/4 lg:w-1/3">
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
            onChange={(e) => {
              register("query").onChange(e);
              if (!e.target.value) {
                setCleandeQuery("");
              }
            }}
          />
          <button
            className="cursor-pointer rounded-full bg-white p-2 transition-colors duration-300 ease-in-out hover:bg-accent-300 hover:text-black"
            type="submit"
          >
            <IoSearchOutline size={24} />
          </button>
        </form>
      </section>
      {cleanedQuery ? (
        <section>
          <h2 className="mb-6 flex items-center text-2xl font-bold text-white md:text-3xl">
            검색 결과
          </h2>
          <SearchResultList searchQuery={cleanedQuery} />
        </section>
      ) : (
        <section>
          <h2 className="mb-8 flex items-center text-2xl font-bold text-accent-300 md:text-4xl">
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
