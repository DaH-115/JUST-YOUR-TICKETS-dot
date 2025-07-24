import Link from "next/link";
import { useMemo } from "react";
import GenreList from "app/components/movie/GenreList";
import MovieCertification from "app/components/movie/MovieCertification";
import MoviePoster from "app/components/movie/MoviePoster";
import WriteButton from "app/components/ui/buttons/WriteButton";
import getMovieTitle from "app/utils/getMovieTitle";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";
import { FaStar } from "react-icons/fa";

export default function SwiperItem({
  idx,
  movie,
}: {
  idx: number;
  movie: MovieList;
}) {
  const { id, original_title, poster_path, title, vote_average, genres } =
    movie;
  const movieTitle = useMemo(
    () => getMovieTitle(original_title, title),
    [original_title, title],
  );

  return (
    <article className="relative flex flex-col items-stretch drop-shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-5">
      {/* 랭킹 번호 */}
      <header className="absolute left-0 top-0 z-50 flex w-full items-center justify-between rounded-t-xl bg-gradient-to-t from-transparent to-black px-2 py-1 text-2xl font-bold text-white md:px-4 md:py-3 md:text-3xl">
        <strong>{`${idx + 1}.`}</strong>
      </header>
      {/* 영화 포스터 */}
      <div className="aspect-[2/3] overflow-hidden rounded-xl">
        <MoviePoster posterPath={poster_path} title={movieTitle} />
      </div>

      {/* 영화 정보 카드 */}
      <section className="overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 p-2">
        {/* 영화 제목 */}
        <div className="border-b-4 border-dotted pb-2">
          <div className="flex items-center gap-1 md:gap-2">
            <div className="flex-1">
              <h3 className="line-clamp-1 text-sm font-bold">
                <Link
                  href={`/movie-details/${id}`}
                  aria-label={`${movieTitle} 영화 상세정보 보기`}
                  className="transition-colors hover:text-accent-300"
                >
                  {title}
                </Link>
              </h3>
              <p className="line-clamp-1 text-xs text-gray-600">
                {original_title}
              </p>
            </div>
            {movie.certification && (
              <MovieCertification certification={movie.certification} />
            )}
          </div>
        </div>

        {/* 등급 & 장르 */}
        <section className="flex items-center">
          {/* 평점 */}
          <div className="flex items-center pr-2 text-sm">
            <FaStar className="mr-1 text-accent-300" />
            <span className="font-bold">
              {vote_average ? Math.round(vote_average * 10) / 10 : 0}
            </span>
          </div>
          {/* 장르 */}
          <GenreList genres={genres || []} />
        </section>
      </section>
      {/* 리뷰 작성 버튼 */}
      <div className="py-2">
        <WriteButton movieId={id} size={"small"} />
      </div>
    </article>
  );
}
