import Link from "next/link";
import Image from "next/image";
import { Movie } from "app/page";
import { fetchMovieDetails } from "api/fetchMovieDetails";
import { fetchSimilarMovies } from "api/fetchSimilarMovies";
import { fetchMovieCredits } from "api/fetchMovieCredits";
import { fetchVideosMovies } from "api/fetchVideosMovies";
import useGetTitle from "hooks/useGetTitle";
import useFormatDate from "hooks/useFormatDate";
import { IoStar } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";
import TicketSwiper from "app/ticket-swiper";
import BackGround from "app/ui/back-ground";
import { RiMovieLine } from "react-icons/ri";

export default async function MovieDetailPage({
  params,
}: {
  params: { id: number };
}) {
  const movieDetails = await fetchMovieDetails(params.id);
  const similarPosts = await fetchSimilarMovies(params.id);
  const movieCredits = await fetchMovieCredits(params.id);
  const movieTrailer = await fetchVideosMovies(params.id);
  const castList = movieCredits?.cast.slice(0, 3);
  const directorsName = movieCredits?.crew.filter(
    (member) => member.job === "Director",
  );
  const {
    id,
    title,
    release_date,
    overview,
    poster_path,
    original_title,
    vote_average,
    genres,
    backdrop_path,
    runtime,
    production_companies,
  } = movieDetails as Movie;
  const movieTitle = useGetTitle(original_title, title);
  const movieDate = useFormatDate(release_date);
  const getYouTubeUrl = (key: string) => `https://www.youtube.com/embed/${key}`;

  const convertRuntime = (runtime: number) => {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}시간 ${minutes}분`;
  };

  return (
    <>
      <BackGround imageUrl={backdrop_path} movieTitle={movieTitle} />
      <div className="relative mb-16 flex w-full items-center justify-center">
        <div className="mt-16 flex w-2/3 justify-center">
          {/* POSTER */}
          <div className="mr-8 w-2/3">
            <Image
              src={`https://image.tmdb.org/t/p/original${poster_path}`}
              alt={movieTitle}
              width={1280}
              height={720}
              className="rounded-lg object-cover shadow-lg"
            />
          </div>
          {/* MOVIE INFO */}
          <div className="mx-auto w-full rounded-xl border-2 border-black bg-white shadow-lg">
            <div className="px-4 py-4">
              <p className="mb-2 inline-block rounded-lg bg-black p-1 text-xs font-bold text-white">
                영화 정보
              </p>
              <h1 className="mx-4 break-keep text-4xl font-bold">{title}</h1>
              <div className="mx-1 flex items-center">
                <p className="ml-4 text-lg text-gray-500">{original_title}</p>
                <p className="text-lg text-gray-500">
                  <span className="px-2">•</span>
                  {release_date.slice(0, 4)}
                </p>
              </div>
            </div>
            <div className="border-y border-black p-4">
              <ul className="flex items-center space-x-2">
                {genres.map((genre) => (
                  <li
                    className="rounded-full border-2 border-black bg-black p-2 px-2 py-1 text-white transition-colors duration-300 hover:bg-white hover:text-black active:bg-white active:text-black"
                    key={genre.id}
                  >
                    {genre.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 font-bold">
              <div className="flex items-center">
                <IoStar className="mr-2" size={48} />
                <p className="text-4xl">{Math.round(vote_average * 10) / 10}</p>
              </div>
            </div>
            <div className="flex w-full items-center justify-between border-y border-black">
              <div className="flex-1 p-2">
                <p className="mb-2 inline-block rounded-lg border-2 border-black p-1 text-xs font-bold">
                  개봉일
                </p>
                <p>{movieDate}</p>
              </div>
              <div className="flex-1 border-x-2 border-dotted border-gray-300 p-2">
                <p className="mb-2 inline-block rounded-lg border-2 border-black p-1 text-xs font-bold">
                  러닝 타임
                </p>
                <p>{convertRuntime(Number(runtime))}</p>
              </div>
              <div className="flex-1 p-2">
                <p className="mb-2 inline-block rounded-lg border-2 border-black p-1 text-xs font-bold">
                  감독
                </p>
                <p>{directorsName && directorsName[0].name}</p>
              </div>
            </div>

            <div className="border-b border-black px-2 pt-2">
              <div className="mb-2 inline-block rounded-lg border-2 border-black p-1 text-xs font-bold">
                배우
              </div>
              <ul className="mb-8 px-4 font-semibold">
                {castList?.map((cast, index) => (
                  <li key={index}>{cast.name}</li>
                ))}
              </ul>
            </div>
            <div className="pt-2">
              <p className="mb-4 ml-2 inline-block rounded-lg border-2 border-black p-1 text-xs font-bold">
                줄거리
              </p>
              <p className="mb-12 break-keep px-4 text-lg font-light">
                {overview}
              </p>
            </div>
            <div className="flex items-center border-y border-black p-2">
              <p className="mr-4 inline-block rounded-lg border-2 border-black p-1 text-xs font-bold">
                제작사
              </p>
              <div className="text-sm font-semibold">
                {production_companies.map((company, index) => (
                  <div key={index}>
                    <span>{company.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="group flex w-full p-1 text-center text-white">
              <Link
                href={`/write-review/new?movieId=${id}`}
                className="relative flex w-full items-center justify-center rounded-xl bg-black p-8"
              >
                <p className="text-lg transition-all duration-300 group-hover:text-xl">
                  리뷰 작성하기
                </p>
                <FaArrowRight
                  className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
                  size={24}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {movieTrailer && movieTrailer.length > 0 ? (
        <div className="px-8 pb-8">
          <div>
            <p className="mb-6 text-2xl font-bold">
              이 영화의 예고편을 확인 해보세요
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {movieTrailer.map((trailer) => (
              <div key={trailer.id} className="aspect-video">
                <iframe
                  src={getYouTubeUrl(trailer.key)}
                  title={trailer.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full rounded-lg shadow-lg"
                ></iframe>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {similarPosts && similarPosts.length > 0 ? (
        <div className="p-8">
          <p className="mb-6 text-2xl font-bold">이런 영화는 어때요?</p>
          <TicketSwiper movieList={similarPosts} />
        </div>
      ) : null}
    </>
  );
}
