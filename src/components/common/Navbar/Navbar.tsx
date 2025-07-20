"use client";
import { useEffect, useState, useRef } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { LuLogOut } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { CgProfile } from "react-icons/cg";
import { RxDashboard } from "react-icons/rx";

export default function Navbar() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // مسح cookie الخاص بالـ token
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    setUser(null);
    router.push("/");
    window.location.reload();
  };

  return (
    <div className="p-4 flex justify-between bg-white items-center border-b dark:border-[#333333] sm:px-20 sticky top-0 dark:bg-black/70 dark:backdrop-blur-md dark:shadow-xl z-50">
      <Link href="/" className="text-xl font-bold max-sm:ml-8">
        Movie Zone
      </Link>

      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        <ThemeToggle />

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {user.profilePicture ? (
                <Image
                  src={user.profilePicture}
                  alt="Avatar"
                  width={36}
                  height={36}
                  className="rounded-full border cursor-pointer w-10 h-10"
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
                <Link href="/profile" passHref>
                  <DropdownMenuItem>
                    Profile
                    <DropdownMenuShortcut><CgProfile /></DropdownMenuShortcut>
                  </DropdownMenuItem>
                </Link>

                {user.isAdmin && (
                  <Link href="/dashboard" passHref>
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
          <Button>
            <Link
              href="/login"
              className=" px-4 py-2 rounded"
            >
              Register / Login
            </Link>
          </Button>
        )}

      </div>
    </div>
  );
}
