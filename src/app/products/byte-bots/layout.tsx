export const metadata = {
  title: "ByteBots | AI Chatbot for Sales, Insights & Compliance",
  description: "Boost conversions with ByteBots, an AI chatbot with lead flows, analytics, GDPR compliance, CRM integrations, real-time dashboards and predictive insights.",
  alternates: {
    canonical: "/products/byte-bots",
  },
  other: {
    'google-site-verification': 'your-verification-code',
  },
};

// Optimize font loading
export const viewport = {
  themeColor: '#010A14',
  width: 'device-width',
  initialScale: 1,
};

export default function ByteBotsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 