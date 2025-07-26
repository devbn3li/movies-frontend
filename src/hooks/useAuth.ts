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
  // Try to get user from localStorage immediately (synchronously)
  const getInitialUserState = () => {
    if (typeof window === 'undefined') return null;
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      if (token && userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
    return null;
  };

  const [user, setUser] = useState<User | null>(getInitialUserState);
  const router = useRouter();

  useEffect(() => {
    // Since we already checked in useState, we don't need to do much here
    // Just verify the state is correct
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
          if (user !== null) {
            setUser(null);
          }
          return;
        }

        const parsedUser = JSON.parse(userData);
        if (!user || user.id !== parsedUser.id) {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    };

    checkAuth();
  }, [user]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // مسح cookie الخاص بالـ token
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
  };
};
