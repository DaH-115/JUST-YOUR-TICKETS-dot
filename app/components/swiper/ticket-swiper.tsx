"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import SwiperButton from "app/components/swiper/swiper-button";
import SwiperCard from "app/components/swiper/swiper-card";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";

export default function TicketSwiper({
  movieList,
}: {
  movieList: MovieList[];
}) {
  return (
    <div className="pt-0">
      <Swiper
        speed={500}
        loop={true}
        navigation={false}
        modules={[Navigation]}
        breakpoints={{
          320: {
            slidesPerView: 2.5,
            spaceBetween: 8,
          },
          480: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 3.5,
            spaceBetween: 12,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 14,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 16,
          },
          1280: {
            slidesPerView: 6,
            spaceBetween: 18,
          },
          1440: {
            slidesPerView: 6.5,
            spaceBetween: 20,
          },
        }}
      >
        {movieList.map((movie, idx) => (
          <SwiperSlide key={movie.id} className="pt-8">
            <SwiperCard idx={idx} movie={movie} />
          </SwiperSlide>
        ))}
        <SwiperButton direction="prev" />
        <SwiperButton direction="next" />
      </Swiper>
    </div>
  );
}
