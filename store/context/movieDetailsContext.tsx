"use client";

import { createContext, useContext } from "react";
import {
  CastMember,
  CrewMember,
  MovieCredits,
} from "api/movies/fetchMovieCredits";

interface MovieDetailsContextType {
  genres: string[];
  cast: CastMember[];
  uniqueDirectors: CrewMember[];
}

const MovieDetailsContext = createContext<MovieDetailsContextType | null>(null);

export function MovieDetailsProvider({
  children,
  credits,
  genres,
}: {
  children: React.ReactNode;
  credits: MovieCredits;
  genres: string[];
}) {
  const { crew, cast } = credits;
  // job이 'Director'인 제작진만 필터링하고 중복 제거
  const uniqueDirectors = crew
    .filter((person) => person.job === "Director")
    .reduce((unique: CrewMember[], person) => {
      const isNameExist = unique.some((p) => p.name === person.name);
      if (!isNameExist) {
        unique.push(person);
      }
      return unique;
    }, []);

  return (
    <MovieDetailsContext.Provider value={{ genres, cast, uniqueDirectors }}>
      {children}
    </MovieDetailsContext.Provider>
  );
}

export function useMovieDetails() {
  const context = useContext(MovieDetailsContext);
  if (!context) {
    throw new Error(
      "useMovieDetails must be used within a MovieDetailsProvider",
    );
  }
  return context;
}
