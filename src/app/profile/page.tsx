"use client";
import { useState } from "react";
import Image from "next/image";
import Loading from "@/components/Loading";
import WatchlistGrid from "@/components/WatchlistGrid";
import { useAuth } from "@/hooks/useAuth";

interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  followersCount: number;
  followingCount: number;
}

const Profile = () => {
  const { user, mounted } = useAuth();

  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  // Helper: get token from localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Fetch followers list
  const fetchFollowers = async () => {
    const userId = user?._id || user?.id;
    if (!userId) return;
    setLoadingFollowers(true);
    try {
      const res = await fetch(`https://moviezone.me/api/follow/${userId}/followers?page=1&limit=20`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setFollowers(data.followers || []);
    } catch {
      // Handle error silently
    }
    setLoadingFollowers(false);
  };

  // Fetch following list
  const fetchFollowing = async () => {
    const userId = user?._id || user?.id;
    if (!userId) return;
    setLoadingFollowing(true);
    try {
      const res = await fetch(`https://moviezone.me/api/follow/${userId}/following?page=1&limit=20`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setFollowing(data.following || []);
    } catch {
      // Handle error silently
    }
    setLoadingFollowing(false);
  };

  if (!mounted || !user) return <Loading />;

  return (
    <div className="relative h-full pb-20">
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
                <span className="text-white text-9xl font-bold">{user.name?.slice(0, 1)}</span>
              </div>
            )}
            <h1 className="text-white text-4xl font-bold mt-6">{user.name}</h1>
            <p className="text-white/80 text-lg mt-2">{user.email}</p>
            <p className="text-white/60">{user.country}</p>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-6">
              <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-4 cursor-pointer" onClick={() => { setFollowersOpen(true); fetchFollowers(); }}>
                <div className="text-2xl font-bold text-white">{user.followersCount ?? user.followers?.length ?? 0}</div>
                <div className="text-sm text-white/70">Followers</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-4 cursor-pointer" onClick={() => { setFollowingOpen(true); fetchFollowing(); }}>
                <div className="text-2xl font-bold text-white">{user.followingCount ?? user.following?.length ?? 0}</div>
                <div className="text-sm text-white/70">Following</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Watchlist Section */}
      <div className="relative max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <WatchlistGrid />
        </div>
      </div>

      {/* Followers Modal */}
      {followersOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
          onClick={() => setFollowersOpen(false)}
        >
          <div
            className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setFollowersOpen(false)}>&times;</button>
            <h2 className="text-2xl font-bold text-white mb-4">Followers</h2>
            {loadingFollowers ? (
              <div className="flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            ) : followers.length === 0 ? (
              <div className="text-white/70">No followers found.</div>
            ) : (
              <ul className="space-y-3">
                {followers.map((f) => (
                  <li key={f._id} className="flex items-center gap-3">
                    <Image src={f.profilePicture || '/placeholder-avatar.svg'} alt={f.name} width={32} height={32} className="rounded-full" />
                    <span className="text-white font-bold">{f.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Following Modal */}
      {followingOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
          onClick={() => setFollowingOpen(false)}
        >
          <div
            className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setFollowingOpen(false)}>&times;</button>
            <h2 className="text-2xl font-bold text-white mb-4">Following</h2>
            {loadingFollowing ? (
              <div className="flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            ) : following.length === 0 ? (
              <div className="text-white/70">Not following anyone.</div>
            ) : (
              <ul className="space-y-3">
                {following.map((f) => (
                  <li key={f._id} className="flex items-center gap-3">
                    <Image src={f.profilePicture || '/placeholder-avatar.svg'} alt={f.name} width={32} height={32} className="rounded-full" />
                    <span className="text-white font-bold">{f.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
