"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Declare gtag function type
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, string | number | boolean | undefined>
    ) => void;
  }
}

const Analytics = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", "G-PXH771LG5B", {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
};

export default Analytics;
