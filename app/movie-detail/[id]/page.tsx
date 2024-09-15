import Link from "next/link";
import Image from "next/image";
import { Movie } from "app/page";
import { fetchMovieDetails } from "api/fetchMovieDetails";
import { fetchSimilarMovies } from "api/fetchSimilarMovies";
import TicketSwiper from "app/ticket-swiper";
import { fetchMovieCredits } from "api/fetchMovieCredits";
import useGetTitle from "hooks/useGetTitle";
import useFormatDate from "hooks/useFormatDate";
import { IoStar } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";
import { fetchVideosMovies } from "api/fetchVideosMovies";

type MovieCredits = {
  cast: { name: string }[];
  crew: { name: string; job: string }[];
};

async function getMovies(id: number) {
  try {
    const movieDetails = await fetchMovieDetails(id);
    return movieDetails;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getMoviesCredits(id: number) {
  try {
    const movieCredits = await fetchMovieCredits(id);
    return movieCredits;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getSimilarPosts(id: number) {
  try {
    const similarPosts = await fetchSimilarMovies(id);
    return similarPosts.results;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getMovieTrailer(id: number) {
  try {
    const posts = await fetchVideosMovies(id);

    if (posts && posts.length > 0) {
      return posts;
    } else {
      return;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export default async function MovieDetailPage({
  params,
}: {
  params: { id: number };
}) {
  const movieDetails: Movie = await getMovies(params.id);
  const similarPosts: Movie[] = await getSimilarPosts(params.id);
  const movieCredits: MovieCredits = await getMoviesCredits(params.id);
  const movieTrailer = await getMovieTrailer(params.id);
  const castList = movieCredits.cast.slice(0, 3);
  const directorsName = movieCredits.crew.filter(
    (member: { job: string }) => member.job === "Director",
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
  } = movieDetails;
  const movieTitle = useGetTitle(original_title, title);
  const movieDate = useFormatDate(release_date);
  const getYouTubeUrl = (key: string) => `https://www.youtube.com/embed/${key}`;
  console.log(movieTrailer);

  return (
    <>
      <div id="page-header-image" className="h-[300px] overflow-hidden">
        <Image
          src={`https://image.tmdb.org/t/p/w1280${backdrop_path}`}
          alt={movieTitle}
          width={1280}
          height={720}
          className="h-full w-full object-cover object-center"
          priority
        />
      </div>
      <div className="mb-12 mt-8 flex justify-center pl-8">
        {/* LEFT SIDE */}
        <div className="w-1/3">
          <Image
            src={`https://image.tmdb.org/t/p/original${poster_path}`}
            alt={movieTitle}
            width={1280}
            height={720}
            className="rounded-lg object-cover shadow-lg"
          />
        </div>
        {/* RIGHT SIDE */}
        <div className="mx-auto w-full bg-white px-12">
          <div className="mb-4 font-bold">
            <p>영화 정보</p>
            <h1 className="text-4xl">{movieTitle}</h1>
          </div>
          <div className="mb-4">
            <ul className="flex items-center space-x-2 text-xs">
              {genres.map((genre: { id: number; name: string }) => (
                <li
                  className="rounded-full border-2 border-black bg-white p-2 px-2 py-1 text-sm text-black"
                  key={genre.id}
                >
                  {genre.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-4 font-bold">
            <div className="flex items-center">
              <IoStar className="mr-2" size={48} />
              <p className="text-4xl">{Math.round(vote_average * 10) / 10}</p>
            </div>
          </div>
          <div className="flex items-center space-x-12">
            <div className="mb-4">
              <p className="font-bold">개봉일</p>
              <p>{movieDate}</p>
            </div>
            <div className="mb-4">
              <p className="font-bold">러닝 타임</p>
              <p>{runtime}</p>
            </div>
            <div className="mb-4">
              <p className="font-bold">감독</p>
              <p>{directorsName[0].name}</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="font-bold">배우</div>
            <ul>
              {castList?.map((cast: any, idx: number) => (
                <li key={idx}>{cast.name}</li>
              ))}
            </ul>
          </div>
          <div className="mb-8">
            <p className="font-bold">줄거리</p>
            <p className="text-lg font-light">{overview}</p>
          </div>
          <div className="mb-4">
            <p className="font-bold">제작사</p>
            <div className="flex space-x-4 text-sm">
              {production_companies.map((company: any, index: any) => (
                <div key={index}>{company.name}</div>
              ))}
            </div>
          </div>
          <div className="group flex w-full rounded-full border-t-2 border-black bg-black text-center text-white">
            <Link
              href={`/post-create?id=${id}`}
              className="relative flex w-full items-center justify-center p-8"
            >
              <p className="text-xl transition-colors duration-300 group-hover:text-gray-400">
                리뷰 작성하기
              </p>
              <FaArrowRight
                className="ml-2 transition-transform duration-300 group-hover:translate-x-2"
                size={24}
              />
            </Link>
          </div>
        </div>
      </div>
      {movieTrailer ? (
        <div className="px-8 pb-12">
          <h2 className="mb-4 text-2xl font-bold">영화 예고편</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {movieTrailer.map((trailer: any) => (
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
      <div className="px-8">
        <p className="text-2xl font-bold">이런 영화는 어때요?</p>
        <TicketSwiper movieList={similarPosts} />
      </div>
    </>
  );
}
