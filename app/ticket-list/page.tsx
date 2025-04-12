import { Metadata } from "next";
import TicketListPage from "app/ticket-list/components/TicketListPage";
import fetchUserReviews from "api/reviews/fetchReviews";

export const metadata: Metadata = {
  title: "Ticket List",
};

export default async function Page() {
  const userReviews = await fetchUserReviews();

  return <TicketListPage userReviews={userReviews} />;
}
