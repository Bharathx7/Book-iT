import { useEffect, useState } from "react";
import {
  getProviderBookings,
  confirmBooking,
  completeBooking,
  cancelBooking,
} from "../../services/booking.api";

type Booking = {
  id: string;
  status: string;
  startTime: string;
  endTime: string;
  venue?: {
    name: string;
  };
  user?: {
    name?: string;
    email?: string;
  };
};

export default function ProviderBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProviderBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleConfirm = async (bookingId: string) => {
    try {
      setActionLoading(bookingId);
      setError("");

      const updatedBooking = await confirmBooking(bookingId);

      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId
            ? { ...booking, ...updatedBooking }
            : booking
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to confirm booking");
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (bookingId: string) => {
    try {
      setActionLoading(bookingId);
      setError("");

      const updatedBooking = await completeBooking(bookingId);

      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId
            ? { ...booking, ...updatedBooking }
            : booking
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to complete booking");
    } finally {
      setActionLoading(null);
    }
  };
const handleCancel = async (bookingId: string) => {
  try {
    setActionLoading(bookingId);
    setError("");

    const updatedBooking = await cancelBooking(bookingId);

    setBookings((current) =>
      current.map((booking) =>
        booking.id === bookingId
          ? { ...booking, ...updatedBooking }
          : booking
      )
    );
  } catch (err) {
    console.error(err);
    setError("Failed to cancel booking");
  } finally {
    setActionLoading(null);
  }
};

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Manage Bookings</h1>
        <p className="mt-4 text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Manage Bookings</h1>

      <p className="mt-2 text-gray-600">
        Manage bookings for your venues.
      </p>

      {error && (
        <div className="mt-4 rounded-md bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="mt-6 rounded-lg border p-6">
          <p className="text-gray-600">
            No bookings found for your venues.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-lg border bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {booking.venue?.name ?? "Venue"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    Customer:{" "}
                    {booking.user?.name ||
                      booking.user?.email ||
                      "Customer"}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Start:{" "}
                    {new Date(booking.startTime).toLocaleString()}
                  </p>

                  <p className="text-sm text-gray-600">
                    End:{" "}
                    {new Date(booking.endTime).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col items-start gap-3 md:items-end">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      booking.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : booking.status === "CONFIRMED"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "COMPLETED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {booking.status}
                  </span>

                  {booking.status === "PENDING" && (
                    <button
                      onClick={() => handleConfirm(booking.id)}
                      disabled={actionLoading === booking.id}
                      className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {actionLoading === booking.id
                        ? "Confirming..."
                        : "Confirm"}
                    </button>
                  )}

                  {booking.status === "CONFIRMED" && (
                    <button
                      onClick={() => handleComplete(booking.id)}
                      disabled={actionLoading === booking.id}
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {actionLoading === booking.id
                        ? "Completing..."
                        : "Complete"}
                    </button>
                  )}
                  {(booking.status === "PENDING" ||
                    booking.status === "CONFIRMED") && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      disabled={actionLoading === booking.id}
                      className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {actionLoading === booking.id
                        ? "Cancelling..."
                        : "Cancel"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}