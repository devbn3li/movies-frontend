"use client";
import { useRef } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";
import Link from "next/link";
import { trackNavigationClick } from "@/lib/analytics";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch";
import { LuLogOut } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { CgProfile } from "react-icons/cg";
import { RxDashboard } from "react-icons/rx";

export default function Navbar() {
  const { user, logout, mounted } = useAuth();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  // Helper: get token from localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Ensure the profile picture URL is absolute and add cache busting
  const getFullImageUrl = (url: string | undefined) => {
    if (!url) return undefined;

    let fullUrl = url;

    // If it's already a full URL, use as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      fullUrl = url;
    }
    // If it's a relative path, make it absolute
    else if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
      fullUrl = `https://moviezone-inky.vercel.app${url.startsWith('/') ? url : '/' + url}`;
    }

    // Add cache busting timestamp to prevent old cached images
    const separator = fullUrl.includes('?') ? '&' : '?';
    return `${fullUrl}${separator}t=${Date.now()}`;
  };

  return (
    <div className="p-4 flex justify-between bg-white items-center border-b dark:border-[#333333] sm:px-20 sticky top-0 dark:bg-black/70 dark:backdrop-blur-md dark:shadow-xl z-50">
      <Link
        href="/"
        className="text-xl font-bold max-sm:ml-8"
        onClick={() => trackNavigationClick('Logo/Home', '/')}
      >
        Movie Zone
      </Link>

      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        <ThemeToggle />

        {!mounted ? (
          // Show a placeholder during hydration to prevent mismatch
          <Button asChild className="px-4 py-2 text-sm rounded-md">
            <Link href="/login">
              Register / Login
            </Link>
          </Button>
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {user.profilePicture ? (
                <Image
                  src={getFullImageUrl(user.profilePicture) || user.profilePicture}
                  alt="Avatar"
                  width={36}
                  height={36}
                  className="rounded-full border cursor-pointer w-10 h-10 object-cover"
                  unoptimized
                  key={user.profilePicture} // Force re-render when URL changes
                />) : (
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center cursor-pointer">
                  <span className="text-gray-500 dark:text-gray-400 text-2xl font-bold">{user.name.slice(0, 1)}</span>
                </div>
              )}
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <Link
                  href="/profile"
                  passHref
                  onClick={() => trackNavigationClick('Profile', '/profile')}
                >
                  <DropdownMenuItem>
                    Profile
                    <DropdownMenuShortcut><CgProfile /></DropdownMenuShortcut>
                  </DropdownMenuItem>
                </Link>

                {user.isAdmin && (
                  <Link
                    href="/dashboard"
                    passHref
                    onClick={() => trackNavigationClick('Dashboard', '/dashboard')}
                  >
                    <DropdownMenuItem>
                      Dashboard
                      <DropdownMenuShortcut><RxDashboard /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </Link>
                )}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={() => {
                  handleLogout();
                }}
                className="text-red-600"
              >
                Log out
                <DropdownMenuShortcut><LuLogOut /></DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild className="px-4 py-2 text-sm rounded-md">
            <Link href="/login">
              Register / Login
            </Link>
          </Button>
        )}

      </div>
    </div>
  );
}
