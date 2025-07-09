import { HeroSection, MovieSection, LatestReviews } from "app/home/components";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";
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
      {/* Hero Section - 추천 영화와 트레일러 통합 */}
      <HeroSection movie={recommendMovie} trailerKey={trailerKey} />

      {/* Main Content */}
      <main className="px-4 md:px-6 lg:px-8">
        {/* Now Playing */}
        <MovieSection
          title="Now Playing"
          description="지금 상영 중인 영화들을 확인하고 티켓을 예매하세요"
          movieList={movieList}
        />

        {/* Trending Movies */}
        <MovieSection
          title="Trending Movies"
          description="요즘 가장 인기 있는 영화들을 만나보세요"
          movieList={trendingMovies}
        />

        {/* Latest Reviews */}
        <LatestReviews reviews={latestReviews} />
      </main>
    </>
  );
}
