"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  trackTimeOnPage,
  trackSessionStart,
  trackExitIntent,
  trackPageVisibility,
  trackDeviceInfo,
} from "@/lib/analytics";

const UserBehaviorTracker = () => {
  const pathname = usePathname();
  const pageStartTime = useRef<number>(Date.now());
  const isFirstRender = useRef(true);
  const hiddenStartTime = useRef<number | null>(null);

  // Track session start on first load
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      
      // Check if session already exists
      const existingSession = sessionStorage.getItem('analytics_session_id');
      if (!existingSession) {
        trackSessionStart();
        trackDeviceInfo();
      }
    }
  }, []);

  // Track time on page when leaving
  const trackPageExit = useCallback(() => {
    const timeSpent = Math.round((Date.now() - pageStartTime.current) / 1000);
    if (timeSpent > 2) { // Only track if more than 2 seconds
      trackTimeOnPage(pathname, timeSpent);
    }
  }, [pathname]);

  // Reset timer when pathname changes
  useEffect(() => {
    // Track previous page time
    if (!isFirstRender.current) {
      trackPageExit();
    }
    
    // Reset timer for new page
    pageStartTime.current = Date.now();
  }, [pathname, trackPageExit]);

  // Track exit intent (mouse leaving viewport)
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        const timeOnPage = Math.round((Date.now() - pageStartTime.current) / 1000);
        trackExitIntent(pathname, timeOnPage);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [pathname]);

  // Track page visibility changes (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        hiddenStartTime.current = Date.now();
        trackPageVisibility(false, pathname);
      } else {
        const timeHidden = hiddenStartTime.current 
          ? Math.round((Date.now() - hiddenStartTime.current) / 1000)
          : undefined;
        trackPageVisibility(true, pathname, timeHidden);
        hiddenStartTime.current = null;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [pathname]);

  // Track time before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      trackPageExit();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [trackPageExit]);

  return null;
};

export default UserBehaviorTracker;
