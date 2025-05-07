"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Review } from "api/reviews/fetchReviews";
import useReviewSearch from "hooks/useReviewSearch";
import ReviewSearchInput from "app/components/reviewTicket/ReviewSearchInput";
import ReviewTicket from "app/components/reviewTicket/ReviewTicket";
import Pagination from "app/components/Pagination";
import EmptyState from "app/my-page/components/EmptyState";

type FormValues = { search: string };

interface TicketListPageProps {
  initialReviews: Review[];
  currentPage: number;
  totalPages: number;
}

export default function TicketListPage({
  initialReviews,
  currentPage,
  totalPages,
}: TicketListPageProps) {
  const [reviews] = useState<Review[]>(initialReviews);
  const { register, watch } = useForm<FormValues>({
    defaultValues: { search: "" },
  });
  const searchTerm = watch("search");
  const { filteredReviews, searchReviewsHandler } = useReviewSearch(reviews);
  const displayed = searchTerm ? filteredReviews : reviews;

  // 검색어 변경 시 필터 적용
  useEffect(() => {
    searchReviewsHandler(searchTerm);
  }, [searchTerm, searchReviewsHandler]);

  // 페이지 변경 시 URL 동기화
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onPageChange = (newPage: number) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col p-8">
      <main className="w-full flex-1">
        <section className="flex w-full flex-col items-center pb-8 md:flex-row">
          <div className="mb-4 flex w-full items-center text-white md:mb-0">
            <h1 className="text-2xl font-bold">ALL TICKET LIST</h1>
            <span className="md:px-4">
              <span className="ml-2 font-bold text-accent-300">
                {displayed.length}장
              </span>
            </span>
          </div>
          <ReviewSearchInput
            label="티켓 검색"
            register={register}
            placeholder="티켓 검색"
          />
        </section>

        {displayed.length > 0 ? (
          <ReviewTicket reviews={displayed} />
        ) : (
          <EmptyState message="등록된 리뷰 티켓이 없습니다" />
        )}
      </main>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
