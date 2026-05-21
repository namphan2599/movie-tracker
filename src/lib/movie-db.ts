export interface Movie {
  id: string;
  title: string;
  type: 'movie' | 'series';
  year: string;
  poster: string;
  genre: string[];
  director: string;
  plot: string;
  imdbRating: string;
  released?: string;
  runtime?: string;
  actors?: string;
}

export interface TrackedItem {
  id: string; // matches Movie.id or custom
  movie: Movie;
  status: 'watchlist' | 'watching' | 'watched';
  rating: number; // 0 to 5 (0 means unrated)
  notes: string;
  dateAdded: string; // ISO Date String
  dateWatched?: string; // ISO Date String
  progress?: {
    episodesTotal?: number;
    episodesWatched?: number;
    seasonsTotal?: number;
    seasonsWatched?: number;
    percentage?: number; // for movies
  };
  customTags: string[];
}

export interface ApiSettings {
  tmdbApiKey?: string;
  omdbApiKey?: string;
}

// Curated list of mock movies with actual TMDB poster URLs
export const MOCK_MOVIES: Movie[] = [
  {
    id: "m-inception",
    title: "Inception",
    type: "movie",
    year: "2010",
    poster: "https://image.tmdb.org/t/p/w500/o0lIWuvGU7tCn6TN2qiK6rq6v6m.jpg",
    genre: ["Action", "Sci-Fi", "Adventure"],
    director: "Christopher Nolan",
    actors: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy",
    imdbRating: "8.8",
    runtime: "148 min",
    released: "16 Jul 2010",
    plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
  },
  {
    id: "m-interstellar",
    title: "Interstellar",
    type: "movie",
    year: "2014",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QvH353eMUTxwc9loZt0ClJ8.jpg",
    genre: ["Adventure", "Drama", "Sci-Fi"],
    director: "Christopher Nolan",
    actors: "Matthew McConaughey, Anne Hathaway, Jessica Chastain, John Lithgow",
    imdbRating: "8.7",
    runtime: "169 min",
    released: "07 Nov 2014",
    plot: "When Earth becomes uninhabitable, a team of explorers travels through a wormhole in space in an attempt to ensure humanity's survival."
  },
  {
    id: "m-dark-knight",
    title: "The Dark Knight",
    type: "movie",
    year: "2008",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tWw2mIMIv3mZ73K2wZ15Flcl.jpg",
    genre: ["Action", "Crime", "Drama"],
    director: "Christopher Nolan",
    actors: "Christian Bale, Heath Ledger, Aaron Eckhart, Maggie Gyllenhaal",
    imdbRating: "9.0",
    runtime: "152 min",
    released: "18 Jul 2008",
    plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice."
  },
  {
    id: "m-pulp-fiction",
    title: "Pulp Fiction",
    type: "movie",
    year: "1994",
    poster: "https://image.tmdb.org/t/p/w500/d5i26OI2Hie58jI27XT626g7yvO.jpg",
    genre: ["Crime", "Drama"],
    director: "Quentin Tarantino",
    actors: "John Travolta, Samuel L. Jackson, Uma Thurman, Bruce Willis",
    imdbRating: "8.9",
    runtime: "154 min",
    released: "14 Oct 1994",
    plot: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption."
  },
  {
    id: "m-matrix",
    title: "The Matrix",
    type: "movie",
    year: "1999",
    poster: "https://image.tmdb.org/t/p/w500/f89U3wLz2ju2pq9R3Ua8M24tVKq.jpg",
    genre: ["Action", "Sci-Fi"],
    director: "Lana Wachowski, Lilly Wachowski",
    actors: "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving",
    imdbRating: "8.7",
    runtime: "136 min",
    released: "31 Mar 1999",
    plot: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence."
  },
  {
    id: "m-spirited-away",
    title: "Spirited Away",
    type: "movie",
    year: "2001",
    poster: "https://image.tmdb.org/t/p/w500/393mh1e0ptuw6JvNe17NuO8YPjK.jpg",
    genre: ["Animation", "Adventure", "Fantasy"],
    director: "Hayao Miyazaki",
    actors: "Rumi Hiiragi, Miyu Irino, Mari Natsuki, Takashi Naitô",
    imdbRating: "8.6",
    runtime: "125 min",
    released: "20 Jul 2001",
    plot: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts."
  },
  {
    id: "m-parasite",
    title: "Parasite",
    type: "movie",
    year: "2019",
    poster: "https://image.tmdb.org/t/p/w500/7IiCmqq52Z7yTy7q4Tw20V786yV.jpg",
    genre: ["Drama", "Thriller", "Comedy"],
    director: "Bong Joon Ho",
    actors: "Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong, Choi Woo-shik",
    imdbRating: "8.5",
    runtime: "132 min",
    released: "30 May 2019",
    plot: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan."
  },
  {
    id: "m-spider-verse",
    title: "Spider-Man: Into the Spider-Verse",
    type: "movie",
    year: "2018",
    poster: "https://image.tmdb.org/t/p/w500/iiZZN26Mrv1Q5CBAgDV8c2quA7G.jpg",
    genre: ["Animation", "Action", "Adventure", "Sci-Fi"],
    director: "Bob Persichetti, Peter Ramsey, Rodney Rothman",
    actors: "Shameik Moore, Jake Johnson, Hailee Steinfeld, Mahershala Ali",
    imdbRating: "8.4",
    runtime: "117 min",
    released: "14 Dec 2018",
    plot: "Teen Miles Morales becomes the Spider-Man of his universe and must join with five spider-powered individuals from other dimensions to stop a threat for all realities."
  },
  {
    id: "m-dune-2",
    title: "Dune: Part Two",
    type: "movie",
    year: "2024",
    poster: "https://image.tmdb.org/t/p/w500/czemb421Na2NWJndHGIO0J2cOIx.jpg",
    genre: ["Action", "Adventure", "Sci-Fi"],
    director: "Denis Villeneuve",
    actors: "Timothée Chalamet, Zendaya, Rebecca Ferguson, Javier Bardem",
    imdbRating: "8.6",
    runtime: "166 min",
    released: "01 Mar 2024",
    plot: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family."
  },
  {
    id: "m-eeaaow",
    title: "Everything Everywhere All at Once",
    type: "movie",
    year: "2022",
    poster: "https://image.tmdb.org/t/p/w500/w3zJ2ILoGqmr7Jg5n5EBj2ft17w.jpg",
    genre: ["Action", "Comedy", "Drama", "Sci-Fi"],
    director: "Daniel Kwan, Daniel Scheinert",
    actors: "Michelle Yeoh, Stephanie Hsu, Ke Huy Quan, Jamie Lee Curtis",
    imdbRating: "8.1",
    runtime: "139 min",
    released: "25 Mar 2022",
    plot: "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led."
  },
  {
    id: "s-severance",
    title: "Severance",
    type: "series",
    year: "2022",
    poster: "https://image.tmdb.org/t/p/w500/l3rmgzvSSt5t3nK5Z1E2y74C4e1.jpg",
    genre: ["Drama", "Mystery", "Sci-Fi"],
    director: "Ben Stiller, Aoife McArdle",
    actors: "Adam Scott, Zach Cherry, Britt Lower, Tramell Tillman, Patricia Arquette",
    imdbRating: "8.7",
    runtime: "45 min per episode",
    released: "18 Feb 2022",
    plot: "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth about their jobs."
  },
  {
    id: "s-stranger-things",
    title: "Stranger Things",
    type: "series",
    year: "2016",
    poster: "https://image.tmdb.org/t/p/w500/49WJ25RLZIZR750z5qr6yNAdR4F.jpg",
    genre: ["Drama", "Fantasy", "Horror", "Sci-Fi"],
    director: "The Duffer Brothers",
    actors: "Millie Bobby Brown, Finn Wolfhard, Winona Ryder, David Harbour",
    imdbRating: "8.7",
    runtime: "51 min per episode",
    released: "15 Jul 2016",
    plot: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl."
  },
  {
    id: "s-breaking-bad",
    title: "Breaking Bad",
    type: "series",
    year: "2008",
    poster: "https://image.tmdb.org/t/p/w500/ztkUQv629zo1egm6go1j5lUj7w5.jpg",
    genre: ["Crime", "Drama", "Thriller"],
    director: "Vince Gilligan",
    actors: "Bryan Cranston, Aaron Paul, Anna Gunn, Betsy Brandt, RJ Mitte",
    imdbRating: "9.5",
    runtime: "49 min per episode",
    released: "20 Jan 2008",
    plot: "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family's future."
  },
  {
    id: "s-succession",
    title: "Succession",
    type: "series",
    year: "2018",
    poster: "https://image.tmdb.org/t/p/w500/79rGkG990v252Tq4H45o5S7uD65.jpg",
    genre: ["Drama"],
    director: "Jesse Armstrong",
    actors: "Brian Cox, Jeremy Strong, Sarah Snook, Kieran Culkin, Alan Ruck",
    imdbRating: "8.9",
    runtime: "60 min per episode",
    released: "03 Jun 2018",
    plot: "The Roy family is known for controlling the biggest media and entertainment company in the world. However, their world changes when their father steps down from the company."
  },
  {
    id: "s-last-of-us",
    title: "The Last of Us",
    type: "series",
    year: "2023",
    poster: "https://image.tmdb.org/t/p/w500/uKVKSj6n5l1Fl86o8Y665tqD1Cc.jpg",
    genre: ["Action", "Adventure", "Drama", "Sci-Fi", "Thriller"],
    director: "Craig Mazin, Neil Druckmann",
    actors: "Pedro Pascal, Bella Ramsey, Gabriel Luna, Rutina Wesley",
    imdbRating: "8.8",
    runtime: "50 min per episode",
    released: "15 Jan 2023",
    plot: "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity's last hope."
  }
];

