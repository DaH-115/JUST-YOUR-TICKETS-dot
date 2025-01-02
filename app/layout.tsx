import { Metadata } from "next";
import "app/globals.css";
import Providers from "app/providers";
import Header from "app/ui/layout/header/header";
import Footer from "app/ui/layout/footer";
import { ErrorProvider } from "store/error-context";
import { AuthProvider } from "store/auth-context";

export const metadata: Metadata = {
  metadataBase: new URL("https://just-movie-tickets.vercel.app"),
  alternates: {
    canonical: "/",
  },
  title: {
    template: "%s | Just Your Tickets",
    default: "Just Your Tickets",
  },
  description: "Make a ticket for your own movie ticket.",
  keywords: ["movie", "ticket", "booking"],
  openGraph: {
    title: "Just Your Tickets",
    description: "Make a ticket for your own movie ticket.",
    url: "/",
    siteName: "Just Your Tickets",
    images: [
      {
        url: "/images/og-card.jpg",
        width: 1200,
        height: 630,
        alt: "Just Your Tickets Preview",
      },
    ],
  },
  icons: {
    icon: "/images/favicon.ico",
    shortcut: "/images/favicon.ico",
    apple: "/images/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="trancy-und h-full">
      <body className="h-full w-full min-w-[320px] bg-[#121212]">
        <Providers>
          <AuthProvider>
            <ErrorProvider>
              <Header />
              {children}
              <Footer />
            </ErrorProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
