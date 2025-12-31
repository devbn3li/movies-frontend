"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/components/Loading";
import WatchlistGrid from "@/components/WatchlistGrid";
import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/hooks/useNotification";

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

const Profile = () => {
  const { user, mounted, updateUser } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);
  const [followStates, setFollowStates] = useState<Record<string, boolean>>({});
  const [followingLoading, setFollowingLoading] = useState<Record<string, boolean>>({});

  // Profile picture management states
  const [profilePictureLoading, setProfilePictureLoading] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile picture from localStorage on mount
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      const userId = user._id || user.id;
      if (userId) {
        const savedPicture = localStorage.getItem(`profilePicture_${userId}`);
        if (savedPicture && savedPicture !== user.profilePicture) {
          updateUser({ profilePicture: savedPicture });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, user?.id]);

  // Helper: get token from localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
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
        // Update user's following count
        if (user) {
          updateUser({ followingCount: (user.followingCount || 0) + 1 });
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
        // Update user's following count
        if (user) {
          updateUser({ followingCount: Math.max((user.followingCount || 0) - 1, 0) });
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

  // Profile Picture Management Functions

  // Validate image file
  const validateImageFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Unsupported file type. Use JPEG, PNG, GIF or WebP');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum 5MB');
    }

    return true;
  };

  // Convert file to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Upload profile picture from device - saves to localStorage
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      validateImageFile(file);
    } catch (error) {
      showError((error as Error).message);
      return;
    }

    setProfilePictureLoading(true);

    try {
      // Convert image to Base64
      const base64Image = await fileToBase64(file);

      // Save to localStorage with user-specific key
      const userId = user?._id || user?.id;
      if (userId) {
        localStorage.setItem(`profilePicture_${userId}`, base64Image);
      }

      // Update user in store
      updateUser({ profilePicture: base64Image });

      showSuccess('Profile picture updated successfully!');
      setShowProfileOptions(false);

    } catch (error) {
      console.error('Error updating profile picture:', error);
      showError('Error: ' + (error as Error).message);
    } finally {
      setProfilePictureLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Update profile picture from URL - saves to localStorage
  const handleUrlUpdate = async () => {
    if (!imageUrl.trim()) {
      showError('Please enter image URL');
      return;
    }

    setProfilePictureLoading(true);

    try {
      // Save URL to localStorage with user-specific key
      const userId = user?._id || user?.id;
      if (userId) {
        localStorage.setItem(`profilePicture_${userId}`, imageUrl);
      }

      // Update user in store
      updateUser({ profilePicture: imageUrl });

      setImageUrl('');
      setShowUrlInput(false);
      setShowProfileOptions(false);
      showSuccess('Profile picture updated successfully!');

    } catch (error) {
      console.error('Error updating profile picture:', error);
      showError('Error: ' + (error as Error).message);
    } finally {
      setProfilePictureLoading(false);
    }
  };

  // Delete profile picture - removes from localStorage
  const handleDeletePicture = async () => {
    setProfilePictureLoading(true);

    try {
      // Remove from localStorage
      const userId = user?._id || user?.id;
      if (userId) {
        localStorage.removeItem(`profilePicture_${userId}`);
      }

      // Update user in store (set to undefined/empty)
      updateUser({ profilePicture: undefined });

      setShowProfileOptions(false);
      setShowDeleteConfirm(false);
      showSuccess('Profile picture deleted successfully!');

    } catch (error) {
      console.error('Error deleting profile picture:', error);
      showError('Error: ' + (error as Error).message);
    } finally {
      setProfilePictureLoading(false);
    }
  };

  if (!mounted || !user) return <Loading />;

  // Ensure the profile picture URL is absolute and add cache busting
  const getFullImageUrl = (url: string | undefined) => {
    if (!url) return undefined;

    // If it's a Base64 data URL, return as is (localStorage images)
    if (url.startsWith('data:image/')) {
      return url;
    }

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

  const profilePictureUrl = getFullImageUrl(user.profilePicture);

  return (
    <div className="relative h-full pb-20">
      {/* Background with same style as movie pages */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-50"></div>

      {/* Profile Header */}
      <div className="relative">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex flex-col items-center">
            {/* Profile Picture with Edit Option */}
            <div className="relative group">
              {profilePictureUrl ? (
                <Image
                  src={profilePictureUrl}
                  alt="Avatar"
                  width={200}
                  height={200}
                  className="rounded-full w-[200px] h-[200px] border-4 border-white/20 shadow-xl object-cover"
                  unoptimized
                  key={profilePictureUrl} // Force re-render when URL changes
                  onError={() => {
                    console.error('Image failed to load:', profilePictureUrl);
                  }}
                  onLoad={() => {
                  }}
                />
              ) : (
                <div className="w-48 h-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-white text-9xl font-bold">{user.name?.slice(0, 1)}</span>
                </div>
              )}

              {/* Edit Profile Picture Button */}
              <button
                onClick={() => setShowProfileOptions(!showProfileOptions)}
                disabled={profilePictureLoading}
                className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors disabled:opacity-50"
                title="Change Profile Picture"
              >
                {profilePictureLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Profile Picture Options Modal */}
            {showProfileOptions && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={() => setShowProfileOptions(false)}>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white text-xl font-bold">Change Profile Picture</h3>
                    <button onClick={() => setShowProfileOptions(false)} className="text-white/70 hover:text-white text-2xl">&times;</button>
                  </div>

                  <div className="space-y-4">
                    {/* Upload from device */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={profilePictureLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Choose Image from Device
                    </button>

                    {/* URL input toggle */}
                    <button
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      disabled={profilePictureLoading}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Use External Link
                    </button>

                    {/* URL Input */}
                    {showUrlInput && (
                      <div className="space-y-3">
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="Enter image URL here"
                          disabled={profilePictureLoading}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-blue-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleUrlUpdate}
                            disabled={profilePictureLoading || !imageUrl.trim()}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => {
                              setShowUrlInput(false);
                              setImageUrl('');
                            }}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Delete picture */}
                    {user.profilePicture && (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={profilePictureLoading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Picture
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <h1 className="text-white text-4xl font-bold mt-6">{user.name}</h1>
            <p className="text-white/80 text-lg mt-2">@{user.username || user.name?.toLowerCase().replace(/\s+/g, '')}</p>
            <p className="text-white/60">{user.email}</p>
            <p className="text-white/60">{user.country}</p>

            {/* Share Profile Button */}
            <div className="mt-4">
              <button
                onClick={() => {
                  const username = user.username || user.name?.toLowerCase().replace(/\s+/g, '');
                  const profileUrl = `${window.location.origin}/user/${username}`;
                  navigator.clipboard.writeText(profileUrl);
                  showSuccess('Profile link copied to clipboard!');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Share Profile Link
              </button>
            </div>

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
                    <Link
                      href={`/user/${f.username || f.name?.toLowerCase().replace(/\s+/g, '')}`}
                      className="flex items-center gap-3 flex-1 hover:bg-white/5 rounded-lg p-2 transition-colors cursor-pointer"
                    >
                      <Image src={getFullImageUrl(f.profilePicture) || '/placeholder-avatar.svg'} alt={f.name} width={32} height={32} className="rounded-full object-cover" unoptimized />
                      <div className="flex flex-col">
                        <span className="text-white font-bold">{f.name}</span>
                        <span className="text-white/70 text-sm">@{f.username}</span>
                      </div>
                    </Link>
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
                    <Link
                      href={`/user/${f.username || f.name?.toLowerCase().replace(/\s+/g, '')}`}
                      className="flex items-center gap-3 flex-1 hover:bg-white/5 rounded-lg p-2 transition-colors cursor-pointer"
                    >
                      <Image src={getFullImageUrl(f.profilePicture) || '/placeholder-avatar.svg'} alt={f.name} width={32} height={32} className="rounded-full object-cover" unoptimized />
                      <div className="flex flex-col">
                        <span className="text-white font-bold">{f.name}</span>
                        <span className="text-white/70 text-sm">@{f.username}</span>
                      </div>
                    </Link>
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Delete Profile Picture</h3>
              <p className="text-sm text-white/70 mb-6">Are you sure you want to delete your profile picture? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    handleDeletePicture();
                  }}
                  disabled={profilePictureLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {profilePictureLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
