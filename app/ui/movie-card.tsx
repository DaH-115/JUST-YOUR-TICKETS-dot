"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CastMember, fetchMovieCredits } from "api/fetchMovieCredits";
import useGetGenres from "hooks/useGetGenres";
import useFormatDate from "hooks/useFormatDate";
import { FaInfoCircle } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";
import AnimatedOverview from "app/ui/animated-overview";
import { Movie } from "app/page";

export default function MovieCard({ movie }: { movie: Movie }) {
  const [castList, setCastList] = useState<CastMember[]>();
  const [director, setDirector] = useState<string | string[]>();
  const { id, original_title, overview, release_date, title, vote_average } =
    movie;
  const { genres } = useGetGenres(id);
  const movieDate = useFormatDate(release_date);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchMovieCredits(id);

        const castList = res?.cast.slice(0, 3);
        const directorsName = res?.crew.filter(
          (member) => member.job === "Director",
        );
        setCastList(castList);
        if (directorsName) {
          setDirector(directorsName[0].name);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="group relative inline-block">
      <div className="rounded-xl border-2 border-black bg-white lg:border-2 lg:transition-all lg:duration-300 lg:group-hover:-translate-x-1 lg:group-hover:-translate-y-1">
        <div className="p-4">
          <h2 className="mb-2 inline-block animate-bounce rounded-lg bg-black p-1 text-xs font-bold text-white">
            추천 영화
          </h2>
          <div className="flex">
            <h1 className="text-4xl font-bold">{title}</h1>
            <div className="group/tooltip relative ml-2">
              <Link href={`/movie-detail/${id}`}>
                <FaInfoCircle size={20} />
              </Link>
              <div className="invisible absolute bottom-full left-1/2 mb-2 whitespace-nowrap rounded-lg bg-black px-3 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover/tooltip:visible group-hover/tooltip:opacity-100">
                더 자세한 정보 보기
              </div>
            </div>
          </div>
          <div className="ml-1 flex items-center">
            <p className="mr-2 text-lg text-gray-500">{`${original_title}(${release_date.slice(0, 4)})`}</p>
          </div>
        </div>
        <ul className="flex items-center space-x-2 border-y border-black px-4 py-2 text-sm">
          {genres.map((genre, idx) => (
            <li
              className="rounded-full border border-black bg-white p-2 px-2 py-1 text-black transition-colors duration-300 hover:bg-black hover:text-white active:bg-white active:text-black"
              key={idx}
            >
              {genre}
            </li>
          ))}
        </ul>
        <div className="flex flex-1 border-b border-black">
          <ul className="flex-1 flex-col items-center justify-center py-4 text-center">
            {castList?.map((cast) => <li key={cast.id}>{cast.name}</li>)}
          </ul>
        </div>
        <AnimatedOverview overview={overview} />
        <div className="flex">
          <div className="flex-1 border-r-2 border-dotted border-gray-300">
            <div className="border-b border-black p-1">
              <div className="rounded-xl bg-black">
                <p className="p-2 text-center text-xs text-white">개봉일</p>
              </div>
            </div>
            <p className="px-2 py-4 text-center">{movieDate}</p>
          </div>
          <div className="flex-1 border-r-2 border-dotted border-gray-300">
            <div className="border-b border-black p-1">
              <div className="rounded-xl bg-black">
                <p className="p-2 text-center text-xs text-white">감독</p>
              </div>
            </div>
            <p className="px-2 py-4 text-center">{director}</p>
          </div>
          <div className="flex-1">
            <div className="border-b border-black p-1">
              <div className="rounded-xl bg-black">
                <p className="p-2 text-center text-xs text-white">평점</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <IoStar className="mr-1" size={24} />
              <p className="py-4 text-4xl font-bold">
                {Math.round(vote_average * 10) / 10}
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full border-t border-black p-1 text-center text-white">
          <Link
            href={`/write-review/new?movieId=${id}`}
            className="group/button relative flex w-full items-center justify-end rounded-2xl bg-black p-4"
          >
            <p className="transition-all duration-300 group-hover/button:text-lg lg:text-lg lg:group-hover/button:text-xl">
              리뷰 작성하기
            </p>
            <FaArrowRight className="ml-1 text-xl transition-transform duration-300 group-hover/button:translate-x-1" />
          </Link>
        </div>
      </div>
      <span className="absolute left-1 top-1 -z-10 h-full w-full rounded-xl border-2 border-black bg-gray-200 lg:bg-black lg:transition-all lg:duration-300 lg:group-hover:translate-x-1 lg:group-hover:translate-y-1 lg:group-hover:bg-gray-200"></span>
    </div>
  );
}
