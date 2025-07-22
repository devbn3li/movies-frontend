// Google Analytics 4 Event Tracking Utilities

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, string | number | boolean | undefined>
    ) => void;
  }
}

// Generic event tracking function
export const trackEvent = (
  eventName: string,
  parameters: {
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: string | number | boolean | undefined;
  } = {}
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, parameters);
  }
};

// Predefined event tracking functions

// Movie/Series interaction events
export const trackPlayButtonClick = (movieTitle: string, movieId: string | number) => {
  trackEvent("play_button_click", {
    event_category: "movie_interaction",
    event_label: movieTitle,
    movie_id: movieId,
    value: 1,
  });
};

export const trackWatchNowClick = (title: string, id: string | number, type: 'movie' | 'series') => {
  trackEvent("watch_now_click", {
    event_category: "engagement",
    event_label: `${type}: ${title}`,
    content_type: type,
    content_id: id,
    value: 1,
  });
};

export const trackMoviePageView = (movieTitle: string, movieId: string | number) => {
  trackEvent("movie_page_view", {
    event_category: "page_view",
    event_label: movieTitle,
    movie_id: movieId,
  });
};

export const trackSeriesPageView = (seriesTitle: string, seriesId: string | number) => {
  trackEvent("series_page_view", {
    event_category: "page_view",
    event_label: seriesTitle,
    series_id: seriesId,
  });
};

// Social interaction events
export const trackShareClick = (title: string, id: string | number, platform?: string) => {
  trackEvent("share_click", {
    event_category: "social_interaction",
    event_label: title,
    content_id: id,
    platform: platform || "unknown",
    value: 1,
  });
};

export const trackDownloadClick = (title: string, id: string | number) => {
  trackEvent("download_click", {
    event_category: "content_download",
    event_label: title,
    content_id: id,
    value: 1,
  });
};

// Watchlist events
export const trackWatchlistAdd = (title: string, id: string | number, type: 'movie' | 'series') => {
  trackEvent("watchlist_add", {
    event_category: "user_engagement",
    event_label: `${type}: ${title}`,
    content_type: type,
    content_id: id,
    value: 1,
  });
};

export const trackWatchlistRemove = (title: string, id: string | number, type: 'movie' | 'series') => {
  trackEvent("watchlist_remove", {
    event_category: "user_engagement",
    event_label: `${type}: ${title}`,
    content_type: type,
    content_id: id,
    value: 1,
  });
};

// Search events
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent("search", {
    event_category: "search",
    event_label: searchTerm,
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

export const trackSearchResultClick = (title: string, id: string | number, position: number) => {
  trackEvent("search_result_click", {
    event_category: "search",
    event_label: title,
    content_id: id,
    position: position,
    value: 1,
  });
};

// Navigation events
export const trackNavigationClick = (linkName: string, destination: string) => {
  trackEvent("navigation_click", {
    event_category: "navigation",
    event_label: linkName,
    destination: destination,
  });
};

// Filter events
export const trackFilterUse = (filterType: string, filterValue: string) => {
  trackEvent("filter_use", {
    event_category: "user_interaction",
    event_label: `${filterType}: ${filterValue}`,
    filter_type: filterType,
    filter_value: filterValue,
  });
};

// Scroll depth tracking
export const trackScrollDepth = (percentage: number, page: string) => {
  trackEvent("scroll_depth", {
    event_category: "user_engagement",
    event_label: `${percentage}% on ${page}`,
    scroll_percentage: percentage,
    page: page,
  });
};

// Page interaction events
export const trackCastMemberClick = (actorName: string, movieTitle: string) => {
  trackEvent("cast_member_click", {
    event_category: "content_interaction",
    event_label: `${actorName} in ${movieTitle}`,
    actor_name: actorName,
    movie_title: movieTitle,
  });
};

export const trackRecommendationClick = (recommendedTitle: string, originalTitle: string) => {
  trackEvent("recommendation_click", {
    event_category: "content_discovery",
    event_label: `${recommendedTitle} from ${originalTitle}`,
    recommended_content: recommendedTitle,
    source_content: originalTitle,
    value: 1,
  });
};

// Auth events
export const trackUserLogin = (method: string = 'email') => {
  trackEvent("login", {
    event_category: "user_auth",
    event_label: `Login via ${method}`,
    method: method,
  });
};

export const trackUserSignup = (method: string = 'email') => {
  trackEvent("sign_up", {
    event_category: "user_auth",
    event_label: `Signup via ${method}`,
    method: method,
  });
};

// Error tracking
export const trackError = (errorType: string, errorMessage: string, page: string) => {
  trackEvent("error", {
    event_category: "error",
    event_label: `${errorType} on ${page}`,
    error_type: errorType,
    error_message: errorMessage,
    page: page,
  });
};

// Performance tracking
export const trackPageLoadTime = (page: string, loadTime: number) => {
  trackEvent("page_load_time", {
    event_category: "performance",
    event_label: page,
    page: page,
    load_time: loadTime,
  });
};
