import { MovieTrailer } from "api/fetchVideosMovies";
import VideoPlayer from "app/video-player";

export default function AllMovieTrailers({
  movieTrailer,
}: {
  movieTrailer: MovieTrailer[];
}) {
  return (
    <section className="px-8 py-4 lg:p-8">
      <h2 className="mb-4 text-2xl font-bold text-white">이 영화의 예고편</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {movieTrailer.length > 0 ? (
          movieTrailer.map((trailer) => (
            <div key={trailer.id} className="aspect-video">
              <VideoPlayer
                url={`https://www.youtube.com/embed/${trailer.key}`}
              />
            </div>
          ))
        ) : (
          <p className="w-full text-gray-400">등록된 예고편이 없습니다</p>
        )}
      </div>
    </section>
  );
}
