import { CastMember, CommunityReview } from './movie-db';

export interface MockMovieDetail {
  cast: CastMember[];
  trailerKey: string; // YouTube video ID
  reviews: CommunityReview[];
}

export const MOCK_MOVIE_DETAILS: Record<string, MockMovieDetail> = {
  "m-inception": {
    cast: [
      { name: "Leonardo DiCaprio", character: "Cobb", profileUrl: "https://image.tmdb.org/t/p/w185/87e1D70mRL358YhBhv76ysxNM69.jpg" },
      { name: "Joseph Gordon-Levitt", character: "Arthur", profileUrl: "https://image.tmdb.org/t/p/w185/1Zw96snJ42u5m3vYr8vC49pqrg9.jpg" },
      { name: "Elliot Page", character: "Ariadne", profileUrl: "https://image.tmdb.org/t/p/w185/96x62vY8zL2p0bN6P1a4tJt4s2S.jpg" },
      { name: "Tom Hardy", character: "Eames", profileUrl: "https://image.tmdb.org/t/p/w185/y9wwl7Zkhm39d997Vss1S2w3eS1.jpg" },
      { name: "Ken Watanabe", character: "Saito", profileUrl: "https://image.tmdb.org/t/p/w185/cT4fR67N23K6jM8Y5LdGkP0T73e.jpg" },
      { name: "Marion Cotillard", character: "Mal", profileUrl: "https://image.tmdb.org/t/p/w185/17sS68k99S67r4d216X1wQ7pG2e.jpg" }
    ],
    trailerKey: "YoHD9XEInc0",
    reviews: [
      { id: "rev-inc-1", author: "CinephileSam", rating: 9, content: "An absolute masterpiece of modern cinema. Nolan constructs a layered dream heist that is as emotionally resonant as it is intellectually stimulating. Hans Zimmer's score is iconic.", date: "2025-11-12" },
      { id: "rev-inc-2", author: "NolanFanatic", rating: 10, content: "Mind-bending visuals, a airtight script, and flawless editing. The spinning top ending remains one of the greatest conversation starters in film history.", date: "2026-01-20" }
    ]
  },
  "m-interstellar": {
    cast: [
      { name: "Matthew McConaughey", character: "Cooper", profileUrl: "https://image.tmdb.org/t/p/w185/sY2hCH2Zrmelv7AyBcDw76IBK4p.jpg" },
      { name: "Anne Hathaway", character: "Brand", profileUrl: "https://image.tmdb.org/t/p/w185/tLmqresvY652KsGi8fo2F1GJyNz.jpg" },
      { name: "Jessica Chastain", character: "Murph", profileUrl: "https://image.tmdb.org/t/p/w185/4tQ65yVbLz4K1L0QjF90N1GkCnz.jpg" },
      { name: "Michael Caine", character: "Professor Brand", profileUrl: "https://image.tmdb.org/t/p/w185/klNx4UqbiED050u52v5qi57gnrn.jpg" }
    ],
    trailerKey: "zSWdZAIB3NY",
    reviews: [
      { id: "rev-int-1", author: "SpaceOdyssey", rating: 10, content: "This is more than a sci-fi film; it's a profound exploration of love, time, and human endurance. The dock sequence is one of the most suspenseful scenes ever filmed.", date: "2025-12-05" },
      { id: "rev-int-2", author: "AstrophysicsNerd", rating: 8, content: "Visually stunning with scientific accuracy (mostly) that makes it deeply immersive. The black hole representation was groundbreaking at the time.", date: "2026-03-02" }
    ]
  },
  "m-dark-knight": {
    cast: [
      { name: "Christian Bale", character: "Bruce Wayne / Batman", profileUrl: "https://image.tmdb.org/t/p/w185/b7fTCIBufSRq8t79t2Rqqbb5c2C.jpg" },
      { name: "Heath Ledger", character: "Joker", profileUrl: "https://image.tmdb.org/t/p/w185/545wG1t6547656wGsd.jpg" },
      { name: "Aaron Eckhart", character: "Harvey Dent", profileUrl: "https://image.tmdb.org/t/p/w185/u6I8wX50t9yv4H4576y.jpg" },
      { name: "Gary Oldman", character: "Jim Gordon", profileUrl: "https://image.tmdb.org/t/p/w185/745wGfsdf54645.jpg" }
    ],
    trailerKey: "EXeTwQWrcwY",
    reviews: [
      { id: "rev-dk-1", author: "GothamMayor", rating: 10, content: "Heath Ledger's performance is legendary. This film transcended the superhero genre and became a premier crime thriller in its own right.", date: "2025-10-18" },
      { id: "rev-dk-2", author: "ComicBuff", rating: 9, content: "A gritty, realistic Gotham. The philosophical clash between Batman and the Joker is executed perfectly. Harvey Dent's tragedy completes the narrative arc.", date: "2026-02-14" }
    ]
  },
  "m-pulp-fiction": {
    cast: [
      { name: "John Travolta", character: "Vincent Vega", profileUrl: "https://image.tmdb.org/t/p/w185/3V98b7D.jpg" },
      { name: "Samuel L. Jackson", character: "Jules Winnfield", profileUrl: "https://image.tmdb.org/t/p/w185/sam_jackson.jpg" },
      { name: "Uma Thurman", character: "Mia Wallace", profileUrl: "https://image.tmdb.org/t/p/w185/uma_t.jpg" },
      { name: "Bruce Willis", character: "Butch Coolidge", profileUrl: "https://image.tmdb.org/t/p/w185/b_willis.jpg" }
    ],
    trailerKey: "s7EdQ4FqbhY",
    reviews: [
      { id: "rev-pf-1", author: "TarantinoGuy", rating: 10, content: "The dialogue, the non-linear timeline, the music - everything about this film is cool. It redefined independent cinema in the 90s.", date: "2025-08-20" }
    ]
  },
  "m-matrix": {
    cast: [
      { name: "Keanu Reeves", character: "Neo", profileUrl: "https://image.tmdb.org/t/p/w185/keanu.jpg" },
      { name: "Laurence Fishburne", character: "Morpheus", profileUrl: "https://image.tmdb.org/t/p/w185/laurence.jpg" },
      { name: "Carrie-Anne Moss", character: "Trinity", profileUrl: "https://image.tmdb.org/t/p/w185/carrie.jpg" }
    ],
    trailerKey: "vKQi3bBA1y8",
    reviews: [
      { id: "rev-mat-1", author: "RedPill", rating: 9, content: "Revolutionary action design and philosophical depth. It changed how blockbusters were made forever.", date: "2025-09-09" }
    ]
  },
  "m-spirited-away": {
    cast: [
      { name: "Rumi Hiiragi", character: "Chihiro (voice)", profileUrl: "https://image.tmdb.org/t/p/w185/rumi.jpg" },
      { name: "Miyu Irino", character: "Haku (voice)", profileUrl: "https://image.tmdb.org/t/p/w185/miyu.jpg" }
    ],
    trailerKey: "ByXuk9QqQMC",
    reviews: [
      { id: "rev-sa-1", author: "AnimeLover", rating: 10, content: "Miyazaki's crowning achievement. The hand-drawn animation, the fantastical world, and the haunting soundtrack by Joe Hisaishi are unmatched.", date: "2025-07-15" }
    ]
  },
  "m-parasite": {
    cast: [
      { name: "Song Kang-ho", character: "Ki-taek", profileUrl: "https://image.tmdb.org/t/p/w185/song.jpg" },
      { name: "Lee Sun-kyun", character: "Mr. Park", profileUrl: "https://image.tmdb.org/t/p/w185/lee.jpg" }
    ],
    trailerKey: "5xH0HfJHsaY",
    reviews: [
      { id: "rev-par-1", author: "BongHive", rating: 10, content: "A razor-sharp satire that seamlessly blends comedy, thriller, and tragedy. The house layout is a character of its own.", date: "2025-10-30" }
    ]
  },
  "m-spider-verse": {
    cast: [
      { name: "Shameik Moore", character: "Miles Morales", profileUrl: "https://image.tmdb.org/t/p/w185/shameik.jpg" },
      { name: "Jake Johnson", character: "Peter B. Parker", profileUrl: "https://image.tmdb.org/t/p/w185/jake.jpg" },
      { name: "Hailee Steinfeld", character: "Gwen Stacy", profileUrl: "https://image.tmdb.org/t/p/w185/hailee.jpg" }
    ],
    trailerKey: "g4HnMaI5bcQ",
    reviews: [
      { id: "rev-sv-1", author: "SpideyFan", rating: 10, content: "The best Spider-Man movie. Period. The animation style is literally a comic book come to life.", date: "2025-06-01" }
    ]
  },
  "m-dune-2": {
    cast: [
      { name: "Timothée Chalamet", character: "Paul Atreides", profileUrl: "https://image.tmdb.org/t/p/w185/timmy.jpg" },
      { name: "Zendaya", character: "Chani", profileUrl: "https://image.tmdb.org/t/p/w185/zendaya.jpg" },
      { name: "Rebecca Ferguson", character: "Lady Jessica", profileUrl: "https://image.tmdb.org/t/p/w185/rebecca.jpg" },
      { name: "Austin Butler", character: "Feyd-Rautha Harkonnen", profileUrl: "https://image.tmdb.org/t/p/w185/austin.jpg" }
    ],
    trailerKey: "Way9Dexny3w",
    reviews: [
      { id: "rev-dune2-1", author: "ArrakisDreamer", rating: 10, content: "A sci-fi epic that matches the scale of Lord of the Rings. Villeneuve has achieved the impossible in adapting Herbert's masterpiece.", date: "2026-04-12" },
      { id: "rev-dune2-2", author: "SpiceWatcher", rating: 9, content: "Greig Fraser's cinematography and Hans Zimmer's sound design are otherworldly. Austin Butler is menacing.", date: "2026-05-01" }
    ]
  },
  "m-eeaaow": {
    cast: [
      { name: "Michelle Yeoh", character: "Evelyn Wang", profileUrl: "https://image.tmdb.org/t/p/w185/michelle.jpg" },
      { name: "Ke Huy Quan", character: "Waymond Wang", profileUrl: "https://image.tmdb.org/t/p/w185/kehuy.jpg" },
      { name: "Stephanie Hsu", character: "Joy Wang", profileUrl: "https://image.tmdb.org/t/p/w185/stephanie.jpg" }
    ],
    trailerKey: "wxN1T1UxQ2A",
    reviews: [
      { id: "rev-ee-1", author: "MultiverseX", rating: 9, content: "Crazy, chaotic, and filled with massive heart. Ke Huy Quan's performance is the soul of the film.", date: "2025-11-15" }
    ]
  },
  "s-severance": {
    cast: [
      { name: "Adam Scott", character: "Mark Scout", profileUrl: "https://image.tmdb.org/t/p/w185/adamscott.jpg" },
      { name: "Britt Lower", character: "Helly R.", profileUrl: "https://image.tmdb.org/t/p/w185/britt.jpg" },
      { name: "Patricia Arquette", character: "Harmony Cobel", profileUrl: "https://image.tmdb.org/t/p/w185/patricia.jpg" },
      { name: "John Turturro", character: "Irving", profileUrl: "https://image.tmdb.org/t/p/w185/john.jpg" }
    ],
    trailerKey: "xKTgqa84-P8",
    reviews: [
      { id: "rev-sev-1", author: "LumonInnie", rating: 10, content: "Best thriller series in years. The set design, the mystery, and the flawless pacing keep you on edge. The season finale is breathtaking.", date: "2025-12-25" }
    ]
  },
  "s-stranger-things": {
    cast: [
      { name: "Millie Bobby Brown", character: "Eleven", profileUrl: "https://image.tmdb.org/t/p/w185/millie.jpg" },
      { name: "Finn Wolfhard", character: "Mike Wheeler", profileUrl: "https://image.tmdb.org/t/p/w185/finn.jpg" },
      { name: "Winona Ryder", character: "Joyce Byers", profileUrl: "https://image.tmdb.org/t/p/w185/winona.jpg" },
      { name: "David Harbour", character: "Jim Hopper", profileUrl: "https://image.tmdb.org/t/p/w185/harbour.jpg" }
    ],
    trailerKey: "b9EkMc79ZSU",
    reviews: [
      { id: "rev-st-1", author: "Retro80s", rating: 9, content: "Pure 80s nostalgia mixed with horror. Excellent casting of child actors who carry the emotional weight of the show.", date: "2025-06-20" }
    ]
  },
  "s-breaking-bad": {
    cast: [
      { name: "Bryan Cranston", character: "Walter White", profileUrl: "https://image.tmdb.org/t/p/w185/bryan.jpg" },
      { name: "Aaron Paul", character: "Jesse Pinkman", profileUrl: "https://image.tmdb.org/t/p/w185/aaron.jpg" },
      { name: "Anna Gunn", character: "Skyler White", profileUrl: "https://image.tmdb.org/t/p/w185/anna.jpg" }
    ],
    trailerKey: "HhesaQXLuRY",
    reviews: [
      { id: "rev-bb-1", author: "Heisenberg", rating: 10, content: "The gold standard of television drama. The slow descent of Walter White from family man to drug kingpin is Shakespearean.", date: "2025-05-15" },
      { id: "rev-bb-2", author: "YoBitch", rating: 10, content: "Perfect ending, perfect development. Vince Gilligan is a genius.", date: "2025-09-12" }
    ]
  },
  "s-succession": {
    cast: [
      { name: "Brian Cox", character: "Logan Roy", profileUrl: "https://image.tmdb.org/t/p/w185/briancox.jpg" },
      { name: "Jeremy Strong", character: "Kendall Roy", profileUrl: "https://image.tmdb.org/t/p/w185/jeremy.jpg" },
      { name: "Sarah Snook", character: "Shiv Roy", profileUrl: "https://image.tmdb.org/t/p/w185/sarah.jpg" },
      { name: "Kieran Culkin", character: "Roman Roy", profileUrl: "https://image.tmdb.org/t/p/w185/kieran.jpg" }
    ],
    trailerKey: "OzYxJV_JHOM",
    reviews: [
      { id: "rev-succ-1", author: "Royalty", rating: 10, content: "Searing satire, intense family dynamics, and hilarious dialogue. Kendall's struggles are tragic. Nicholas Britell's theme song is legendary.", date: "2025-10-10" }
    ]
  },
  "s-last-of-us": {
    cast: [
      { name: "Pedro Pascal", character: "Joel Miller", profileUrl: "https://image.tmdb.org/t/p/w185/pedro.jpg" },
      { name: "Bella Ramsey", character: "Ellie Williams", profileUrl: "https://image.tmdb.org/t/p/w185/bella.jpg" }
    ],
    trailerKey: "uLtkt8BonwM",
    reviews: [
      { id: "rev-lou-1", author: "GamerCine", rating: 9, content: "A masterclass in video game adaptation. It preserves the heart of the game while expanding the world and characters in meaningful ways.", date: "2025-07-20" }
    ]
  }
};
