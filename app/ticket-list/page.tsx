import { Metadata } from "next";
import TicketListPage from "app/ticket-list/components/TicketListPage";
import {
  fetchReviewsPaginated,
  PaginatedReviews,
} from "api/reviews/fetchReviewsPaginated";

export const metadata: Metadata = {
  title: "Ticket List",
  description: "티켓 목록입니다.",
};

export default async function Page() {
  const page = 1;
  const PAGE_SIZE = 10;

  // 한 번에 전체 개수+페이징 데이터를 가져옴
  const { reviews, totalPages }: PaginatedReviews = await fetchReviewsPaginated(
    {
      page,
      pageSize: PAGE_SIZE,
    },
  );

  return (
    <TicketListPage
      reviews={reviews}
      currentPage={page}
      totalPages={totalPages}
    />
  );
}
