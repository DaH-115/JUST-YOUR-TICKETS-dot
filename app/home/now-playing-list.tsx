import { memo, useMemo } from "react";
import { MovieList } from "api/fetchNowPlayingMovies";
import TicketSwiper from "app/components/swiper/ticket-swiper";

function NowPlayingList({ movieList }: { movieList: MovieList[] }) {
  const slicedMovieList = useMemo(() => movieList.slice(0, 10), [movieList]);

  return (
    <section className="px-4 py-8 md:p-8">
      {/* SECTION TITLE */}
      <div className="sr-only">
        <h2>Now Playing</h2>
        <p>{"티켓으로 만들 영화를 찾아보세요."}</p>
      </div>
      {/* SECTION CONTENTS */}
      <TicketSwiper movieList={slicedMovieList} />
    </section>
  );
}

export default memo(NowPlayingList);
