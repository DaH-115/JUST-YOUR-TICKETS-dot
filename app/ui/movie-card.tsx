"use client";

import { useEffect, useState } from "react";
import { Movie } from "../page";
import useGetGenres from "hooks/useGetGenres";
import Link from "next/link";

export default function MovieCard({ movie }: { movie: Movie }) {
  const [castList, setCastList] = useState([]);
  const [director, setDirector] = useState();
  const [isExpanded, setIsExpanded] = useState(false);
  const { id, original_title, overview, release_date, title, vote_average } =
    movie;
  const { genres } = useGetGenres(id);

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split("-");
    const monthNames = [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ];
    const monthName = monthNames[parseInt(month, 10) - 1];
    return `${year}년 ${monthName} ${parseInt(day, 10)}일`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=ko-KR`,
        );
        const posts = await res.json();

        const castList = posts.cast.slice(0, 3);
        const directorsName = posts.crew.filter(
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
      <div className="px-4 py-4">
        <h2 className="text-xs font-bold md:text-base">추천 영화</h2>
        <h1 className="mb-2 text-4xl font-bold">{`${title}(${original_title})`}</h1>
        <ul className="mb-6 mt-4 flex items-center space-x-2 text-xs">
          {genres.map((genre, idx) => (
            <li
              className="rounded-full border-2 border-black bg-white p-2 px-2 py-1 text-sm text-black"
              key={idx}
            >
              {genre}
            </li>
          ))}
        </ul>
        {overview ? (
          <p
            className={`mb-1 text-xs md:mt-3 ${isExpanded ? "" : "line-clamp-2"}`}
          >
            {overview}
          </p>
        ) : null}

        {overview.split(" ").length > 30 && (
          <button onClick={toggleExpand} className="text-xs text-gray-500">
            {isExpanded ? "접기" : "더 보기"}
          </button>
        )}
        <div className="mt-2 flex justify-evenly">
          <div>
            <p className="font-bold">Release Date</p>
            <p>{formatDate(release_date)}</p>
          </div>
          <div>
            <p className="font-bold">Director</p>
            <p>{director}</p>
          </div>
          <div>
            <div className="font-bold">Stars</div>
            <ul>
              {castList?.map((cast: any, idx: number) => (
                <li key={idx}>{cast.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold">Rated</p>
            <p>{vote_average}</p>
          </div>
        </div>
      </div>
      <div className="w-full border-t-2 border-black p-8 text-center md:mt-0">
        <Link href={`/movie-detail/${id}`}>누르면 이동합니다</Link>
      </div>
    </div>
  );
}
