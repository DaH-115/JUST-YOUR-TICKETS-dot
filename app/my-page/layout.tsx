import { PrivateRoute } from "store/context/auth/authContext";
import SideMenu from "app/my-page/components/SideMenu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PrivateRoute>
      <div className="flex min-h-screen w-full p-8">
        <SideMenu />
        {children}
      </div>
    </PrivateRoute>
  );
}
