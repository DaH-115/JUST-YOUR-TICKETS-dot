import { Metadata } from "next";
import MyTicketListPage from "app/my-page/my-ticket-list/components/MyTicketListPage";

export const metadata: Metadata = {
  title: "My Tickets",
  description: "내가 작성한 티켓 목록입니다.",
};

export default function Page() {
  return <MyTicketListPage />;
}
