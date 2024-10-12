"use client";

import { useEffect, useState } from "react";
import { fetchVideosMovies } from "api/fetchVideosMovies";
import useGetTitle from "hooks/useGetTitle";
import BackGround from "app/ui/back-ground";
import ScrollToTopButton from "app/ui/scroll-to-top-button";
import TicketSwiper from "app/ticket-swiper";
import { Movie } from "app/page";
import Catchphrase from "app/ui/catchphrase";
import { MdLocalMovies } from "react-icons/md";
import RecommendMovie from "app/recommend-movie";
import RecommendMovieSkeleton from "app/recommend-movie-skeleton";
import MovieTrailer from "app/movie-trailer";

export default function HomePage({ movieList }: { movieList: Movie[] }) {
  const [trailerKey, setTrailerKey] = useState<string>("");
  const [currentMovie, setCurrentMovie] = useState<Movie>();
  const movieTitle = useGetTitle(
    currentMovie?.original_title,
    currentMovie?.title,
  );

  useEffect(() => {
    if (movieList.length > 0) {
      const newIndex = Math.floor(Math.random() * movieList.length);
      setCurrentMovie(movieList[newIndex]);
    }
  }, [movieList]);

  useEffect(() => {
    if (!currentMovie) return;

    const fetchTrailer = async () => {
      setTrailerKey("");
      try {
        const posts = await fetchVideosMovies(currentMovie.id);

        if (posts && posts.length > 0) {
          setTrailerKey(posts[0].key);
        } else {
          console.log("Not found for this movie");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTrailer();
  }, [currentMovie]);

  return (
    <>
      <BackGround
        imageUrl={currentMovie?.backdrop_path}
        movieTitle={movieTitle}
      />
      <>
        {currentMovie ? (
          <RecommendMovie currentMovie={currentMovie} trailerKey={trailerKey} />
        ) : (
          <RecommendMovieSkeleton />
        )}
      </>
      <>
        {trailerKey && (
          <MovieTrailer trailerKey={trailerKey} movieTitle={movieTitle} />
        )}
      </>

      {/* Now Playing */}
      <section
        id="now-playing"
        className="relative z-10 mb-16 w-full px-4 pt-8"
      >
        <div className="mb-4 lg:mb-8">
          <div className="flex items-start justify-between lg:justify-start">
            <h2 className="text-4xl font-black lg:text-6xl">
              Now
              <br />
              Playing
            </h2>
            <div className="ml-2 rounded-full border-2 border-black bg-white p-3 transition-colors duration-300 hover:bg-gray-300 hover:text-white">
              <MdLocalMovies className="text-2xl lg:text-4xl" />
            </div>
          </div>
          <div>
            <p className="pt-2 text-base text-black lg:pt-6 lg:text-xl">
              현재 상영 중인 영화들을 확인해 보세요
            </p>
          </div>
        </div>

        {/* POSTER SWIPER */}
        <TicketSwiper movieList={movieList} />
      </section>

      <ScrollToTopButton />
      <Catchphrase />
    </>
  );
}
