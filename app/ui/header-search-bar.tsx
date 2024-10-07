"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { fetchSearchMovies } from "api/fetchSearchMovies";
import { debounce } from "lodash";
import { Movie } from "app/page";
import { IoSearchOutline } from "react-icons/io5";

export default function HeaderSearchBar() {
  const { register, watch, reset } = useForm();
  const searchQuery = watch("search");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debounceHandler = useCallback(
    debounce(async (query: string) => {
      if (query.trim()) {
        const results = await fetchSearchMovies(query);
        setSearchResults(results);
        setIsDropdownOpen(true);
      } else {
        setSearchResults([]);
        setIsDropdownOpen(false);
      }
    }, 300),
    [],
  );

  const inputFocusHandler = useCallback(() => {
    if (searchResults.length > 0) {
      setIsDropdownOpen(true);
    }
  }, [searchResults]);

  useEffect(() => {
    debounceHandler(searchQuery || "");
  }, [searchQuery, debounceHandler]);

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

  const handleIconClick = () => {
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
  };

  return (
    <div className="flex h-10 px-4" ref={dropdownRef}>
      <div className="relative flex h-full w-full items-center justify-end">
        <input
          {...register("search")}
          type="search"
          placeholder="Search..."
          className={`h-full rounded-full border-2 border-black shadow-md transition-all duration-300 ease-in-out ${
            isSearchOpen
              ? "w-64 pl-4 pr-10 text-sm opacity-100"
              : "w-10 opacity-0"
          }`}
          onFocus={inputFocusHandler}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-10 cursor-pointer items-center justify-center rounded-full shadow-md ${isSearchOpen ? "border-none bg-none" : "border border-black bg-white"} transition-all duration-300 ease-in-out`}
          onClick={handleIconClick}
        >
          <IoSearchOutline size={20} color="black" />
        </div>

        {isDropdownOpen && searchResults.length > 0 && (
          <div className="absolute right-0 top-full z-10 mt-1 max-h-60 w-64 cursor-pointer overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="px-3 py-2 hover:bg-gray-100"
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsSearchOpen(false);
                  reset({ search: "" });
                }}
              >
                <Link href={`/movie-detail/${result.id}`}>
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
