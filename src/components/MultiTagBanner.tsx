"use client";
import { useEffect } from "react";

interface MultiTagBannerProps {
  isAdultContent?: boolean;
}

export default function MultiTagBanner({ isAdultContent = false }: MultiTagBannerProps) {
  useEffect(() => {
    if (!isAdultContent) return;

    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "//useful-appearance.com/b/XUVFscd.Gnla0/YnWHcb/ReSmK9/uDZBUYl/kPPcTxY/2AOjTOMn5gOsDQYgtZNMjxYB5QMUzyk/4hNow_";
      script.async = true;
      script.referrerPolicy = "no-referrer-when-downgrade";
      const bannerElement = document.getElementById("multitag-banner");
      if (bannerElement) {
        bannerElement.appendChild(script);
      }
    }
  }, [isAdultContent]);

  if (!isAdultContent) {
    return null;
  }

  return (
    <div
      id="multitag-banner"
      className="my-4 mx-auto w-full max-w-[300px]"
    ></div>
  );
}
