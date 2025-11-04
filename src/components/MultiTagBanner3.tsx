"use client";
import { useEffect } from "react";

interface MultiTagBannerProps {
  isAdultContent?: boolean;
}

export default function MultiTagBanner3({ isAdultContent = false }: MultiTagBannerProps) {
  useEffect(() => {
    if (!isAdultContent) return;

    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "//useful-appearance.com/bGX.VusOdkGulN0sYHWUcw/oepmc9cuqZ/UBlikEPdT_Y-2/OWTKQOzpNfz/UKtsNrjdYG5/NRD/MN3jNFgo";
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
