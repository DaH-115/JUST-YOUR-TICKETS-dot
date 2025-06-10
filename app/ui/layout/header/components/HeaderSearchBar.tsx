"use client";

import { useCallback, useEffect, useState, useRef, useMemo } from "react";
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

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
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
      }, 300),
    [],
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

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
    <div className="ml-4 hidden lg:flex" ref={dropdownRef}>
      <div className="relative flex items-center justify-end">
        <div
          className={`relative flex items-center rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm transition-all duration-300 ease-in-out hover:border-white/50 hover:bg-white/20 ${
            isSearchOpen ? "w-64" : "w-12"
          }`}
        >
          <input
            {...register("search")}
            type="search"
            placeholder="영화 검색"
            className={`h-12 w-full rounded-full bg-transparent pl-4 pr-14 text-sm text-white placeholder-white/70 transition-all duration-300 ease-in-out focus:outline-none ${
              isSearchOpen ? "opacity-100" : "opacity-0"
            }`}
            onFocus={inputFocusHandler}
          />
          <div
            className="absolute right-0 top-0 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-all duration-300 ease-in-out hover:bg-white/10"
            onClick={iconClickHandler}
          >
            <IoSearchOutline size={18} color="white" />
          </div>
        </div>

        {isDropdownOpen && results.length > 0 && (
          <div className="absolute right-0 top-full z-10 mt-2 max-h-96 w-64 overflow-auto rounded-xl border border-white/20 bg-black/90 shadow-xl backdrop-blur-md scrollbar-hide">
            {results.slice(0, visibleCount).map((result, idx) => (
              <div
                key={idx}
                className="px-4 py-3 text-white transition-colors duration-200 hover:bg-white/10"
                onClick={resultsClickHandler}
              >
                <Link href={`/movie-details/${result.id}`}>
                  <p className="font-medium">{result.title}</p>
                  <p className="text-sm text-white/70">
                    ({result.release_date?.slice(0, 4)})
                  </p>
                </Link>
              </div>
            ))}

            {/* 더 보기 버튼 */}
            {visibleCount < results.length && (
              <button
                onClick={() => setVisibleCount((prev) => prev + 5)}
                className="w-full px-4 py-3 text-sm text-white/70 transition-colors duration-200 hover:bg-white/10"
              >
                더 보기
              </button>
            )}

            {/* 전체 검색 페이지로 이동 */}
            {results.length >= 20 && (
              <Link href={`/search?query=${encodeURIComponent(searchQuery)}`}>
                <div className="flex w-full items-center bg-white/5 px-4 py-3 text-sm text-white/70 transition-colors duration-200 hover:bg-white/10">
                  전체 검색 결과 보기
                  <FaArrowRight className="ml-2 text-white/50" />
                </div>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
