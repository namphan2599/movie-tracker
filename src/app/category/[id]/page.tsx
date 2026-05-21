'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMovies } from '@/hooks/use-movies';
import { MovieCard } from '@/components/movie-card';
import { MovieDialog } from '@/components/movie-dialog';
import { Movie, TrackedItem, DISCOVER_CATEGORIES, getMoviesByGenreTmdbPaginated } from '@/lib/movie-db';
import { motion } from 'framer-motion';
import {
  Film,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ChevronsLeft,
  ChevronsRight,
  Compass,
} from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    mounted,
    trackedItems,
    apiSettings,
    addMovie,
    updateTrackedItem,
    removeMovie,
  } = useMovies();

  // Find category matching ID
  const category = DISCOVER_CATEGORIES.find((c) => c.id === id);

  // Pagination state
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog state
  const [editingItem, setEditingItem] = useState<TrackedItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch category movies with pagination
  useEffect(() => {
    if (!mounted || !category) return;

    const loadMovies = async () => {
      setIsLoading(true);
      if (apiSettings.tmdbApiKey) {
        const result = await getMoviesByGenreTmdbPaginated(
          apiSettings.tmdbApiKey,
          category.tmdbGenreId,
          page
        );
        setMovies(result.movies);
        setTotalPages(result.totalPages);
      } else {
        // Offline / fallback mode: paginate local MOCK_MOVIES
        const requireRes = require('@/lib/movie-db');
        const offlineAllMovies = requireRes.MOCK_MOVIES.filter((movie: Movie) =>
          movie.genre.includes(category.mockName)
        );
        const pageSize = 4; // Small page size for mock data to demonstrate pagination
        const total = Math.ceil(offlineAllMovies.length / pageSize) || 1;
        setTotalPages(total);
        setMovies(offlineAllMovies.slice((page - 1) * pageSize, page * pageSize));
      }
      setIsLoading(false);
    };

    loadMovies();
  }, [page, category, apiSettings.tmdbApiKey, mounted]);

  const handleEditClick = (item: TrackedItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  // Helper to generate dynamic sliding page range (max 5 page buttons shown)
  const getPageRange = () => {
    const range: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    if (page <= 3) {
      end = Math.min(totalPages, maxButtons);
    }
    if (page > totalPages - 3) {
      start = Math.max(1, totalPages - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  // Safe tab redirect back to main page
  const handleBackToDiscover = () => {
    router.push('/?tab=discover');
  };

  if (!mounted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 text-zinc-400 min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-700 mb-3" />
        <span className="text-xs font-mono tracking-widest uppercase">Loading Category...</span>
      </div>
    );
  }

  // Handle invalid/not found category
  if (!category) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-zinc-950 text-zinc-100 min-h-screen">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <ArrowLeft className="w-5 h-5 text-red-400" />
        </div>
        <h2 className="text-xl font-bold font-mono tracking-wide">Category Not Found</h2>
        <p className="text-sm text-zinc-500 max-w-[320px] mt-2 mb-6">
          The requested movie category &ldquo;{id}&rdquo; does not exist or has been removed.
        </p>
        <button
          onClick={handleBackToDiscover}
          className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-semibold font-mono tracking-wide hover:bg-zinc-800 hover:text-zinc-100 transition cursor-pointer"
        >
          Return to Discover
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col pb-16 min-h-screen bg-zinc-950">
      {/* Sticky Header Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Film className="w-4.5 h-4.5 text-indigo-400" />
            </div>
            <span className="font-bold text-base tracking-wider text-zinc-100 font-mono">
              CINEPHILE<span className="text-indigo-500 font-sans">/</span>
            </span>
          </div>

          <button
            onClick={handleBackToDiscover}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-wide transition flex items-center gap-1.5 bg-zinc-900 text-zinc-300 border border-zinc-800 hover:text-zinc-100 hover:bg-zinc-800 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Discover</span>
          </button>
        </div>
      </header>

      {/* Main Content container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {/* Breadcrumb Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">
              <Compass className="w-3 h-3" />
              <span className="hover:underline cursor-pointer" onClick={handleBackToDiscover}>Discover</span>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-400">{category.name}</span>
            </div>
            <h1 className="text-2xl font-bold font-mono tracking-wide text-zinc-100 flex items-center gap-2 uppercase">
              {category.name} Movies
            </h1>
          </div>
          <span className="text-[10px] text-zinc-500 italic font-mono bg-zinc-900/50 border border-zinc-900 px-3 py-1.5 rounded-md self-start sm:self-auto">
            {apiSettings.tmdbApiKey ? 'Live TMDB Database' : 'Offline Mock Database'}
          </span>
        </div>

        {/* Loading Skeleton or Movie Grid */}
        {isLoading ? (
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: apiSettings.tmdbApiKey ? 10 : 4 }).map((_, i) => (
              <div key={i} className="space-y-3 animate-pulse">
                <div className="aspect-[2/3] w-full rounded-2xl bg-zinc-900 border border-zinc-850" />
                <div className="h-4 w-3/4 rounded bg-zinc-900" />
                <div className="h-3 w-1/2 rounded bg-zinc-900" />
              </div>
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-900 rounded-2xl">
            <Film className="w-8 h-8 text-zinc-700 mb-2" />
            <span className="text-sm font-semibold text-zinc-500">No movies found</span>
            <p className="text-[11px] text-zinc-650 mt-1 max-w-[280px]">
              We couldn&apos;t load any movies for this category right now.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between">
            {/* Movie Card Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  item={trackedItems.find((i) => i.id === movie.id)}
                  onAdd={addMovie}
                  onEdit={handleEditClick}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
                <span className="text-zinc-500">
                  Showing Page <strong className="text-zinc-350">{page}</strong> of <strong className="text-zinc-350">{totalPages}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  {/* First Page Button */}
                  <button
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-zinc-900 bg-zinc-950 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 disabled:opacity-30 disabled:hover:text-zinc-400 disabled:hover:bg-zinc-950 transition cursor-pointer"
                    title="First Page"
                  >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                  </button>

                  {/* Previous Button */}
                  <button
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-zinc-900 bg-zinc-950 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 disabled:opacity-30 disabled:hover:text-zinc-400 disabled:hover:bg-zinc-950 transition cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {/* Numerical Pages */}
                  {getPageRange().map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1.5 rounded-lg border text-center transition min-w-[32px] cursor-pointer font-bold ${
                        page === p
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                          : 'border-zinc-900 bg-zinc-950 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-zinc-900 bg-zinc-950 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 disabled:opacity-30 disabled:hover:text-zinc-400 disabled:hover:bg-zinc-950 transition cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Last Page Button */}
                  <button
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-zinc-900 bg-zinc-950 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 disabled:opacity-30 disabled:hover:text-zinc-400 disabled:hover:bg-zinc-950 transition cursor-pointer"
                    title="Last Page"
                  >
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
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
