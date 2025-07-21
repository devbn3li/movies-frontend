"use client";

import { useState, useEffect } from "react";

export const useAdultContent = () => {
  const [hideAdultContent, setHideAdultContent] = useState(true);

  useEffect(() => {
    // Load setting from localStorage on mount
    const stored = localStorage.getItem("hideAdultContent");
    if (stored !== null) {
      setHideAdultContent(JSON.parse(stored));
    }
  }, []);

  const toggleAdultContent = () => {
    const newValue = !hideAdultContent;
    setHideAdultContent(newValue);
    localStorage.setItem("hideAdultContent", JSON.stringify(newValue));
  };

  return {
    hideAdultContent,
    toggleAdultContent,
  };
};
