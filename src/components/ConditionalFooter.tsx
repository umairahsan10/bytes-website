"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/sections/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/portfolio")) {
    return null;
  }

  return <Footer />;
}
