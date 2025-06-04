"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "store/redux-toolkit/hooks";
import MyTicketHeader from "app/my-page/components/MyTicketPageHeader";
import SearchForm from "app/components/SearchForm";
import Loading from "app/loading";
import ReviewTicket from "app/components/reviewTicket/ReviewTicket";
import EmptyState from "app/my-page/components/EmptyState";
import Pagination from "app/components/Pagination";
import { buildQueryUrl } from "app/my-page/utils/buildQueryUrl";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";

interface TicketListLayoutProps {
  header: {
    title: string;
    content: string;
  };
  placeholder: string;
  useFetchReviews: (args: {
    uid: string;
    search: string;
    page: number;
    pageSize: number;
  }) => {
    reviews: ReviewDoc[];
    totalPages: number;
    loading: boolean;
    error: string | null;
  };
}

export default function TicketListLayout({
  header,
  placeholder,
  useFetchReviews,
}: TicketListLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const currentPage = parseInt(params.get("page") || "1", 10);
  const searchTerm = params.get("search") || "";
  const uid = useAppSelector((state) => state.userData.auth?.uid) || "";

  const { reviews, totalPages, loading, error } = useFetchReviews({
    uid,
    search: searchTerm,
    page: currentPage,
    pageSize: 10,
  });

  const searchHandler = (term: string) => {
    const url = buildQueryUrl({
      pathname,
      params: { uid, search: term, page: 1 },
    });
    router.replace(url);
  };

  const pageChangeHandler = (page: number) => {
    const url = buildQueryUrl({
      pathname,
      params: { uid, search: searchTerm, page },
    });
    router.push(url);
  };

  return (
    <main className="w-full">
      {/* 헤더 */}
      <MyTicketHeader
        title={header.title}
        content={header.content}
        reviewsCount={reviews.length}
      />

      {/* 검색 폼 */}
      <div className="my-8 flex justify-end">
        <SearchForm placeholder={placeholder} onSearch={searchHandler} />
      </div>

      {/* 리뷰 리스트 */}
      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-red-500">오류: {error}</p>
      ) : reviews.length > 0 ? (
        <ReviewTicket reviews={reviews} />
      ) : (
        <EmptyState message="리뷰가 없습니다" />
      )}

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={pageChangeHandler}
      />
    </main>
  );
}
