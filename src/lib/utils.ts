import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function containsSensitiveContent(title: string): boolean {
  const sensitiveWords = [
    "sex",
    "porn",
    "xxx",
    "adult",
    "erotic",
    "sexual",
    "nude",
    "naked",
    "strip",
    "seduction",
    "affair",
    "lust",
    "desire",
    "intimate",
    "sensual",
    "passion",
    "temptation",
    "bitch",
  ];

  const titleLower = title.toLowerCase();
  return sensitiveWords.some((word) => titleLower.includes(word));
}

export function shouldHideAdultContent(): boolean {
  if (typeof window === "undefined") return true; // SSR fallback
  const stored = localStorage.getItem("hideAdultContent");
  return stored ? JSON.parse(stored) : true;
}
