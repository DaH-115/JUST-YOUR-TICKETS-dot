"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchVideosMovies, MovieTrailer } from "api/fetchVideosMovies";

export default function AllMovieTrailers({ movieId }: { movieId: number }) {
  const [movieTrailer, setMovieTrailer] = useState<MovieTrailer[]>([]);
  const [isError, setIsError] = useState<string | null>(null);
  const getYouTubeUrl = useCallback(
    (trailerKey: string) => `https://www.youtube.com/embed/${trailerKey}`,
    [],
  );

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { results } = await fetchVideosMovies(movieId);
        setMovieTrailer(results);
      } catch (error) {
        console.error(error);
        setMovieTrailer([]);
        setIsError("예고편을 불러오는데 실패했습니다.");
      }
    };

    fetchVideos();
  }, [movieId]);

  return (
    <section className="px-8 py-4 lg:p-8">
      <h2 className="mb-4 text-2xl font-bold lg:mb-6">이 영화의 예고편</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {movieTrailer.length > 0 ? (
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
          <p className="w-full text-gray-400">
            {isError ? isError : "등록된 예고편이 없습니다."}
          </p>
        )}
      </div>
    </section>
  );
}
