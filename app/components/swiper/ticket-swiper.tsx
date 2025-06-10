"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { MovieList } from "lib/movies/fetchNowPlayingMovies";
import SwiperCard from "app/components/swiper/swiper-card";
import SwiperButton from "app/components/swiper/swiper-button";

export default function TicketSwiper({
  movieList,
}: {
  movieList: MovieList[];
}) {
  return (
    <div className="pt-2">
      <Swiper
        speed={500}
        loop={true}
        navigation={false}
        modules={[Navigation]}
        breakpoints={{
          320: {
            slidesPerView: 2,
            spaceBetween: 8,
          },
          480: {
            slidesPerView: 2.5,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 12,
          },
          768: {
            slidesPerView: 3.5,
            spaceBetween: 14,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 16,
          },
          1280: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
        }}
      >
        {movieList.map((movie, idx) => (
          <SwiperSlide key={movie.id} className="pt-2">
            <SwiperCard idx={idx} movie={movie} />
          </SwiperSlide>
        ))}
        <SwiperButton direction="prev" />
        <SwiperButton direction="next" />
      </Swiper>
    </div>
  );
}
