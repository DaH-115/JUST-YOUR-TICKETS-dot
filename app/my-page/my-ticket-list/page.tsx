import { Metadata } from "next";
import MyTicketListPage from "app/my-page/my-ticket-list/components/MyTicketListPage";
import fetchUserReviews from "api/reviews/fetchReviews";

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
  const userReviews = await fetchUserReviews({ uid });

  return <MyTicketListPage userReviews={userReviews} />;
}
