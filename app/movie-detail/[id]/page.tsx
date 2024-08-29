import { Movie } from "app/page";
import useGetGenres from "hooks/useGetGenres";
import Image from "next/image";

async function getPosts(id: Number) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}`,
    { cache: "force-cache" },
  );
  const posts = await res.json();
  return posts;
}

export default async function MovieDetailPage({
  params,
}: {
  params: { id: Number };
}) {
  const movieDetails: Movie = await getPosts(params.id);

  const {
    title,
    release_date,
    overview,
    poster_path,
    original_title,
    vote_average,
    genres,
  } = movieDetails;

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

  return (
    <div className="flex justify-center">
      {/* LEFT SIDE */}
      <div className="w-full bg-red-50">
        <Image
          src={`https://image.tmdb.org/t/p/original${poster_path}`}
          alt={`${title}(${original_title})`}
          width={640}
          height={750}
          className="h-full w-full object-cover"
        />
      </div>
      {/* RIGHT SIDE */}
      <div className="mx-auto w-full bg-white p-6">
        <div className="mb-4 font-bold">
          <p className="">타이틀</p>
          <h1 className="text-4xl">{`${title}(${original_title})`}</h1>
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
        <div className="mb-4">
          <p className="font-bold">평가</p>
          <p>{vote_average}</p>
        </div>
        <div className="mb-4">
          <p className="font-bold">개봉일</p>
          <p>{formatDate(release_date)}</p>
        </div>
        <div className="mb-4">
          <p className="font-bold">줄거리</p>
          <p>{overview}</p>
        </div>
        <div className="w-full border-y-2 border-black p-8 text-center md:mt-0">
          누르면 이동합니다
        </div>
      </div>
    </div>
  );
}
