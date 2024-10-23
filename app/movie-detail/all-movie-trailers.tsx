"use client";

import { useEffect, useState } from "react";
import { useError } from "store/error-context";
import { fetchVideosMovies, MovieTrailer } from "api/fetchVideosMovies";

export default function AllMovieTrailers({ movieId }: { movieId: number }) {
  const [movieTrailer, setMovieTrailer] = useState<MovieTrailer[]>();
  const getYouTubeUrl = (trailerKey: string) =>
    `https://www.youtube.com/embed/${trailerKey}`;
  const { isShowError } = useError();

  useEffect(() => {
    const fetchVideos = async () => {
      const result = await fetchVideosMovies(movieId);

      if ("results" in result) {
        setMovieTrailer(result.results);
      } else {
        isShowError(result.title, result.errorMessage, result.status);
      }
    };

    fetchVideos();
  }, [movieId, isShowError]);

  return (
    <section className="p-4 lg:p-8">
      <h2 className="mb-4 text-2xl font-bold lg:mb-6">이 영화의 예고편</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {movieTrailer && movieTrailer.length > 0 ? (
          movieTrailer.map((trailer) => (
            <div key={trailer.id} className="aspect-video">
              <iframe
                src={getYouTubeUrl(trailer.key)}
                title={trailer.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full rounded-lg shadow-lg"
              />
            </div>
          ))
        ) : (
          <div className="w-full text-gray-400">등록된 예고편이 없습니다.</div>
        )}
      </div>
    </section>
  );
}
