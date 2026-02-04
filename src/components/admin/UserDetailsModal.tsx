"use client";
import { AdminUser } from "@/types/admin";
import { X, Shield, Mail, MapPin, Users, Calendar, Settings } from "lucide-react";
import Image from "next/image";

interface UserDetailsModalProps {
  user: AdminUser;
  onClose: () => void;
}

export default function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
          <h2 className="text-xl font-bold text-white">User Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <Image
                src={user.profilePicture}
                alt={user.name}
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
              {user.isAdmin && (
                <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1.5">
                  <Shield size={14} className="text-white" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{user.name}</h3>
              <p className="text-gray-400">@{user.username}</p>
              {user.isAdmin && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                  Admin
                </span>
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                Contact Info
              </h4>
              <div className="flex items-center gap-3 text-white">
                <Mail size={18} className="text-gray-500" />
                <span>{user.email}</span>
                {user.isEmailVerified ? (
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                    Verified
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                    Not Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-white">
                <MapPin size={18} className="text-gray-500" />
                <span>{user.country}</span>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                Social Stats
              </h4>
              <div className="flex items-center gap-3 text-white">
                <Users size={18} className="text-gray-500" />
                <span>
                  <strong>{user.followersCount}</strong> Followers ·{" "}
                  <strong>{user.followingCount}</strong> Following
                </span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-gray-500">❤️</span>
                <span>
                  <strong>{user.favorites.length}</strong> Favorites
                </span>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                Settings
              </h4>
              <div className="flex items-center gap-3 text-white">
                <Settings size={18} className="text-gray-500" />
                <span>
                  Adult Content:{" "}
                  {user.settings.showAdultContent ? (
                    <span className="text-green-400">Enabled</span>
                  ) : (
                    <span className="text-gray-400">Disabled</span>
                  )}
                </span>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                Dates
              </h4>
              <div className="flex items-center gap-3 text-white">
                <Calendar size={18} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-400">Created</p>
                  <p>{formatDate(user.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Calendar size={18} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-400">Last Updated</p>
                  <p>{formatDate(user.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* User ID */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              ID: <code className="text-gray-400">{user._id}</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
