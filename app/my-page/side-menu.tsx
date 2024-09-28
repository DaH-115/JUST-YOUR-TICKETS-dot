import Link from "next/link";

export default function SideMenu({ uid }: { uid: string }) {
  const profileMenuStyle = `${!uid ? "text-2xl text-gray-300 hover:text-black md:text-8xl" : "text-4xl text-black  md:text-8xl"}`;
  const sideMenuStyle = `${!uid ? "text-4xl text-black md:text-8xl" : "text-2xl text-gray-300 hover:text-black md:text-8xl"}`;

  return (
    <div className="w-full flex-1 pr-8">
      <Link href="/my-page">
        <div className={profileMenuStyle}>PROFILE</div>
      </Link>
      <Link href={`/my-page/my-ticket-list?uid=${uid}`}>
        <div className={sideMenuStyle}>MY TICKET LIST</div>
      </Link>
    </div>
  );
}
