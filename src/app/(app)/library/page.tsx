'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMovies } from '@/hooks/use-movies';
import { MovieCard } from '@/components/movie-card';
import { MovieDialog } from '@/components/movie-dialog';
import { AddToWatchlistDialog } from '@/components/add-to-watchlist-dialog';
import { Movie, TrackedItem } from '@/lib/movie-db';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FolderHeart, Loader2, Search, SlidersHorizontal } from 'lucide-react';

export default function LibraryPage() {
  const router = useRouter();
  const { mounted, trackedItems, updateTrackedItem, removeMovie } = useMovies();

  const [watchlistDialogOpen, setWatchlistDialogOpen] = useState(false);
  const [selectedMovieForWatchlist, setSelectedMovieForWatchlist] = useState<Movie | null>(null);
  const [editingItem, setEditingItem] = useState<TrackedItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [libSearch, setLibSearch] = useState('');
  const [libStatus, setLibStatus] = useState<string>('all');
  const [libType, setLibType] = useState<string>('all');
  const [libGenre, setLibGenre] = useState<string>('all');
  const [libSort, setLibSort] = useState<string>('added-desc');
  const [showFilters, setShowFilters] = useState(false);

  const openWatchlistDialog = (movie: Movie) => {
    setSelectedMovieForWatchlist(movie);
    setWatchlistDialogOpen(true);
  };

  const handleEditClick = (item: TrackedItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  if (!mounted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-700 mb-3" />
        <span className="text-xs font-mono tracking-widest uppercase">Initializing Cinephile...</span>
      </div>
    );
  }

  const allGenresInLibrary = Array.from(new Set(trackedItems.flatMap((item) => item.movie.genre))).sort();

  const filteredLibrary = trackedItems
    .filter((item) => {
      const q = libSearch.toLowerCase();
      const matchesText =
        item.movie.title.toLowerCase().includes(q) ||
        item.movie.director.toLowerCase().includes(q) ||
        item.notes.toLowerCase().includes(q) ||
        item.customTags.some((t) => t.toLowerCase().includes(q));

      const matchesStatus = libStatus === 'all' || item.status === libStatus;
      const matchesType = libType === 'all' || item.movie.type === libType;
      const matchesGenre = libGenre === 'all' || item.movie.genre.includes(libGenre);

      return matchesText && matchesStatus && matchesType && matchesGenre;
    })
    .sort((a, b) => {
      switch (libSort) {
        case 'added-desc':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case 'added-asc':
          return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        case 'rating-desc':
          return b.rating - a.rating;
        case 'rating-asc':
          return a.rating - b.rating;
        case 'title-asc':
          return a.movie.title.localeCompare(b.movie.title);
        case 'title-desc':
          return b.movie.title.localeCompare(a.movie.title);
        case 'year-desc':
          return parseInt(b.movie.year, 10) - parseInt(a.movie.year, 10);
        case 'year-asc':
          return parseInt(a.movie.year, 10) - parseInt(b.movie.year, 10);
        default:
          return 0;
      }
    });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-6 flex-1 flex flex-col"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-zinc-900/30 p-3 rounded-xl border border-zinc-900">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Filter by title, director, tags, notes..."
              value={libSearch}
              onChange={(e) => setLibSearch(e.target.value)}
              className="pl-9 bg-zinc-950 border-zinc-850 text-zinc-200 text-xs placeholder:text-zinc-600 rounded-lg h-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`border-zinc-850 text-xs h-9 rounded-lg px-3.5 flex items-center gap-2 ${
                showFilters ? 'bg-zinc-900 text-zinc-100' : 'hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </Button>

            <Select value={libSort} onValueChange={(val) => setLibSort(val || 'added-desc')}>
              <SelectTrigger className="w-[155px] bg-zinc-950 border-zinc-850 text-zinc-400 text-xs rounded-lg h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-850 text-zinc-355">
                <SelectItem value="added-desc" className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer text-xs">Date Added (New)</SelectItem>
                <SelectItem value="added-asc" className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer text-xs">Date Added (Old)</SelectItem>
                <SelectItem value="rating-desc" className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer text-xs">Rating (High)</SelectItem>
                <SelectItem value="rating-asc" className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer text-xs">Rating (Low)</SelectItem>
                <SelectItem value="title-asc" className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer text-xs">Title (A-Z)</SelectItem>
                <SelectItem value="title-desc" className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer text-xs">Title (Z-A)</SelectItem>
                <SelectItem value="year-desc" className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer text-xs">Release Year (New)</SelectItem>
                <SelectItem value="year-asc" className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer text-xs">Release Year (Old)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-zinc-900/10 p-3 rounded-lg border border-zinc-900/60 animate-in fade-in-50 slide-in-from-top-2 duration-150">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Status</label>
              <Select value={libStatus} onValueChange={(val) => setLibStatus(val || 'all')}>
                <SelectTrigger className="w-full bg-zinc-950 border-zinc-850 text-zinc-300 text-xs h-8">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-850 text-zinc-200">
                  <SelectItem value="all" className="cursor-pointer text-xs">All Statuses</SelectItem>
                  <SelectItem value="watchlist" className="cursor-pointer text-xs">Watchlist</SelectItem>
                  <SelectItem value="watching" className="cursor-pointer text-xs">Currently Watching</SelectItem>
                  <SelectItem value="watched" className="cursor-pointer text-xs">Watched</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Type</label>
              <Select value={libType} onValueChange={(val) => setLibType(val || 'all')}>
                <SelectTrigger className="w-full bg-zinc-950 border-zinc-850 text-zinc-300 text-xs h-8">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-850 text-zinc-200">
                  <SelectItem value="all" className="cursor-pointer text-xs">All Types</SelectItem>
                  <SelectItem value="movie" className="cursor-pointer text-xs">Movies</SelectItem>
                  <SelectItem value="series" className="cursor-pointer text-xs">TV Series</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Genre</label>
              <Select value={libGenre} onValueChange={(val) => setLibGenre(val || 'all')}>
                <SelectTrigger className="w-full bg-zinc-950 border-zinc-850 text-zinc-300 text-xs h-8">
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-850 text-zinc-200">
                  <SelectItem value="all" className="cursor-pointer text-xs">All Genres</SelectItem>
                  {allGenresInLibrary.map((g) => (
                    <SelectItem key={g} value={g} className="cursor-pointer text-xs">
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {filteredLibrary.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredLibrary.map((item) => (
              <MovieCard
                key={item.id}
                item={item}
                onEdit={handleEditClick}
                onAddToWatchlist={openWatchlistDialog}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20 border border-dashed border-zinc-900 rounded-2xl">
            <FolderHeart className="w-10 h-10 text-zinc-700 mb-3" />
            <h3 className="text-sm font-semibold text-zinc-400">No items found</h3>
            <p className="text-xs text-zinc-600 mt-1 max-w-[280px]">
              {trackedItems.length === 0
                ? 'Your movie tracking library is empty. Head to Discover to add movies!'
                : 'Try adjusting your search queries or filter dropdown selections.'}
            </p>
            {trackedItems.length === 0 && (
              <Button
                onClick={() => router.push('/discover')}
                className="mt-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold h-8 rounded-lg px-4"
              >
                Go to Discover
              </Button>
            )}
          </div>
        )}
      </motion.div>

      <MovieDialog
        item={editingItem}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingItem(null);
        }}
        onUpdate={updateTrackedItem}
        onRemove={removeMovie}
      />
      <AddToWatchlistDialog
        isOpen={watchlistDialogOpen}
        onClose={() => setWatchlistDialogOpen(false)}
        movie={selectedMovieForWatchlist}
      />
    </>
  );
}
