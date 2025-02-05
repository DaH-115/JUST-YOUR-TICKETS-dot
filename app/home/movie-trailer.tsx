import { RiMovieLine } from "react-icons/ri";
import VideoPlayer from "app/components/video-player";

export default function MovieTrailer({ trailerKey }: { trailerKey: string }) {
  return (
    <section
      id="movie-trailer"
      className="relative z-10 w-full bg-[#121212] pb-8 pt-12 lg:py-12"
    >
      <div className="mb-4 px-4 lg:mb-8 lg:px-8">
        <div className="flex items-start justify-between md:justify-start">
          <h2 className="text-4xl font-black text-accent-300 lg:text-5xl">
            Movie
            <br />
            Trailer
          </h2>
          <div className="ml-2 rounded-full bg-white p-2 text-primary-500">
            <RiMovieLine className="text-2xl" />
          </div>
        </div>
        <p className="pt-1 text-sm text-gray-300 lg:pt-4">
          이 영화의 예고편을 확인해 보세요
        </p>
      </div>

      <div className="mx-auto aspect-video w-full md:w-4/6">
        <VideoPlayer trailerKey={trailerKey} thubmnailSize={"large"} />
      </div>
    </section>
  );
}
