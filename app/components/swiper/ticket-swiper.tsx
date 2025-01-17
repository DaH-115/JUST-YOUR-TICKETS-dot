"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { MovieList } from "api/fetchNowPlayingMovies";
import SwiperCard from "app/components/swiper/swiper-card";
import SwiperButton from "app/components/swiper/swiper-button";

export default function TicketSwiper({
  movieList,
}: {
  movieList: MovieList[];
}) {
  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={10}
      speed={600}
      loop={true}
      navigation={false}
      modules={[Navigation]}
      breakpoints={{
        // 640px
        640: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        // 768px
        768: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        // 1024px
        1024: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        // 1280px
        1280: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
      }}
    >
      {movieList.map((movie, idx) => (
        <SwiperSlide key={movie.id}>
          <SwiperCard idx={idx} movie={movie} />
        </SwiperSlide>
      ))}
      <SwiperButton direction="prev" />
      <SwiperButton direction="next" />
    </Swiper>
  );
}
