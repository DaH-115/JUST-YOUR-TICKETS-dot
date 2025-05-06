import { Metadata } from "next";
import MyProfileForm from "app/my-page/components/MyProfileForm";

export const metadata: Metadata = {
  title: "My Page",
  description: "나의 프로필 및 나의 리뷰 티켓을 확인할 수 있는 페이지입니다.",
};

export default async function MyPage() {
  return <MyProfileForm />;
}
