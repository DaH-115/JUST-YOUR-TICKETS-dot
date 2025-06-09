import { Metadata } from "next";
import ProfileView from "app/my-page/components/ProfileView";

export const metadata: Metadata = {
  title: "My Page",
  description: "나의 프로필 및 나의 리뷰 티켓을 확인할 수 있는 페이지입니다.",
};

export default function MyPage() {
  return <ProfileView />;
}
