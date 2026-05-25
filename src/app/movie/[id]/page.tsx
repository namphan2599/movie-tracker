/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMovies } from '@/hooks/use-movies';
import {
  MovieDetailedInfo,
  getMovieDetailsTmdb,
  getMovieDetailsOmdb,
  MOCK_MOVIES
} from '@/lib/movie-db';
import { MOCK_MOVIE_DETAILS } from '@/lib/mock-details';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  Film,
  Tv,
  Play,
  Bookmark,
  CheckCircle2,
  Trash2,
  Loader2,
  MessageSquare,
  Clapperboard,
  Sparkles,
  Save,
  Check
} from 'lucide-react';


export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    mounted,
    trackedItems,
    apiSettings,
    addMovie,
    updateTrackedItem,
    removeMovie
  } = useMovies();

  // Detail states
  const [detailedInfo, setDetailedInfo] = useState<MovieDetailedInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'trailer' | 'reviews' | 'similar'>('overview');

  // Tracking Panel states (for inline logs editing)
  const [localStatus, setLocalStatus] = useState<'watchlist' | 'watching' | 'watched' | 'none'>('none');
  const [localRating, setLocalRating] = useState(0);
  const [localNotes, setLocalNotes] = useState('');
  const [localTags, setLocalTags] = useState('');
  const [episodesWatched, setEpisodesWatched] = useState(0);
  const [episodesTotal, setEpisodesTotal] = useState(10);
  const [seasonsWatched, setSeasonsWatched] = useState(1);
  const [percentage, setPercentage] = useState(0);
  const [isNotesSaving, setIsNotesSaving] = useState(false);
  const [isSavedTag, setIsSavedTag] = useState(false);

  // Check if current movie is in tracked items
  const trackedItem = trackedItems.find((item) => item.id === id);

  // Load movie detail data
  useEffect(() => {
    if (!mounted) return;

    const loadMovieDetail = async () => {
      setIsLoading(true);

      // 1. Try local mock details first (Offline Mode / Curated list)
      if (MOCK_MOVIE_DETAILS[id]) {
        const basicMovie = MOCK_MOVIES.find((m) => m.id === id);
        const mockDetail = MOCK_MOVIE_DETAILS[id];
        if (basicMovie) {
          setDetailedInfo({
            movie: basicMovie,
            cast: mockDetail.cast,
            trailerKey: mockDetail.trailerKey,
            reviews: mockDetail.reviews,
            backdropUrl: basicMovie.poster
          });
        }
        setIsLoading(false);
        return;
      }

      // 2. Fetch from Live APIs if keys are available
      if (apiSettings.tmdbApiKey) {
        let result = null;
        if (trackedItem) {
          result = await getMovieDetailsTmdb(id, trackedItem.movie.type, apiSettings.tmdbApiKey);
        } else {
          // If not tracked, try fetching as movie first, then fall back to tv/series
          result = await getMovieDetailsTmdb(id, 'movie', apiSettings.tmdbApiKey);
          if (!result) {
            result = await getMovieDetailsTmdb(id, 'series', apiSettings.tmdbApiKey);
          }
        }

        if (result) {
          setDetailedInfo(result);
          setIsLoading(false);
          return;
        }
      }

      if (apiSettings.omdbApiKey) {
        const result = await getMovieDetailsOmdb(id, apiSettings.omdbApiKey);
        if (result) {
          setDetailedInfo(result);
          setIsLoading(false);
          return;
        }
      }

      // 3. Fallback to tracked item values
      if (trackedItem) {
        setDetailedInfo({
          movie: trackedItem.movie,
          cast: [],
          reviews: []
        });
      }

      setIsLoading(false);
    };

    loadMovieDetail();
  }, [id, mounted, apiSettings, trackedItems, trackedItem]);

  // Sync inline log form states with the tracked item
  useEffect(() => {
    if (trackedItem) {
      setLocalStatus(trackedItem.status);
      setLocalRating(trackedItem.rating);
      setLocalNotes(trackedItem.notes);
      setLocalTags(trackedItem.customTags.join(', '));
      
      if (trackedItem.movie.type === 'series') {
        setEpisodesWatched(trackedItem.progress?.episodesWatched || 0);
        setEpisodesTotal(trackedItem.progress?.episodesTotal || 10);
        setSeasonsWatched(trackedItem.progress?.seasonsWatched || 1);
      } else {
        setPercentage(trackedItem.progress?.percentage || 0);
      }
    } else {
      setLocalStatus('none');
      setLocalRating(0);
      setLocalNotes('');
      setLocalTags('');
    }
  }, [trackedItem]);

  // Handle Add to Library
  const handleAddToLibrary = (status: 'watchlist' | 'watching' | 'watched') => {
    if (!detailedInfo) return;
    addMovie(detailedInfo.movie, status);
  };

  // Handle Status Update
  const handleStatusUpdate = (status: 'watchlist' | 'watching' | 'watched') => {
    if (!trackedItem) return;
    updateTrackedItem(id, {
      status,
      // reset rating if not watched
      rating: status === 'watched' ? localRating : 0
    });
  };

  // Handle Rating Update
  const handleRatingUpdate = (rating: number) => {
    if (!trackedItem) return;
    setLocalRating(rating);
    updateTrackedItem(id, { rating });
  };

  // Handle Save Review / Notes
  const handleSaveNotes = () => {
    if (!trackedItem) return;
    setIsNotesSaving(true);

    const parsedTags = localTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const progress =
      trackedItem.movie.type === 'series'
        ? {
            episodesWatched,
            episodesTotal,
            seasonsWatched,
          }
        : {
            percentage,
          };

    updateTrackedItem(id, {
      notes: localNotes,
      customTags: parsedTags,
      progress
    });

    setIsNotesSaving(false);
    setIsSavedTag(true);
    setTimeout(() => setIsSavedTag(false), 2000);
  };

  // Handle Remove from tracking
  const handleRemove = () => {
    if (!trackedItem) return;
    if (confirm(`Remove "${trackedItem.movie.title}" from your library?`)) {
      removeMovie(id);
      router.push('/');
    }
  };

  // Generate generic recommended movies based on genres
  const getRecommendedMovies = () => {
    if (!detailedInfo) return [];
    
    // Match genres from preloaded movies
    const currentGenres = detailedInfo.movie.genre;
    return MOCK_MOVIES.filter(
      (m) => m.id !== id && m.genre.some((g) => currentGenres.includes(g))
    ).slice(0, 5);
  };

  if (!mounted || isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 text-zinc-400 min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-700 mb-3" />
        <span className="text-xs font-mono tracking-widest uppercase">Fetching Details...</span>
      </div>
    );
  }

  if (!detailedInfo) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-zinc-950 text-zinc-100 min-h-screen">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <ArrowLeft className="w-5 h-5 text-red-400" />
        </div>
        <h2 className="text-xl font-bold font-mono tracking-wide">Title Not Found</h2>
        <p className="text-sm text-zinc-500 max-w-[320px] mt-2 mb-6">
          The movie or TV show could not be found in our database.
        </p>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-semibold font-mono tracking-wide hover:bg-zinc-800 hover:text-zinc-100 transition"
        >
          Return to Library
        </Link>
      </div>
    );
  }

  const { movie, cast, trailerKey, reviews } = detailedInfo;
  const isTracked = !!trackedItem;

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 min-h-screen relative overflow-hidden pb-16">
      {/* Blurred Hero Backdrop */}
      <div className="absolute top-0 left-0 w-full h-[60vh] pointer-events-none select-none z-0 overflow-hidden">
        <img
          src={movie.poster}
          alt=""
          className="w-full h-full object-cover filter blur-[80px] opacity-15 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/60 to-zinc-950 z-10" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-zinc-950/80 z-10" />
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-zinc-950/85 backdrop-blur-md">
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
            onClick={() => router.back()}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-wide transition flex items-center gap-1.5 bg-zinc-900 text-zinc-300 border border-zinc-800 hover:text-zinc-100 hover:bg-zinc-850 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        
        {/* LEFT COLUMN: Poster & Tracking controls */}
        <div className="space-y-6 flex flex-col items-center lg:items-stretch">
          
          {/* Poster image */}
          <div className="w-[230px] sm:w-[260px] lg:w-full aspect-[2/3] rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl relative group">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Show type tag */}
            <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-black/60 border border-zinc-800 backdrop-blur-sm text-[10px] text-zinc-300 font-medium font-mono flex items-center gap-1.5">
              {movie.type === 'series' ? (
                <>
                  <Tv className="w-3 h-3 text-indigo-400" />
                  <span>TV SERIES</span>
                </>
              ) : (
                <>
                  <Film className="w-3 h-3 text-emerald-400" />
                  <span>MOVIE</span>
                </>
              )}
            </div>
          </div>

          {/* CINEPHILE LOGGING PANEL */}
          <div className="w-full max-w-[340px] lg:max-w-none bg-zinc-900/30 border border-zinc-900 rounded-2xl p-5 backdrop-blur-md space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 font-mono tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>YOUR CINEPHILE LOG</span>
            </h3>

            {/* If NOT tracked in library */}
            {!isTracked ? (
              <div className="space-y-3.5 py-2">
                <p className="text-xs text-zinc-500 italic">This title is not in your library yet. Add it below:</p>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    onClick={() => handleAddToLibrary('watchlist')}
                    className="w-full bg-zinc-900 border border-zinc-850 hover:bg-amber-600/10 hover:border-amber-500/20 hover:text-amber-400 text-zinc-300 font-mono text-[11px] h-9.5 rounded-xl justify-start px-3 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <Bookmark className="w-4 h-4 text-amber-500" /> Add to Watchlist
                  </Button>
                  <Button
                    onClick={() => handleAddToLibrary('watching')}
                    className="w-full bg-zinc-900 border border-zinc-850 hover:bg-indigo-600/10 hover:border-indigo-500/20 hover:text-indigo-400 text-zinc-300 font-mono text-[11px] h-9.5 rounded-xl justify-start px-3 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <Play className="w-4 h-4 text-indigo-500" /> Mark as Watching
                  </Button>
                  <Button
                    onClick={() => handleAddToLibrary('watched')}
                    className="w-full bg-zinc-900 border border-zinc-850 hover:bg-emerald-600/10 hover:border-emerald-500/20 hover:text-emerald-400 text-zinc-300 font-mono text-[11px] h-9.5 rounded-xl justify-start px-3 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Mark as Watched
                  </Button>
                </div>
              </div>
            ) : (
              // IF TRACKED
              <div className="space-y-4">
                
                {/* Watch Status selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Watch Status</label>
                  <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-900">
                    <button
                      onClick={() => handleStatusUpdate('watchlist')}
                      className={`py-1.5 rounded-md text-[10px] font-bold font-mono transition flex flex-col items-center gap-0.5 cursor-pointer ${
                        localStatus === 'watchlist'
                          ? 'bg-amber-600/10 text-amber-400 border border-amber-500/20'
                          : 'text-zinc-500 hover:text-zinc-350'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Watchlist</span>
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('watching')}
                      className={`py-1.5 rounded-md text-[10px] font-bold font-mono transition flex flex-col items-center gap-0.5 cursor-pointer ${
                        localStatus === 'watching'
                          ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                          : 'text-zinc-500 hover:text-zinc-350'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Watching</span>
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('watched')}
                      className={`py-1.5 rounded-md text-[10px] font-bold font-mono transition flex flex-col items-center gap-0.5 cursor-pointer ${
                        localStatus === 'watched'
                          ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20'
                          : 'text-zinc-500 hover:text-zinc-350'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Watched</span>
                    </button>
                  </div>
                </div>

                {/* Rating (only if Watched) */}
                {localStatus === 'watched' && (
                  <div className="space-y-1.5 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Your Rating</label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingUpdate(star)}
                          className="hover:scale-110 transition duration-100 cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= localRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-zinc-700 hover:text-zinc-500'
                            }`}
                          />
                        </button>
                      ))}
                      {localRating > 0 && (
                        <span className="text-[10px] text-zinc-400 font-mono font-bold ml-1.5">({localRating}/5)</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Progress bar (only if Watching) */}
                {localStatus === 'watching' && (
                  <div className="space-y-3 bg-zinc-950 p-3 rounded-lg border border-zinc-900 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                    {movie.type === 'series' ? (
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase font-mono tracking-wider">Episodes Tracking</span>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <span className="text-[9px] text-zinc-650 font-mono uppercase">Season</span>
                            <Input
                              type="number"
                              min={1}
                              value={seasonsWatched}
                              onChange={(e) => setSeasonsWatched(Math.max(1, parseInt(e.target.value) || 1))}
                              className="bg-zinc-900 border-zinc-800 text-zinc-200 text-xs h-7 text-center font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] text-zinc-650 font-mono uppercase">Watched</span>
                            <Input
                              type="number"
                              min={0}
                              value={episodesWatched}
                              onChange={(e) => setEpisodesWatched(Math.max(0, parseInt(e.target.value) || 0))}
                              className="bg-zinc-900 border-zinc-800 text-zinc-200 text-xs h-7 text-center font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] text-zinc-650 font-mono uppercase">Total</span>
                            <Input
                              type="number"
                              min={1}
                              value={episodesTotal}
                              onChange={(e) => setEpisodesTotal(Math.max(1, parseInt(e.target.value) || 10))}
                              className="bg-zinc-900 border-zinc-800 text-zinc-200 text-xs h-7 text-center font-semibold"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase font-mono tracking-wider">Progress</span>
                          <span className="text-[10px] text-zinc-400 font-mono font-bold">{percentage}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={percentage}
                          onChange={(e) => setPercentage(parseInt(e.target.value) || 0)}
                          className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Custom Tags */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Tags (comma-separated)</label>
                  <Input
                    value={localTags}
                    onChange={(e) => setLocalTags(e.target.value)}
                    placeholder="e.g. Masterpiece, Re-watch"
                    className="bg-zinc-950 border-zinc-900 text-zinc-200 text-xs h-8 placeholder:text-zinc-700"
                  />
                </div>

                {/* Personal Notes */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Your Review & Notes</label>
                  <Textarea
                    value={localNotes}
                    onChange={(e) => setLocalNotes(e.target.value)}
                    placeholder="Add your thoughts, review notes, quotes, or tracking details..."
                    className="bg-zinc-950 border-zinc-900 text-zinc-200 text-xs min-h-[80px] max-h-[160px] placeholder:text-zinc-700 resize-none font-sans"
                  />
                </div>

                {/* Save Log & Remove buttons */}
                <div className="pt-2 flex items-center justify-between border-t border-zinc-900/60 mt-3 gap-2">
                  <button
                    onClick={handleRemove}
                    className="p-2 rounded bg-zinc-950 border border-zinc-900 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition flex items-center justify-center cursor-pointer"
                    title="Remove from Library"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <Button
                    onClick={handleSaveNotes}
                    disabled={isNotesSaving}
                    className={`h-8 font-mono text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 px-3 rounded cursor-pointer transition ${
                      isSavedTag
                        ? 'bg-emerald-600 hover:bg-emerald-600 text-white border border-emerald-500/20'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-950'
                    }`}
                  >
                    {isNotesSaving ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : isSavedTag ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3 h-3" />
                        <span>Save Log</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Metadata details, synopsis, tabs content */}
        <div className="space-y-6 flex-1">
          
          {/* Breadcrumbs & Navigation */}
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-400 uppercase tracking-widest font-mono">
            <Link href="/" className="hover:underline">Library</Link>
            <span className="text-zinc-800">/</span>
            <span className="text-zinc-500">{movie.type === 'series' ? 'TV Series' : 'Movie'}</span>
            <span className="text-zinc-800">/</span>
            <span className="text-zinc-300 truncate max-w-[200px]">{movie.title}</span>
          </div>

          {/* Title & Metadata header */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight text-white uppercase">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 text-xs text-zinc-450 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>{movie.released || movie.year}</span>
              </span>

              {movie.runtime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{movie.runtime}</span>
                </span>
              )}

              {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                <span className="flex items-center gap-1 text-amber-400 font-semibold bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{movie.imdbRating} / 10</span>
                </span>
              )}
            </div>
          </div>

          {/* Genres row */}
          <div className="flex flex-wrap gap-1.5">
            {movie.genre.map((g) => (
              <Badge
                key={g}
                className="bg-zinc-900 text-zinc-300 hover:bg-zinc-850 font-mono text-[9px] font-bold tracking-wider uppercase border border-zinc-800 h-6 px-2.5"
              >
                {g}
              </Badge>
            ))}
          </div>

          {/* Summary / Plot Section */}
          <div className="space-y-2 border-b border-zinc-900 pb-5">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">Plot Synopsis</span>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl font-sans">
              {movie.plot}
            </p>
          </div>

          {/* Director & Actors metadata block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-zinc-400 bg-zinc-900/10 border border-zinc-900/60 p-4 rounded-xl">
            <div className="space-y-0.5">
              <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-wider">Director</span>
              <p className="font-semibold text-zinc-350">{movie.director}</p>
            </div>
            {movie.actors && (
              <div className="space-y-0.5">
                <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-wider">Starring</span>
                <p className="font-semibold text-zinc-350 truncate">{movie.actors}</p>
              </div>
            )}
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="space-y-6">
            <div className="flex border-b border-zinc-900 gap-1 overflow-x-auto no-scrollbar font-mono text-[10px] font-bold tracking-widest uppercase">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 px-3 relative cursor-pointer ${
                  activeTab === 'overview' ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span>Cast & Details</span>
                {activeTab === 'overview' && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500" />
                )}
              </button>

              {trailerKey && (
                <button
                  onClick={() => setActiveTab('trailer')}
                  className={`pb-3 px-3 relative cursor-pointer ${
                    activeTab === 'trailer' ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <span className="flex items-center gap-1"><Clapperboard className="w-3 h-3" /> Trailer</span>
                  {activeTab === 'trailer' && (
                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500" />
                  )}
                </button>
              )}

              {reviews && reviews.length > 0 && (
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-3 px-3 relative cursor-pointer ${
                    activeTab === 'reviews' ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Reviews ({reviews.length})</span>
                  {activeTab === 'reviews' && (
                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500" />
                  )}
                </button>
              )}

              <button
                onClick={() => setActiveTab('similar')}
                className={`pb-3 px-3 relative cursor-pointer ${
                  activeTab === 'similar' ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span>Recommended</span>
                {activeTab === 'similar' && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500" />
                )}
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="min-h-[220px]">
              <AnimatePresence mode="wait">
                
                {/* 1. Tab: Overview (Cast List & Specs) */}
                {activeTab === 'overview' && (
                  <motion.div
                    key="tab-overview"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-6"
                  >
                    {cast && cast.length > 0 ? (
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">Featured Cast</span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
                          {cast.map((actor, idx) => (
                            <div key={idx} className="bg-zinc-950 border border-zinc-900 rounded-xl p-2.5 flex flex-col items-center text-center space-y-2">
                              <div className="w-14 h-14 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                                {actor.profileUrl ? (
                                  <img
                                    src={actor.profileUrl}
                                    alt={actor.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-zinc-650 font-bold text-xs uppercase font-mono">
                                    {actor.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                  </div>
                                )}
                              </div>
                              <div className="space-y-0.5 w-full">
                                <p className="text-[11px] font-bold text-zinc-200 truncate">{actor.name}</p>
                                <p className="text-[9px] text-zinc-500 truncate italic">{actor.character}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 border border-dashed border-zinc-900 rounded-xl text-center">
                        <Loader2 className="w-5 h-5 text-zinc-850 mb-1.5" />
                        <p className="text-xs text-zinc-550 italic font-mono">No detailed cast information loaded.</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 2. Tab: Watch Trailer (Responsive Video) */}
                {activeTab === 'trailer' && trailerKey && (
                  <motion.div
                    key="tab-trailer"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="relative aspect-video w-full max-w-3xl rounded-xl bg-zinc-950 border border-zinc-900 overflow-hidden shadow-xl">
                      <iframe
                        src={`https://www.youtube.com/embed/${trailerKey}?rel=0&modestbranding=1&hd=1`}
                        title={`${movie.title} Trailer`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full border-0"
                      />
                    </div>
                  </motion.div>
                )}

                {/* 3. Tab: Reviews (Community Ratings) */}
                {activeTab === 'reviews' && reviews && reviews.length > 0 && (
                  <motion.div
                    key="tab-reviews"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    {reviews.map((rev) => (
                      <div key={rev.id} className="bg-zinc-950 border border-zinc-900 p-4.5 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-xs font-mono font-bold text-indigo-400">
                              {rev.author[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-zinc-200">{rev.author}</p>
                              <p className="text-[9px] text-zinc-600 font-mono">{rev.date}</p>
                            </div>
                          </div>
                          {rev.rating > 0 && (
                            <span className="text-[10px] text-amber-400 font-mono font-bold border border-amber-500/15 bg-amber-500/5 px-2 py-0.5 rounded flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-400" /> {rev.rating} / 10
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-zinc-450 leading-relaxed font-sans line-clamp-4 hover:line-clamp-none transition-all duration-300">
                          {rev.content}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* 4. Tab: Similar Recommended Titles */}
                {activeTab === 'similar' && (
                  <motion.div
                    key="tab-similar"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {getRecommendedMovies().map((recMovie) => (
                        <Link href={`/movie/${recMovie.id}`} key={recMovie.id} className="group block">
                          <div className="space-y-2">
                            <div className="aspect-[2/3] w-full rounded-lg bg-zinc-900 border border-zinc-850 overflow-hidden relative shadow-md">
                              <img
                                src={recMovie.poster}
                                alt={recMovie.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                            </div>
                            <div className="w-full space-y-0.5">
                              <p className="text-xs font-bold text-zinc-300 group-hover:text-white truncate transition-colors pr-2">
                                {recMovie.title}
                              </p>
                              <p className="text-[10px] text-zinc-650 font-mono">{recMovie.year}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
