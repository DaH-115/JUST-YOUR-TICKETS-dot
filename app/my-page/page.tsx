import { Metadata } from "next";
import SideMenu from "app/my-page/components/SideMenu";
import ProfileForm from "app/my-page/components/ProfileForm";

export const metadata: Metadata = {
  title: "My Page",
  description: "내 정보를 수정할 수 있는 페이지입니다.",
};

export default async function MyPage() {
  return (
    <div className="flex w-full p-8">
      <ProfileForm />
    </div>
  );
}
