import { Metadata } from "next";
import "app/globals.css";
import Providers from "app/providers";
import Header from "app/ui/header";
import Footer from "app/ui/footer";

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
        <Providers>
          <Header />
          <div className="h-vh">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
