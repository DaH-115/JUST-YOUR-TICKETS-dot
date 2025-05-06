import { PrivateRoute } from "store/context/auth/authContext";
import SideMenu from "app/my-page/components/SideMenu";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateRoute>
      <div className="flex p-8">
        <SideMenu />
        {children}
      </div>
    </PrivateRoute>
  );
}
