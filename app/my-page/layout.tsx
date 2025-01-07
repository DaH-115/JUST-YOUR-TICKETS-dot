import { PrivateRoute } from "store/context/auth-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PrivateRoute>
      <section className="flex w-full flex-col px-4 py-4 md:h-96 md:py-8 lg:min-h-screen lg:flex-row lg:px-8">
        {children}
      </section>
    </PrivateRoute>
  );
}
