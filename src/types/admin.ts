export interface AdminUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
  country: string;
  favorites: string[];
  isAdmin: boolean;
  profilePicture: string;
  following: string[];
  followers: string[];
  followingCount: number;
  followersCount: number;
  createdAt: string;
  updatedAt: string;
  settings: {
    showAdultContent: boolean;
  };
}

export interface UsersPagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UsersResponse {
  users: AdminUser[];
  pagination: UsersPagination;
}

export interface UserContent {
  user: {
    _id: string;
    name: string;
    username: string;
    email: string;
  };
  reviews: unknown[];
  favorites: unknown[];
  stats: {
    totalReviews: number;
    totalFavorites: number;
    followersCount: number;
    followingCount: number;
  };
}