// OMDb Search Helper
export async function searchOmdb(query: string, apiKey: string): Promise<Movie[]> {
  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.Response === "True" && data.Search) {
      return Promise.all(
        data.Search.slice(0, 10).map(async (item: any) => {
          // Fetch full details for detailed info (director, plot, genres)
          const detailRes = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${item.imdbID}`);
          const detailData = await detailRes.json();
          return {
            id: item.imdbID,
            title: detailData.Title || item.Title,
            type: detailData.Type === 'series' ? 'series' : 'movie',
            year: detailData.Year || item.Year,
            poster: (detailData.Poster && detailData.Poster !== 'N/A') ? detailData.Poster : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500&auto=format&fit=crop',
            genre: detailData.Genre ? detailData.Genre.split(', ').map((g: string) => g.trim()) : [],
            director: detailData.Director || 'Unknown',
            actors: detailData.Actors || 'Unknown',
            imdbRating: detailData.imdbRating || 'N/A',
            released: detailData.Released,
            runtime: detailData.Runtime,
            plot: detailData.Plot || 'No plot details available.'
          };
        })
      );
    }
    return [];
  } catch (error) {
    console.error("OMDb API Error:", error);
    return [];
  }
}

// TMDB Search Helper
export async function searchTmdb(query: string, apiKey: string): Promise<Movie[]> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&include_adult=false`
    );
    const data = await res.json();
    if (data.results) {
      const filtered = data.results.filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv');
      return filtered.slice(0, 10).map((item: any) => {
        const isTv = item.media_type === 'tv';
        // TMDB genres are numeric, we'll map standard ones or just list general
        const genreMap: Record<number, string> = {
          28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
          99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
          27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
          10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western", 10759: "Action & Adventure",
          10762: "Kids", 10765: "Sci-Fi & Fantasy", 10768: "War & Politics"
        };
        const genres = (item.genre_ids || []).map((id: number) => genreMap[id] || "Drama").slice(0, 3);
        if (genres.length === 0) genres.push(isTv ? "Series" : "Movie");

        return {
          id: `tmdb-${item.id}`,
          title: item.title || item.name,
          type: isTv ? 'series' : 'movie',
          year: (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A',
          poster: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500&auto=format&fit=crop',
          genre: genres,
          director: 'Various Directors',
          actors: 'Cast Details',
          imdbRating: item.vote_average ? item.vote_average.toFixed(1) : 'N/A',
          plot: item.overview || 'No plot details available.'
        };
      });
    }
    return [];
  } catch (error) {
    console.error("TMDB API Error:", error);
    return [];
  }
}

// TMDB Trending Helper
export async function getTrendingTmdb(apiKey: string): Promise<Movie[]> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
    );
    const data = await res.json();
    if (data.results) {
      return data.results.slice(0, 10).map((item: any) => {
        const genreMap: Record<number, string> = {
          28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
          99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
          27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
          10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
        };
        const genres = (item.genre_ids || []).map((id: number) => genreMap[id] || "Drama").slice(0, 3);
        if (genres.length === 0) genres.push("Movie");

        return {
          id: `tmdb-${item.id}`,
          title: item.title,
          type: 'movie',
          year: (item.release_date || '').split('-')[0] || 'N/A',
          poster: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500&auto=format&fit=crop',
          genre: genres,
          director: 'Various Directors',
          actors: 'Cast/Crew Details',
          imdbRating: item.vote_average ? item.vote_average.toFixed(1) : 'N/A',
          plot: item.overview || 'No plot details available.'
        };
      });
    }
    return [];
  } catch (error) {
    console.error("TMDB Trending API Error:", error);
    return [];
  }
}

