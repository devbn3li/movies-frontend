"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import WatchlistGrid from "@/components/WatchlistGrid";
import { useAuth } from "@/hooks/useAuth";

interface User {
  _id: string;
  name: string;
  username?: string;
  email: string;
  profilePicture?: string;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  isOwnProfile?: boolean;
}

const UserProfile = () => {
  const { user: currentUser, mounted } = useAuth();
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);
  const [followStates, setFollowStates] = useState<Record<string, boolean>>({});
  const [followingLoading, setFollowingLoading] = useState<Record<string, boolean>>({});

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
      fullUrl = `https://moviezone.me${url.startsWith('/') ? url : '/' + url}`;
    }

    // Add cache busting timestamp to prevent old cached images
    const separator = fullUrl.includes('?') ? '&' : '?';
    return `${fullUrl}${separator}t=${Date.now()}`;
  };

  // Fetch user profile by username
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!mounted || !username) return;

      try {
        setLoading(true);
        const token = getToken();

        // If no token and trying to access profile, redirect to login
        if (!token) {
          router.push('/login');
          return;
        }

        // Try to fetch user by username using the correct API
        const res = await fetch(`https://moviezone.me/api/user/username/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          },
        });

        if (res.ok) {
          const data = await res.json();
          setProfileUser(data.user);

          // Use the isOwnProfile and isFollowing from API response
          setIsOwnProfile(data.user.isOwnProfile || false);
          setIsFollowing(data.user.isFollowing || false);
          setUserNotFound(false);
        } else if (res.status === 404) {
          // User not found
          setUserNotFound(true);
          setProfileUser(null);
        } else {
          // Other error, redirect to home
          router.push('/');
        }

      } catch (error) {
        console.error('Error fetching user profile:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [mounted, username, currentUser, router]);

  // Follow/Unfollow the profile user
  const toggleFollow = async () => {
    if (!profileUser || isOwnProfile) return;

    setFollowLoading(true);
    try {
      const endpoint = isFollowing
        ? `https://moviezone.me/api/follow/${profileUser._id}/unfollow`
        : `https://moviezone.me/api/follow/${profileUser._id}/follow`;

      const method = isFollowing ? 'DELETE' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Cache-Control': 'no-cache'
        },
      });

      if (res.ok) {
        setIsFollowing(!isFollowing);
        // Update the followers count
        if (profileUser) {
          profileUser.followersCount = isFollowing
            ? Math.max((profileUser.followersCount || 0) - 1, 0)
            : (profileUser.followersCount || 0) + 1;
        }
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
    setFollowLoading(false);
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
    const userId = profileUser?._id;
    if (!userId) return;

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
    const userId = profileUser?._id;
    if (!userId) return;

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

  if (!mounted || loading) return <Loading />;

  if (userNotFound) {
    return (
      <div className="relative h-full pb-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-50"></div>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <div className="text-white text-2xl font-bold mb-2">User not found</div>
            <div className="text-white/70 text-lg mb-6">The user you&apos;re looking for doesn&apos;t exist.</div>
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-xl">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="relative h-full pb-20">
      {/* Background with same style as movie pages */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-50"></div>

      {/* Profile Header */}
      <div className="relative">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex flex-col items-center">
            {profileUser.profilePicture ? (
              <Image
                src={getFullImageUrl(profileUser.profilePicture) || profileUser.profilePicture}
                alt="Avatar"
                width={200}
                height={200}
                className="rounded-full border-4 border-white/20 shadow-xl object-cover"
                unoptimized
                key={profileUser.profilePicture} // Force re-render when URL changes
              />
            ) : (
              <div className="w-48 h-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-white text-9xl font-bold">{profileUser.name?.slice(0, 1)}</span>
              </div>
            )}
            <h1 className="text-white text-4xl font-bold mt-6">{profileUser.name}</h1>
            <p className="text-white/80 text-lg mt-2">@{profileUser.username || username}</p>
            {isOwnProfile && <p className="text-white/60">{profileUser.email}</p>}

            {/* Follow/Unfollow Button - Only show for other users */}
            {!isOwnProfile && (
              <div className="mt-4">
                <button
                  onClick={toggleFollow}
                  disabled={followLoading}
                  className={`px-6 py-2 rounded-full font-medium transition-colors disabled:opacity-50 ${isFollowing
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                  {followLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {isFollowing ? 'Unfollowing...' : 'Following...'}
                    </div>
                  ) : (
                    isFollowing ? 'Unfollow' : 'Follow'
                  )}
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-8 mt-6">
              <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-4 cursor-pointer" onClick={() => {
                setFollowers([]); // Clear previous data
                setFollowStates({}); // Clear previous states
                setFollowersOpen(true);
                fetchFollowers();
              }}>
                <div className="text-2xl font-bold text-white">{profileUser.followersCount ?? 0}</div>
                <div className="text-sm text-white/70">Followers</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-4 cursor-pointer" onClick={() => {
                setFollowing([]); // Clear previous data
                setFollowStates({}); // Clear previous states
                setFollowingOpen(true);
                fetchFollowing();
              }}>
                <div className="text-2xl font-bold text-white">{profileUser.followingCount ?? 0}</div>
                <div className="text-sm text-white/70">Following</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Watchlist Section - Only show for own profile */}
      {isOwnProfile && (
        <div className="relative max-w-6xl mx-auto px-6 py-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <WatchlistGrid />
          </div>
        </div>
      )}

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
                    <Link
                      href={`/user/${f.username || f.name?.toLowerCase().replace(/\s+/g, '')}`}
                      className="flex items-center gap-3 flex-1 hover:bg-white/5 rounded-lg p-2 transition-colors cursor-pointer"
                    >
                      <Image src={getFullImageUrl(f.profilePicture) || '/placeholder-avatar.svg'} alt={f.name} width={32} height={32} className="rounded-full object-cover" unoptimized key={f.profilePicture} />
                      <div className="flex flex-col">
                        <span className="text-white font-bold">{f.name}</span>
                        <span className="text-white/70 text-sm">@{f.username}</span>
                      </div>
                    </Link>
                    {!isOwnProfile && f._id !== currentUser?._id && f._id !== currentUser?.id && (
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
                    )}
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
                    <Link
                      href={`/user/${f.username || f.name?.toLowerCase().replace(/\s+/g, '')}`}
                      className="flex items-center gap-3 flex-1 hover:bg-white/5 rounded-lg p-2 transition-colors cursor-pointer"
                    >
                      <Image src={getFullImageUrl(f.profilePicture) || '/placeholder-avatar.svg'} alt={f.name} width={32} height={32} className="rounded-full object-cover" unoptimized key={f.profilePicture} />
                      <div className="flex flex-col">
                        <span className="text-white font-bold">{f.name}</span>
                        <span className="text-white/70 text-sm">@{f.username}</span>
                      </div>
                    </Link>
                    {(isOwnProfile || (!isOwnProfile && f._id !== currentUser?._id && f._id !== currentUser?.id)) && (
                      <button
                        onClick={() => isOwnProfile ? unfollowUser(f._id) : (followStates[f._id] ? unfollowUser(f._id) : followUser(f._id))}
                        disabled={followingLoading[f._id]}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors disabled:opacity-50 ${isOwnProfile
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : followStates[f._id]
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                      >
                        {followingLoading[f._id] ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : isOwnProfile ? (
                          'Unfollow'
                        ) : followStates[f._id] ? (
                          'Unfollow'
                        ) : (
                          'Follow'
                        )}
                      </button>
                    )}
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

export default UserProfile;
