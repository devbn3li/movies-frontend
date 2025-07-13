export type Movie = {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  genre_names: string[];
  poster_url: string;
  backdrop_url: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  original_language: string;
  adult: boolean;
  video: boolean;
};

export type TVShow = {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  first_air_date: string;
  genre_names: string[];
  poster_url: string;
  backdrop_url: string;
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
