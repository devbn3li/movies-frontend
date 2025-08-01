import { create } from "zustand";

interface User {
  id: string;
  _id?: string;
  name: string;
  username?: string;
  email: string;
  isAdmin: boolean;
  profilePicture?: string;
  country?: string;
  followersCount?: number;
  followingCount?: number;
  followers?: string[];
  following?: string[];
}

interface UserStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  mounted: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
  setMounted: (mounted: boolean) => void;

  // Computed getters
  isAdmin: () => boolean;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  mounted: false,

  setUser: (user) => {
    // Update localStorage directly when user changes
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }

    set({
      user,
      isAuthenticated: !!user,
    });
  },

  setToken: (token) => {
    // Update localStorage directly when token changes
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    }

    set({ token });
  },

  updateUser: (userData) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };

      // Update localStorage directly when user data changes
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      set({
        user: updatedUser,
        isAuthenticated: true,
      });
    }
  },

  logout: () => {
    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Clear cookies
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    // Clear store
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  setMounted: (mounted) => {
    set({ mounted });
  },

  isAdmin: () => {
    const user = get().user;
    return user?.isAdmin || false;
  },
}));
