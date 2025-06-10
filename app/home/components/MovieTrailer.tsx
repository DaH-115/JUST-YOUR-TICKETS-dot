import VideoPlayer from "app/components/VideoPlayer";

export default function MovieTrailer({ trailerKey }: { trailerKey: string }) {
  return (
    <section className="py-12 md:py-8">
      {/* SECTION TITLE */}
      <div className="pb-6 md:pb-8">
        <div className="mb-2 flex items-center space-x-3">
          <div className="flex space-x-1">
            <div className="h-2 w-2 rounded-full bg-accent-300"></div>
            <div className="h-2 w-2 rounded-full bg-accent-300"></div>
            <div className="h-2 w-2 rounded-full bg-accent-300"></div>
            <div className="h-2 w-2 rounded-full bg-accent-300"></div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Movie Trailer
          </h2>
        </div>
        <p className="ml-11 text-sm text-gray-300">
          이 영화의 예고편을 확인해보세요.
        </p>
      </div>
      {/* SECTION CONTETNS */}
      <div className="mx-auto aspect-video w-full md:w-4/6">
        <VideoPlayer trailerKey={trailerKey} thumbnailSize={"large"} />
      </div>
    </section>
  );
}
