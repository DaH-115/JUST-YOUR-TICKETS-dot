import { Metadata } from "next";
import "app/globals.css";
import Providers from "app/providers";
import Header from "app/ui/header";
import Footer from "app/ui/footer";
import { ErrorProvider } from "store/error-context";

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
          <ErrorProvider>
            <Header />
            {children}
            <Footer />
          </ErrorProvider>
        </Providers>
      </body>
    </html>
  );
}
