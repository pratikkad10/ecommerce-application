import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import * as reviewService from "../../api/services/review.service";
import type { Review } from "../../types/commerce.types";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New / Edit review form state
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    try {
      setIsLoading(true);
      const res = await reviewService.getProductReviews(productId);
      if (res.success && Array.isArray(res.data)) {
        setReviews(res.data);
      }
    } catch {
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Check if current user already submitted a review
  const userExistingReview = useMemo(() => {
    if (!user) return null;
    return reviews.find((r) => r.userId === user.id) || null;
  }, [reviews, user]);

  const handleStartEdit = (review: Review) => {
    setEditingReviewId(review.id);
    setRating(review.rating);
    setComment(review.comment || "");
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setRating(5);
    setComment("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please sign in to leave a review");
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingReviewId) {
        await reviewService.updateReview(editingReviewId, {
          rating,
          comment: comment.trim() || undefined,
        });
        toast.success("Review updated successfully");
        setEditingReviewId(null);
      } else {
        await reviewService.createReview({
          productId,
          rating,
          comment: comment.trim() || undefined,
        });
        toast.success("Thank you for your review!");
      }
      setComment("");
      setRating(5);
      await fetchReviews();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete your review?")) return;
    try {
      await reviewService.deleteReview(reviewId);
      toast.success("Review deleted");
      if (editingReviewId === reviewId) {
        handleCancelEdit();
      }
      await fetchReviews();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete review");
    }
  };

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return total / reviews.length;
  }, [reviews]);

  const ratingCounts = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        counts[r.rating - 1]++;
      }
    });
    return counts;
  }, [reviews]);

  return (
    <section className="mt-16 pt-12 border-t border-outline-variant/30">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="font-headline-sm text-2xl font-bold text-on-surface">
            Customer Reviews
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Real feedback from verified purchasers
          </p>
        </div>
      </div>

      {/* Ratings Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs mb-10">
        <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-outline-variant/30 pb-6 md:pb-0">
          <span className="text-5xl font-black text-on-surface tracking-tight">
            {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
          </span>
          <div className="flex items-center gap-1 my-2 text-primary-container">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="material-symbols-outlined text-xl"
                style={{
                  fontVariationSettings:
                    i < Math.round(averageRating) ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                star
              </span>
            ))}
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </span>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingCounts[stars - 1];
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs text-on-surface-variant">
                <span className="w-12 flex items-center gap-1 font-medium shrink-0">
                  {stars} <span className="material-symbols-outlined text-xs">star</span>
                </span>
                <div className="flex-1 h-2 rounded-full bg-surface-variant overflow-hidden">
                  <div
                    className="h-full bg-primary-container rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right shrink-0">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form */}
      {isAuthenticated ? (
        (!userExistingReview || editingReviewId) && (
          <form
            onSubmit={handleSubmit}
            className="p-6 rounded-2xl bg-surface-container-low border border-primary-container/20 shadow-xs mb-10 space-y-4"
          >
            <h3 className="font-bold text-base text-on-surface">
              {editingReviewId ? "Edit Your Review" : "Write a Review"}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-2">
                Overall Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(null)}
                    className="text-primary-container hover:scale-110 transition-transform p-0.5 cursor-pointer"
                  >
                    <span
                      className="material-symbols-outlined text-2xl"
                      style={{
                        fontVariationSettings:
                          star <= (hoveredStar ?? rating) ? "'FILL' 1" : "'FILL' 0",
                      }}
                    >
                      star
                    </span>
                  </button>
                ))}
                <span className="text-xs font-medium text-on-surface-variant ml-2">
                  {rating === 5 && "Excellent"}
                  {rating === 4 && "Very Good"}
                  {rating === 3 && "Average"}
                  {rating === 2 && "Poor"}
                  {rating === 1 && "Terrible"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Your Review (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on the quality, fit, and style..."
                rows={3}
                className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-on-primary font-bold px-6 py-2.5 rounded-xl hover:bg-primary-container cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : editingReviewId ? "Update Review" : "Submit Review"}
              </Button>
              {editingReviewId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="rounded-xl px-4 py-2.5 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        )
      ) : (
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-center mb-10">
          <p className="text-sm text-on-surface-variant mb-3">
            Have you purchased this product? Sign in to leave your feedback.
          </p>
          <Button asChild variant="outline" className="rounded-xl font-bold px-6">
            <Link to="/login">Sign In to Review</Link>
          </Button>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="py-12 text-center text-sm text-on-surface-variant">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-12 text-center text-sm text-on-surface-variant">
          No reviews yet. Be the first to share your experience!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => {
            const isMyReview = user && rev.userId === user.id;
            return (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-container/15 flex items-center justify-center font-bold text-xs text-primary">
                      {rev.user?.firstName?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-on-surface">
                        {rev.user?.firstName} {rev.user?.lastName ?? ""}
                        {isMyReview && (
                          <span className="ml-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary-container/10 text-primary uppercase">
                            You
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-on-surface-variant">
                        {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {isMyReview && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(rev)}
                        className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <span className="text-outline-variant">•</span>
                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="text-xs text-on-surface-variant hover:text-red-500 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Rating Stars */}
                <div className="flex items-center text-primary-container">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-sm"
                      style={{
                        fontVariationSettings: i < rev.rating ? "'FILL' 1" : "'FILL' 0",
                      }}
                    >
                      star
                    </span>
                  ))}
                </div>

                {/* Comment */}
                {rev.comment && (
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {rev.comment}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
