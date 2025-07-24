"use client";

import { lazy } from "react";

/**
 * Component factory for managing lazy-loaded components
 */
export const lazyComponents = {
  // Profile components
  WatchlistGrid: lazy(() => import("@/components/WatchlistGrid")),

  // Search components
  GlobalSearch: lazy(() => import("@/components/GlobalSearch")),

  // Movie components
  Cast: lazy(() => import("@/components/Cast")),

  WatchProviders: lazy(() => import("@/components/WatchProviders")),

  Recommendations: lazy(() => import("@/components/Recommendations")),

  // Auth components
  AuthModal: lazy(() => import("@/components/AuthModal")),

  // Content components
  TrendingNow: lazy(() => import("@/components/TrendingNow")),

  MayLike: lazy(() => import("@/components/MayLike")),
};

/**
 * Preload components for better performance
 */
export const preloadComponent = (importPromise: Promise<unknown>) => {
  // Don't await here, just start the loading process
  importPromise.catch(() => {
    // Silently handle preload errors
  });
  return importPromise;
};

/**
 * Preload critical components
 */
export const preloadCriticalComponents = () => {
  // Preload components that are likely to be used soon
  preloadComponent(import("@/components/GlobalSearch"));
  preloadComponent(import("@/components/AuthModal"));
  preloadComponent(import("@/components/TrendingNow"));
};

/**
 * Preload page-specific components
 */
export const preloadPageComponents = (
  page: "profile" | "movie" | "home" | "search"
) => {
  switch (page) {
    case "profile":
      preloadComponent(import("@/components/WatchlistGrid"));
      break;
    case "movie":
      preloadComponent(import("@/components/Cast"));
      preloadComponent(import("@/components/WatchProviders"));
      preloadComponent(import("@/components/Recommendations"));
      break;
    case "home":
      preloadComponent(import("@/components/TrendingNow"));
      preloadComponent(import("@/components/GlobalSearch"));
      break;
    case "search":
      preloadComponent(import("@/components/GlobalSearch"));
      break;
  }
};
