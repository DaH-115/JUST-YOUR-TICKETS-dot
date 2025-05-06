import { fetchLikedReviewsPaginated } from "api/reviews/fetchLikedReviews";
import fetchReviewById from "api/reviews/fetchReviewById";
import { Review } from "api/reviews/fetchReviews";
import Pagination from "app/components/Pagination";
import ReviewTicket from "app/components/reviewTicket/ReviewTicket";
import EmptyState from "app/my-page/components/EmptyState";

export const metadata = {
  title: "Liked Tickets",
  description: "좋아요한 티켓 목록입니다",
};

export default async function Page({
  searchParams,
}: {
  searchParams: { uid: string };
}) {
  const uid = searchParams.uid;
  const page = 1;
  const PAGE_SIZE = 10;

  // 1. 좋아요 리스트 가져오기
  const { reviews: likedReviews, totalPages } =
    await fetchLikedReviewsPaginated(uid, page, PAGE_SIZE);

  // 2. 좋아요 리스트에 저장된 리뷰 ID로 리뷰 정보 가져오기
  const detailedReviews = await Promise.all(
    likedReviews.map(async ({ id }) => {
      const review = await fetchReviewById(id);
      return review ? { ...review } : null;
    }),
  );

  // 3. null이 아닌 리뷰만 필터링
  const fullList = detailedReviews.filter(
    (review): review is Review => review !== null,
  );

  return (
    <div className="flex w-full flex-col">
      <main className="w-full flex-1">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-accent-300">
            Liked Ticket List
          </h1>
          <p className="text-white">좋아요를 누른 티켓 목록입니다</p>
        </div>
        <p className="mb-6 text-white">
          전체 {fullList.length > 0 ? fullList.length : 0}장
        </p>
        {fullList.length > 0 ? (
          <ReviewTicket reviews={fullList} />
        ) : (
          <EmptyState message="좋아요한 티켓이 없습니다" />
        )}
      </main>
      {/* 페이지네이션 */}
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
