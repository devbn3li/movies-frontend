"use client";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Loading from "@/components/Loading";
import { useWatchlistStore } from "@/store/watchlist";
import WatchlistGrid from "@/components/WatchlistGrid";

const Profile = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const { getWatchlistCount } = useWatchlistStore();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return <Loading />;

  return (
    <div className="relative min-h-[calc(100vh-5.07rem)] mb-20">
      {/* Background with same style as movie pages */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-50"></div>

      {/* Profile Header */}
      <div className="relative">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex flex-col items-center">
            {user.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt="Avatar"
                width={200}
                height={200}
                className="rounded-full border-4 border-white/20 shadow-xl"
              />
            ) : (
              <div className="w-48 h-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-white text-9xl font-bold">{user.name.slice(0, 1)}</span>
              </div>
            )}
            <h1 className="text-white text-4xl font-bold mt-6">{user.name}</h1>
            <p className="text-white/80 text-lg mt-2">{user.email}</p>
            <p className="text-white/60">{user.country}</p>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-6">
              <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-4">
                <div className="text-2xl font-bold text-white">
                  {getWatchlistCount()}
                </div>
                <div className="text-sm text-white/70">
                  In Watchlist
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Watchlist Section */}
      <div className="relative max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <Suspense fallback={<Loading />}>
            <WatchlistGrid />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Profile;
