import Link from "next/link";
import { Movie } from "api/fetchNowPlayingMovies";
import formatMovieDate from "app/utils/format-movie-date";
import { useMovieDetails } from "store/context/movie-details-context";
import { FaInfoCircle } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import AnimatedOverview from "app/components/animated-overview";
import NewWriteBtn from "app/components/new-write-btn";
import Tooltip from "app/components/tooltip";
import { BackAnimation } from "app/ui/back-animation";

export default function MovieCard({ movie }: { movie: Movie }) {
  const { id, title, original_title, release_date, vote_average, overview } =
    movie;
  const releaseDate = formatMovieDate(release_date);
  const { genres, cast, uniqueDirectors } = useMovieDetails();

  return (
    <section className="group relative mx-auto w-full break-keep">
      <div className="relative rounded-xl border-2 border-black bg-white p-2 lg:border-2 lg:transition-all lg:duration-300 lg:group-hover:-translate-x-1 lg:group-hover:-translate-y-1">
        <div className="p-4">
          <span className="mb-2 inline-block animate-bounce rounded-lg bg-[#8b1e3f] p-1 text-xs font-bold text-[#fbf7e8]">
            추천 영화
          </span>
          <div className="flex">
            <h1 className="text-3xl font-bold lg:text-4xl">{title}</h1>
            <div className="group/tooltip relative ml-2">
              <Link
                href={`/movie-details/${id}`}
                aria-label={`${title}(${original_title}) 영화 상세정보 보기`}
                title={`${title}(${original_title}) 영화 상세정보 보기`}
                role="button"
              >
                <FaInfoCircle className="lg:text-lg" aria-hidden />
              </Link>
              <Tooltip>영화 상세정보 보기</Tooltip>
            </div>
          </div>
          <div className="ml-1 flex items-center">
            <h2 className="mr-2 text-lg text-gray-500">{`${original_title}(${release_date.slice(0, 4)})`}</h2>
          </div>
        </div>
        <ul className="flex items-center space-x-2 border-y-4 border-dotted border-gray-200 p-4 text-sm">
          {genres.length > 0 ? (
            genres.map((genre, idx) => (
              <li
                className="rounded-full border border-black bg-white px-2 py-1 text-xs text-black transition-colors duration-300 hover:bg-[#8b1e3f] hover:text-white active:bg-white active:text-black lg:text-sm"
                key={idx}
              >
                {genre}
              </li>
            ))
          ) : (
            <li className="text-xs text-gray-300 lg:text-sm">
              장르 정보가 없습니다
            </li>
          )}
        </ul>
        {overview && <AnimatedOverview overview={overview} />}
        <div className="flex flex-1 border-b-4 border-dotted border-gray-200">
          <ul className="flex-1 flex-col items-center justify-center py-4 text-center text-sm">
            {cast.slice(0, 3).map((actor) => (
              <li key={actor.id}>
                {actor.name}
                <span className="block text-xs text-gray-500">
                  {actor.character}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex p-2">
          <div className="flex-1 border-r-4 border-dotted border-gray-200">
            <p className="pr-2 text-sm font-bold text-black">개봉일</p>
            <p className="p-2 pb-4 text-center text-sm">{releaseDate}</p>
          </div>
          <div className="flex-1 border-r-4 border-dotted border-gray-200">
            <p className="px-2 text-sm font-bold text-black">감독</p>
            <ul className="p-2 pb-4 text-center text-sm">
              {uniqueDirectors.length > 0 ? (
                uniqueDirectors.map((director) => (
                  <li key={`director-${director.id}`}>{director.name}</li>
                ))
              ) : (
                <li className="text-gray-300">감독 정보가 없습니다</li>
              )}
            </ul>
          </div>
          <div className="flex-1">
            <p className="px-2 text-sm font-bold text-black">평점</p>
            <div className="flex flex-1 items-center justify-center p-2 pb-4">
              <IoStar className="mr-1 text-[#D4AF37]" size={24} />
              <div className="text-2xl font-bold">
                {Math.round(vote_average * 10) / 10}
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full border-t-4 border-dotted border-gray-200 pt-4">
          <NewWriteBtn movieId={id} />
        </div>
      </div>
      <BackAnimation />
    </section>
  );
}
