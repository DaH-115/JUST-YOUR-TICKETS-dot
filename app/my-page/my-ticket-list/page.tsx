import { Metadata } from "next";
import TicketListLayout from "app/my-page/components/ticket-list-page/TicketListLayout";
import useMyReviews from "app/my-page/hooks/useMyReviews";

export const metadata: Metadata = {
  title: "My Tickets",
  description: "내가 작성한 티켓 목록입니다.",
};

export default function Page() {
  return (
    <TicketListLayout
      header={{
        title: "My Ticket List",
        content: "내가 작성한 티켓 목록입니다",
      }}
      placeholder="티켓 검색"
      useFetchReviews={useMyReviews}
    />
  );
}
