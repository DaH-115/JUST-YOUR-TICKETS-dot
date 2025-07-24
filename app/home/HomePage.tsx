"use client";

import dynamic from "next/dynamic";
import { RecommendSection, MovieSection } from "app/home/components";
import LatestReviewSkeleton from "app/home/components/reviews/LatestReviewSkeleton";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";

// 컴포넌트 지연 로딩
const LatestReviewList = dynamic(
  () => import("app/home/components/reviews/LatestReviewList"),
  {
    loading: () => <LatestReviewSkeleton />,
  },
);

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
    <main className="px-4 md:px-6 lg:px-8">
      <MovieSection
        title="Now Playing"
        description="지금 상영 중인 영화들을 확인하고 티켓을 예매하세요"
        movieList={movieList}
        maxItems={10}
      />
      <RecommendSection movie={recommendMovie} trailerKey={trailerKey} />
      <MovieSection
        title="Trending Movies"
        description="요즘 가장 인기 있는 영화들을 만나보세요"
        movieList={trendingMovies}
      />
      <LatestReviewList reviews={latestReviews} />
    </main>
  );
}
