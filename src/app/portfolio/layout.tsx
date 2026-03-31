import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Bytes — Digital Agency | CRM, SaaS, Web & SEO",
  description:
    "Bytes builds scalable CRM systems, SaaS products, websites, and delivers SEO growth for modern businesses.",
};

export default function PortfolioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} portfolio-root font-body antialiased`}
      style={{ background: "#050816", color: "#FFFFFF" }}
    >
      <div className="noise-overlay" aria-hidden="true" />
      {children}
    </div>
  );
}
