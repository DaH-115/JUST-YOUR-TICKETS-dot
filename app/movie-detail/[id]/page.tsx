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
      <main className="relative z-50 mb-8 flex w-full items-center justify-center lg:my-16">
        <div className="flex flex-col justify-center lg:w-2/3 lg:flex-row">
          {/* MOVIE POSTER */}
          <div className="mx-auto w-3/4 py-4 lg:mr-8 lg:w-2/3">
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
            <div className="p-4 pb-2">
              <h1 className="mb-2 inline-block rounded-lg bg-black p-1 text-xs font-bold text-white">
                영화 정보
              </h1>
              <h2 className="break-keep text-3xl font-bold lg:ml-4 lg:text-4xl">
                {title}
              </h2>
              <div className="ml-1 flex items-center">
                <p className="text-lg text-gray-500 lg:ml-4">
                  {original_title}
                </p>
                <p className="text-lg text-gray-500">
                  <span className="px-2">•</span>
                  {release_date.slice(0, 4)}
                </p>
              </div>
            </div>
            <div className="border-y border-black p-2">
              <ul className="flex items-center space-x-2">
                {genres.map((genre) => (
                  <li
                    key={genre.id}
                    className="rounded-full border-2 border-black bg-black px-2 py-1 text-xs text-white transition-colors duration-300 hover:bg-white hover:text-black active:bg-white active:text-black lg:text-sm"
                  >
                    {genre.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 font-bold">
              <div className="flex items-center">
                <IoStar className="mr-2" size={42} />
                <p className="text-4xl">
                  {Math.round(vote_average * 10) / 10}
                  <span className="font-normal text-gray-400">/10</span>
                </p>
              </div>
            </div>
            <div className="mb-12 mt-2">
              <p className="break-keep px-6 font-light">{overview}</p>
            </div>
            <div className="border-t border-black p-2">
              <h3 className="text-lg font-bold">출연진</h3>
              <ul className="space-y-1 p-4">
                {castList?.map((cast, index) => (
                  <li key={index}>{cast.name}</li>
                ))}
              </ul>
            </div>
            <div className="flex w-full items-stretch justify-between border-t border-black text-sm">
              <div className="flex flex-1 flex-col">
                <h3 className="p-2 pb-0 font-bold">개봉일</h3>
                <div className="h-16 overflow-y-auto p-2 text-center">
                  <p className="break-keep">{movieDate}</p>
                </div>
              </div>
              <div className="flex flex-1 flex-col border-x-2 border-dotted border-gray-300 text-sm">
                <h3 className="p-2 pb-0 font-bold">러닝 타임</h3>
                <div className="h-16 overflow-y-auto p-2 text-center">
                  <p>{convertRuntime(Number(runtime))}</p>
                </div>
              </div>
              <div className="flex flex-1 flex-col">
                <h3 className="p-2 pb-0 text-sm font-bold">감독</h3>
                <div className="h-16 overflow-y-auto p-2 text-center">
                  <ul className="space-y-1">
                    {directorsName?.map((cast, index) => (
                      <li key={index}>{cast.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex items-center border-y border-black p-4">
              <h3 className="font-bold">제작</h3>
              <div className="ml-4 space-y-1 text-sm">
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
                className="relative flex w-full items-center justify-center rounded-xl bg-black p-4 lg:p-8"
              >
                <p className="text-base transition-all duration-300 group-hover:text-lg lg:text-lg lg:group-hover:text-xl">
                  리뷰 작성하기
                </p>
                <FaArrowRight className="ml-1 text-lg transition-transform duration-300 group-hover:translate-x-1 lg:text-xl" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      {movieTrailer && movieTrailer.length > 0 ? (
        <section className="p-8">
          <h2 className="mb-4 text-2xl font-bold lg:mb-6">이 영화의 예고편</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {movieTrailer.map((trailer) => (
              <div key={trailer.id} className="aspect-video">
                <iframe
                  src={getYouTubeUrl(trailer.key)}
                  title={trailer.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full rounded-lg shadow-lg"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}
      {similarPosts && similarPosts.length > 0 ? (
        <section className="p-8">
          <h2 className="mb-6 text-2xl font-bold">이런 영화는 어때요?</h2>
          <TicketSwiper movieList={similarPosts} />
        </section>
      ) : null}
    </>
  );
}
