import { Metadata } from "next";
import MyPagePage from "app/my-page/my-page-page";
import fetchUserReviews from "api/movie-reviews/fetchUserReviews";

export const metadata: Metadata = {
  title: "My Page",
};

export default async function MyPage() {
  const userReview = await fetchUserReviews();

  return <MyPagePage userReview={userReview} />;
}
