import { useEffect, useState } from "react";
import api from "../../services/api";

interface BookingUser {
  id: string;
  name: string;
  email: string;
}

interface BookingVenue {
  id: string;
  name: string;
  owner: BookingUser;
}

interface AdminBooking {
  id: string;
  status: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  user: BookingUser;
  venue: BookingVenue;
}

function AdminBookings() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/admin/bookings");

        setBookings(response.data.bookings);
      } catch (err: any) {
        console.error("Failed to load bookings:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load bookings"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bookings
        </h1>

        <p className="mt-4 text-gray-600">
          Loading bookings...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bookings
        </h1>

        <p className="mt-4 text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          All Bookings
        </h1>

        <p className="mt-1 text-gray-600">
          Monitor all bookings across the BookIt platform.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Customer
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Venue
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Provider
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Start
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  End
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y bg-white">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.user.name}
                    </div>

                    <div className="text-sm text-gray-500">
                      {booking.user.email}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {booking.venue.name}
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.venue.owner.name}
                    </div>

                    <div className="text-sm text-gray-500">
                      {booking.venue.owner.email}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {new Date(
                      booking.startTime
                    ).toLocaleString()}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {new Date(
                      booking.endTime
                    ).toLocaleString()}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}

              {bookings.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminBookings;