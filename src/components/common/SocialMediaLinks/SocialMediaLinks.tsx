import { PersonExternalIds } from "@/types/index";
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  ExternalLink,
  Music2,
  Globe
} from "lucide-react";

interface SocialMediaLinksProps {
  externalIds: PersonExternalIds | null;
  personName: string;
  className?: string;
}

export default function SocialMediaLinks({
  externalIds,
  personName,
  className = ""
}: SocialMediaLinksProps) {
  if (!externalIds) return null;

  const socialLinks = [
    {
      id: externalIds.instagram_id,
      platform: "Instagram",
      url: `https://www.instagram.com/${externalIds.instagram_id}`,
      icon: Instagram,
      color: "hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20",
      bgColor: "bg-gradient-to-br from-purple-500 to-pink-500",
      username: `@${externalIds.instagram_id}`
    },
    {
      id: externalIds.twitter_id,
      platform: "X (Twitter)",
      url: `https://twitter.com/${externalIds.twitter_id}`,
      icon: Twitter,
      color: "hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20",
      bgColor: "bg-black",
      username: `@${externalIds.twitter_id}`
    },
    {
      id: externalIds.facebook_id,
      platform: "Facebook",
      url: `https://www.facebook.com/${externalIds.facebook_id}`,
      icon: Facebook,
      color: "hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20",
      bgColor: "bg-blue-600",
      username: externalIds.facebook_id
    },
    {
      id: externalIds.youtube_id,
      platform: "YouTube",
      url: `https://www.youtube.com/channel/${externalIds.youtube_id}`,
      icon: Youtube,
      color: "hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20",
      bgColor: "bg-red-600",
      username: "Channel"
    },
    {
      id: externalIds.tiktok_id,
      platform: "TikTok",
      url: `https://www.tiktok.com/@${externalIds.tiktok_id}`,
      icon: Music2,
      color: "hover:text-black hover:bg-gray-50 dark:hover:bg-gray-800/20",
      bgColor: "bg-black",
      username: `@${externalIds.tiktok_id}`
    },
    {
      id: externalIds.imdb_id,
      platform: "IMDb",
      url: `https://www.imdb.com/name/${externalIds.imdb_id}`,
      icon: Globe,
      color: "hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20",
      bgColor: "bg-yellow-600",
      username: "Profile"
    }
  ].filter(link => link.id);

  if (socialLinks.length === 0) return null;

  return (
    <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 ${className}`}>
      <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
        <Globe size={20} className="text-purple-400" />
        Social Media
      </h3>

      {/* Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {socialLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                flex items-center gap-3 p-3 rounded-xl 
                bg-white/5 border border-white/10 
                transition-all duration-200 
                ${link.color}
                hover:scale-105 hover:shadow-lg hover:bg-white/10
                group relative overflow-hidden
              `}
              title={`Follow ${personName} on ${link.platform}`}
            >
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

              {/* Icon */}
              <div className={`p-2 rounded-lg ${link.bgColor} group-hover:scale-110 transition-transform duration-200 relative z-10`}>
                <Icon size={18} className="text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 relative z-10">
                <p className="text-white text-sm font-medium">
                  {link.platform}
                </p>
                <p className="text-gray-300 text-xs">
                  {link.username}
                </p>
              </div>

              {/* Arrow */}
              <ExternalLink size={14} className="text-gray-400 group-hover:text-white transition-colors duration-200 relative z-10" />
            </a>
          );
        })}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <p className="text-gray-400 text-xs">
          Follow {personName}&apos;s latest updates
        </p>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-xs font-medium">
            {socialLinks.length} platform{socialLinks.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
