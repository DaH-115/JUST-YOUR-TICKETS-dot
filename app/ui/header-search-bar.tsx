"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { fetchSearchMovies } from "api/fetchSearchMovies";
import { debounce } from "lodash";
import { Movie } from "app/page";

export default function HeaderSearchBar() {
  const { register, watch, reset } = useForm();
  const searchQuery = watch("search");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const inputFocusHanlder = useCallback(() => {
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
      }
    };

    document.addEventListener("mousedown", clickOutsideHandler);
    return () => {
      document.removeEventListener("mousedown", clickOutsideHandler);
    };
  }, []);

  return (
    <div className="relative mr-4 hidden w-1/5 md:flex" ref={dropdownRef}>
      <input
        {...register("search")}
        type="search"
        placeholder="Search"
        className="w-full rounded-md border-2 border-black px-3 py-2 text-sm"
        onFocus={inputFocusHanlder}
      />
      {isDropdownOpen && searchResults.length > 0 && (
        <div className="absolute right-0 top-full z-10 mt-1 max-h-60 cursor-pointer overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
          {searchResults.map((result, index) => (
            <div
              key={index}
              className="px-3 py-2 hover:bg-gray-100"
              onClick={() => {
                setIsDropdownOpen(false);
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
  );
}
