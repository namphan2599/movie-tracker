import type { Movie } from './movie-db';

export interface DiscoverFilters {
  type: string;
  genre: string;
  yearMin: string;
  yearMax: string;
  ratingMin: string;
  director: string;
  actor: string;
  runtimeMax: string;
  sort: string;
}

const toNumber = (value: unknown) => {
  const parsed = Number.parseFloat(String(value ?? '').replace(/[^\d.]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
};

const includesText = (value: unknown, query: string) => {
  if (!query) return true;
  return String(value ?? '').toLowerCase().includes(query.toLowerCase());
};

export function filterDiscoverMovies(movies: Movie[], filters: DiscoverFilters) {
  const yearMin = toNumber(filters.yearMin);
  const yearMax = toNumber(filters.yearMax);
  const ratingMin = toNumber(filters.ratingMin);
  const runtimeMax = toNumber(filters.runtimeMax);

  const filtered = movies.filter((movie) => {
    const year = toNumber(movie.year);
    const rating = toNumber(movie.imdbRating);
    const runtime = toNumber(movie.runtime);

    return (
      (!filters.type || filters.type === 'all' || movie.type === filters.type) &&
      (!filters.genre || filters.genre === 'all' || movie.genre?.includes(filters.genre)) &&
      (yearMin === null || (year !== null && year >= yearMin)) &&
      (yearMax === null || (year !== null && year <= yearMax)) &&
      (ratingMin === null || (rating !== null && rating >= ratingMin)) &&
      (runtimeMax === null || (runtime !== null && runtime <= runtimeMax)) &&
      includesText(movie.director, filters.director) &&
      includesText(movie.actors, filters.actor)
    );
  });

  switch (filters.sort) {
    case 'title-asc':
      return filtered.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return filtered.sort((a, b) => b.title.localeCompare(a.title));
    case 'year-asc':
      return filtered.sort((a, b) => (toNumber(a.year) ?? 0) - (toNumber(b.year) ?? 0));
    case 'year-desc':
      return filtered.sort((a, b) => (toNumber(b.year) ?? 0) - (toNumber(a.year) ?? 0));
    case 'rating-desc':
      return filtered.sort((a, b) => (toNumber(b.imdbRating) ?? 0) - (toNumber(a.imdbRating) ?? 0));
    case 'rating-asc':
      return filtered.sort((a, b) => (toNumber(a.imdbRating) ?? 0) - (toNumber(b.imdbRating) ?? 0));
    default:
      return filtered;
  }
}

export function getDiscoverGenreOptions(
  searchResults: Movie[],
  fallbackMovies: Movie[],
  fallbackGenres: string[] = []
) {
  const sourceMovies = searchResults.length > 0 ? searchResults : fallbackMovies;
  return Array.from(
    new Set([
      ...fallbackGenres,
      ...sourceMovies.flatMap((movie) => movie.genre ?? []),
    ])
  ).sort();
}

export function paginateDiscoverMovies<T>(items: T[], page: number, pageSize: number) {
  const safePageSize = Math.max(1, Number(pageSize) || 1);
  const totalPages = Math.max(1, Math.ceil(items.length / safePageSize));
  const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const start = (currentPage - 1) * safePageSize;

  return {
    items: items.slice(start, start + safePageSize),
    currentPage,
    totalPages,
  };
}
