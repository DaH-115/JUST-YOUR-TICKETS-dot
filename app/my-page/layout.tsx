import { PrivateRoute } from "store/context/auth/authContext";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateRoute>
      <main className="flex min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </PrivateRoute>
  );
}
