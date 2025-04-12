import fetchLikedReviews from "api/reviews/fetchLikedReviews";
import fetchReviewById from "api/reviews/fetchReviewById";
import { Review } from "api/reviews/fetchReviews";
import ReviewTicket from "app/components/reviewTicket/ReviewTicket";

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
  if (!uid) {
    return <div>로그인이 필요합니다</div>;
  }

  // 1. 좋아요 리스트 가져오기
  const likedReviews = await fetchLikedReviews(uid);
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
    <main>
      <div className="mb-8 text-white">
        <h1 className="text-3xl font-bold">Liked Ticket List</h1>
        <p>좋아요를 누른 티켓 목록입니다</p>
      </div>
      <div>
        {fullList.length > 0 ? (
          <ReviewTicket reviews={fullList} />
        ) : (
          <div className="text-center text-gray-500">
            좋아요한 리뷰가 없습니다
          </div>
        )}
      </div>
    </main>
  );
}
