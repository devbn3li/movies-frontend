/**
 * Reviews configuration and constants
 */

export const REVIEW_CONFIG = {
  // Rating limits
  MIN_RATING: 1,
  MAX_RATING: 5,

  // Comment limits
  MIN_COMMENT_LENGTH: 1,
  MAX_COMMENT_LENGTH: 1000,

  // UI settings
  REVIEWS_PER_PAGE: 10,
  SHOW_RATING_DISTRIBUTION: true,
  ALLOW_EDIT: true,
  ALLOW_DELETE: true,

  // Messages
  MESSAGES: {
    LOGIN_REQUIRED: "Please login to add a review",
    COMMENT_REQUIRED: "Please enter a comment",
    COMMENT_TOO_LONG: "Comment must be less than 1000 characters",
    INVALID_RATING: "Rating must be between 1 and 5",
    DELETE_CONFIRM: "Are you sure you want to delete this review?",
    SUBMIT_ERROR: "Failed to submit review. Please try again.",
    DELETE_ERROR: "Failed to delete review. Please try again.",
    UPDATE_ERROR: "Failed to update review. Please try again.",
  },
};

export const RATING_LABELS = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

export const MEDIA_TYPE_LABELS = {
  movie: "movie",
  tv: "series",
};
