import React, { ReactElement } from "react";
import { Review } from "@/types/index";

/**
 * Helper functions for Reviews component
 */

/**
 * Format date for review display
 */
export const formatReviewDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Render star rating
 */
export const renderStars = (rating: number): ReactElement[] => {
  return Array.from({ length: 5 }, (_, i) =>
    React.createElement(
      "span",
      {
        key: i,
        className: `text-xl ${
          i < rating ? "text-yellow-400" : "text-gray-400"
        }`,
      },
      "⭐"
    )
  );
};

/**
 * Calculate percentage for rating distribution
 */
export const calculateRatingPercentage = (
  count: number,
  total: number
): number => {
  return total > 0 ? (count / total) * 100 : 0;
};

/**
 * Get user initials for avatar
 */
export const getUserInitials = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

/**
 * Validate review input
 */
export const validateReviewInput = (
  comment: string,
  rating: number
): { isValid: boolean; error?: string } => {
  if (!comment.trim()) {
    return { isValid: false, error: "Please enter a comment" };
  }

  if (rating < 1 || rating > 5) {
    return { isValid: false, error: "Rating must be between 1 and 5" };
  }

  if (comment.length > 1000) {
    return {
      isValid: false,
      error: "Comment must be less than 1000 characters",
    };
  }

  return { isValid: true };
};

/**
 * Sort reviews by date (newest first)
 */
export const sortReviewsByDate = (reviews: Review[]): Review[] => {
  return reviews.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};
