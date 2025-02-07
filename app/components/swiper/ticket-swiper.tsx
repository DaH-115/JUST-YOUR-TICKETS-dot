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
      speed={600}
      loop={true}
      navigation={false}
      modules={[Navigation]}
      breakpoints={{
        320: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
        1280: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
      }}
    >
      {movieList.map((movie, idx) => (
        <SwiperSlide className="md:p-2" key={movie.id}>
          <SwiperCard idx={idx} movie={movie} />
        </SwiperSlide>
      ))}
      <SwiperButton direction="prev" />
      <SwiperButton direction="next" />
    </Swiper>
  );
}
