"use client"
import { Home } from "lucide-react"
import { MdLiveTv } from "react-icons/md";
import { BiMoviePlay } from "react-icons/bi";
import { RiMovieLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { getMovieGenres, getTVGenres } from "@/lib/api";
import { Genre } from "@/types/index";
import { useQuery } from '@tanstack/react-query';
import { CiWarning } from "react-icons/ci";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Movies",
    url: "/main-movies",
    icon: BiMoviePlay,
  },
  {
    title: "TV Shows",
    url: "/main-series",
    icon: MdLiveTv,
  },
  {
    title: "Disclaimer",
    url: "/disclaimer",
    icon: CiWarning,
  },
]

// مكون منفصل لـ sidebar content
function SidebarContent_() {
  const router = useRouter();

  // استخدام React Query لـ caching الـ genres (نادراً ما تتغير)
  const { data: movieGenres = [] } = useQuery<Genre[]>({
    queryKey: ['movieGenres'],
    queryFn: async () => {
      const genres = await getMovieGenres();
      return genres;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - الـ genres نادراً ما تتغير
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days - نحتفظ بيها في الـ cache أسبوع
    refetchOnMount: false, // لا نعيد الـ fetch عند mount
    refetchOnWindowFocus: false, // لا نعيد الـ fetch عند focus
    refetchOnReconnect: false, // لا نعيد الـ fetch عند reconnect
  });

  const { data: tvGenres = [] } = useQuery<Genre[]>({
    queryKey: ['tvGenres'],
    queryFn: async () => {
      const genres = await getTVGenres();
      return genres;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    refetchOnMount: false, // لا نعيد الـ fetch عند mount
    refetchOnWindowFocus: false, // لا نعيد الـ fetch عند focus
    refetchOnReconnect: false, // لا نعيد الـ fetch عند reconnect
  });

  const isGenreActive = (genre: string) => {
    // بدلاً من searchParams، هنشوف الـ current path
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      return url.searchParams.get('genre') === genre;
    }
    return false;
  };

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>
          General
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Movie Categories */}
      <SidebarGroup>
        <SidebarGroupLabel>
          <BiMoviePlay className="mr-2 h-4 w-4" />
          Movie Categories
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {movieGenres.map((genre) => (
              <SidebarMenuItem key={`movie-${genre.id}`}>
                <SidebarMenuButton
                  className={`cursor-pointer ${isGenreActive(genre.name)
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : ''
                    }`}
                  onClick={() => router.push(`/main-movies?genre=${encodeURIComponent(genre.name)}`)}
                >
                  <RiMovieLine />
                  <span>{genre.name}</span>
                  {isGenreActive(genre.name) && (
                    <span className="ml-auto h-2 w-2 bg-blue-500 rounded-full" />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* TV Show Categories */}
      <SidebarGroup>
        <SidebarGroupLabel>
          <MdLiveTv className="mr-2 h-4 w-4" />
          TV Show Categories
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {tvGenres.map((genre) => (
              <SidebarMenuItem key={`tv-${genre.id}`}>
                <SidebarMenuButton
                  className={`cursor-pointer ${isGenreActive(genre.name)
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : ''
                    }`}
                  onClick={() => router.push(`/main-series?genre=${encodeURIComponent(genre.name)}`)}
                >
                  <RiMovieLine />
                  <span>{genre.name}</span>
                  {isGenreActive(genre.name) && (
                    <span className="ml-auto h-2 w-2 bg-green-500 rounded-full" />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}

export function AppSidebar() {
  const { setOpen, isMobile } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // إغلاق السايد بار عند الضغط خارجه
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const sidebarTrigger = document.querySelector('.sidebar-trigger');

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !isMobile && // على الموبايل الـ Sheet component هيتولى الموضوع ده
        !(sidebarTrigger && sidebarTrigger.contains(target)) // مانقفلش لو ضغطت على الزرار نفسه
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setOpen, isMobile]);

  return (
    <div ref={sidebarRef}>
      <Sidebar className="fixed top-[64px] left-0 z-40 h-[calc(100vh-64px)] w-64 ">
        <SidebarContent_ />
      </Sidebar>
    </div>
  )
}