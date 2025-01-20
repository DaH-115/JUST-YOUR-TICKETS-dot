import { Metadata } from "next";
import MyTicktListPage from "app/my-page/my-ticket-list/my-ticket-list-page";
import fetchUserReviews from "api/movie-reviews/fetchUserReviews";

interface SearchParams {
  searchParams: {
    uid: string;
  };
}

export const metadata: Metadata = {
  title: "My Tickets",
};

export default async function Page({ searchParams }: SearchParams) {
  const uid = searchParams.uid;
  const userReviews = await fetchUserReviews(uid);

  return <MyTicktListPage userReviews={userReviews} uid={uid} />;
}
