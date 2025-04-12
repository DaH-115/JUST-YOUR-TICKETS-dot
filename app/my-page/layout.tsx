import { PrivateRoute } from "store/context/auth/authContext";
import SideMenu from "app/my-page/components/SideMenu";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateRoute>
      <div className="flex min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <SideMenu />
        {children}
      </div>
    </PrivateRoute>
  );
}
