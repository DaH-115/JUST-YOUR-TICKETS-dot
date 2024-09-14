import Image from "next/image";
import { Movie } from "app/page";
import { fetchMovieDetails } from "api/fetchMovieDetails";
import { fetchSimilarMovies } from "api/fetchSimilarMovies";
import TicketSwiper from "app/ticket-swiper";
import { fetchMovieCredits } from "api/fetchMovieCredits";
import useGetTitle from "hooks/useGetTitle";
import useFormatDate from "hooks/useFormatDate";
import { IoStar } from "react-icons/io5";

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

export default async function MovieDetailPage({
  params,
}: {
  params: { id: number };
}) {
  const movieDetails: Movie = await getMovies(params.id);
  const similarPosts: Movie[] = await getSimilarPosts(params.id);
  const movieCredits: MovieCredits = await getMoviesCredits(params.id);
  const castList = movieCredits.cast.slice(0, 3);
  const directorsName = movieCredits.crew.filter(
    (member: { job: string }) => member.job === "Director",
  );
  const {
    title,
    release_date,
    overview,
    poster_path,
    original_title,
    vote_average,
    genres,
  } = movieDetails;
  const movieTitle = useGetTitle(original_title, title);
  const movieDate = useFormatDate(release_date);

  return (
    <>
      <div className="mb-16 mt-16 flex justify-center px-6">
        {/* LEFT SIDE */}
        <div className="w-full bg-red-50">
          <Image
            src={`https://image.tmdb.org/t/p/original${poster_path}`}
            alt={movieTitle}
            width={640}
            height={750}
            className="w-full object-cover"
          />
        </div>
        {/* RIGHT SIDE */}
        <div className="mx-auto w-full bg-white p-6">
          <div className="mb-4 font-bold">
            <p>타이틀</p>
            <h1 className="text-4xl">{movieTitle}</h1>
          </div>
          <div className="mb-4">
            <p className="font-bold">장르</p>
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
            <p>평가</p>
            <div className="flex items-center">
              <IoStar className="mr-2" size={48} />
              <p className="text-4xl">{Math.round(vote_average * 10) / 10}</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="font-bold">개봉일</p>
            <p>{movieDate}</p>
          </div>
          <div className="mb-4">
            <div className="font-bold">Stars</div>
            <ul>
              {castList?.map((cast: any, idx: number) => (
                <li key={idx}>{cast.name}</li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <p className="font-bold">Director</p>
            <p>{directorsName[0].name}</p>
          </div>
          <div className="mb-4">
            <p className="font-bold">줄거리</p>
            <p>{overview}</p>
          </div>
          <div className="mt-16 w-full border-2 border-black p-8 text-center">
            누르면 이동합니다
          </div>
        </div>
      </div>
      <div className="px-6">
        <p className="text-2xl font-bold">이런 영화는 어때요?</p>
        <TicketSwiper movieList={similarPosts} />
      </div>
    </>
  );
}
