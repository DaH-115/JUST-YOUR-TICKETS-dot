import { PublicRoute } from "store/auth-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PublicRoute>{children}</PublicRoute>;
}
