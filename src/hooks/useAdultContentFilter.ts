"use client";

import { useState, useCallback } from "react";
import { useAdultContent } from "./useAdultContent";

export const useAdultContentFilter = () => {
  const { hideAdultContent, toggleAdultContent } = useAdultContent();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to refresh the setting (trigger re-render)
  const refreshFromStorage = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Wrap the toggle function to include refresh trigger
  const handleToggleAdultContent = useCallback(() => {
    toggleAdultContent();
    setRefreshTrigger((prev) => prev + 1);
  }, [toggleAdultContent]);

  return {
    hideAdultContent,
    toggleAdultContent: handleToggleAdultContent,
    refreshFromStorage,
    refreshTrigger, // يمكن استخدامه كـ dependency في useMemo
  };
};
