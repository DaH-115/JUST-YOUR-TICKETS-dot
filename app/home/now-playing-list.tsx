import { memo, useMemo } from "react";
import { MovieList } from "api/fetchNowPlayingMovies";
import { MdLocalMovies } from "react-icons/md";
import TicketSwiper from "app/components/swiper/ticket-swiper";

function NowPlayingList({ movieList }: { movieList: MovieList[] }) {
  const slicedMovieList = useMemo(() => movieList.slice(0, 10), [movieList]);

  return (
    <section id="now-playing" className="relative p-4 md:py-8">
      <div className="mb-6 md:px-8">
        <div className="flex items-start justify-between md:justify-start">
          <h2 className="text-4xl font-black text-accent-300 lg:text-5xl">
            Now
            <br />
            Playing
          </h2>
          <div className="ml-2 rounded-full bg-white p-2 text-primary-500">
            <MdLocalMovies className="text-2xl" />
          </div>
        </div>
        <p className="pt-2 text-base text-gray-300 lg:pt-6">
          현재 상영 중인 영화들을 확인해 보세요
        </p>
      </div>
      <TicketSwiper movieList={slicedMovieList} />
    </section>
  );
}

export default memo(NowPlayingList);
