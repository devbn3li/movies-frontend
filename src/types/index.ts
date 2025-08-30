export type User = {
  _id: string;
  name: string;
  username: string;
  email: string;
  country?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Movie = {
  _id?: string;
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  genre_names: string[];
  poster_url: string | null;
  backdrop_url: string | null;
  popularity: number;
  vote_average: number;
  vote_count: number;
  original_language: string;
  adult: boolean;
  video: boolean;
};

export type TVShow = {
  _id?: string;
  id: number;
  name: string;
  original_name: string;
  overview: string;
  first_air_date: string;
  genre_names: string[];
  poster_url: string | null;
  backdrop_url: string | null;
  popularity: number;
  vote_average: number;
  vote_count: number;
  original_language: string;
  origin_country: string[];
  adult: boolean;
};

export type CastMember = {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
};

export type CrewMember = {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
  department: string;
  job: string;
};

export type Credits = {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
};

export type Person = {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  imdb_id: string | null;
  known_for_department: string;
  place_of_birth: string | null;
  popularity: number;
  profile_path: string | null;
  adult: boolean;
  also_known_as: string[];
};

export type PersonMovieCredit = {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  character?: string;
  job?: string;
  department?: string;
  credit_id: string;
  adult?: boolean;
};

export type PersonTVCredit = {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  first_air_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  character?: string;
  job?: string;
  department?: string;
  credit_id: string;
  episode_count?: number;
  adult?: boolean;
};

export type PersonCredits = {
  id: number;
  cast: PersonMovieCredit[] | PersonTVCredit[];
  crew: PersonMovieCredit[] | PersonTVCredit[];
};

export type PersonImage = {
  aspect_ratio: number;
  height: number;
  width: number;
  file_path: string;
  vote_average: number;
  vote_count: number;
};

export type PersonImages = {
  id: number;
  profiles: PersonImage[];
};

export type PersonExternalIds = {
  id: number;
  imdb_id: string | null;
  freebase_mid: string | null;
  freebase_id: string | null;
  tvrage_id: number | null;
  wikidata_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  tiktok_id: string | null;
  twitter_id: string | null;
  youtube_id: string | null;
};

// Video/Trailer Types
export type Video = {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
};

export type VideosResponse = {
  id: number;
  results: Video[];
};

// Genre Types
export type Genre = {
  id: number;
  name: string;
};

// Backend Filter Types
export type BackendGenre = {
  name: string;
  count: number;
};

export type FilterResponse = {
  success: boolean;
  filters: {
    years: number[];
    genres: BackendGenre[];
    contentType: "movie" | "tv";
  };
  meta: {
    totalMovies?: number;
    totalTVShows?: number;
    contentType: "movie" | "tv";
    lastUpdated: string;
  };
};

export type ReviewUser = {
  _id: string;
  name: string;
  profilePicture?: string;
  username: string;
};

export type Review = {
  _id: string;
  movie: string;
  mediaType: string;
  user: ReviewUser;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ReviewInput = {
  comment: string;
  rating: number;
};

export type ReviewResponse = {
  message: string;
  review: Review;
};

export type ReviewStats = {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    [key: string]: number;
  };
};

export type ReviewUpdateInput = {
  comment: string;
  rating: number;
};
