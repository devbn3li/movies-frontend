"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  isAdmin: boolean;
  profilePicture?: string;
  country?: string;
  followersCount?: number;
  followingCount?: number;
  followers?: string[];
  following?: string[];
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Only access localStorage after component mounts
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
          setUser(null);
          return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    setUser(null);
    router.push("/");
  };

  const requireAuth = (redirectTo: string = "/login") => {
    if (!user) {
      router.push(redirectTo);
      return false;
    }
    return true;
  };

  const requireAdmin = () => {
    if (!user || !user.isAdmin) {
      router.push("/");
      return false;
    }
    return true;
  };

  return {
    user,
    logout,
    requireAuth,
    requireAdmin,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    mounted,
  };
};
