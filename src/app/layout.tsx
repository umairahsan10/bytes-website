import type { Metadata } from "next";
import { Inter, Calistoga } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";
import "../sections/cards.css";
import { Footer } from "@/sections/Footer";
import GTM, { GTMNoScript } from "@/components/GTM";
import PageLoader from "@/components/PageLoader";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const calistoga = Calistoga({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Bytes Platform",
  description: "Testing the portfolio",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <GTM id="GTM-MNW4L2XD" />
      </head>
      <body
        className={twMerge(
          inter.variable,
          calistoga.variable,
          "text-black antialiased font-sans min-h-screen flex flex-col"
        )}
      >
        {/* GTM noscript fallback */}
        <GTMNoScript id="GTM-MNW4L2XD" />
        <PageLoader>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </PageLoader>
      </body>
    </html>
  );
}