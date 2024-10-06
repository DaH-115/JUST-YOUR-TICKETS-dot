import { Movie } from "app/page";
import Image from "next/image";
import Link from "next/link";
import useGetGenres from "hooks/useGetGenres";
import useGetTitle from "hooks/useGetTitle";
import { FaArrowRight, FaInfoCircle } from "react-icons/fa";
import { IoStar } from "react-icons/io5";

export default function SwiperCard({
  idx,
  movie,
  id,
}: {
  movie: Movie;
  idx: number;
  id: number;
}) {
  const { genres } = useGetGenres(id);
  const { original_title, poster_path, title, vote_average } = movie;
  const movieTitle = useGetTitle(original_title, title);

  return (
    <div className="group/card relative mx-2 h-[600px]">
      <div className="absolute left-0 top-0 w-full rounded-t-xl bg-gradient-to-t from-transparent to-black p-4 pt-5 text-6xl font-bold text-white">
        {idx + 1}.
      </div>
      {poster_path ? (
        <Image
          width={640}
          height={750}
          className="h-full w-full rounded-xl object-cover object-center"
          src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
          alt={movieTitle}
        />
      ) : (
        <div className="h-full w-full overflow-hidden bg-black text-4xl font-bold text-white">
          Make a ticket for your own movie review.
        </div>
      )}

      {/* MOVIE INFO CARD */}
      <div className="absolute bottom-0 right-0 w-full rounded-xl border-2 border-black bg-white shadow-lg transition-all duration-300 group-hover/card:bottom-2 group-hover/card:right-2">
        <div className="flex p-4 pb-0">
          <div className="truncate pb-4 text-xl font-bold">{movieTitle}</div>
          <div className="group relative ml-2">
            <Link href={`/movie-detail/${id}`}>
              <FaInfoCircle />
            </Link>
            <div className="invisible absolute bottom-full right-0 z-50 mb-2 whitespace-nowrap rounded-lg bg-black px-3 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
              더 자세한 정보 보기
            </div>
          </div>
        </div>
        <div className="flex w-full flex-wrap border-y border-black p-1">
          {genres.map((genre, idx) => (
            <p
              className="m-1 rounded-full border-2 border-black bg-white px-2 py-1 text-sm text-black"
              key={idx}
            >
              {genre}
            </p>
          ))}
        </div>
        <div className="flex w-full text-center">
          <div className="flex items-center border-r-2 border-black px-2">
            <IoStar />
            <div className="text-xl font-bold">
              {Math.round(vote_average * 10) / 10}
            </div>
          </div>
          <div className="flex-1 p-1">
            <Link
              href={`/write-review/new?movieId=${id}`}
              className="group relative flex items-center justify-end rounded-xl bg-black p-4 text-white"
            >
              <p className="text-sm transition-all duration-300 group-hover:font-bold">
                리뷰 작성하기
              </p>
              <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
