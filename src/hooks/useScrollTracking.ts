import { useEffect, useRef } from 'react';
import { trackScrollDepth } from '@/lib/analytics';

interface UseScrollTrackingProps {
  pageName: string;
  enabled?: boolean;
  thresholds?: number[]; // مستويات التمرير للتتبع (مثال: [25, 50, 75, 100])
}

export const useScrollTracking = ({ 
  pageName, 
  enabled = true, 
  thresholds = [25, 50, 75, 100] 
}: UseScrollTrackingProps) => {
  const trackedPercentages = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);

      // تتبع المستويات المحددة فقط
      thresholds.forEach(threshold => {
        if (scrollPercentage >= threshold && !trackedPercentages.current.has(threshold)) {
          trackedPercentages.current.add(threshold);
          trackScrollDepth(threshold, pageName);
        }
      });
    };

    const throttledScroll = throttle(handleScroll, 1000); // تقليل تكرار الاستدعاءات
    window.addEventListener('scroll', throttledScroll);

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [pageName, enabled, thresholds]);

  // إعادة تعيين التتبع عند تغيير الصفحة
  useEffect(() => {
    trackedPercentages.current.clear();
  }, [pageName]);
};

// Throttle function لتقليل عدد استدعاءات الـ scroll
function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function(this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
