import { useEffect, useState } from "react";
import {
  cancelBooking,
  getBookings,
  type Booking,
} from "../../services/booking.api";

function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(
    null
  );

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBookings();
      setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings:", err);
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(bookingId);
      setError("");

      const updatedBooking = await cancelBooking(bookingId);

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                ...updatedBooking,
                venue: booking.venue,
              }
            : booking
        )
      );
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      setError(
        "Failed to cancel booking. Please try again."
      );
    } finally {
      setCancellingId(null);
    }
  };

  const formatDateTime = (value: string) => {
    return new Date(value).toLocaleString();
  };

  if (loading) {
    return (
      <div>
        <h1>My Bookings</h1>
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>My Bookings</h1>

      {error && <p>{error}</p>}

      {bookings.length === 0 ? (
        <p>You don't have any bookings yet.</p>
      ) : (
        <div>
          {bookings.map((booking) => (
            <div key={booking.id}>
              <h2>{booking.venue.name}</h2>

              <p>
                Status: <strong>{booking.status}</strong>
              </p>

              <p>
                Date: {formatDateTime(booking.startTime)}
              </p>

              <p>
                End: {formatDateTime(booking.endTime)}
              </p>

              <p>
                Price: ₹{booking.venue.pricePerHour} / hour
              </p>

              <p>
                Address:{" "}
                {booking.venue.address ||
                  "Address not provided"}
              </p>

              {booking.status !== "CANCELLED" &&
                booking.status !== "COMPLETED" && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    disabled={cancellingId === booking.id}
                  >
                    {cancellingId === booking.id
                      ? "Cancelling..."
                      : "Cancel Booking"}
                  </button>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;