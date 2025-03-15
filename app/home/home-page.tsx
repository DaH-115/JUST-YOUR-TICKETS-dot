import { MovieList } from "api/fetchNowPlayingMovies";
import { Review } from "api/reviews/fetchUserReviews";
import BackGround from "app/ui/layout/BackGround";
import RecommendMovie from "app/home/components/RecommendMovie";
import NowPlayingList from "app/home/components/NowPlayingList";
import MovieTrailer from "app/home/components/MovieTrailer";
import TrendingMovies from "app/home/components/trending/TrendingMovies";
import LatestReviews from "app/home/components/reviews/LatestReviews";
import ScrollToTopBtn from "app/components/ScrollToTopBtn";

interface HomePageProps {
  movieList: MovieList[];
  recommendMovie: MovieList;
  trailerKey: string;
  trendingMovies: MovieList[];
  latestReviews: Review[];
}

export default function HomePage({
  movieList,
  recommendMovie,
  trailerKey,
  trendingMovies,
  latestReviews,
}: HomePageProps) {
  return (
    <>
      {recommendMovie?.backdrop_path && (
        <BackGround imageUrl={recommendMovie.backdrop_path} />
      )}
      <main className="p-8">
        <h1 className="mb-4 text-center text-4xl font-bold text-white">
          Just Movie Tickets
        </h1>
        <NowPlayingList movieList={movieList} />
        <TrendingMovies trendingMovies={trendingMovies} />
        <RecommendMovie currentMovie={recommendMovie} />
        {trailerKey && <MovieTrailer trailerKey={trailerKey} />}
        <LatestReviews reviews={latestReviews} />
      </main>
      <ScrollToTopBtn />
    </>
  );
}
