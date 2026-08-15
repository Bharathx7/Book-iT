import { useEffect, useState } from "react";
import { getProviderBookings } from "../../services/booking.api";

type Booking = {
  id: string;
  status: string;
  startTime: string;
  endTime: string;
  venue?: {
    name: string;
  };
};

export default function ProviderCalendar() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProviderBookings();
        setBookings(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load calendar");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="mt-4 text-gray-600">Loading calendar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="mt-4 text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Booking Calendar</h1>

      <p className="mt-2 text-gray-600">
        View bookings for your venues.
      </p>

      {bookings.length === 0 ? (
        <div className="mt-6 rounded-lg border p-6">
          <p className="text-gray-600">
            No bookings available.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-lg border bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-semibold">
                    {booking.venue?.name ?? "Venue"}
                  </h2>

                  <p className="text-sm text-gray-600">
                    {new Date(booking.startTime).toLocaleString()}
                  </p>

                  <p className="text-sm text-gray-600">
                    to {new Date(booking.endTime).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    booking.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : booking.status === "CONFIRMED"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "COMPLETED"
                      ? "bg-blue-100 text-blue-800"
                      : booking.status === "CANCELLED"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}