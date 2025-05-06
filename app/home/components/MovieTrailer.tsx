import VideoPlayer from "app/components/VideoPlayer";

export default function MovieTrailer({ trailerKey }: { trailerKey: string }) {
  return (
    <section className="py-8">
      {/* SECTION TITLE */}
      <div className="pb-8 pt-6">
        <h2 className="text-5xl font-bold text-accent-300 lg:text-6xl">
          Movie
          <br />
          Trailer
        </h2>
        <p className="mt-4 text-white">이 영화의 예고편을 확인해보세요.</p>
      </div>
      {/* SECTION CONTETNS */}
      <div className="mx-auto aspect-video w-full md:w-4/6">
        <VideoPlayer trailerKey={trailerKey} thubmnailSize={"large"} />
      </div>
    </section>
  );
}
