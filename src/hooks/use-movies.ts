/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Movie, TrackedItem, ApiSettings, MOCK_MOVIES, searchOmdb, searchTmdb, getTrendingTmdb, DISCOVER_CATEGORIES, getMoviesByGenreTmdb, WatchlistCollection } from '@/lib/movie-db';
import { toast } from 'sonner';

export function useMovies() {
  const [trackedItems, setTrackedItems] = useState<TrackedItem[]>([]);
  const [apiSettings, setApiSettings] = useState<ApiSettings>({ tmdbApiKey: '', omdbApiKey: '' });
  const [mounted, setMounted] = useState(false);
  const [searchResult, setSearchResult] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const [categoryMovies, setCategoryMovies] = useState<Record<string, Movie[]>>({});
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Initialize and load from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedItems = localStorage.getItem('tracked_movies');
      if (storedItems) {
        try {
          setTrackedItems(JSON.parse(storedItems));
        } catch (e) {
          console.error("Failed to parse tracked items", e);
        }
      }

      const storedSettings = localStorage.getItem('movie_api_settings');
      if (storedSettings) {
        try {
          setApiSettings(JSON.parse(storedSettings));
        } catch (e) {
          console.error("Failed to parse API settings", e);
        }
      }
      setMounted(true);
    }
  }, []);

  // Save to local storage on change
  const saveTrackedItems = (items: TrackedItem[]) => {
    setTrackedItems(items);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tracked_movies', JSON.stringify(items));
    }
  };

  const saveApiSettings = (settings: ApiSettings) => {
    setApiSettings(settings);
    if (typeof window !== 'undefined') {
      localStorage.setItem('movie_api_settings', JSON.stringify(settings));
    }
    toast.success("API settings saved successfully.");
  };

  const fetchTrending = useCallback(async () => {
    if (!apiSettings.tmdbApiKey) {
      setTrendingMovies([]);
      return;
    }
    setIsLoadingTrending(true);
    const results = await getTrendingTmdb(apiSettings.tmdbApiKey);
    setTrendingMovies(results);
    setIsLoadingTrending(false);
  }, [apiSettings.tmdbApiKey]);

  const fetchCategories = useCallback(async () => {
    if (!apiSettings.tmdbApiKey) {
      setCategoryMovies({});
      return;
    }
    setIsLoadingCategories(true);
    try {
      const results: Record<string, Movie[]> = {};
      await Promise.all(
        DISCOVER_CATEGORIES.map(async (cat) => {
          const movies = await getMoviesByGenreTmdb(apiSettings.tmdbApiKey!, cat.tmdbGenreId);
          results[cat.id] = movies;
        })
      );
      setCategoryMovies(results);
    } catch (e) {
      console.error("Failed to fetch category movies", e);
    } finally {
      setIsLoadingCategories(false);
    }
  }, [apiSettings.tmdbApiKey]);

  useEffect(() => {
    if (mounted) {
      if (apiSettings.tmdbApiKey) {
        fetchTrending();
        fetchCategories();
      } else {
        setTrendingMovies([]);
        setCategoryMovies({});
      }
    }
  }, [apiSettings.tmdbApiKey, mounted, fetchTrending, fetchCategories]);

  // Add a movie to tracker
  const [collections, setCollections] = useState<WatchlistCollection[]>([]);

  // Load collections from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('watchlist_collections');
      if (stored) {
        try {
          setCollections(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse collections', e);
        }
      } else {
        // Seed default collection
        const defaultCol: WatchlistCollection = {
          id: 'default',
          name: 'Default',
          color: '#6366f1',
          createdAt: new Date().toISOString()
        };
        setCollections([defaultCol]);
        localStorage.setItem('watchlist_collections', JSON.stringify([defaultCol]));
      }
    }
  }, []);

  // Helper to persist collections
  const persistCollections = (cols: WatchlistCollection[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('watchlist_collections', JSON.stringify(cols));
    }
  };

  const addCollection = (name: string, color: string, description?: string) => {
    const newCol: WatchlistCollection = {
      id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
      name,
      color,
      description,
      createdAt: new Date().toISOString()
    };
    const updated = [...collections, newCol];
    setCollections(updated);
    persistCollections(updated);
    return newCol;
  };

  const updateCollection = (id: string, updates: Partial<WatchlistCollection>) => {
    const updated = collections.map(col => (col.id === id ? { ...col, ...updates } : col));
    setCollections(updated);
    persistCollections(updated);
  };

  const deleteCollection = (id: string) => {
    // Move items to default collection
    const defaultId = 'default';
    const updatedItems = trackedItems.map(item => (item.collectionId === id ? { ...item, collectionId: defaultId } : item));
    saveTrackedItems(updatedItems);
    const filtered = collections.filter(col => col.id !== id);
    setCollections(filtered);
    persistCollections(filtered);
  };

  // Modified addMovie to accept optional collectionId (default to "default")
  const addMovie = useCallback((movie: Movie, status: 'watchlist' | 'watching' | 'watched', collectionId?: string) => {
    const existing = trackedItems.find((item) => item.id === movie.id);
    if (existing) {
      toast.error(`"${movie.title}" is already in your tracker!`);
      return;
    }

    const newItem: TrackedItem = {
      id: movie.id,
      movie,
      status,
      rating: 0,
      notes: '',
      dateAdded: new Date().toISOString(),
      dateWatched: status === 'watched' ? new Date().toISOString() : undefined,
      customTags: [],
      progress: movie.type === 'series' ? {
        episodesTotal: 10, // default placeholder
        episodesWatched: 0,
        seasonsTotal: 1,
        seasonsWatched: 0
      } : {
        percentage: 0
      },
      collectionId: collectionId ?? 'default'
    };

    const updated = [newItem, ...trackedItems];
    saveTrackedItems(updated);
    toast.success(`Added "${movie.title}" to ${status === 'watching' ? 'Currently Watching' : status}.`);
  }, [trackedItems, collections]);


  // Update a tracked item's details
  const updateTrackedItem = useCallback((id: string, updates: Partial<TrackedItem>) => {
    const updated = trackedItems.map((item) => {
      if (item.id === id) {
        const merged = { ...item, ...updates };
        // Automatically set dateWatched if status changes to watched
        if (updates.status === 'watched' && item.status !== 'watched') {
          merged.dateWatched = new Date().toISOString();
        } else if (updates.status && updates.status !== 'watched') {
          merged.dateWatched = undefined;
        }
        return merged;
      }
      return item;
    });

    saveTrackedItems(updated);
    toast.success("Updated movie tracking details.");
  }, [trackedItems]);

  // Remove a movie
  const removeMovie = useCallback((id: string) => {
    const item = trackedItems.find((t) => t.id === id);
    const updated = trackedItems.filter((t) => t.id !== id);
    saveTrackedItems(updated);
    if (item) {
      toast.success(`Removed "${item.movie.title}" from tracking.`);
    }
  }, [trackedItems]);

  // Search function - dynamic based on API key configuration
  const searchMovies = useCallback(async (query: string) => {
    if (!query || query.trim().length === 0) {
      setSearchResult([]);
      return;
    }

    setIsSearching(true);
    const trimmed = query.trim().toLowerCase();

    // 1. Check if external APIs are configured
    if (apiSettings.tmdbApiKey) {
      const tmdbResults = await searchTmdb(trimmed, apiSettings.tmdbApiKey);
      setSearchResult(tmdbResults);
      setIsSearching(false);
      return;
    }

    if (apiSettings.omdbApiKey) {
      const omdbResults = await searchOmdb(trimmed, apiSettings.omdbApiKey);
      setSearchResult(omdbResults);
      setIsSearching(false);
      return;
    }

    // 2. Fallback to mock search in our pre-populated DB
    // Simulate API delay for realistic premium micro-interaction loading
    setTimeout(() => {
      const results = MOCK_MOVIES.filter((movie) => {
        return (
          movie.title.toLowerCase().includes(trimmed) ||
          movie.genre.some((g) => g.toLowerCase().includes(trimmed)) ||
          movie.director.toLowerCase().includes(trimmed) ||
          (movie.actors && movie.actors.toLowerCase().includes(trimmed))
        );
      });
      setSearchResult(results);
      setIsSearching(false);
    }, 400);
  }, [apiSettings]);

  // Import JSON library
  const importLibrary = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed)) {
        // Validate keys of first element to see if it conforms
        if (parsed.length === 0 || (parsed[0].id && parsed[0].movie && parsed[0].status)) {
          saveTrackedItems(parsed);
          toast.success("Library imported successfully.");
          return true;
        }
      }
      toast.error("Invalid library format. Please check the backup file.");
      return false;
    } catch (e) {
      toast.error("Failed to parse JSON file.");
      return false;
    }
  };

  // Clear database
  const clearDatabase = () => {
    saveTrackedItems([]);
    toast.success("Cleared entire library.");
  };

  // Statistics & Analytics Calculations
  const stats = {
    total: trackedItems.length,
    watched: trackedItems.filter((i) => i.status === 'watched').length,
    watching: trackedItems.filter((i) => i.status === 'watching').length,
    watchlist: trackedItems.filter((i) => i.status === 'watchlist').length,
    averageRating: (() => {
      const rated = trackedItems.filter((i) => i.status === 'watched' && i.rating > 0);
      if (rated.length === 0) return 0;
      return +(rated.reduce((sum, item) => sum + item.rating, 0) / rated.length).toFixed(1);
    })(),
    genreDistribution: (() => {
      const counts: Record<string, number> = {};
      trackedItems.forEach((item) => {
        item.movie.genre.forEach((g) => {
          counts[g] = (counts[g] || 0) + 1;
        });
      });
      return Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // top 5 genres
    })(),
    monthlyHistory: (() => {
      // Create a map of the last 6 months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const historyMap: Record<string, number> = {};
      
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
        historyMap[key] = 0;
      }

      trackedItems.forEach((item) => {
        if (item.status === 'watched' && item.dateWatched) {
          const date = new Date(item.dateWatched);
          const key = `${months[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
          if (key in historyMap) {
            historyMap[key] += 1;
          }
        }
      });

      return Object.entries(historyMap).map(([name, count]) => ({
        name,
        count
      }));
    })()
  };

  return {
    mounted,
    trackedItems,
    apiSettings,
    searchResult,
    isSearching,
    trendingMovies,
    isLoadingTrending,
    categoryMovies,
    isLoadingCategories,
    saveApiSettings,
    addMovie,
    updateTrackedItem,
    removeMovie,
    searchMovies,
    importLibrary,
    clearDatabase,
    collections,
    addCollection,
    updateCollection,
    deleteCollection,
    stats
  };
}
export type UseMoviesReturn = ReturnType<typeof useMovies>;
