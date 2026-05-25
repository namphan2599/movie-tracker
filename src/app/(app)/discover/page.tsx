'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMovies } from '@/hooks/use-movies';
import { MovieCard } from '@/components/movie-card';
import { MovieDialog } from '@/components/movie-dialog';
import { AddToWatchlistDialog } from '@/components/add-to-watchlist-dialog';
import { Movie, TrackedItem, DISCOVER_CATEGORIES, MOCK_MOVIES } from '@/lib/movie-db';
import {
  DiscoverFilters,
  filterDiscoverMovies,
  getDiscoverGenreOptions,
  paginateDiscoverMovies,
} from '@/lib/discover-filters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Search, Loader2, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

const DEFAULT_FILTERS: DiscoverFilters = {
  type: 'all',
  genre: 'all',
  yearMin: '',
  yearMax: '',
  ratingMin: '',
  director: '',
  actor: '',
  runtimeMax: '',
  sort: 'relevance',
};

const PAGE_SIZE = 10;

function CategoryRow({
  title,
  movies,
  trackedItems,
  onAdd,
  onEdit,
  onAddToWatchlist,
  subtitle,
  onMore,
}: {
  title: string;
  movies: Movie[];
  trackedItems: TrackedItem[];
  onAdd?: (movie: Movie, status: 'watchlist' | 'watching' | 'watched') => void;
  onEdit?: (item: TrackedItem) => void;
  onAddToWatchlist?: (movie: Movie) => void;
  subtitle?: string;
  onMore?: () => void;
}) {
  const rowRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="space-y-3 relative group/row">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
          {title}
        </span>
        <div className="flex items-center gap-3">
          {subtitle && (
            <span className="text-[10px] text-zinc-600 italic font-mono hidden sm:inline">
              {subtitle}
            </span>
          )}
          {onMore && (
            <button
              onClick={onMore}
              className="text-[10px] font-semibold font-mono tracking-wider uppercase text-indigo-400 hover:text-indigo-300 transition cursor-pointer flex items-center gap-1"
            >
              More &rarr;
            </button>
          )}
        </div>
      </div>

      <div className="relative px-1">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-zinc-950/80 border border-zinc-800 text-zinc-400 hover:text-zinc-150 hover:bg-zinc-900/90 transition-all opacity-0 group-hover/row:opacity-100 -left-2 sm:-left-4 focus:opacity-100 shadow-md backdrop-blur-sm cursor-pointer"
          title="Scroll Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-zinc-950/80 border border-zinc-800 text-zinc-400 hover:text-zinc-150 hover:bg-zinc-900/90 transition-all opacity-0 group-hover/row:opacity-100 -right-2 sm:-right-4 focus:opacity-100 shadow-md backdrop-blur-sm cursor-pointer"
          title="Scroll Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div ref={rowRef} className="flex gap-4 overflow-x-auto py-2 scroll-smooth no-scrollbar">
          {movies.map((movie) => (
            <div key={movie.id} className="w-[155px] sm:w-[170px] shrink-0">
              <MovieCard
                movie={movie}
                item={trackedItems.find((i) => i.id === movie.id)}
                onAdd={onAdd}
                onEdit={onEdit}
                onAddToWatchlist={onAddToWatchlist}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const router = useRouter();
  const {
    mounted,
    trackedItems,
    apiSettings,
    searchResult,
    isSearching,
    trendingMovies,
    isLoadingTrending,
    categoryMovies,
    isLoadingCategories,
    addMovie,
    searchMovies,
    updateTrackedItem,
    removeMovie,
  } = useMovies();

  const [watchlistDialogOpen, setWatchlistDialogOpen] = useState(false);
  const [selectedMovieForWatchlist, setSelectedMovieForWatchlist] = useState<Movie | null>(null);
  const [editingItem, setEditingItem] = useState<TrackedItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailsFilter, setShowDetailsFilter] = useState(false);
  const [detailsFilters, setDetailsFilters] = useState<DiscoverFilters>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const openWatchlistDialog = (movie: Movie) => {
    setSelectedMovieForWatchlist(movie);
    setWatchlistDialogOpen(true);
  };

  const handleEditClick = (item: TrackedItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    searchMovies(searchQuery);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setCurrentPage(1);
    searchMovies('');
  };

  const updateFilter = (key: keyof DiscoverFilters, value: string) => {
    setDetailsFilters((current) => ({ ...current, [key]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setDetailsFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const allSearchGenres = getDiscoverGenreOptions(
    searchResult,
    MOCK_MOVIES,
    DISCOVER_CATEGORIES.map((category) => category.name)
  );
  const filteredSearchResult = filterDiscoverMovies(searchResult, detailsFilters);
  const paginatedSearchResult = paginateDiscoverMovies(filteredSearchResult, currentPage, PAGE_SIZE);
  const hasActiveFilters = Object.entries(detailsFilters).some(([key, value]) => {
    if (key === 'type' || key === 'genre') return value !== 'all';
    if (key === 'sort') return value !== 'relevance';
    return value.length > 0;
  });

  if (!mounted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-700 mb-3" />
        <span className="text-xs font-mono tracking-widest uppercase">Initializing Cinephile...</span>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-6 flex-1 flex flex-col"
      >
        <div className="space-y-3 rounded-xl border border-zinc-900 bg-zinc-900/20 p-3">
          <form onSubmit={handleSearchSubmit} className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <Input
                placeholder={
                  apiSettings.tmdbApiKey || apiSettings.omdbApiKey
                    ? 'Search live database...'
                    : 'Search curated mock database (e.g., Inception, Breaking Bad)...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 bg-zinc-950 border-zinc-800 text-zinc-200 text-xs placeholder:text-zinc-600 rounded-lg h-9.5"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleSearchClear}
                  className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDetailsFilter(!showDetailsFilter)}
                className={`border-zinc-850 text-xs h-9.5 rounded-lg px-3.5 flex items-center gap-2 ${
                  showDetailsFilter || hasActiveFilters
                    ? 'bg-zinc-900 text-zinc-100'
                    : 'hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Details</span>
              </Button>
              <Button
                type="submit"
                disabled={isSearching}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold text-xs h-9.5 px-4 rounded-lg flex items-center gap-1.5 shrink-0"
              >
                {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Search</span>
              </Button>
            </div>
          </form>

          {showDetailsFilter && (
            <div className="grid grid-cols-1 gap-3 border-t border-zinc-900 pt-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Type</label>
                <Select value={detailsFilters.type} onValueChange={(value) => updateFilter('type', value || 'all')}>
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
                <Select value={detailsFilters.genre} onValueChange={(value) => updateFilter('genre', value || 'all')}>
                  <SelectTrigger className="w-full bg-zinc-950 border-zinc-850 text-zinc-300 text-xs h-8">
                    <SelectValue placeholder="All Genres" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-850 text-zinc-200">
                    <SelectItem value="all" className="cursor-pointer text-xs">All Genres</SelectItem>
                    {allSearchGenres.map((genre) => (
                      <SelectItem key={genre} value={genre} className="cursor-pointer text-xs">
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Year Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={detailsFilters.yearMin} onChange={(e) => updateFilter('yearMin', e.target.value)} placeholder="From" className="bg-zinc-950 border-zinc-850 text-zinc-300 text-xs h-8" />
                  <Input value={detailsFilters.yearMax} onChange={(e) => updateFilter('yearMax', e.target.value)} placeholder="To" className="bg-zinc-950 border-zinc-850 text-zinc-300 text-xs h-8" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Sort</label>
                <Select value={detailsFilters.sort} onValueChange={(value) => updateFilter('sort', value || 'relevance')}>
                  <SelectTrigger className="w-full bg-zinc-950 border-zinc-850 text-zinc-300 text-xs h-8">
                    <SelectValue placeholder="Relevance" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-850 text-zinc-200">
                    <SelectItem value="relevance" className="cursor-pointer text-xs">Relevance</SelectItem>
                    <SelectItem value="title-asc" className="cursor-pointer text-xs">Title (A-Z)</SelectItem>
                    <SelectItem value="title-desc" className="cursor-pointer text-xs">Title (Z-A)</SelectItem>
                    <SelectItem value="year-desc" className="cursor-pointer text-xs">Year (New)</SelectItem>
                    <SelectItem value="year-asc" className="cursor-pointer text-xs">Year (Old)</SelectItem>
                    <SelectItem value="rating-desc" className="cursor-pointer text-xs">Rating (High)</SelectItem>
                    <SelectItem value="rating-asc" className="cursor-pointer text-xs">Rating (Low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Input value={detailsFilters.ratingMin} onChange={(e) => updateFilter('ratingMin', e.target.value)} placeholder="Minimum rating" className="bg-zinc-950 border-zinc-850 text-zinc-300 text-xs h-8" />
              <Input value={detailsFilters.director} onChange={(e) => updateFilter('director', e.target.value)} placeholder="Director contains..." className="bg-zinc-950 border-zinc-850 text-zinc-300 text-xs h-8" />
              <Input value={detailsFilters.actor} onChange={(e) => updateFilter('actor', e.target.value)} placeholder="Actor contains..." className="bg-zinc-950 border-zinc-850 text-zinc-300 text-xs h-8" />
              <div className="flex gap-2">
                <Input value={detailsFilters.runtimeMax} onChange={(e) => updateFilter('runtimeMax', e.target.value)} placeholder="Max runtime" className="bg-zinc-950 border-zinc-850 text-zinc-300 text-xs h-8" />
                <Button type="button" variant="outline" onClick={resetFilters} className="h-8 border-zinc-850 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200">
                  Reset
                </Button>
              </div>
            </div>
          )}
        </div>

        {isSearching ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24 text-zinc-500">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-700 mb-2" />
            <span className="text-xs">Searching titles...</span>
          </div>
        ) : searchResult.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest block">
                Search Results · {filteredSearchResult.length} of {searchResult.length}
              </span>
              <span className="text-[10px] text-zinc-600 font-mono">
                Page {paginatedSearchResult.currentPage} / {paginatedSearchResult.totalPages}
              </span>
            </div>
            {paginatedSearchResult.items.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {paginatedSearchResult.items.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      item={trackedItems.find((i) => i.id === movie.id)}
                      onAdd={addMovie}
                      onEdit={handleEditClick}
                      onAddToWatchlist={openWatchlistDialog}
                    />
                  ))}
                </div>
                {paginatedSearchResult.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <Button type="button" variant="outline" disabled={paginatedSearchResult.currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)} className="h-8 border-zinc-850 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 disabled:opacity-40">
                      Previous
                    </Button>
                    <Button type="button" variant="outline" disabled={paginatedSearchResult.currentPage === paginatedSearchResult.totalPages} onClick={() => setCurrentPage((page) => page + 1)} className="h-8 border-zinc-850 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 disabled:opacity-40">
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-zinc-900 rounded-2xl">
                <Search className="w-8 h-8 text-zinc-700 mb-2" />
                <span className="text-sm font-semibold text-zinc-500">No filtered matches</span>
                <p className="text-[11px] text-zinc-650 mt-1 max-w-[280px]">Try clearing one or more details filters.</p>
              </div>
            )}
          </div>
        ) : searchQuery ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-900 rounded-2xl">
            <Search className="w-8 h-8 text-zinc-700 mb-2" />
            <span className="text-sm font-semibold text-zinc-500">No matches found</span>
            <p className="text-[11px] text-zinc-650 mt-1 max-w-[280px]">
              Could not find any items matching &ldquo;{searchQuery}&rdquo;.
            </p>
          </div>
        ) : isLoadingTrending || isLoadingCategories ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24 text-zinc-500">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-700 mb-2" />
            <span className="text-xs">Loading discover feed...</span>
          </div>
        ) : (
          <div className="space-y-8 pb-10">
            {apiSettings.tmdbApiKey && trendingMovies.length > 0 ? (
              <CategoryRow
                title="Trending Movies this Week"
                subtitle="Live TMDB Feed"
                movies={trendingMovies}
                trackedItems={trackedItems}
                onAdd={addMovie}
                onEdit={handleEditClick}
                onAddToWatchlist={openWatchlistDialog}
              />
            ) : (
              <CategoryRow
                title="Suggested Titles"
                subtitle="Offline Mode"
                movies={MOCK_MOVIES.slice(0, 10)}
                trackedItems={trackedItems}
                onAdd={addMovie}
                onEdit={handleEditClick}
                onAddToWatchlist={openWatchlistDialog}
              />
            )}

            {DISCOVER_CATEGORIES.map((cat) => {
              const movies = apiSettings.tmdbApiKey
                ? (categoryMovies[cat.id] || [])
                : MOCK_MOVIES.filter((movie: Movie) => movie.genre.includes(cat.mockName));

              return (
                <CategoryRow
                  key={cat.id}
                  title={`Popular in ${cat.name}`}
                  subtitle={apiSettings.tmdbApiKey ? 'Live TMDB Feed' : 'Curated Collection'}
                  movies={movies}
                  trackedItems={trackedItems}
                  onAdd={addMovie}
                  onEdit={handleEditClick}
                  onAddToWatchlist={openWatchlistDialog}
                  onMore={() => router.push(`/category/${cat.id}`)}
                />
              );
            })}
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
