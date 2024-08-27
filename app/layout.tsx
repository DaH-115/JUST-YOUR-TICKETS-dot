import { Metadata } from "next";
import "./globals.css";
import Header from "./header";

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
        <div className="mt-16 md:mt-36">{children}</div>
      </body>
    </html>
  );
}
