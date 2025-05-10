"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import debounce from "lodash/debounce";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";
import { IoSearchOutline } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";

export default function HeaderSearchBar() {
  const { register, watch, reset } = useForm({
    defaultValues: { search: "" },
  });
  const searchQuery = watch("search");
  const [results, setResults] = useState<MovieList[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const inputFocusHandler = useCallback(() => {
    if (results.length > 0) {
      setIsDropdownOpen(true);
    }
  }, [results]);

  const iconClickHandler = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
    if (!isSearchOpen) {
      setTimeout(() => {
        const input = document.querySelector(
          'input[type="search"]',
        ) as HTMLInputElement;
        input?.focus();
      }, 300);
    }
  }, [isSearchOpen]);

  const resultsClickHandler = useCallback(() => {
    setIsDropdownOpen(false);
    setIsSearchOpen(false);
    reset({ search: "" });
    setResults([]);
    setVisibleCount(5);
  }, [reset]);

  useEffect(() => {
    const debounceHandler = debounce(async (query: string) => {
      if (query.trim()) {
        try {
          const res = await fetch(
            `/api/tmdb/search?query=${encodeURIComponent(query)}&page=1`,
          );
          if (!res.ok) throw new Error("검색 실패");
          const data = await res.json();
          setResults(data.movies);
          setVisibleCount(5);
          setIsDropdownOpen(true);
        } catch (error) {
          console.error("검색 실패:", error);
          setResults([]);
          setIsDropdownOpen(false);
        }
      } else {
        setResults([]);
        setIsDropdownOpen(false);
      }
    }, 300);

    debounceHandler(searchQuery);
    return () => debounceHandler.cancel();
  }, [searchQuery]);

  useEffect(() => {
    const clickOutsideHandler = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", clickOutsideHandler);
    return () => {
      document.removeEventListener("mousedown", clickOutsideHandler);
    };
  }, []);

  return (
    <div className="ml-4 hidden h-10 lg:flex" ref={dropdownRef}>
      <div className="relative flex h-full items-center justify-end">
        <div
          className={`relative flex items-center transition-all duration-300 ease-in-out ${
            isSearchOpen ? "w-64" : "w-10"
          }`}
        >
          <input
            {...register("search")}
            type="search"
            placeholder="영화 검색"
            className={`h-10 w-full rounded-full border border-black pl-4 pr-12 text-sm transition-all duration-300 ease-in-out focus:border-none focus:outline-none focus:ring-2 focus:ring-accent-300 ${
              isSearchOpen ? "opacity-100" : "opacity-0"
            }`}
            onFocus={inputFocusHandler}
          />
          <div
            className={`${
              isSearchOpen ? "border-none" : "bg-white"
            } absolute right-0 top-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-gray-200 transition-all duration-300 ease-in-out`}
            onClick={iconClickHandler}
          >
            <IoSearchOutline size={18} color="black" />
          </div>
        </div>

        {isDropdownOpen && results.length > 0 && (
          <div className="absolute right-0 top-full z-10 mt-1 max-h-96 w-64 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg scrollbar-hide">
            {results.slice(0, visibleCount).map((result, idx) => (
              <div
                key={idx}
                className="px-3 py-2 hover:bg-gray-100"
                onClick={resultsClickHandler}
              >
                <Link href={`/movie-details/${result.id}`}>
                  <p>{result.title}</p>
                  <p className="text-sm text-gray-500">
                    ({result.release_date?.slice(0, 4)})
                  </p>
                </Link>
              </div>
            ))}

            {/* 더 보기 버튼 */}
            {visibleCount < results.length && (
              <button
                onClick={() => setVisibleCount((prev) => prev + 5)}
                className="w-full px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
              >
                더 보기
              </button>
            )}

            {/* 전체 검색 페이지로 이동 */}
            {results.length >= 20 && (
              <Link href={`/search?query=${encodeURIComponent(searchQuery)}`}>
                <div className="flex w-full items-center bg-gray-100 px-3 py-2 text-sm text-gray-500 hover:bg-gray-200">
                  전체 검색 결과 보기
                  <FaArrowRight className="ml-1 text-gray-400" />
                </div>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
