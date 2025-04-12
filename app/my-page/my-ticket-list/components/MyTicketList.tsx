import { Review } from "api/reviews/fetchReviews";
import ReviewTicket from "app/components/reviewTicket/ReviewTicket";

interface MyTicketListProps {
  reviews: Review[];
}

export default function MyTicketList({ reviews }: MyTicketListProps) {
  if (reviews.length === 0) {
    return (
      <div className="flex items-center justify-center text-center text-sm font-bold text-gray-300">
        등록된 리뷰 티켓이 없습니다.
      </div>
    );
  }

  return <ReviewTicket reviews={reviews} />;
}
