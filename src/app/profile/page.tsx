"use client";
import { useState, useEffect } from "react";
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
  const [followStates, setFollowStates] = useState<Record<string, boolean>>({});
  const [followingLoading, setFollowingLoading] = useState<Record<string, boolean>>({});

  // Clear follow cache on component mount
  useEffect(() => {
    clearFollowCache();
  }, []);

  // Helper: get token from localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Clear follow cache from localStorage
  const clearFollowCache = () => {
    if (typeof window !== 'undefined') {
      // Remove any cached follow data
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('follow') || key.includes('followers') || key.includes('following'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  };

  // Check follow status for a user
  const checkFollowStatus = async (userId: string) => {
    try {
      const res = await fetch(`https://moviezone.me/api/follow/${userId}/follow-status`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Cache-Control': 'no-cache'
        },
      });
      const data = await res.json();
      return data.isFollowing || false;
    } catch {
      return false;
    }
  };

  // Follow a user
  const followUser = async (userId: string) => {
    setFollowingLoading(prev => ({ ...prev, [userId]: true }));
    try {
      const res = await fetch(`https://moviezone.me/api/follow/${userId}/follow`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Cache-Control': 'no-cache'
        },
      });

      if (res.ok) {
        setFollowStates(prev => ({ ...prev, [userId]: true }));
        // Update user's following count if needed
        if (user) {
          user.followingCount = (user.followingCount || 0) + 1;
        }
        // Refresh the current lists to get updated data
        if (followersOpen) {
          setTimeout(() => fetchFollowers(), 500);
        }
        if (followingOpen) {
          setTimeout(() => fetchFollowing(), 500);
        }
      }
    } catch {
      // Handle error silently
    }
    setFollowingLoading(prev => ({ ...prev, [userId]: false }));
  };

  // Unfollow a user
  const unfollowUser = async (userId: string) => {
    setFollowingLoading(prev => ({ ...prev, [userId]: true }));
    try {
      const res = await fetch(`https://moviezone.me/api/follow/${userId}/unfollow`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Cache-Control': 'no-cache'
        },
      });

      if (res.ok) {
        setFollowStates(prev => ({ ...prev, [userId]: false }));
        // Remove from following list if unfollowed from following modal
        setFollowing(prev => prev.filter(u => u._id !== userId));
        // Update user's following count if needed
        if (user) {
          user.followingCount = Math.max((user.followingCount || 0) - 1, 0);
        }
        // Refresh the current lists to get updated data
        if (followersOpen) {
          setTimeout(() => fetchFollowers(), 500);
        }
        if (followingOpen) {
          setTimeout(() => fetchFollowing(), 500);
        }
      }
    } catch {
      // Handle error silently
    }
    setFollowingLoading(prev => ({ ...prev, [userId]: false }));
  };

  // Fetch followers list
  const fetchFollowers = async () => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    // Clear any cached data first
    clearFollowCache();

    setLoadingFollowers(true);
    try {
      const res = await fetch(`https://moviezone.me/api/follow/${userId}/followers?page=1&limit=20`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Cache-Control': 'no-cache'
        },
      });
      const data = await res.json();
      const followersList = data.followers || [];
      setFollowers(followersList);

      // Check follow status for each follower - fresh API call each time
      const followStatusPromises = followersList.map(async (follower: User) => {
        const isFollowing = await checkFollowStatus(follower._id);
        return { userId: follower._id, isFollowing };
      });

      const followStatuses = await Promise.all(followStatusPromises);
      const newFollowStates: Record<string, boolean> = {};
      followStatuses.forEach(({ userId, isFollowing }) => {
        newFollowStates[userId] = isFollowing;
      });
      setFollowStates(newFollowStates);
    } catch {
      // Handle error silently
    }
    setLoadingFollowers(false);
  };

  // Fetch following list
  const fetchFollowing = async () => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    // Clear any cached data first
    clearFollowCache();

    setLoadingFollowing(true);
    try {
      const res = await fetch(`https://moviezone.me/api/follow/${userId}/following?page=1&limit=20`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Cache-Control': 'no-cache'
        },
      });
      const data = await res.json();
      const followingList = data.following || [];
      setFollowing(followingList);

      // Set all following users as followed (since they are in the following list) - fresh data each time
      const newFollowStates: Record<string, boolean> = {};
      followingList.forEach((user: User) => {
        newFollowStates[user._id] = true;
      });
      setFollowStates(prev => ({ ...prev, ...newFollowStates }));
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
              <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-4 cursor-pointer" onClick={() => {
                setFollowers([]); // Clear previous data
                setFollowStates({}); // Clear previous states
                setFollowersOpen(true);
                fetchFollowers();
              }}>
                <div className="text-2xl font-bold text-white">{user.followersCount ?? user.followers?.length ?? 0}</div>
                <div className="text-sm text-white/70">Followers</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-4 cursor-pointer" onClick={() => {
                setFollowing([]); // Clear previous data
                setFollowStates({}); // Clear previous states
                setFollowingOpen(true);
                fetchFollowing();
              }}>
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
                  <li key={f._id} className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3">
                      <Image src={f.profilePicture || '/placeholder-avatar.svg'} alt={f.name} width={32} height={32} className="rounded-full" />
                      <span className="text-white font-bold">{f.name}</span>
                    </div>
                    <button
                      onClick={() => followStates[f._id] ? unfollowUser(f._id) : followUser(f._id)}
                      disabled={followingLoading[f._id]}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${followStates[f._id]
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                        } disabled:opacity-50`}
                    >
                      {followingLoading[f._id] ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : followStates[f._id] ? (
                        'Unfollow'
                      ) : (
                        'Follow Back'
                      )}
                    </button>
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
                  <li key={f._id} className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3">
                      <Image src={f.profilePicture || '/placeholder-avatar.svg'} alt={f.name} width={32} height={32} className="rounded-full" />
                      <span className="text-white font-bold">{f.name}</span>
                    </div>
                    <button
                      onClick={() => unfollowUser(f._id)}
                      disabled={followingLoading[f._id]}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {followingLoading[f._id] ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        'Unfollow'
                      )}
                    </button>
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
