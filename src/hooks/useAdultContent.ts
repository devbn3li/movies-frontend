"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

export const useAdultContent = () => {
  const [hideAdultContent, setHideAdultContent] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { user, mounted } = useAuth();

  useEffect(() => {
    if (!mounted) return;

    const loadAdultContentSetting = async () => {
      setIsLoading(true);

      try {
        // If user is authenticated, fetch from server
        if (user) {
          const token = localStorage.getItem("token");
          if (token) {
            const response = await fetch("/api/user/profile", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.ok) {
              const data = await response.json();
              const serverHideAdultContent =
                !data.user?.settings?.showAdultContent;
              setHideAdultContent(serverHideAdultContent);
              // Sync with localStorage
              localStorage.setItem(
                "hideAdultContent",
                JSON.stringify(serverHideAdultContent)
              );
            } else {
              // Fallback to localStorage if API fails
              const stored = localStorage.getItem("hideAdultContent");
              if (stored !== null) {
                setHideAdultContent(JSON.parse(stored));
              }
            }
          }
        } else {
          // If not authenticated, load from localStorage
          const stored = localStorage.getItem("hideAdultContent");
          if (stored !== null) {
            setHideAdultContent(JSON.parse(stored));
          }
        }
      } catch (error) {
        console.error("Error loading adult content setting:", error);
        // Fallback to localStorage on error
        const stored = localStorage.getItem("hideAdultContent");
        if (stored !== null) {
          setHideAdultContent(JSON.parse(stored));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadAdultContentSetting();
  }, [user, mounted]);

  const toggleAdultContent = () => {
    const newValue = !hideAdultContent;
    setHideAdultContent(newValue);
    localStorage.setItem("hideAdultContent", JSON.stringify(newValue));
  };

  return {
    hideAdultContent,
    toggleAdultContent,
    isLoading,
  };
};
