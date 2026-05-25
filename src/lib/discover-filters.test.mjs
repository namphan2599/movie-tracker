import test from 'node:test';
import assert from 'node:assert/strict';
import { filterDiscoverMovies, getDiscoverGenreOptions, paginateDiscoverMovies } from './discover-filters.ts';

const movies = [
  {
    id: 'a',
    title: 'Alien',
    type: 'movie',
    year: '1979',
    poster: '',
    genre: ['Horror', 'Sci-Fi'],
    director: 'Ridley Scott',
    actors: 'Sigourney Weaver, Tom Skerritt',
    imdbRating: '8.5',
    runtime: '117 min',
    plot: '',
  },
  {
    id: 'b',
    title: 'Arrival',
    type: 'movie',
    year: '2016',
    poster: '',
    genre: ['Drama', 'Sci-Fi'],
    director: 'Denis Villeneuve',
    actors: 'Amy Adams, Jeremy Renner',
    imdbRating: '7.9',
    runtime: '116 min',
    plot: '',
  },
  {
    id: 'c',
    title: 'Andor',
    type: 'series',
    year: '2022',
    poster: '',
    genre: ['Drama', 'Sci-Fi'],
    director: 'Tony Gilroy',
    actors: 'Diego Luna',
    imdbRating: '8.4',
    runtime: '50 min per episode',
    plot: '',
  },
];

test('filters discover movies by advanced detail fields', () => {
  const result = filterDiscoverMovies(movies, {
    type: 'movie',
    genre: 'Sci-Fi',
    yearMin: '1970',
    yearMax: '2000',
    ratingMin: '8',
    director: 'ridley',
    actor: 'weaver',
    runtimeMax: '120',
    sort: 'year-desc',
  });

  assert.deepEqual(result.map((movie) => movie.id), ['a']);
});

test('paginates filtered discover movies', () => {
  const page = paginateDiscoverMovies(movies, 2, 2);

  assert.equal(page.totalPages, 2);
  assert.deepEqual(page.items.map((movie) => movie.id), ['c']);
});

test('builds genre options from fallback movies when search results are empty', () => {
  const result = getDiscoverGenreOptions([], movies, ['Action']);

  assert.deepEqual(result, ['Action', 'Drama', 'Horror', 'Sci-Fi']);
});
