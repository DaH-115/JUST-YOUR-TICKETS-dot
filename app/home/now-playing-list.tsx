import { Movie } from "api/fetchNowPlayingMovies";
import { MdLocalMovies } from "react-icons/md";
import TicketSwiper from "app/ticket-swiper";

export default function NowPlayingList({ movieList }: { movieList: Movie[] }) {
  return (
    <section
      id="now-playing"
      className="relative z-10 mb-12 w-full px-4 pt-8 lg:px-8 lg:py-12"
    >
      <div className="mb-4 lg:mb-8">
        <div className="flex items-start justify-between lg:justify-start">
          <h2 className="text-4xl font-black lg:text-5xl">
            Now
            <br />
            Playing
          </h2>
          <div className="ml-2 rounded-full border-2 border-black bg-white p-2 transition-colors duration-300 hover:bg-gray-300 hover:text-white">
            <MdLocalMovies className="text-2xl lg:text-3xl" />
          </div>
        </div>
        <div>
          <p className="pt-2 text-base text-black lg:pt-6 lg:text-xl">
            현재 상영 중인 영화들을 확인해 보세요
          </p>
        </div>
      </div>
      <div className="px-4">
        <TicketSwiper movieList={movieList.slice(0, 10)} />
      </div>
    </section>
  );
}
