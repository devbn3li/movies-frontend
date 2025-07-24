"use client";

import { useEffect, useState } from 'react';

interface PerformanceData {
  bundleSize: number;
  loadTime: number;
  componentsLoaded: string[];
  totalChunks: number;
}

export const useCodeSplittingAnalytics = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    bundleSize: 0,
    loadTime: 0,
    componentsLoaded: [],
    totalChunks: 0,
  });

  useEffect(() => {
    // Monitor performance when components load
    const performanceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          setPerformanceData(prev => ({
            ...prev,
            loadTime: navEntry.loadEventEnd - navEntry.fetchStart,
          }));
        }

        if (entry.entryType === 'resource' && entry.name.includes('chunk')) {
          const resourceEntry = entry as PerformanceResourceTiming;
          setPerformanceData(prev => ({
            ...prev,
            bundleSize: prev.bundleSize + (resourceEntry.transferSize || 0),
            totalChunks: prev.totalChunks + 1,
          }));
        }
      });
    });

    performanceObserver.observe({ entryTypes: ['navigation', 'resource'] });

    return () => {
      performanceObserver.disconnect();
    };
  }, []);

  const trackComponentLoad = (componentName: string) => {
    setPerformanceData(prev => ({
      ...prev,
      componentsLoaded: [...prev.componentsLoaded, componentName],
    }));

    // Simple console logging for now (can be replaced with real analytics)
    console.log(`📊 Component loaded: ${componentName} at ${performance.now()}ms`);
  };

  return {
    performanceData,
    trackComponentLoad,
  };
};// HOC to track component loading
export function withLoadingTracking<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  componentName: string
) {
  return function TrackedComponent(props: T) {
    const { trackComponentLoad } = useCodeSplittingAnalytics();

    useEffect(() => {
      trackComponentLoad(componentName);
    }, [trackComponentLoad]);

    return <WrappedComponent {...props} />;
  };
}

// Performance display component for development
export const CodeSplittingStats = () => {
  const { performanceData } = useCodeSplittingAnalytics();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-xs">
      <h4 className="font-bold mb-2">Code Splitting Stats</h4>
      <div className="space-y-1">
        <div>Bundle Size: {(performanceData.bundleSize / 1024).toFixed(2)} KB</div>
        <div>Load Time: {performanceData.loadTime.toFixed(2)} ms</div>
        <div>Total Chunks: {performanceData.totalChunks}</div>
        <div>Components Loaded: {performanceData.componentsLoaded.length}</div>
      </div>

      {performanceData.componentsLoaded.length > 0 && (
        <details className="mt-2">
          <summary className="cursor-pointer">Components</summary>
          <ul className="mt-1 ml-2">
            {performanceData.componentsLoaded.map((component, index) => (
              <li key={index}>{component}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
};
