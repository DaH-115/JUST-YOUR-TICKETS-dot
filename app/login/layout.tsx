import { PublicRoute } from "store/context/auth/auth-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PublicRoute>{children}</PublicRoute>;
}
