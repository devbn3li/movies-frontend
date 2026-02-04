"use client";
import Image from "next/image";
import { AdminUser } from "@/types/admin";
import { Shield, Mail, MapPin, Users, Calendar } from "lucide-react";

interface UserCardProps {
  user: AdminUser;
  onViewDetails: (user: AdminUser) => void;
  onViewContent: (user: AdminUser) => void;
  onToggleAdmin: (user: AdminUser) => void;
}

export default function UserCard({
  user,
  onViewDetails,
  onViewContent,
  onToggleAdmin,
}: UserCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="relative">
          <Image
            src={user.profilePicture}
            alt={user.name}
            width={56}
            height={56}
            className="rounded-full object-cover"
          />
          {user.isAdmin && (
            <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-1">
              <Shield size={12} className="text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{user.name}</h3>
          <p className="text-sm text-gray-400 truncate">@{user.username}</p>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Mail size={14} />
          <span className="truncate">{user.email}</span>
          {user.isEmailVerified && (
            <span className="text-green-500 text-xs">✓</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <MapPin size={14} />
          <span>{user.country}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Users size={14} />
          <span>{user.followersCount} followers · {user.followingCount} following</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar size={14} />
          <span>Joined {formatDate(user.createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails(user)}
          className="flex-1 px-3 py-2 text-sm bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
        >
          Details
        </button>
        <button
          onClick={() => onViewContent(user)}
          className="flex-1 px-3 py-2 text-sm bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
        >
          Content
        </button>
        <button
          onClick={() => onToggleAdmin(user)}
          className={`px-3 py-2 text-sm rounded-lg transition-colors ${user.isAdmin
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
              : "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
            }`}
        >
          {user.isAdmin ? "Remove Admin" : "Make Admin"}
        </button>
      </div>
    </div>
  );
}
