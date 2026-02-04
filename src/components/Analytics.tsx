"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Declare gtag function type
declare global {
  interface Window {
    gtag: (
      command: 'set' | 'config' | 'event',
      targetId: string,
      config?: Record<string, string | number | boolean | null | undefined>
    ) => void;
  }
}

const RouteTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", "G-SHSM2HT143", {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
};

export default RouteTracker;
