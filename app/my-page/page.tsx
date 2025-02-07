import { Metadata } from "next";
import MyPagePage from "app/my-page/my-page-page";

export const metadata: Metadata = {
  title: "My Page",
};

export default async function MyPage() {
  return <MyPagePage />;
}
