import { PrivateRoute } from "store/context/auth-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
