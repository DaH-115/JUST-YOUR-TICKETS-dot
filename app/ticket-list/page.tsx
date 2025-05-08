import { Metadata } from "next";
import { fetchReviewsPaginated } from "lib/reviews/fetchReviewsPaginated";
import TicketListPage from "app/ticket-list/components/TicketListPage";

export const metadata: Metadata = {
  title: "Ticket List",
  description: "티켓 목록입니다.",
};

interface PageProps {
  searchParams: { page?: string };
}

export default async function Page({ searchParams }: PageProps) {
  const PAGE_SIZE = 10;
  const page = parseInt(searchParams.page ?? "1", 10);
  const { reviews, totalPages } = await fetchReviewsPaginated({
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <TicketListPage
      initialReviews={reviews}
      currentPage={page}
      totalPages={totalPages}
    />
  );
}
