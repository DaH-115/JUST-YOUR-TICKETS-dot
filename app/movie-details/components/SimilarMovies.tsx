import TicketSwiper from "app/components/swiper/ticket-swiper";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";

export default function SimilarMovies({
  similarMovies,
}: {
  similarMovies: MovieList[];
}) {
  return (
    <section className="p-8">
      <h2 className="mb-2 text-2xl font-bold tracking-tight text-white">
        Similar Movies
      </h2>
      <p className="text-sm text-gray-300">이런 영화는 어떠세요</p>
      {/* 비슷한 영화 목록 */}
      {similarMovies.length > 0 ? (
        <TicketSwiper movieList={similarMovies} />
      ) : (
        <div className="w-full text-gray-400">비슷한 영화가 없습니다</div>
      )}
    </section>
  );
}
