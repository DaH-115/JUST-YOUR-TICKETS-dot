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
      className={`absolute top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black text-white shadow-md transition-all duration-300 ease-in-out hover:scale-110 hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 ${direction === "prev" ? "left-4" : "right-4"}`}
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
