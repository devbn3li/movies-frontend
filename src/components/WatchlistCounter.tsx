import React from 'react';
import { Heart } from 'lucide-react';
import { useWatchlistStore } from '@/store/watchlist';

const WatchlistCounter: React.FC = () => {
  const { getWatchlistCount } = useWatchlistStore();
  const count = getWatchlistCount();

  if (count === 0) return null;

  return (
    <div className="relative">
      <Heart size={20} className="text-gray-600 dark:text-gray-400" />
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {count > 99 ? '99+' : count}
      </span>
    </div>
  );
};

export default WatchlistCounter;
