import type { Metadata } from "next";
import { Inter, Calistoga } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";
import "../sections/cards.css";
import GTMHead, { GTMNoScript } from "@/components/GTM";


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
        {/* ✅ Google Tag Manager script in head */}
        
        <GTMHead />
      </head>
      <body
        className={twMerge(
          inter.variable,
          calistoga.variable,
          "text-black antialiased font-sans min-h-screen"
        )}
      >
        {/* Google Tag Manager */}
        <GTMNoScript />
        {children}
      </body>
    </html>
  );
}