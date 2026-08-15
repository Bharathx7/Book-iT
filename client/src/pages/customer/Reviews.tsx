import { useEffect, useState } from "react";
import {
  createReview,
} from "../../services/review.api";
import {
  getBookings,
  type Booking,
} from "../../services/booking.api";

function Reviews() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getBookings();
        setBookings(data);
      } catch (err) {
        console.error("Failed to load bookings:", err);
        setError(
          "Failed to load bookings. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const completedBookings = bookings.filter(
    (booking) => booking.status === "COMPLETED"
  );

  const handleSubmit = async () => {
    if (!selectedBooking) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await createReview({
        bookingId: selectedBooking.id,
        rating,
        review: reviewText.trim() || undefined,
      });

      setSelectedBooking(null);
      setRating(5);
      setReviewText("");

      setBookings((currentBookings) =>
        currentBookings.filter(
          (booking) => booking.id !== selectedBooking.id
        )
      );
    } catch (err) {
      console.error("Failed to create review:", err);
      setError(
        "Failed to submit review. This booking may already have a review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1>Reviews</h1>
        <p>Loading completed bookings...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Reviews</h1>

      {error && <p>{error}</p>}

      {completedBookings.length === 0 ? (
        <p>
          You don't have any completed bookings available
          for review.
        </p>
      ) : (
        <div>
          <h2>Bookings Available for Review</h2>

          {completedBookings.map((booking) => (
            <div key={booking.id}>
              <h3>{booking.venue.name}</h3>

              <p>
                Date:{" "}
                {new Date(
                  booking.startTime
                ).toLocaleString()}
              </p>

              <p>
                Status: <strong>{booking.status}</strong>
              </p>

              <button
                onClick={() => setSelectedBooking(booking)}
              >
                Leave Review
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedBooking && (
        <div>
          <h2>
            Review {selectedBooking.venue.name}
          </h2>

          <label>
            Rating:
            <select
              value={rating}
              onChange={(event) =>
                setRating(Number(event.target.value))
              }
            >
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Good</option>
              <option value={3}>3 - Average</option>
              <option value={2}>2 - Poor</option>
              <option value={1}>1 - Very Poor</option>
            </select>
          </label>

          <br />

          <label>
            Review:
            <textarea
              value={reviewText}
              onChange={(event) =>
                setReviewText(event.target.value)
              }
              placeholder="Write your review..."
              rows={4}
            />
          </label>

          <br />

          <button
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Submit Review"}
          </button>

          <button
            onClick={() => setSelectedBooking(null)}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default Reviews;