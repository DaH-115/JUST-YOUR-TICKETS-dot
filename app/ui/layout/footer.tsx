"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  const borderStyle =
    "border-b-2 border-transparent transition duration-300 hover:border-white";

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;

      if (windowHeight + scrollTop >= documentHeight - 10) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible]);

  return (
    <footer className="w-full bg-black px-8 pb-8 pt-4 text-white lg:py-12">
      <div className="pb-8">JUST YOUR TICKETS.</div>
      <div className="flex justify-between space-x-2 text-xs lg:text-sm">
        <div className="w-full space-y-1 border-l-2 border-dotted border-gray-500 pl-4">
          <Link
            href="https://zippy-position-4e4.notion.site/Dahyun-Gwak-45235441d63641798c44ee9d7ed607f5"
            className={`block p-1 font-bold ${borderStyle}`}
          >
            Resume
          </Link>
          <Link
            href="https://github.com/DaH-115/JUST-MOVIE-TICKETS-dot"
            className={`block p-1 ${borderStyle}`}
          >
            Github
          </Link>
        </div>
        <div className="w-full border-l-2 border-dotted border-gray-500 pl-4">
          <ul className="space-y-1">
            <li className={borderStyle}>
              <Link href="/" className="block p-1">
                Home
              </Link>
            </li>
            <li className={borderStyle}>
              <Link href="/search" className="block p-1">
                Search
              </Link>
            </li>
            <li className={borderStyle}>
              <Link href="/ticket-list" className="block p-1">
                Ticket List
              </Link>
            </li>
          </ul>
        </div>
        <div className={`w-full border-l-2 border-dotted border-gray-500 pl-4`}>
          <div
            className={`text-xs font-bold transition-transform duration-700 ${
              isVisible ? "translate-y-0" : "translate-y-full"
            }`}
          >
            {`ⓒGWAK DA HYUN 2022 - ${new Date().getFullYear()}`}
          </div>
        </div>
      </div>
    </footer>
  );
}
