import { Metadata } from "next";
import "app/globals.css";
import Header from "app/ui/header";

export const metadata: Metadata = {
  title: "My Home",
  description: "Welcome to Next.js by FOLLO",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <div>{children}</div>
      </body>
    </html>
  );
}
