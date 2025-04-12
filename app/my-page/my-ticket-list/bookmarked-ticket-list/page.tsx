import fetchBookmarkedReviews from "api/reviews/fetchBookmarkedReviews";
import fetchReviewById from "api/reviews/fetchReviewById";
import { Review } from "api/reviews/fetchReviews";
import ReviewTicket from "app/components/reviewTicket/ReviewTicket";

export const metadata = {
  title: "Bookmarked Tickets",
  description: "북마크한 티켓 목록입니다",
};

export default async function Page({
  searchParams,
}: {
  searchParams: { uid: string };
}) {
  const uid = searchParams.uid;
  if (!uid) {
    return <div>로그인이 필요합니다</div>;
  }

  // 1. 북마크 리스트 가져오기
  const bookmarked = await fetchBookmarkedReviews(uid);
  // 2. 북마크 리스트에 저장된 리뷰 ID로 리뷰 정보 가져오기
  const detailedReviews = await Promise.all(
    bookmarked.map(async ({ id }) => {
      const review = await fetchReviewById(id);
      return review ? { ...review } : null;
    }),
  );
  // 3. null이 아닌 리뷰만 필터링
  const fullList = detailedReviews.filter(
    (review): review is Review => review !== null,
  );

  return (
    <main>
      <div className="mb-8 text-white">
        <h1 className="text-3xl font-bold">Bookmarked Ticket List</h1>
        <p>북마크한 티켓 목록입니다</p>
      </div>
      <div>
        {fullList.length > 0 ? (
          <ReviewTicket reviews={fullList} />
        ) : (
          <div className="text-center text-gray-500">
            북마크한 티켓이 없습니다
          </div>
        )}
      </div>
    </main>
  );
}
