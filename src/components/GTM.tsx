// components/GTM.tsx
import Script from "next/script";

export const GTM_ID = "GTM-5MHPQ34Q"; // Replace with your actual GTM ID

/**
 * Google Tag Manager Script
 * Injects the GTM script into the document <head> using Next.js <Script> component.
 */
const GTMHead: React.FC = () => (
  <Script
    id="gtm-head"
    strategy="afterInteractive"
    dangerouslySetInnerHTML={{
      __html: `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `,
    }}
  />
);

/**
 * Google Tag Manager noscript fallback.
 * Should be rendered at the top of <body> for users with JavaScript disabled.
 */
export const GTMNoScript: React.FC = () => (
  <noscript>
    <iframe
      src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
      height="0"
      width="0"
      style={{ display: "none", visibility: "hidden" }}
    />
  </noscript>
);

export default GTMHead;
