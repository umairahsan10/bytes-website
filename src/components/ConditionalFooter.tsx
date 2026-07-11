"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/sections/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Portfolio has its own layout; the revamped homepage renders PremiumFooter itself.
  if (pathname.startsWith("/portfolio") || pathname.startsWith("/home-v2")) {
    return null;
  }

  return <Footer />;
}
