import { MovieTrailer } from "lib/movies/fetchVideosMovies";
import VideoPlayer from "app/components/VideoPlayer";

export default function AllMovieTrailers({
  movieTrailer,
}: {
  movieTrailer: MovieTrailer[];
}) {
  return (
    <section className="px-8 py-12 lg:px-12 lg:py-16">
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-white">
          Movie Trailers
        </h2>
        <p className="text-sm text-gray-300">이 영화의 예고편을 확인해보세요</p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {movieTrailer.length > 0 ? (
          movieTrailer.map((trailer) => (
            <div key={trailer.id} className="aspect-video">
              <VideoPlayer trailerKey={trailer.key} />
            </div>
          ))
        ) : (
          <p className="w-full text-gray-400">등록된 예고편이 없습니다</p>
        )}
      </div>
    </section>
  );
}
