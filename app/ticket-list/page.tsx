import { Metadata } from "next";
import TicketListPage from "app/ticket-list/components/TicketListPage";
import { fetchReviewsPaginated } from "lib/reviews/fetchReviewsPaginated";

export const metadata: Metadata = {
  title: "Ticket List",
  description: "티켓 목록입니다.",
};

interface searchParamsProps {
  page?: string;
  search?: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams: searchParamsProps;
}) {
  const page = parseInt(searchParams.page ?? "1", 10);
  const search = searchParams.search?.trim() ?? "";

  const { reviews, totalPages } = await fetchReviewsPaginated({
    page,
    pageSize: 10,
    search,
  });

  return (
    <TicketListPage
      initialReviews={reviews}
      initialPage={page}
      initialSearch={search}
      initialTotalPages={totalPages}
    />
  );
}
