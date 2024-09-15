"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Movie } from "app/page";
import { fetchMovieCredits } from "api/fetchMovieCredits";
import useGetGenres from "hooks/useGetGenres";
import useGetTitle from "hooks/useGetTitle";
import useFormatDate from "hooks/useFormatDate";
import { FaInfoCircle } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";

export default function MovieCard({ movie }: { movie: Movie }) {
  const [castList, setCastList] = useState([]);
  const [director, setDirector] = useState();
  const [isExpanded, setIsExpanded] = useState(false);
  const { id, original_title, overview, release_date, title, vote_average } =
    movie;
  const { genres } = useGetGenres(id);
  const movieTitle = useGetTitle(original_title, title);
  const movieDate = useFormatDate(release_date);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchMovieCredits(id);

        const castList = res.cast.slice(0, 3);
        const directorsName = res.crew.filter(
          (member: any) => member.job === "Director",
        );
        setCastList(castList);
        setDirector(directorsName[0].name);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mx-auto mt-2 self-start border-2 border-black bg-white">
      <div className="">
        <div className="p-4">
          <h2 className="text-xs font-bold md:text-base">추천 영화</h2>
          <div className="flex">
            <h1 className="mb-2 text-4xl font-bold">{movieTitle}</h1>
            <Link href={`/movie-detail/${id}`}>
              <FaInfoCircle />
            </Link>
          </div>
        </div>
        <ul className="flex items-center space-x-2 border-y-2 border-black px-4 py-4 text-xs">
          {genres.map((genre, idx) => (
            <li
              className="rounded-full border-2 border-black bg-white p-2 px-2 py-1 text-sm text-black"
              key={idx}
            >
              {genre}
            </li>
          ))}
        </ul>
        <div className="border-b-2 border-black px-4 py-6">
          {overview ? (
            <p className={` ${isExpanded ? "" : "line-clamp-2"}`}>{overview}</p>
          ) : null}

          {overview.split(" ").length > 30 && (
            <button onClick={toggleExpand} className="text-xs text-gray-500">
              {isExpanded ? "접기" : "더 보기"}
            </button>
          )}
        </div>
        <div className="flex justify-center text-center">
          <div className="border-r border-gray-300 p-4">
            <p className="font-bold">Release Date</p>
            <p>{movieDate}</p>
          </div>
          <div className="border-r border-gray-300 p-4">
            <p className="font-bold">Director</p>
            <p>{director}</p>
          </div>
          <div className="border-r border-gray-300 p-4">
            <div className="font-bold">Stars</div>
            <ul>
              {castList?.map((cast: any, idx: number) => (
                <li key={idx}>{cast.name}</li>
              ))}
            </ul>
          </div>
          <div className="flex-1 p-4 font-bold">
            <p className="mb-2">Rated</p>
            <div className="flex items-center justify-center">
              <IoStar className="mr-2" size={24} />
              <p className="text-4xl">{Math.round(vote_average * 10) / 10}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full border-t-2 border-black bg-black text-center text-white">
        <Link
          href={`/post-create?id=${id}`}
          className="group relative flex w-full items-center justify-end p-8"
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
  );
}
