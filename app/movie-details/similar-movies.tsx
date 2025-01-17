import { MovieList } from "api/fetchNowPlayingMovies";
import TicketSwiper from "app/components/swiper/ticket-swiper";

export default function SimilarMovies({
  similarMovies,
}: {
  similarMovies: MovieList[];
}) {
  return (
    <section className="px-8 py-4 lg:p-8">
      <h2 className="mb-4 text-2xl font-bold text-white">
        이런 영화는 어때요?
      </h2>
      {similarMovies.length > 0 ? (
        <TicketSwiper movieList={similarMovies} />
      ) : (
        <div className="w-full text-gray-400">비슷한 영화가 없습니다</div>
      )}
    </section>
  );
}
