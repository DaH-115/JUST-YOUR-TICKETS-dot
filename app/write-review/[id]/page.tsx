import { Metadata } from "next";
import WriteReviewPage from "app/write-review/components/WriteReviewPage";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Write Review",
};

export default function Page() {
  return <WriteReviewPage />;
}
