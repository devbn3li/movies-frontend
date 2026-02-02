"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getTMDBReviews, TMDBReview } from "@/lib/api";

interface ReviewsProps {
  movieId: string;
  mediaType?: "movie" | "tv";
}

const Reviews = ({ movieId, mediaType = "movie" }: ReviewsProps) => {
  const [reviews, setReviews] = useState<TMDBReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalReviews, setTotalReviews] = useState(0);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      // Convert movieId to number for TMDB API
      const tmdbId = parseInt(movieId, 10);

      if (isNaN(tmdbId)) {
        console.warn("Reviews: Invalid TMDB ID");
        setReviews([]);
        setTotalReviews(0);
        setLoading(false);
        return;
      }

      const response = await getTMDBReviews(tmdbId, mediaType);

      if (response) {
        setReviews(response.results);
        setTotalReviews(response.total_results);
      } else {
        setReviews([]);
        setTotalReviews(0);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (movieId) {
      fetchReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId, mediaType]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAvatarUrl = (avatarPath: string | null) => {
    if (!avatarPath) return null;

    // Handle gravatar URLs (they start with /)
    if (avatarPath.startsWith("/https://")) {
      return avatarPath.substring(1);
    }

    // Handle TMDB avatar paths
    if (avatarPath.startsWith("/")) {
      return `https://image.tmdb.org/t/p/w45${avatarPath}`;
    }

    return avatarPath;
  };

  const renderRating = (rating: number | null) => {
    if (!rating) return null;

    // TMDB rating is out of 10, convert to 5 stars
    const stars = Math.round(rating / 2);

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`text-lg ${i < stars ? "text-yellow-400" : "text-gray-500"}`}
          >
            ⭐
          </span>
        ))}
        <span className="text-white/60 text-sm ml-1">({rating.toFixed(1)}/10)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-[1080px] w-full mt-10">
        <div className="border border-white/20 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl">
          <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-white mb-4">
            Reviews
          </h2>
          <div className="text-white/60">Loading reviews...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1080px] w-full mt-10">
      <div className="border border-white/20 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-white">
              Reviews ({totalReviews})
            </h2>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <p className="text-lg">No reviews yet.</p>
              <p className="text-sm mt-2">Be the first to review on TMDB!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="border border-white/20 p-4 rounded-xl bg-white/5"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    {getAvatarUrl(review.author_details.avatar_path) ? (
                      <Image
                        src={getAvatarUrl(review.author_details.avatar_path)!}
                        alt={review.author}
                        width={48}
                        height={48}
                        className="rounded-full object-cover w-12 h-12"
                        unoptimized
                      />
                    ) : (
                      <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {review.author.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <div>
                        <h4 className="text-white font-semibold text-lg">
                          {review.author_details.name || review.author}
                        </h4>
                        <p className="text-white/60 text-sm">@{review.author_details.username}</p>
                      </div>
                      <div className="text-right">
                        {renderRating(review.author_details.rating)}
                        <p className="text-white/60 text-sm">
                          {formatDate(review.created_at)}
                          {review.updated_at !== review.created_at && " (edited)"}
                        </p>
                      </div>
                    </div>

                    <p className="text-white/90 text-base leading-relaxed whitespace-pre-line">
                      {review.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* TMDB Attribution */}
        {reviews.length > 0 && (
          <div className="mt-6 text-center text-white/40 text-sm">
            Reviews powered by{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              TMDB
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;