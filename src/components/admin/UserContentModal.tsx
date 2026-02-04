"use client";
import { useState, useEffect } from "react";
import { UserContent, AdminUser } from "@/types/admin";
import { X, FileText, Heart, Users, Loader2 } from "lucide-react";
import axios from "@/lib/axios";

interface UserContentModalProps {
  user: AdminUser;
  onClose: () => void;
}

export default function UserContentModal({ user, onClose }: UserContentModalProps) {
  const [content, setContent] = useState<UserContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${user._id}/content`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setContent(res.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [user._id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">User Content</h2>
            <p className="text-sm text-gray-400">@{user.username}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400">{error}</p>
            </div>
          ) : content ? (
            <div className="space-y-4">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                  <FileText className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">
                    {content.stats.totalReviews}
                  </p>
                  <p className="text-sm text-gray-400">Reviews</p>
                </div>
                <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-4 text-center">
                  <Heart className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">
                    {content.stats.totalFavorites}
                  </p>
                  <p className="text-sm text-gray-400">Favorites</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
                  <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">
                    {content.stats.followersCount}
                  </p>
                  <p className="text-sm text-gray-400">Followers</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                  <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">
                    {content.stats.followingCount}
                  </p>
                  <p className="text-sm text-gray-400">Following</p>
                </div>
              </div>

              {/* Reviews List */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
                  Recent Reviews
                </h4>
                {content.reviews.length > 0 ? (
                  <div className="space-y-2">
                    {/* TODO: Render reviews when structure is known */}
                    <p className="text-gray-400 text-sm">
                      {content.reviews.length} reviews found
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No reviews yet
                  </p>
                )}
              </div>

              {/* Favorites List */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
                  Favorites
                </h4>
                {content.favorites.length > 0 ? (
                  <div className="space-y-2">
                    {/* TODO: Render favorites when structure is known */}
                    <p className="text-gray-400 text-sm">
                      {content.favorites.length} favorites found
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No favorites yet
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
