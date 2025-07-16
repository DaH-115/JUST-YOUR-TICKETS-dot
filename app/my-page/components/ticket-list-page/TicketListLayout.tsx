"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Pagination from "app/components/Pagination";
import ReviewTicket from "app/components/reviewTicket/ReviewTicket";
import SearchSection from "app/components/SearchSection";
import Loading from "app/loading";
import EmptyState from "app/my-page/components/EmptyState";
import MyTicketHeader from "app/my-page/components/MyTicketPageHeader";
import { buildQueryUrl } from "app/my-page/utils/buildQueryUrl";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { selectUser } from "store/redux-toolkit/slice/userSlice";

interface FetchReviewsHook {
  reviews: ReviewDoc[];
  totalPages: number;
  loading: boolean;
  error: string | null;
  removeReview?: (reviewId: string) => void;
  updateReviewLikeCount?: (reviewId: string, newLikeCount: number) => void;
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
  useFetchReviews: (args: FetchReviewsArgs) => FetchReviewsHook;
}

export default function TicketListLayout({
  header,
  useFetchReviews,
}: TicketListLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const currentPage = parseInt(params.get("page") || "1", 10);
  const searchTerm = params.get("search") || "";
  const user = useAppSelector(selectUser);

  const fetchResult = useFetchReviews({
    uid: user?.uid || "",
    search: searchTerm,
    page: currentPage,
    pageSize: 10,
  });

  const { reviews, totalPages, loading, error } = fetchResult;
  const removeReview =
    "removeReview" in fetchResult ? fetchResult.removeReview : undefined;
  const updateReviewLikeCount =
    "updateReviewLikeCount" in fetchResult
      ? fetchResult.updateReviewLikeCount
      : undefined;

  const searchHandler = (term: string) => {
    const url = buildQueryUrl({
      pathname,
      params: { uid: user?.uid || "", search: term, page: 1 },
    });
    router.replace(url);
  };

  const pageChangeHandler = (page: number) => {
    const url = buildQueryUrl({
      pathname,
      params: { uid: user?.uid || "", search: searchTerm, page },
    });
    router.push(url);
  };

  const handleLikeToggled = (
    reviewId: string,
    newLikeCount: number,
    isLiked: boolean,
  ) => {
    // 좋아요 취소 시에만 목록에서 제거 (좋아요한 리뷰 페이지에서만)
    if (!isLiked && removeReview) {
      removeReview(reviewId);
    }
    // 모든 페이지에서 likeCount 업데이트
    if (updateReviewLikeCount) {
      updateReviewLikeCount(reviewId, newLikeCount);
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
      <SearchSection
        searchTerm={searchTerm}
        resultCount={reviews.length}
        onSearch={searchHandler}
      />

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
