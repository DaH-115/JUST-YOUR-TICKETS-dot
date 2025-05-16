"use client";

import React, { useMemo } from "react";
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
  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages],
  );

  const pageChangeHandler = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <nav
      aria-label="페이지 네비게이션"
      className="mt-16 flex justify-center gap-3 text-gray-200"
    >
      <button
        onClick={() => pageChangeHandler(1)}
        disabled={currentPage === 1}
        className={`${currentPage === 1 ? "hidden" : "block"}`}
      >
        처음
      </button>
      <button
        onClick={() => pageChangeHandler(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${currentPage === 1 ? "hidden" : "block"}`}
      >
        <FaArrowLeft />
      </button>
      {pageNumbers.map((p) => (
        <button
          key={p}
          onClick={() => pageChangeHandler(p)}
          aria-current={p === currentPage ? "page" : undefined}
          className="font-bold text-accent-300"
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => pageChangeHandler(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${currentPage === totalPages ? "hidden" : "block"}`}
      >
        <FaArrowRight />
      </button>
      <button
        onClick={() => pageChangeHandler(totalPages)}
        disabled={currentPage === totalPages}
        className={`${currentPage === totalPages ? "hidden" : "block"}`}
      >
        마지막
      </button>
    </nav>
  );
}
