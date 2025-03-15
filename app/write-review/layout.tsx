import { PrivateRoute } from "store/context/auth/authContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
