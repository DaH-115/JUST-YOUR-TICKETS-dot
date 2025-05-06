"use client";

import { useState, useEffect } from "react";

const ScrollToTopBtn = () => {
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  useEffect(() => {
    const scrollHandler = () => {
      if (window.scrollY > 300) {
        setShowScrollTopButton(true);
      } else {
        setShowScrollTopButton(false);
      }
    };

    window.addEventListener("scroll", scrollHandler);

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
      className={`fixed bottom-10 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full border border-white bg-primary-700 text-xs font-bold text-white shadow-lg transition-all duration-300 hover:bg-white hover:text-black md:h-20 md:w-20 lg:right-10 lg:text-base ${
        showScrollTopButton
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-5 opacity-0"
      }`}
    >
      Top
    </button>
  );
};

export default ScrollToTopBtn;
