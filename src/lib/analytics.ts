// Google Analytics 4 Event Tracking Utilities

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'set',
      targetId: string,
      config?: Record<string, string | number | boolean | undefined | null>
    ) => void;
    dataLayer: unknown[];
  }
}

// Generic event tracking function
export const trackEvent = (
  eventName: string,
  parameters: {
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: string | number | boolean | undefined | null;
  } = {}
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, {
      ...parameters,
      timestamp: new Date().toISOString(),
    });
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

// ============ ENHANCED USER BEHAVIOR TRACKING ============

// Track time spent on page
export const trackTimeOnPage = (page: string, timeInSeconds: number) => {
  trackEvent("time_on_page", {
    event_category: "user_engagement",
    event_label: page,
    page: page,
    time_seconds: timeInSeconds,
    time_minutes: Math.round(timeInSeconds / 60),
  });
};

// Track user session info
export const trackSessionStart = () => {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  if (typeof window !== "undefined") {
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  trackEvent("session_start", {
    event_category: "session",
    session_id: sessionId,
    referrer: typeof document !== "undefined" ? document.referrer : null,
    landing_page: typeof window !== "undefined" ? window.location.pathname : null,
  });
  return sessionId;
};

// Track user exit intent (when mouse leaves viewport)
export const trackExitIntent = (page: string, timeOnPage: number) => {
  trackEvent("exit_intent", {
    event_category: "user_behavior",
    event_label: page,
    page: page,
    time_on_page: timeOnPage,
  });
};

// Track button clicks with context
export const trackButtonClick = (
  buttonName: string, 
  buttonLocation: string, 
  additionalData?: Record<string, string | number>
) => {
  trackEvent("button_click", {
    event_category: "user_interaction",
    event_label: buttonName,
    button_name: buttonName,
    button_location: buttonLocation,
    ...additionalData,
  });
};

// Track video player interactions
export const trackVideoInteraction = (
  action: 'play' | 'pause' | 'seek' | 'complete' | 'error',
  videoTitle: string,
  videoId: string | number,
  currentTime?: number,
  duration?: number
) => {
  trackEvent("video_interaction", {
    event_category: "video_engagement",
    event_label: `${action}: ${videoTitle}`,
    video_action: action,
    video_title: videoTitle,
    video_id: videoId,
    current_time: currentTime,
    duration: duration,
    progress_percent: duration && currentTime ? Math.round((currentTime / duration) * 100) : null,
  });
};

// Track trailer watch
export const trackTrailerWatch = (
  movieTitle: string, 
  movieId: string | number,
  watchDuration: number,
  totalDuration: number
) => {
  const completionRate = Math.round((watchDuration / totalDuration) * 100);
  trackEvent("trailer_watch", {
    event_category: "content_engagement",
    event_label: movieTitle,
    movie_id: movieId,
    watch_duration: watchDuration,
    total_duration: totalDuration,
    completion_rate: completionRate,
    completed: completionRate >= 90,
  });
};

// Track genre/category interest
export const trackGenreInterest = (genre: string, action: 'browse' | 'filter' | 'click') => {
  trackEvent("genre_interest", {
    event_category: "content_discovery",
    event_label: genre,
    genre: genre,
    action: action,
  });
};

// Track page visibility changes (when user switches tabs)
export const trackPageVisibility = (isVisible: boolean, page: string, timeHidden?: number) => {
  trackEvent("page_visibility", {
    event_category: "user_behavior",
    event_label: isVisible ? "page_visible" : "page_hidden",
    page: page,
    is_visible: isVisible,
    time_hidden_seconds: timeHidden,
  });
};

// Track user device/screen info
export const trackDeviceInfo = () => {
  if (typeof window === "undefined") return;
  
  trackEvent("device_info", {
    event_category: "technical",
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    device_pixel_ratio: window.devicePixelRatio,
    is_mobile: window.innerWidth < 768,
    is_tablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    is_desktop: window.innerWidth >= 1024,
    connection_type: (navigator as unknown as { connection?: { effectiveType?: string } })?.connection?.effectiveType || 'unknown',
  });
};

// Track content card hover (shows interest)
export const trackCardHover = (title: string, id: string | number, type: 'movie' | 'series', hoverDuration: number) => {
  // Only track meaningful hovers (more than 1 second)
  if (hoverDuration < 1000) return;
  
  trackEvent("card_hover", {
    event_category: "user_interest",
    event_label: title,
    content_id: id,
    content_type: type,
    hover_duration_ms: hoverDuration,
  });
};

// Track infinite scroll loads
export const trackInfiniteScrollLoad = (page: string, pageNumber: number, itemsLoaded: number) => {
  trackEvent("infinite_scroll_load", {
    event_category: "user_engagement",
    event_label: `Page ${pageNumber} on ${page}`,
    page: page,
    page_number: pageNumber,
    items_loaded: itemsLoaded,
  });
};

// Track rating/review interactions
export const trackRatingInteraction = (
  contentTitle: string,
  contentId: string | number,
  rating: number,
  action: 'view' | 'submit' | 'update'
) => {
  trackEvent("rating_interaction", {
    event_category: "user_feedback",
    event_label: `${action}: ${contentTitle}`,
    content_id: contentId,
    rating: rating,
    action: action,
  });
};

// Track external link clicks
export const trackExternalLinkClick = (url: string, linkText: string, page: string) => {
  trackEvent("external_link_click", {
    event_category: "outbound",
    event_label: linkText,
    destination_url: url,
    source_page: page,
  });
};
