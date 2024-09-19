import { useSearchParams } from "next/navigation";

export default function SideMenu() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const profileMenuStyle = `${uid ? "text-2xl text-gray-300 hover:text-black md:text-8xl" : "text-4xl text-black  md:text-8xl"}`;
  const sideMenuStyle = `${uid ? "text-4xl text-black hover:text-black md:text-8xl" : "text-2xl text-gray-300 md:text-8xl"}`;

  return (
    <div className="w-full flex-1 pr-8">
      <div className={profileMenuStyle}>PROFILE</div>
      <div className={sideMenuStyle}>MY REVIEW LIST</div>
    </div>
  );
}
