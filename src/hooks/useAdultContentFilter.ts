"use client";

import { useState, useEffect, useCallback } from "react";

export const useAdultContentFilter = () => {
  const [hideAdultContent, setHideAdultContent] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load setting from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("hideAdultContent");
    if (stored !== null) {
      setHideAdultContent(JSON.parse(stored));
    }
  }, []);

  // Function to refresh the setting from localStorage
  const refreshFromStorage = useCallback(() => {
    const stored = localStorage.getItem("hideAdultContent");
    const newValue = stored ? JSON.parse(stored) : true;
    setHideAdultContent(newValue);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Function to update the setting
  const toggleAdultContent = useCallback(() => {
    const newValue = !hideAdultContent;
    setHideAdultContent(newValue);
    localStorage.setItem("hideAdultContent", JSON.stringify(newValue));
    setRefreshTrigger((prev) => prev + 1);
  }, [hideAdultContent]);

  return {
    hideAdultContent,
    toggleAdultContent,
    refreshFromStorage,
    refreshTrigger, // يمكن استخدامه كـ dependency في useMemo
  };
};
