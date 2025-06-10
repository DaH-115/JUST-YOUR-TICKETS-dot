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

interface FetchReviewsHook {
  reviews: ReviewDoc[];
  totalPages: number;
  loading: boolean;
  error: string | null;
  removeReview?: (reviewId: string) => void;
}

interface FetchReviewsArgs {
  uid: string;
  search: string;
  page: number;
  pageSize: number;
}

interface TicketListLayoutProps {
  header: {
    title: string;
    content: string;
  };
  placeholder: string;
  useFetchReviews: (args: FetchReviewsArgs) => FetchReviewsHook;
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

  const fetchResult = useFetchReviews({
    uid,
    search: searchTerm,
    page: currentPage,
    pageSize: 10,
  });

  const { reviews, totalPages, loading, error } = fetchResult;
  const removeReview =
    "removeReview" in fetchResult ? fetchResult.removeReview : undefined;

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

  const handleLikeToggled = (reviewId: string, isLiked: boolean) => {
    // 좋아요 취소 시에만 목록에서 제거 (좋아요한 리뷰 페이지에서만)
    if (!isLiked && removeReview) {
      removeReview(reviewId);
    }
  };

  return (
    <main className="flex min-h-full w-full flex-col pl-0 md:w-3/4 md:pl-4">
      {/* 헤더 */}
      <MyTicketHeader
        title={header.title}
        content={header.content}
        reviewsCount={reviews.length}
      />

      {/* 검색 폼 & 결과 정보 */}
      <div className="my-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          {searchTerm && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">"{searchTerm}"</span> 검색 결과:
              {reviews.length}개
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <SearchForm placeholder={placeholder} onSearch={searchHandler} />
        </div>
      </div>

      {/* 리뷰 리스트 */}
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <p className="font-medium text-red-600">오류가 발생했습니다</p>
          <p className="mt-1 text-sm text-red-500">{error}</p>
        </div>
      ) : reviews.length > 0 ? (
        <ReviewTicket reviews={reviews} onLikeToggled={handleLikeToggled} />
      ) : (
        <EmptyState
          message={
            searchTerm
              ? `"${searchTerm}"에 대한 검색 결과가 없습니다`
              : "리뷰가 없습니다"
          }
        />
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
