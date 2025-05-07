"use client";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const pageChangeHandler = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <nav
      aria-label="페이지 네비게이션"
      className="mt-16 flex items-center justify-center space-x-4 text-white"
    >
      {/* First / Prev */}
      <button
        onClick={() => pageChangeHandler(1)}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
      >
        처음
      </button>
      <button
        onClick={() => pageChangeHandler(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 text-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FaArrowLeft />
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((p) => (
        <button
          key={p}
          onClick={() => pageChangeHandler(p)}
          className={`rounded-full px-3 py-1 text-sm transition-colors duration-300 ${
            p === currentPage
              ? "bg-accent-300 text-black"
              : "border border-white hover:bg-white hover:text-black"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Next / Last */}
      <button
        onClick={() => pageChangeHandler(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 text-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FaArrowRight />
      </button>
      <button
        onClick={() => pageChangeHandler(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
      >
        마지막
      </button>
    </nav>
  );
}