// Discover Categories with TMDB Genre Mappings
export const DISCOVER_CATEGORIES = [
  { id: 'action', name: 'Action', tmdbGenreId: 28, mockName: 'Action' },
  { id: 'comedy', name: 'Comedy', tmdbGenreId: 35, mockName: 'Comedy' },
  { id: 'drama', name: 'Drama', tmdbGenreId: 18, mockName: 'Drama' },
  { id: 'scifi', name: 'Sci-Fi', tmdbGenreId: 878, mockName: 'Sci-Fi' },
  { id: 'animation', name: 'Animation', tmdbGenreId: 16, mockName: 'Animation' }
];

// TMDB Discover by Genre Helper
export async function getMoviesByGenreTmdb(apiKey: string, genreId: number): Promise<Movie[]> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&sort_by=popularity.desc`
    );
    const data = await res.json();
    if (data.results) {
      return data.results.slice(0, 10).map((item: any) => {
        const genreMap: Record<number, string> = {
          28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
          99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
          27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
          10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
        };
        const genres = (item.genre_ids || []).map((id: number) => genreMap[id] || "Drama").slice(0, 3);
        if (genres.length === 0) genres.push("Movie");

        return {
          id: `tmdb-${item.id}`,
          title: item.title,
          type: 'movie',
          year: (item.release_date || '').split('-')[0] || 'N/A',
          poster: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500&auto=format&fit=crop',
          genre: genres,
          director: 'Various Directors',
          actors: 'Cast/Crew Details',
          imdbRating: item.vote_average ? item.vote_average.toFixed(1) : 'N/A',
          plot: item.overview || 'No plot details available.'
        };
      });
    }
    return [];
  } catch (error) {
    console.error(`TMDB Genre ${genreId} API Error:`, error);
    return [];
  }
}

// TMDB Discover by Genre Paginated Helper
export async function getMoviesByGenreTmdbPaginated(
  apiKey: string,
  genreId: number,
  page: number = 1
): Promise<{ movies: Movie[]; totalPages: number }> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`
    );
    const data = await res.json();
    if (data.results) {
      const movies = data.results.map((item: any) => {
        const genreMap: Record<number, string> = {
          28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
          99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
          27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
          10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
        };
        const genres = (item.genre_ids || []).map((id: number) => genreMap[id] || "Drama").slice(0, 3);
        if (genres.length === 0) genres.push("Movie");

        return {
          id: `tmdb-${item.id}`,
          title: item.title,
          type: 'movie',
          year: (item.release_date || '').split('-')[0] || 'N/A',
          poster: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500&auto=format&fit=crop',
          genre: genres,
          director: 'Various Directors',
          actors: 'Cast/Crew Details',
          imdbRating: item.vote_average ? item.vote_average.toFixed(1) : 'N/A',
          plot: item.overview || 'No plot details available.'
        };
      });
      return {
        movies,
        totalPages: Math.min(data.total_pages || 1, 500) // TMDB maximum accessible page count is 500
      };
    }
    return { movies: [], totalPages: 1 };
  } catch (error) {
    console.error(`TMDB Genre ${genreId} Paginated API Error:`, error);
    return { movies: [], totalPages: 1 };
  }
}


