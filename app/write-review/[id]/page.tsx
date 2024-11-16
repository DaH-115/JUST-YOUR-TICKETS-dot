import { Metadata } from "next";
import WriteReviewPage from "app/write-review/write-review-page";

export const metadata: Metadata = {
  title: "Write Review",
};

export default function Page() {
  return <WriteReviewPage />;
}
