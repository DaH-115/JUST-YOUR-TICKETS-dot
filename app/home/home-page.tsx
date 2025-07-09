"use client";

import dynamic from "next/dynamic";
import { HeroSection } from "app/home/components";
import LatestReviewsSkeleton from "app/home/components/reviews/LatestReviewsSkeleton";
import MovieSectionSkeleton from "app/home/components/MovieSectionSkeleton";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";

// 컴포넌트 지연 로딩
const MovieSection = dynamic(() => import("app/home/components/MovieSection"), {
  loading: () => <MovieSectionSkeleton />,
  ssr: false,
});

const LatestReviews = dynamic(
  () => import("app/home/components/reviews/LatestReviews"),
  {
    loading: () => <LatestReviewsSkeleton />,
    ssr: false,
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
    <>
      <HeroSection movie={recommendMovie} trailerKey={trailerKey} />

      <main className="px-4 md:px-6 lg:px-8">
        <MovieSection
          title="Now Playing"
          description="지금 상영 중인 영화들을 확인하고 티켓을 예매하세요"
          movieList={movieList}
          maxItems={10}
        />
        <MovieSection
          title="Trending Movies"
          description="요즘 가장 인기 있는 영화들을 만나보세요"
          movieList={trendingMovies}
        />
        <LatestReviews reviews={latestReviews} />
      </main>
    </>
  );
}
