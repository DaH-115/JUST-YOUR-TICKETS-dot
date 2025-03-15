import { Metadata } from "next";
import MyTicktListPage from "app/my-page/my-ticket-list/components/MyTicketListPage";
import fetchUserReviews from "api/reviews/fetchUserReviews";

interface MyTicketListParams {
  searchParams: {
    uid: string;
  };
}

export const metadata: Metadata = {
  title: "My Tickets",
};

export default async function Page({ searchParams }: MyTicketListParams) {
  const uid = searchParams.uid;
  const userReviews = await fetchUserReviews({ uid });

  return <MyTicktListPage userReviews={userReviews} uid={uid} />;
}
