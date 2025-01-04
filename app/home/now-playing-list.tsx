import { memo, useMemo } from "react";
import { Movie } from "api/fetchNowPlayingMovies";
import { MdLocalMovies } from "react-icons/md";
import TicketSwiper from "app/ui/ticket-swiper";

const NowPlayingHeader = memo(function NowPlayingHeader() {
  return (
    <div>
      <div className="flex items-start justify-between md:justify-start">
        <h2 className="text-4xl font-black text-[#D4AF37] lg:text-5xl">
          Now
          <br />
          Playing
        </h2>
        <div className="ml-2 rounded-full bg-white p-2 transition-colors duration-300 hover:bg-black hover:text-white">
          <MdLocalMovies className="text-2xl" />
        </div>
      </div>
      <p className="pt-2 text-base text-gray-300 lg:pt-6">
        현재 상영 중인 영화들을 확인해 보세요
      </p>
    </div>
  );
});

// 메인 컴포넌트
function NowPlayingList({ movieList }: { movieList: Movie[] }) {
  const slicedMovieList = useMemo(() => movieList.slice(0, 10), [movieList]);

  return (
    <section
      id="now-playing"
      className="relative z-10 w-full px-4 pb-12 pt-8 lg:px-8"
    >
      <NowPlayingHeader />
      <TicketSwiper movieList={slicedMovieList} />
    </section>
  );
}

export default memo(NowPlayingList);
