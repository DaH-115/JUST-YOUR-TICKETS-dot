"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Review } from "api/reviews/fetchReviews";
import useReviewSearch from "hooks/useReviewSearch";
import MyTicketHeader from "app/my-page/my-ticket-list/components/MyTicketPageHeader";
import MyTicketList from "app/my-page/my-ticket-list/components/MyTicketList";

interface MyTicketListPageProps {
  uid: string;
  userReviews: Review[];
}

export default function MyTicketListPage({
  userReviews,
  uid,
}: MyTicketListPageProps) {
  // 현재 사용자의 리뷰만 필터링
  const myTicketList = userReviews.filter((review) => review.uid === uid);
  // 검색 폼 설정
  const { register, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });
  // 검색 기능 설정
  const { filteredUserReviews, searchReviewsHandler } =
    useReviewSearch(myTicketList);
  const searchTerm = watch("search");

  // 검색어 변경 시 검색 실행
  useEffect(() => {
    searchReviewsHandler(searchTerm);
  }, [searchTerm, searchReviewsHandler]);

  // 표시할 리뷰 목록 결정
  const displayReviews =
    filteredUserReviews.length > 0 ? filteredUserReviews : myTicketList;

  return (
    <div className="flex w-full flex-col p-8 pb-16 pt-4 lg:flex-row">
      <main className="flex w-full flex-col">
        <MyTicketHeader
          ticketCount={filteredUserReviews.length}
          register={register}
        />
        <div className="h-full w-full">
          <MyTicketList reviews={displayReviews} />
        </div>
      </main>
    </div>
  );
}
