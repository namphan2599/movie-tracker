'use client';

import React, { useState } from 'react';
import { useMovies } from '@/hooks/use-movies';
import { MovieCard } from '@/components/movie-card';
import { MovieDialog } from '@/components/movie-dialog';
import { AnalyticsDashboard } from '@/components/analytics-dashboard';
import { SettingsPanel } from '@/components/settings-panel';
import { Movie, TrackedItem } from '@/lib/movie-db';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Compass,
  Film,
  Plus,
  Search,
  Settings,
  BarChart3,
  SlidersHorizontal,
  FolderHeart,
  Loader2,
  X,
  Flame,
} from 'lucide-react';

export default function Home() {
  const {
    mounted,
    trackedItems,
    apiSettings,
    searchResult,
    isSearching,
    trendingMovies,
    isLoadingTrending,
    saveApiSettings,
    addMovie,
    updateTrackedItem,
    removeMovie,
    searchMovies,
    importLibrary,
    clearDatabase,
    stats,
  } = useMovies();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'library' | 'discover' | 'analytics' | 'settings'>('library');

  // Dialog state
  const [editingItem, setEditingItem] = useState<TrackedItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Discover search query
  const [searchQuery, setSearchQuery] = useState('');

  // Library filters & sorting state
  const [libSearch, setLibSearch] = useState('');
  const [libStatus, setLibStatus] = useState<string>('all');
  const [libType, setLibType] = useState<string>('all');
  const [libGenre, setLibGenre] = useState<string>('all');
  const [libSort, setLibSort] = useState<string>('added-desc');
  const [showFilters, setShowFilters] = useState(false);

  if (!mounted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-700 mb-3" />
        <span className="text-xs font-mono tracking-widest uppercase">Initializing Cinephile...</span>
      </div>
    );
  }

  // Handle Discover Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchMovies(searchQuery);
  };

  // Handle Discover Search Clear
  const handleSearchClear = () => {
    setSearchQuery('');
    searchMovies('');
  };

  // Get list of unique genres in library for filter dropdown
  const allGenresInLibrary = Array.from(
    new Set(trackedItems.flatMap((item) => item.movie.genre))
  ).sort();

  // Filter and Sort tracked library items
  const filteredLibrary = trackedItems
    .filter((item) => {
      // 1. Text filter (Title, director, notes)
      const matchesText =
        item.movie.title.toLowerCase().includes(libSearch.toLowerCase()) ||
        item.movie.director.toLowerCase().includes(libSearch.toLowerCase()) ||
        item.notes.toLowerCase().includes(libSearch.toLowerCase()) ||
        item.customTags.some((t) => t.toLowerCase().includes(libSearch.toLowerCase()));

      // 2. Status filter
      const matchesStatus = libStatus === 'all' || item.status === libStatus;

      // 3. Type filter
      const matchesType = libType === 'all' || item.movie.type === libType;

      // 4. Genre filter
      const matchesGenre = libGenre === 'all' || item.movie.genre.includes(libGenre);

      return matchesText && matchesStatus && matchesType && matchesGenre;
    })
    .sort((a, b) => {
      // Sorting logic
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
          return parseInt(b.movie.year) - parseInt(a.movie.year);
        case 'year-asc':
          return parseInt(a.movie.year) - parseInt(b.movie.year);
        default:
          return 0;
      }
    });

  const handleEditClick = (item: TrackedItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col pb-16">
      {/* Sticky Header Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Film className="w-4.5 h-4.5 text-indigo-400" />
            </div>
            <span className="font-bold text-base tracking-wider text-zinc-100 font-mono">
              CINEPHILE<span className="text-indigo-500 font-sans">/</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('library')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-wide transition flex items-center gap-1.5 ${
                activeTab === 'library'
                  ? 'bg-zinc-900 text-zinc-100 border border-zinc-800'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <FolderHeart className="w-3.5 h-3.5" />
              <span>Library</span>
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-wide transition flex items-center gap-1.5 ${
                activeTab === 'discover'
                  ? 'bg-zinc-900 text-zinc-100 border border-zinc-800'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Discover</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-wide transition flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-zinc-900 text-zinc-100 border border-zinc-800'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-wide transition flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'bg-zinc-900 text-zinc-100 border border-zinc-800'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-8 flex-1 flex flex-col">
        {/* Tab Content: Library */}
        {activeTab === 'library' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 flex-1 flex flex-col"
          >
            {/* Library Control Bar */}
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

            {/* Collapsible filters menu */}
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

            {/* Library Grid */}
            {filteredLibrary.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredLibrary.map((item) => (
                  <MovieCard
                    key={item.id}
                    item={item}
                    onEdit={handleEditClick}
                  />
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-20 border border-dashed border-zinc-900 rounded-2xl">
                <FolderHeart className="w-10 h-10 text-zinc-700 mb-3" />
                <h3 className="text-sm font-semibold text-zinc-400">No items found</h3>
                <p className="text-xs text-zinc-600 mt-1 max-w-[280px]">
                  {trackedItems.length === 0
                    ? "Your movie tracking library is empty. Head to Discover to add movies!"
                    : "Try adjusting your search queries or filter dropdown selections."}
                </p>
                {trackedItems.length === 0 && (
                  <Button
                    onClick={() => setActiveTab('discover')}
                    className="mt-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold h-8 rounded-lg px-4"
                  >
                    Go to Discover
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Tab Content: Discover */}
        {activeTab === 'discover' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 flex-1 flex flex-col"
          >
            {/* Search Input Container */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder={
                    apiSettings.tmdbApiKey || apiSettings.omdbApiKey
                      ? "Search live database..."
                      : "Search curated mock database (e.g., Inception, Breaking Bad)..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-8 bg-zinc-900 border-zinc-800 text-zinc-200 text-xs placeholder:text-zinc-600 rounded-lg h-9.5"
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
              <Button
                type="submit"
                disabled={isSearching}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold text-xs h-9.5 px-4 rounded-lg flex items-center gap-1.5 shrink-0"
              >
                {isSearching ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
                <span>Search</span>
              </Button>
            </form>

            {/* Dynamic Results Grid */}
            {isSearching ? (
              <div className="flex-1 flex flex-col items-center justify-center py-24 text-zinc-500">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-700 mb-2" />
                <span className="text-xs">Searching titles...</span>
              </div>
            ) : searchResult.length > 0 ? (
              <div className="space-y-4">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest block">Search Results</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {searchResult.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      // Check if already in library
                      item={trackedItems.find((i) => i.id === movie.id)}
                      onAdd={addMovie}
                      onEdit={handleEditClick}
                    />
                  ))}
                </div>
              </div>
            ) : searchQuery ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-900 rounded-2xl">
                <Search className="w-8 h-8 text-zinc-700 mb-2" />
                <span className="text-sm font-semibold text-zinc-500">No matches found</span>
                <p className="text-[11px] text-zinc-650 mt-1 max-w-[280px]">
                  Could not find any items matching &ldquo;{searchQuery}&rdquo;.
                </p>
              </div>
            ) : isLoadingTrending ? (
              <div className="flex-1 flex flex-col items-center justify-center py-24 text-zinc-500">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-700 mb-2" />
                <span className="text-xs">Loading trending movies...</span>
              </div>
            ) : apiSettings.tmdbApiKey && trendingMovies.length > 0 ? (
              // Live TMDB Trending Movies
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Trending Movies this Week
                  </span>
                  <span className="text-[10px] text-zinc-500 italic">
                    Live TMDB Feed
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {trendingMovies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      item={trackedItems.find((i) => i.id === movie.id)}
                      onAdd={addMovie}
                      onEdit={handleEditClick}
                    />
                  ))}
                </div>
              </div>
            ) : (
              // Default suggestion library (fallback or offline)
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" /> Suggested Titles
                  </span>
                  {!apiSettings.tmdbApiKey && !apiSettings.omdbApiKey && (
                    <span className="text-[10px] text-zinc-500 italic">
                      Offline Mode (Config API Key in Settings for live lookup)
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {require('@/lib/movie-db').MOCK_MOVIES.slice(0, 10).map((movie: Movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      item={trackedItems.find((i) => i.id === movie.id)}
                      onAdd={addMovie}
                      onEdit={handleEditClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Tab Content: Analytics */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AnalyticsDashboard stats={stats} />
          </motion.div>
        )}

        {/* Tab Content: Settings */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SettingsPanel
              settings={apiSettings}
              onSaveSettings={saveApiSettings}
              trackedItems={trackedItems}
              onImport={importLibrary}
              onClear={clearDatabase}
            />
          </motion.div>
        )}
      </main>

      {/* Global Dialog Form */}
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
    </div>
  );
}
