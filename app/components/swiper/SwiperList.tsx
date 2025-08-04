"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Navigation } from "swiper/modules";
import SwiperButton from "app/components/swiper/SwiperButton";
import SwiperItem from "app/components/swiper/SwiperItem";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";

// SwiperList용 스켈레톤 컴포넌트
function SwiperListSkeleton() {
  const skeletonItems = Array.from({ length: 8 });

  return (
    <div className="w-full">
      <div className="relative">
        {/* 스켈레톤 아이템들 */}
        <div className="flex gap-3 overflow-hidden pt-8 md:gap-4 lg:gap-5">
          {skeletonItems.map((_, i) => (
            <div
              key={i}
              className="w-[140px] flex-shrink-0 sm:w-[150px] md:w-[160px] lg:w-[180px] xl:w-[200px] 2xl:w-[220px]"
            >
              <div className="flex w-full flex-col">
                {/* 포스터 영역 (실제 SwiperCard와 동일한 비율) */}
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl">
                  <div className="absolute inset-0 animate-pulse bg-gray-600"></div>
                  {/* 랭킹 번호 스켈레톤 */}
                  <div className="absolute left-2 top-2 z-10 h-8 w-8 animate-pulse rounded-full bg-gray-500"></div>
                </div>

                {/* 정보 카드 영역 */}
                <div className="mt-3 space-y-2">
                  {/* 제목 영역 */}
                  <div className="space-y-1">
                    <div className="h-4 w-full animate-pulse rounded bg-gray-600"></div>
                    <div className="h-3 w-3/4 animate-pulse rounded bg-gray-600"></div>
                  </div>

                  {/* 평점 및 장르 영역 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <div className="h-3 w-3 animate-pulse rounded bg-gray-600"></div>
                      <div className="h-3 w-8 animate-pulse rounded bg-gray-600"></div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="h-3 w-6 animate-pulse rounded bg-gray-600"></div>
                      <div className="h-3 w-8 animate-pulse rounded bg-gray-600"></div>
                    </div>
                  </div>

                  {/* 버튼 영역 */}
                  <div className="h-8 w-full animate-pulse rounded-lg bg-gray-600"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 네비게이션 버튼 스켈레톤 */}
        <div className="absolute left-2 top-1/2 h-10 w-10 -translate-y-1/2 animate-pulse rounded-full bg-gray-600 opacity-50"></div>
        <div className="absolute right-2 top-1/2 h-10 w-10 -translate-y-1/2 animate-pulse rounded-full bg-gray-600 opacity-50"></div>
      </div>
    </div>
  );
}

export default function SwiperList({ movieList }: { movieList: MovieList[] }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트된 후 바로 로드 완료
    setIsLoaded(true);
  }, []);

  // 로딩 중일 때 스켈레톤 표시
  if (!isLoaded) {
    return <SwiperListSkeleton />;
  }

  return (
    <Swiper
      speed={500}
      loop={true}
      navigation={false}
      modules={[Navigation]}
      breakpoints={{
        320: {
          slidesPerView: 2.5,
        },
        480: {
          slidesPerView: 3,
        },
        640: {
          slidesPerView: 3.5,
        },
        768: {
          slidesPerView: 4,
        },
        1024: {
          slidesPerView: 5,
        },
        1280: {
          slidesPerView: 6,
        },
        1440: {
          slidesPerView: 6.5,
        },
      }}
    >
      {movieList.map((movie, idx) => (
        <SwiperSlide key={movie.id} className="px-2 pt-6">
          <SwiperItem idx={idx} movie={movie} />
        </SwiperSlide>
      ))}
      <SwiperButton direction="prev" />
      <SwiperButton direction="next" />
    </Swiper>
  );
}
