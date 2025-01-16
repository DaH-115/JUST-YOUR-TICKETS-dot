import { Metadata } from "next";
import TicketListPage from "app/ticket-list/ticket-list-page";
import fetchUserReviews from "api/movie-reviews/fetchUserReviews";

export const metadata: Metadata = {
  title: "Ticket List",
};

export default async function Page() {
  try {
    const userReviews = await fetchUserReviews();

    if (!userReviews) {
      throw new Error("데이터를 불러올 수 없습니다.");
    }

    return <TicketListPage userReviews={userReviews} />;
  } catch (error) {
    throw error;
  }
}
