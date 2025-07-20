"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  profilePicture?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
          setUser(null);
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setLoading(false);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // مسح cookie الخاص بالـ token
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    setUser(null);
    router.push("/");
  };

  const requireAuth = (redirectTo: string = "/login") => {
    if (!loading && !user) {
      router.push(redirectTo);
      return false;
    }
    return true;
  };

  const requireAdmin = () => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push("/");
      return false;
    }
    return true;
  };

  return {
    user,
    loading,
    logout,
    requireAuth,
    requireAdmin,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
  };
};
