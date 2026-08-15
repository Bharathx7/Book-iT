import { useEffect, useState } from "react";
import api from "../../services/api";

interface DashboardStats {
  users: number;
  providers: number;
  venues: number;
  bookings: number;
  bookingStats: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
}

function AdminAnalytics() {
  const [dashboard, setDashboard] =
    useState<DashboardStats | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get("/admin/dashboard");

        setDashboard(response.data.dashboard);
      } catch (err: any) {
        console.error("Failed to load analytics:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Analytics
        </h1>

        <p className="mt-4 text-gray-600">
          Loading analytics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Analytics
        </h1>

        <p className="mt-4 text-red-600">
          {error}
        </p>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const totalTrackedBookings =
    dashboard.bookingStats.pending +
    dashboard.bookingStats.confirmed +
    dashboard.bookingStats.completed +
    dashboard.bookingStats.cancelled;

  const getPercentage = (value: number) => {
    if (totalTrackedBookings === 0) {
      return 0;
    }

    return Math.round(
      (value / totalTrackedBookings) * 100
    );
  };

  const bookingStats = [
    {
      label: "Pending",
      value: dashboard.bookingStats.pending,
    },
    {
      label: "Confirmed",
      value: dashboard.bookingStats.confirmed,
    },
    {
      label: "Completed",
      value: dashboard.bookingStats.completed,
    },
    {
      label: "Cancelled",
      value: dashboard.bookingStats.cancelled,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Analytics
        </h1>

        <p className="mt-1 text-gray-600">
          Overview of BookIt platform activity.
        </p>
      </div>

      {/* Platform Metrics */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Users
          </p>

          <p className="mt-2 text-3xl font-bold">
            {dashboard.users}
          </p>
        </div>

        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Providers
          </p>

          <p className="mt-2 text-3xl font-bold">
            {dashboard.providers}
          </p>
        </div>

        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Venues
          </p>

          <p className="mt-2 text-3xl font-bold">
            {dashboard.venues}
          </p>
        </div>

        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Bookings
          </p>

          <p className="mt-2 text-3xl font-bold">
            {dashboard.bookings}
          </p>
        </div>
      </div>

      {/* Booking Analytics */}

      <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          Booking Analytics
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Distribution of bookings by status.
        </p>

        <div className="mt-6 space-y-5">
          {bookingStats.map((stat) => {
            const percentage = getPercentage(
              stat.value
            );

            return (
              <div key={stat.label}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {stat.label}
                  </span>

                  <span className="text-sm text-gray-500">
                    {stat.value} ({percentage}%)
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Completion Rate
          </h2>

          <p className="mt-3 text-3xl font-bold">
            {getPercentage(
              dashboard.bookingStats.completed
            )}
            %
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Percentage of tracked bookings that are
            completed.
          </p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Cancellation Rate
          </h2>

          <p className="mt-3 text-3xl font-bold">
            {getPercentage(
              dashboard.bookingStats.cancelled
            )}
            %
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Percentage of tracked bookings that are
            cancelled.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;