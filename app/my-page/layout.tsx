import SideMenu from "app/my-page/components/SideMenu";
import { PrivateRoute } from "store/context/auth/authContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PrivateRoute>
      <div className="flex min-h-full w-full p-4 md:p-8">
        <SideMenu />
        {children}
      </div>
    </PrivateRoute>
  );
}
