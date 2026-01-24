"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Review, ReviewInput, ReviewStats } from "@/types/index";
import {
  getMovieReviews,
  addMovieReview,
  getSeriesReviews,
  addSeriesReview,
  updateReview,
  deleteReview,
  getReviewStats
} from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface ReviewsProps {
  movieId: string;
  mediaType?: "movie" | "tv";
}

const Reviews = ({ movieId, mediaType = "movie" }: ReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: {}
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [newReview, setNewReview] = useState<ReviewInput>({
    comment: "",
    rating: 5,
  });
  const { user } = useAuth();

  const fetchReviews = async () => {
    try {
      setLoading(true);

      // Check if movieId is a valid ObjectId (24 character hex string)
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(movieId);

      if (!isObjectId) {
        console.warn("Reviews: movieId is not a valid ObjectId, skipping reviews fetch");
        setReviews([]);
        setStats({
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: {}
        });
        setUserReview(null);
        setLoading(false);
        return;
      }

      // Fetch reviews
      const reviewsData = mediaType === "movie"
        ? await getMovieReviews(movieId)
        : await getSeriesReviews(movieId);
      setReviews(reviewsData);

      // Find user's review if exists
      if (user) {
        const currentUserReview = reviewsData.find(review => review.user._id === user._id);
        setUserReview(currentUserReview || null);
      }

      // Fetch stats
      const statsData = await getReviewStats(movieId);
      setStats(statsData);

    } catch (error) {
      console.error("Error fetching reviews:", error);
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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to add a review");
      return;
    }

    if (!newReview.comment.trim()) {
      alert("Please enter a comment");
      return;
    }

    try {
      setSubmitting(true);

      if (editingReview) {
        // Update existing review
        await updateReview(movieId, newReview);
      } else {
        // Add new review
        if (mediaType === "movie") {
          await addMovieReview(movieId, newReview);
        } else {
          await addSeriesReview(movieId, newReview);
        }
      }

      setNewReview({ comment: "", rating: 5 });
      setShowForm(false);
      setEditingReview(null);
      await fetchReviews(); // Refresh reviews
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setNewReview({
      comment: review.comment,
      rating: review.rating
    });
    setShowForm(true);
  };

  const handleDeleteReview = async () => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      await deleteReview(movieId);
      await fetchReviews(); // Refresh reviews
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review. Please try again.");
    }
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setNewReview({ comment: "", rating: 5 });
    setShowForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-xl ${i < rating ? "text-yellow-400" : "text-gray-400"}`}
      >
        ⭐
      </span>
    ));
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

  // Check if movieId is a valid ObjectId
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(movieId);

  if (!isObjectId) {
    return (
      <div className="max-w-[1080px] w-full mt-10">
        <div className="border border-white/20 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl">
          <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-white mb-4">
            Reviews
          </h2>
          <div className="text-center py-8 text-white/60">
            <p className="text-lg">Reviews are not available for this content.</p>
            <p className="text-sm mt-2">This content may be from an external source.</p>
          </div>
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
              Reviews ({stats.totalReviews})
            </h2>
            {stats.totalReviews > 0 && (
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="text-white text-lg font-semibold">
                    {stats.averageRating.toFixed(1)}/5
                  </span>
                </div>
                <span className="text-white/60 text-sm">
                  Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
          {user && !userReview && (
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              {showForm ? "Cancel" : "Add Review"}
            </Button>
          )}
        </div>

        {/* Add/Edit Review Form */}
        {showForm && user && (
          <form onSubmit={handleSubmitReview} className="mb-6 p-4 border border-white/20 rounded-xl bg-white/5">
            <h3 className="text-white text-lg font-semibold mb-4">
              {editingReview ? "Edit Your Review" : "Add Your Review"}
            </h3>
            <div className="mb-4">
              <label className="block text-white mb-2 text-sm font-medium">
                Rating
              </label>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                    className={`text-2xl ${i < newReview.rating ? "text-yellow-400" : "text-gray-400"
                      } hover:text-yellow-300 transition-colors`}
                  >
                    ⭐
                  </button>
                ))}
                <span className="text-white ml-2">({newReview.rating}/5)</span>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2 text-sm font-medium">
                Comment
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder={`Share your thoughts about this ${mediaType === "movie" ? "movie" : "series"}...`}
                className="w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/60 resize-none"
                rows={4}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {submitting ? "Submitting..." : (editingReview ? "Update Review" : "Submit Review")}
              </Button>
              <Button
                type="button"
                onClick={editingReview ? cancelEdit : () => setShowForm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Rating Distribution */}
        {stats.totalReviews > 0 && (
          <div className="mb-6 p-4 border border-white/20 rounded-xl bg-white/5">
            <h3 className="text-white text-lg font-semibold mb-4">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingDistribution[rating] || 0;
                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-white text-sm">{rating}</span>
                      <span className="text-yellow-400 text-sm">⭐</span>
                    </div>
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-white/60 text-sm w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* User's Existing Review */}
        {userReview && !showForm && (
          <div className="mb-6 p-4 border-2 border-blue-500/50 rounded-xl bg-blue-500/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white text-lg font-semibold">Your Review</h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEditReview(userReview)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded"
                >
                  Edit
                </Button>
                <Button
                  onClick={handleDeleteReview}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded"
                >
                  Delete
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              {renderStars(userReview.rating)}
              <span className="text-white/60 text-sm">
                {formatDate(userReview.createdAt)}
                {userReview.updatedAt !== userReview.createdAt && " (edited)"}
              </span>
            </div>
            <p className="text-white/90 text-base leading-relaxed">
              {userReview.comment}
            </p>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.filter(review => !user || review.user._id !== user._id).length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <p className="text-lg">No other reviews yet.</p>
              {!user && (
                <p className="text-sm mt-2">Login to add the first review!</p>
              )}
            </div>
          ) : (
            reviews
              .filter(review => !user || review.user._id !== user._id)
              .map((review) => (
                <div
                  key={review._id}
                  className="border border-white/20 p-4 rounded-xl bg-white/5"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      {review.user.profilePicture ? (
                        <Image
                          src={review.user.profilePicture}
                          alt={review.user.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {review.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-white font-semibold text-lg">
                            {review.user.name}
                          </h4>
                          <p className="text-white/60 text-sm">@{review.user.username}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-white/60 text-sm">
                            {formatDate(review.createdAt)}
                            {review.updatedAt !== review.createdAt && " (edited)"}
                          </p>
                        </div>
                      </div>

                      <p className="text-white/90 text-base leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;