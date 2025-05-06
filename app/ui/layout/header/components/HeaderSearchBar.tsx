"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import fetchSearchMovies from "api/movies/fetchSearchMovies";
import debounce from "lodash/debounce";
import { MovieList } from "api/movies/fetchNowPlayingMovies";
import { IoSearchOutline } from "react-icons/io5";

export default function HeaderSearchBar() {
  const { register, watch, reset } = useForm({
    defaultValues: { search: "" },
  });
  const searchQuery = watch("search");
  const [searchResults, setSearchResults] = useState<MovieList[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const inputFocusHandler = useCallback(() => {
    if (searchResults.length > 0) {
      setIsDropdownOpen(true);
    }
  }, [searchResults]);

  const iconClickHandler = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
    if (!isSearchOpen) {
      setTimeout(
        () =>
          (
            document.querySelector('input[type="search"]') as HTMLInputElement
          )?.focus(),
        300,
      );
    }
  }, []);

  const resultsClickHandler = useCallback(() => {
    setIsDropdownOpen(false);
    setIsSearchOpen(false);
    reset({ search: "" });
  }, []);

  useEffect(() => {
    const debounceHandler = debounce(async (query: string) => {
      if (query.trim()) {
        try {
          const { movies } = await fetchSearchMovies(query);
          setSearchResults(movies);
          setIsDropdownOpen(true);
        } catch (error) {
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
        setIsDropdownOpen(false);
      }
    }, 300);

    debounceHandler(searchQuery);
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
  }, [dropdownRef]);

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
            className={`${isSearchOpen ? "border-none" : "bg-white"} absolute right-0 top-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-gray-200 transition-all duration-300 ease-in-out`}
            onClick={iconClickHandler}
          >
            <IoSearchOutline size={18} color="black" />
          </div>
        </div>

        {isDropdownOpen && searchResults.length > 0 && (
          <div className="absolute right-0 top-full z-10 mt-1 max-h-60 w-64 cursor-pointer overflow-auto rounded-md border border-gray-300 bg-white shadow-lg scrollbar-hide">
            {searchResults.map((result, idx) => (
              <div
                key={idx}
                className="px-3 py-2 hover:bg-gray-100"
                onClick={resultsClickHandler}
              >
                <Link href={`/movie-details/${result.id}`}>
                  <p>{result.title}</p>
                  <p className="text-sm text-gray-500">
                    ({result.release_date.slice(0, 4)})
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
