import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useSwiper } from "swiper/react";

interface SliderButtonProps {
  direction: "next" | "prev";
}

export default function SliderButton({ direction }: SliderButtonProps) {
  const swiper = useSwiper();

  return (
    <button
      onClick={() =>
        direction === "next" ? swiper.slideNext() : swiper.slidePrev()
      }
      className={`absolute top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black text-white shadow-md transition-all duration-300 ease-in-out hover:scale-110 hover:bg-white hover:text-black focus:outline-none ${direction === "prev" ? "left-4" : "right-4"} `}
      aria-label={direction === "next" ? "다음 슬라이드" : "이전 슬라이드"}
    >
      {direction === "next" ? <FaArrowRight /> : <FaArrowLeft />}
    </button>
  );
}
