"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

export const useAuth = () => {
  const router = useRouter();
  const {
    user,
    token,
    isAuthenticated,
    mounted,
    setUser,
    setToken,
    updateUser,
    logout: logoutStore,
    setMounted,
    isAdmin,
  } = useUserStore();

  useEffect(() => {
    setMounted(true);

    // Only access localStorage after component mounts
    const checkAuth = () => {
      try {
        const storedToken = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!storedToken || !userData) {
          setUser(null);
          setToken(null);
          return;
        }

        const parsedUser = JSON.parse(userData);

        // Load profile picture from localStorage if exists
        const userId = parsedUser._id || parsedUser.id;
        if (userId) {
          const savedProfilePicture = localStorage.getItem(
            `profilePicture_${userId}`
          );
          if (savedProfilePicture) {
            parsedUser.profilePicture = savedProfilePicture;
          }
        }

        // Only update if the stored data is different from current store data
        if (
          JSON.stringify(parsedUser) !== JSON.stringify(user) ||
          storedToken !== token
        ) {
          setUser(parsedUser);
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
        setToken(null);
      }
    };

    checkAuth();

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user" || e.key === "token") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [setUser, setToken, setMounted, user, token]);

  const logout = () => {
    logoutStore();
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
    if (!user || !isAdmin()) {
      router.push("/");
      return false;
    }
    return true;
  };

  return {
    user,
    token,
    logout,
    requireAuth,
    requireAdmin,
    updateUser, // New: function to update user data
    isAuthenticated,
    isAdmin: isAdmin(),
    mounted,
  };
};
