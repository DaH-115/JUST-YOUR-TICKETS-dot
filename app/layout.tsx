import { Metadata } from "next";
import "app/globals.css";
import Providers from "store/redux-toolkit/providers";
import { ErrorProvider } from "store/context/error-context";
import { AuthProvider } from "store/context/auth/auth-context";
import Header from "app/ui/layout/header/header";
import Footer from "app/ui/layout/footer";
import { Nanum_Gothic, Montserrat } from "next/font/google";

const nanumGothic = Nanum_Gothic({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const roboto = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://just-movie-tickets.vercel.app"),
  alternates: {
    canonical: "/",
  },
  title: {
    template: "%s | Just Your Tickets.",
    default: "Just Your Tickets.",
  },
  description: "Make a ticket for your own movie ticket.",
  keywords: ["movie", "ticket", "booking"],
  openGraph: {
    title: "Just Your Tickets.",
    description: "Make a ticket for your own movie ticket.",
    url: "/",
    siteName: "Just Your Tickets.",
    images: [
      {
        url: "/images/og-card.jpg",
        width: 1200,
        height: 630,
        alt: "Just Your Tickets.",
      },
    ],
  },
  icons: {
    apple: [
      {
        url: "/images/apple-icon-57x57.png",
        sizes: "57x57",
        type: "image/png",
      },
      {
        url: "/images/apple-icon-60x60.png",
        sizes: "60x60",
        type: "image/png",
      },
      {
        url: "/images/apple-icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        url: "/images/apple-icon-76x76.png",
        sizes: "76x76",
        type: "image/png",
      },
      {
        url: "/images/apple-icon-114x114.png",
        sizes: "114x114",
        type: "image/png",
      },
      {
        url: "/images/apple-icon-120x120.png",
        sizes: "120x120",
        type: "image/png",
      },
      {
        url: "/images/apple-icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        url: "/images/apple-icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: "/images/apple-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    icon: [
      { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      {
        url: "/images/android-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    shortcut: "/images/favicon.ico",
  },
  manifest: "/manifest.json",
  other: {
    "msapplication-TileColor": "#ffffff",
    "msapplication-TileImage": "/images/ms-icon-144x144.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${nanumGothic.className} ${roboto.className}`}>
      <body className="min-h-screen w-full min-w-[320px] bg-[#121212]">
        {/* RTK Provider */}
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
