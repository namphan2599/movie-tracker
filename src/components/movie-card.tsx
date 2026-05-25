'use client';

import React from 'react';
import Link from 'next/link';
import { Movie, TrackedItem } from '@/lib/movie-db';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Play, CheckCircle2, Bookmark, Edit2, Film, Tv } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface MovieCardProps {
  item?: TrackedItem; // if it's already tracked
  movie?: Movie; // if it's just a search result
  onAddToWatchlist?: (movie: Movie) => void; // open collection dialog
  onAdd?: (movie: Movie, status: 'watchlist' | 'watching' | 'watched') => void; // legacy
  onEdit?: (item: TrackedItem) => void;
}

export function MovieCard({ item, movie, onAdd, onEdit, onAddToWatchlist }: MovieCardProps) {
  const currentMovie = item ? item.movie : movie;
  if (!currentMovie) return null;

  const isTracked = !!item;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: 'watchlist' | 'watching' | 'watched') => {
    switch (status) {
      case 'watched':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 gap-1 hover:bg-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Watched
          </Badge>
        );
      case 'watching':
        return (
          <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 gap-1 hover:bg-indigo-500/20">
            <Play className="w-3 h-3" /> Watching
          </Badge>
        );
      case 'watchlist':
        return (
          <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 gap-1 hover:bg-amber-500/20">
            <Bookmark className="w-3 h-3" /> Watchlist
          </Badge>
        );
    }
  };

  // For series, show episodes progress. For movies, show slider percentage.
  const getProgressInfo = () => {
    if (!item || item.status !== 'watching' || !item.progress) return null;
    const { progress } = item;

    if (currentMovie.type === 'series') {
      const watched = progress.episodesWatched || 0;
      const total = progress.episodesTotal || 10;
      const pct = Math.min(100, Math.round((watched / total) * 100));
      return (
        <div className="mt-2.5 space-y-1">
          <div className="flex justify-between text-[11px] text-zinc-400 font-medium">
            <span>S{progress.seasonsWatched || 1} Ep {watched}/{total}</span>
            <span>{pct}%</span>
          </div>
          <Progress value={pct} className="h-1 bg-zinc-800" />
        </div>
      );
    } else {
      const pct = progress.percentage || 0;
      if (pct === 0) return null;
      return (
        <div className="mt-2.5 space-y-1">
          <div className="flex justify-between text-[11px] text-zinc-400 font-medium">
            <span>Progress</span>
            <span>{pct}%</span>
          </div>
          <Progress value={pct} className="h-1 bg-zinc-800" />
        </div>
      );
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-zinc-950 border border-zinc-900 rounded-xl transition-all duration-300 hover:border-zinc-800 hover:shadow-xl hover:shadow-black/50">
      {/* Poster area */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
        <Link href={`/movie/${currentMovie.id}`} className="block h-full w-full cursor-pointer">
          <img
            src={currentMovie.poster}
            alt={currentMovie.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Backdrop overlay for tracked status or hover actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          {!isTracked && onAdd && (
            <div className="flex flex-col gap-1.5 animate-in fade-in-50 slide-in-from-bottom-5 duration-200">
              <p className="text-xs font-semibold text-center mb-1 text-zinc-300">Add to library as:</p>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => onAdd(currentMovie, 'watchlist')}
                  className="px-2 py-1.5 rounded bg-zinc-900/90 text-[10px] text-zinc-200 font-medium hover:bg-amber-600 hover:text-white transition"
                >
                  Watchlist
                </button>
                <button
                  onClick={() => onAdd(currentMovie, 'watching')}
                  className="px-2 py-1.5 rounded bg-zinc-900/90 text-[10px] text-zinc-200 font-medium hover:bg-indigo-600 hover:text-white transition"
                >
                  Watching
                </button>
                <button
                  onClick={() => onAdd(currentMovie, 'watched')}
                  className="px-2 py-1.5 rounded bg-zinc-900/90 text-[10px] text-zinc-200 font-medium hover:bg-emerald-600 hover:text-white transition"
                >
                  Watched
                </button>
              </div>
            </div>
          )}

          {isTracked && onEdit && (
            <button
              onClick={() => onEdit(item)}
              className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-zinc-800 text-white rounded-full transition border border-zinc-800 flex items-center justify-center backdrop-blur-sm"
              title="Edit tracking status"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Type Icon Tag */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 border border-zinc-800/80 backdrop-blur-sm text-[10px] text-zinc-300 font-medium flex items-center gap-1">
          {currentMovie.type === 'series' ? (
            <>
              <Tv className="w-3 h-3 text-indigo-400" />
              <span>TV</span>
            </>
          ) : (
            <>
              <Film className="w-3 h-3 text-emerald-400" />
              <span>Movie</span>
            </>
          )}
        </div>

        {/* Tracked status badge (shown when not hovered) */}
        {isTracked && (
          <div className="absolute bottom-3 left-3 group-hover:hidden transition-all duration-200">
            {getStatusBadge(item.status)}
          </div>
        )}
      </div>

        {/* Buttons */}
        <div className="flex gap-1 mt-2">
          {/* Watchlist button opens dialog */}
          {onAddToWatchlist && (
            <button
              onClick={() => onAddToWatchlist(currentMovie)}
              className="px-2 py-1 rounded bg-amber-600/90 text-xs text-white hover:bg-amber-500 transition"
            >
              Add to Watchlist
            </button>
          )}
          {/* Watching */}
          {onAdd && (
            <button
              onClick={() => onAdd(currentMovie, 'watching')}
              className="px-2 py-1 rounded bg-indigo-600/90 text-xs text-white hover:bg-indigo-500 transition"
            >
              Watching
            </button>
          )}
          {/* Watched */}
          {onAdd && (
            <button
              onClick={() => onAdd(currentMovie, 'watched')}
              className="px-2 py-1 rounded bg-emerald-600/90 text-xs text-white hover:bg-emerald-500 transition"
            >
              Watched
            </button>
          )}
        </div>
      <CardContent className="p-4 bg-zinc-950">
        <div className="space-y-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-zinc-100 text-sm line-clamp-1 group-hover:text-zinc-50 transition-colors">
              <Link href={`/movie/${currentMovie.id}`} className="hover:underline">
                {currentMovie.title}
              </Link>
            </h3>
            <span className="text-xs text-zinc-500 font-medium shrink-0">{currentMovie.year}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-400 line-clamp-1">
              {currentMovie.genre.join(', ')}
            </span>
          </div>

          {/* User rating (only if rated) */}
          {isTracked && item.rating > 0 && (
            <div className="pt-1 flex items-center justify-between">
              {renderStars(item.rating)}
              {item.customTags.length > 0 && (
                <span className="text-[9px] text-zinc-500 font-medium bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded truncate max-w-[100px]">
                  #{item.customTags[0]}
                </span>
              )}
            </div>
          )}

          {/* User Review Note preview if exists */}
          {isTracked && item.notes && (
            <p className="text-[11px] text-zinc-500 line-clamp-1 italic pt-1">
              &ldquo;{item.notes}&rdquo;
            </p>
          )}

          {/* Progress bar for ongoing shows/movies */}
          {getProgressInfo()}
        </div>
      </CardContent>
    </Card>
  );
}
export default MovieCard;
