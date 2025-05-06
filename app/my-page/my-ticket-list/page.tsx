import { Metadata } from "next";
import MyTicketListPage from "app/my-page/my-ticket-list/components/MyTicketListPage";

import { fetchReviewsPaginated } from "api/reviews/fetchReviewsPaginated";

export const metadata: Metadata = {
  title: "My Tickets",
  description: "내가 작성한 티켓 목록입니다.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: {
    uid: string;
  };
}) {
  const uid = searchParams.uid;
  const page = 1;
  const PAGE_SIZE = 10;
  const { reviews, totalPages } = await fetchReviewsPaginated({
    uid,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <MyTicketListPage
      userReviews={reviews}
      currentPage={page}
      totalPages={totalPages}
    />
  );
}
