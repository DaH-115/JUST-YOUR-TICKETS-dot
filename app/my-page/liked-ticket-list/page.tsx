import { Metadata } from "next";
import TicketListLayout from "app/my-page/components/ticket-list-page/TicketListLayout";
import useLikedReviews from "app/my-page/hooks/useLikedReviews";

export const metadata: Metadata = {
  title: "Liked Ticket List",
  description: "좋아요한 티켓 목록입니다.",
};

export default function Page() {
  return (
    <TicketListLayout
      header={{
        title: "Liked Ticket List",
        content: "좋아요한 티켓 목록입니다",
      }}
      placeholder="티켓 검색"
      useFetchReviews={useLikedReviews}
    />
  );
}
