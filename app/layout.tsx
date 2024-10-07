import { Metadata } from "next";
import "app/globals.css";
import Providers from "app/providers";
import Header from "app/ui/header";
import Footer from "app/ui/footer";

export const metadata: Metadata = {
  title: "Jsut Your Tickets",
  description: "Make a ticket for your own movie ticket.",
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
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
