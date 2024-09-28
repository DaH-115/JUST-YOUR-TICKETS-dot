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
    <div className="relative h-dvh py-6">
      <div className="absolute left-0 top-5 w-full bg-gradient-to-t from-transparent to-black p-4 pt-5 text-6xl font-bold text-white">
        {idx + 1}.
      </div>
      {poster_path ? (
        <Image
          width={640}
          height={750}
          className="h-full w-full object-cover object-center"
          src={`https://image.tmdb.org/t/p/original/${poster_path}`}
          alt={movieTitle}
        />
      ) : (
        <div className="h-full w-full overflow-hidden bg-black text-4xl font-bold text-white">
          Make a ticket for your own movie review.
        </div>
      )}

      {/* MOVIE INFO CARD */}
      <div className="absolute bottom-5 left-0 w-full border-2 border-black bg-white">
        <div className="flex p-4 pb-0">
          <div className="truncate pb-4 text-xl font-bold">{movieTitle}</div>
          <Link href={`/movie-detail/${id}`}>
            <FaInfoCircle />
          </Link>
        </div>
        <div className="flex w-full flex-wrap border-t-2 border-black p-1">
          {genres.map((genre, idx) => (
            <p
              className="m-1 rounded-full border-2 border-black bg-white px-2 py-1 text-sm text-black"
              key={idx}
            >
              {genre}
            </p>
          ))}
        </div>
        <div className="flex w-full border-t-2 border-black text-center">
          <div className="flex items-center border-r-2 border-black px-2">
            <IoStar />
            <div className="text-xl font-bold">
              {Math.round(vote_average * 10) / 10}
            </div>
          </div>
          <div className="flex-1 p-1">
            <Link
              href={`/post-create?id=${id}`}
              className="group relative flex items-center justify-end rounded-xl bg-black p-4 text-white"
            >
              <p className="text-sm transition-colors duration-300 group-hover:text-gray-400">
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
