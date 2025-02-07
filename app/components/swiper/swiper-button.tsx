import { useSwiper } from "swiper/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function SwiperButton({
  direction,
}: {
  direction: "next" | "prev";
}) {
  const swiper = useSwiper();
  const ariaLabel = direction === "next" ? "다음 슬라이드" : "이전 슬라이드";

  return (
    <button
      onClick={() =>
        direction === "next" ? swiper.slideNext() : swiper.slidePrev()
      }
      className={`absolute top-1/2 z-50 hidden -translate-y-1/2 items-center justify-center rounded-full border border-black bg-white p-3 text-sm text-primary-500 shadow-md transition-all duration-300 ease-in-out hover:scale-110 focus:border-none focus:outline-none focus:ring-2 focus:ring-accent-300 md:flex ${direction === "prev" ? "left-4" : "right-4"}`}
      aria-label={ariaLabel}
    >
      {direction === "next" ? (
        <FaArrowRight aria-hidden />
      ) : (
        <FaArrowLeft aria-hidden />
      )}
    </button>
  );
}
