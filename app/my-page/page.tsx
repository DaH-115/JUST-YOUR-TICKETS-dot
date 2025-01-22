import { Metadata } from "next";
import fetchUserReviews from "api/movie-reviews/fetchUserReviews";
import dynamic from "next/dynamic";
import Loading from "app/loading";

export const metadata: Metadata = {
  title: "My Page",
};

export default async function MyPage() {
  const userReview = await fetchUserReviews();
  const MyPagePage = dynamic(() => import("app/my-page/my-page-page"), {
    loading: () => <Loading />,
  });

  return <MyPagePage userReview={userReview} />;
}
