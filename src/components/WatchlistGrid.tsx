import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Calendar, Star, Filter } from 'lucide-react';
import { useWatchlistStore, WatchlistItem } from '@/store/watchlist';

interface WatchlistCardProps {
  item: WatchlistItem;
}

const WatchlistCard: React.FC<WatchlistCardProps> = ({ item }) => {
  const { removeFromWatchlist } = useWatchlistStore();

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWatchlist(item.id, item.type);
  };

  const releaseDate = item.type === 'movie' ? item.release_date : item.first_air_date;
  const linkHref = item.type === 'movie' ? `/movie/${item.id}` : `/series/${item.id}`;

  return (
    <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:bg-white/15">
      <Link href={linkHref} className="block">
        <div className="flex gap-4 p-4">
          {/* Poster */}
          <div className="shrink-0 relative">
            <div className="w-24 h-36 relative overflow-hidden rounded-lg">
              <Image
                src={item.poster_url || '/placeholder-movie.jpg'}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="96px"
              />
            </div>

            {/* Remove button */}
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
              title="Remove from Watchlist"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-white text-lg line-clamp-2 flex-1">
                {item.title}
              </h3>
              <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-lg shrink-0">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-white">{item.vote_average.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex items-center text-sm text-white/70 mb-3">
              <Calendar size={14} className="mr-1" />
              <span>
                {releaseDate ? new Date(releaseDate).getFullYear() : 'Unknown'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs bg-blue-500/80 text-white px-2 py-1 rounded-full">
                {item.type === 'movie' ? 'Movie' : 'TV Show'}
              </span>
              <span className="text-xs text-white/50">
                Added {new Date(item.addedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

const WatchlistGrid: React.FC = () => {
  const { watchlist, clearWatchlist } = useWatchlistStore();
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'title'>('newest');

  const filteredWatchlist = watchlist
    .filter(item => filter === 'all' || item.type === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case 'oldest':
          return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
        case 'rating':
          return b.vote_average - a.vote_average;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  if (watchlist.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎬</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Watchlist is empty
        </h3>
        <p className="text-white/70">
          Start adding your favorite movies and TV shows
        </p>
      </div>
    );
  }

  return (
    <div>
      <style jsx>{`
        select option {
          background-color: #1f2937;
          color: white;
        }
      `}</style>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">
          My Watchlist ({filteredWatchlist.length})
        </h2>

        <div className="flex flex-wrap items-center gap-4">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-white/70" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'movie' | 'tv')}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/40"
            >
              <option value="all">All</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'rating' | 'title')}
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/40"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="rating">Rating</option>
            <option value="title">Title</option>
          </select>

          <button
            onClick={clearWatchlist}
            className="bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm backdrop-blur-md"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWatchlist.map((item) => (
          <WatchlistCard key={`${item.type}-${item.id}`} item={item} />
        ))}
      </div>
    </div>
  );
};

export default WatchlistGrid;
