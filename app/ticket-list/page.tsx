import { Metadata } from "next";
import TicketListPage from "app/ticket-list/ticket-list-page";

export const metadata: Metadata = {
  title: "Ticket List",
};

export default function Page() {
  return <TicketListPage />;
}
