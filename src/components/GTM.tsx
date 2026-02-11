'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function GTM({ id }: { id: string }) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    
    setIsMobile(checkMobile());

    // For mobile: defer GTM until after critical content loads
    // For desktop: load after interactive
    if (checkMobile()) {
      // Wait for user interaction or after 3 seconds on mobile
      const loadGTM = () => setShouldLoad(true);
      
      const events = ['scroll', 'touchstart', 'click', 'mousemove'];
      const timeout = setTimeout(loadGTM, 3000);
      
      events.forEach(event => {
        window.addEventListener(event, loadGTM, { once: true, passive: true });
      });

      return () => {
        clearTimeout(timeout);
        events.forEach(event => window.removeEventListener(event, loadGTM));
      };
    } else {
      // Load immediately on desktop
      setShouldLoad(true);
    }
  }, []);

  if (!shouldLoad) return null;

  return (
    <Script 
      id="gtm-head" 
      strategy={isMobile ? "lazyOnload" : "afterInteractive"}
    >{`
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${id}');
    `}</Script>
  );
}

export function GTMNoScript({ id }: { id: string }) {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${id}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}
