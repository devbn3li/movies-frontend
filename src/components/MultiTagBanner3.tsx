"use client";
import { useEffect, useId } from "react";

interface MultiTagBannerProps {
  isAdultContent?: boolean;
}

export default function MultiTagBanner3({ isAdultContent = false }: MultiTagBannerProps) {
  const uniqueId = useId();
  const bannerId = `multitag-banner-3-${uniqueId.replace(/:/g, '-')}`;

  useEffect(() => {
    if (!isAdultContent) return;

    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "//useful-appearance.com/bGX.VusOdkGulN0sYHWUcw/oepmc9cuqZ/UBlikEPdT_Y-2/OWTKQOzpNfz/UKtsNrjdYG5/NRD/MN3jNFgo";
      script.async = true;
      script.referrerPolicy = "no-referrer-when-downgrade";
      const bannerElement = document.getElementById(bannerId);
      if (bannerElement) {
        bannerElement.appendChild(script);
      }
    }
  }, [isAdultContent, bannerId]);

  if (!isAdultContent) {
    return null;
  }

  return (
    <div
      id={bannerId}
      className="relative z-20 w-full h-full overflow-hidden"
      style={{
        display: "inline-block",
        verticalAlign: "top",
      }}
    ></div>
  );
}
