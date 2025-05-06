import { PublicRoute } from "store/context/auth/authContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PublicRoute>{children}</PublicRoute>;
}
