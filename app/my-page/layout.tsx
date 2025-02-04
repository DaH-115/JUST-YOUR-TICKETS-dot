import { PrivateRoute } from "store/context/auth/auth-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PrivateRoute>
      <section className="flex w-full flex-col lg:flex-row">{children}</section>
    </PrivateRoute>
  );
}
