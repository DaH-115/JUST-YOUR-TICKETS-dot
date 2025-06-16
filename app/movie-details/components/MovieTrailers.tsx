"use client";

import { useState, useEffect } from "react";
import { MovieTrailer } from "lib/movies/fetchVideosMovies";
import VideoPlayer from "app/components/VideoPlayer";
import { createOptimizedResizeHandler } from "app/utils/performanceOptimization";

export default function AllMovieTrailers({
  movieTrailer,
}: {
  movieTrailer: MovieTrailer[];
}) {
  const [showAll, setShowAll] = useState(false);
  const [currentItemsPerRow, setCurrentItemsPerRow] = useState(4);

  // Tailwind CSS 브레이크포인트 상수
  const BREAKPOINTS = {
    sm: 640, // 태블릿
    md: 768, // 중간 태블릿
    lg: 1024, // 데스크톱
    xl: 1280, // 대형 데스크톱
    "2xl": 1536, // 초대형 화면
  } as const;

  // 화면 크기에 따른 한 줄 개수 계산 (Tailwind 브레이크포인트 기준)
  useEffect(() => {
    const updateItemsPerRow = createOptimizedResizeHandler((width) => {
      let newItemsPerRow;

      if (width < BREAKPOINTS.sm) {
        // sm 미만 (모바일)
        newItemsPerRow = 1;
      } else if (width < BREAKPOINTS.lg) {
        // sm 이상 lg 미만 (태블릿)
        newItemsPerRow = 2;
      } else if (width < BREAKPOINTS.xl) {
        // lg 이상 xl 미만 (데스크톱)
        newItemsPerRow = 3;
      } else {
        // xl 이상 (대형 화면)
        newItemsPerRow = 4;
      }

      if (newItemsPerRow !== currentItemsPerRow) {
        setCurrentItemsPerRow(newItemsPerRow);
      }
    });

    // 초기 설정
    updateItemsPerRow();

    // 리사이즈 이벤트 리스너
    window.addEventListener("resize", updateItemsPerRow, { passive: true });

    return () => window.removeEventListener("resize", updateItemsPerRow);
  }, [currentItemsPerRow]);

  const shouldShowMoreButton = movieTrailer.length > currentItemsPerRow;
  const displayedTrailers = showAll
    ? movieTrailer
    : movieTrailer.slice(0, currentItemsPerRow);

  return (
    <section className="px-8 py-12 lg:px-12 lg:py-16">
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-white">
          Movie Trailers
        </h2>
        <p className="text-sm text-gray-300">이 영화의 예고편을 확인해보세요</p>
      </div>

      {movieTrailer.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedTrailers.map((trailer) => (
              <div key={trailer.id} className="aspect-video">
                <VideoPlayer trailerKey={trailer.key} />
              </div>
            ))}
          </div>

          {shouldShowMoreButton && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="rounded-full bg-white/10 px-6 py-3 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {showAll ? (
                  <>
                    <span>접기</span>
                    <span className="ml-2">↑</span>
                  </>
                ) : (
                  <>
                    <span>
                      더보기 ({movieTrailer.length - currentItemsPerRow}개 더)
                    </span>
                    <span className="ml-2">↓</span>
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="w-full text-gray-400">등록된 예고편이 없습니다</p>
      )}
    </section>
  );
}
