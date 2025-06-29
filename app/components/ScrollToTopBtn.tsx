"use client";

import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import { createOptimizedScrollHandler } from "app/utils/performanceOptimization";

const ScrollToTopBtn = () => {
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  useEffect(() => {
    const scrollHandler = createOptimizedScrollHandler((scrollY) => {
      setShowScrollTopButton(scrollY > 300);
    });

    window.addEventListener("scroll", scrollHandler, { passive: true });

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const scrollToTopHandler = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTopHandler}
      className={`fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:from-primary-700 hover:to-primary-800 hover:shadow-xl focus:outline-none focus:ring-1 focus:ring-accent-300 focus:ring-offset-1 sm:bottom-8 sm:right-6 md:h-16 md:w-16 lg:right-10 ${
        showScrollTopButton
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-5 opacity-0"
      }`}
      aria-label="맨 위로 스크롤"
    >
      <div className="flex flex-col items-center">
        <FaArrowUp className="text-lg md:text-xl" />
        <span className="text-xs font-medium">TOP</span>
      </div>
    </button>
  );
};

export default ScrollToTopBtn;
