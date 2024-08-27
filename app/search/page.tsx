"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Movie } from "app/page";
import SwiperCard from "../ui/swiper-card";

const searchSchema = z.object({
  query: z.string().min(1, "검색어를 입력해주세요."),
});

type SearchSchema = z.infer<typeof searchSchema>;

export default function Page() {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = async (data: SearchSchema) => {
    console.log("Search query:", data.query);

    setIsLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&query=${data.query}&include_adult=true&language=ko-KR`,
        { cache: "force-cache" },
      );
      const posts = await res.json();
      setSearchResults(posts.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
          <div className="flex items-center border-b border-black py-2">
            <input
              className="mr-3 w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight text-gray-700 focus:outline-none"
              type="text"
              placeholder="검색어를 입력하세요"
              {...register("query")}
            />
            <button
              className="flex-shrink-0 rounded bg-black px-2 py-1 text-sm text-white transition-colors duration-200 ease-in-out hover:bg-yellow-600"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "검색 중..." : "검색"}
            </button>
          </div>
          {errors.query && (
            <p className="mt-2 text-sm text-red-600">{errors.query.message}</p>
          )}
        </form>

        {isLoading ? (
          <p className="text-center">검색 중...</p>
        ) : (
          <div>
            {searchResults.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {searchResults.map((result, idx) => (
                  <SwiperCard
                    key={result.id}
                    movie={result}
                    id={result.id}
                    idx={idx}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
