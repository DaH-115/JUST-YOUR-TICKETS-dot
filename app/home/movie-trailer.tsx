import { RiMovieLine } from "react-icons/ri";

export default function MovieTrailer({
  trailerKey,
  movieTitle,
}: {
  trailerKey: string;
  movieTitle: string;
}) {
  return (
    <section id="movie-trailer" className="relative z-10 w-full py-12">
      <div className="mb-4 px-4 lg:mb-8 lg:px-8">
        <div className="flex items-start justify-between lg:justify-start">
          <h2 className="text-4xl font-black lg:text-5xl">
            Movie
            <br />
            Trailer
          </h2>
          <div className="ml-2 rounded-full border border-black bg-white p-2 transition-colors duration-300 hover:bg-black hover:text-white">
            <RiMovieLine className="text-2xl lg:text-3xl" />
          </div>
        </div>
        <p className="pt-1 text-base text-black lg:pt-6 lg:text-xl">
          이 영화의 예고편을 확인해 보세요
        </p>
      </div>

      <div className="mx-auto aspect-video w-full md:w-4/6">
        <iframe
          src={`https://www.youtube.com/embed/${trailerKey}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
          title={movieTitle}
        />
      </div>
    </section>
  );
}
