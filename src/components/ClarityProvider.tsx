"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

interface ClarityProviderProps {
  projectId: string;
}

/**
 * Microsoft Clarity Provider
 * 
 * Initializes Clarity tracking for the application.
 * Get your project ID from: Clarity project > Settings > Overview
 * 
 * Features:
 * - Session replays
 * - Heatmaps
 * - User behavior insights
 * - Clarity Copilot (AI-powered insights)
 */
const ClarityProvider = ({ projectId }: ClarityProviderProps) => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize Clarity with project ID
    if (projectId && projectId !== "yourProjectId") {
      Clarity.init(projectId);
    }
  }, [projectId]);

  return null;
};

export default ClarityProvider;

// Utility functions for advanced Clarity usage

/**
 * Identify a user with custom ID
 * Call this when a user logs in or you have user information
 * 
 * @param customId - Unique identifier for the user (required)
 * @param customSessionId - Optional custom session ID
 * @param customPageId - Optional custom page ID
 * @param friendlyName - Optional friendly name for the user
 */
export const identifyUser = (
  customId: string,
  customSessionId?: string,
  customPageId?: string,
  friendlyName?: string
) => {
  if (typeof window !== "undefined") {
    Clarity.identify(customId, customSessionId, customPageId, friendlyName);
  }
};

/**
 * Set custom tags for filtering in Clarity
 * 
 * @param key - The key for the tag
 * @param value - The value(s) for the tag
 */
export const setClarityTag = (key: string, value: string | string[]) => {
  if (typeof window !== "undefined") {
    Clarity.setTag(key, value);
  }
};

/**
 * Track custom events in Clarity
 * Appears in Filters, Dashboard, Settings, and Recordings
 * 
 * @param eventName - Name of the event to track
 */
export const trackClarityEvent = (eventName: string) => {
  if (typeof window !== "undefined") {
    Clarity.event(eventName);
  }
};

/**
 * Set cookie consent for Clarity tracking
 * Use this when you have user consent for cookies
 * 
 * @param consent - Consent options or boolean
 */
export const setClarityConsent = (
  consent: { ad_Storage: "granted" | "denied"; analytics_Storage: "granted" | "denied" } | boolean = true
) => {
  if (typeof window !== "undefined") {
    if (typeof consent === "boolean") {
      // v1 API
      Clarity.consent(consent);
    } else {
      // v2 API (recommended)
      Clarity.consentV2(consent);
    }
  }
};

/**
 * Upgrade a session to prioritize recording
 * Useful for important user interactions (checkout, signup, etc.)
 * 
 * @param reason - Reason for upgrading the session
 */
export const upgradeClaritySession = (reason: string) => {
  if (typeof window !== "undefined") {
    Clarity.upgrade(reason);
  }
};
