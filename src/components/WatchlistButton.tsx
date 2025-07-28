import React from 'react';
import { Heart } from 'lucide-react';
import { useWatchlistStore } from '@/store/watchlist';
import { trackWatchlistAdd, trackWatchlistRemove } from '@/lib/analytics';
import { Movie, TVShow } from '@/types';

interface WatchlistButtonProps {
  item: Movie | TVShow;
  type: 'movie' | 'tv';
  className?: string;
  showText?: boolean;
}

const WatchlistButton: React.FC<WatchlistButtonProps> = ({
  item,
  type,
  className = '',
  showText = false
}) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlistStore();
  const inWatchlist = isInWatchlist(item.id, type);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const title = 'title' in item ? item.title : item.name;
    const contentType = type === 'tv' ? 'series' : 'movie';

    if (inWatchlist) {
      removeFromWatchlist(item.id, type);
      // Track Analytics event
      trackWatchlistRemove(title || 'Unknown', item.id, contentType);
    } else {
      addToWatchlist(item, type);
      // Track Analytics event
      trackWatchlistAdd(title || 'Unknown', item.id, contentType);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`group flex items-center gap-2 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-md border border-white/20 ${inWatchlist
        ? 'bg-red-500/80 hover:bg-red-600/90 text-white shadow-lg shadow-red-500/20'
        : 'bg-white/10 hover:bg-white/20 text-white hover:shadow-lg shadow-black/10'
        } ${className}`}
      title={inWatchlist ? 'Remove from favourites' : 'Add to favourites'}
    >
      <Heart
        size={20}
        className={`transition-all duration-300 ${inWatchlist
          ? 'fill-current animate-pulse'
          : 'group-hover:scale-110'
          }`}
      />
      {showText && (
        <span className="text-sm font-medium transition-all duration-300">
          {inWatchlist ? 'In favourites' : 'Add to favourites'}
        </span>
      )}
    </button>
  );
};

export default WatchlistButton;
