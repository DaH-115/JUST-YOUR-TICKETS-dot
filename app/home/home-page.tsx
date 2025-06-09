import { MovieList } from "lib/movies/fetchNowPlayingMovies";
import Background from "app/ui/layout/Background";
import {
  RecommendMovie,
  MovieSection,
  MovieTrailer,
  LatestReviews,
} from "app/home/components";
import ScrollToTopBtn from "app/components/ScrollToTopBtn";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";

interface HomePageProps {
  movieList: MovieList[];
  recommendMovie: MovieList;
  trailerKey: string;
  trendingMovies: MovieList[];
  latestReviews: ReviewDoc[];
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
        <Background imageUrl={recommendMovie.backdrop_path} />
      )}
      <main className="p-4 md:p-8">
        <MovieSection
          title="Now Playing"
          description="티켓으로 만들 영화를 찾아보세요."
          movieList={movieList}
        />
        <MovieSection
          title="Trending Movies"
          description="요즘 뜨는 영화를 확인해보세요."
          movieList={trendingMovies}
        />
        <RecommendMovie currentMovie={recommendMovie} />
        {trailerKey && <MovieTrailer trailerKey={trailerKey} />}
        <LatestReviews reviews={latestReviews} />
      </main>
      <ScrollToTopBtn />
    </>
  );
}
