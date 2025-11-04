"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 60, // 1 hour - البيانات تبقى "fresh" لمدة ساعة
        gcTime: 1000 * 60 * 60 * 24, // 24 hours - البيانات تبقى في الـ cache لمدة 24 ساعة
        refetchOnWindowFocus: false, // لا نعيد الـ fetch عند focus على النافذة
        refetchOnReconnect: false, // لا نعيد الـ fetch عند إعادة الاتصال
        retry: 1, // محاولة واحدة فقط عند الفشل
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
