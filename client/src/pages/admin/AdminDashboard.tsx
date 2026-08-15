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

function AdminDashboard() {
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/admin/dashboard");
        setDashboard(response.data.dashboard);
      } catch (err: any) {
        console.error("Failed to load admin dashboard:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load admin dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-4 text-gray-600">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          Admin Dashboard
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

  const overviewCards = [
    {
      title: "Users",
      value: dashboard.users,
    },
    {
      title: "Providers",
      value: dashboard.providers,
    },
    {
      title: "Venues",
      value: dashboard.venues,
    },
    {
      title: "Bookings",
      value: dashboard.bookings,
    },
  ];

  const bookingCards = [
    {
      title: "Pending",
      value: dashboard.bookingStats.pending,
    },
    {
      title: "Confirmed",
      value: dashboard.bookingStats.confirmed,
    },
    {
      title: "Completed",
      value: dashboard.bookingStats.completed,
    },
    {
      title: "Cancelled",
      value: dashboard.bookingStats.cancelled,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-gray-600">
          Manage and monitor the BookIt platform.
        </p>
      </div>

      <h2 className="mb-4 text-xl font-semibold text-gray-800">
        Platform Overview
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((card) => (
          <div
            key={card.title}
            className="rounded-lg bg-white p-5 shadow-sm border"
          >
            <p className="text-sm text-gray-500">
              {card.title}
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mb-4 mt-8 text-xl font-semibold text-gray-800">
        Booking Statistics
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {bookingCards.map((card) => (
          <div
            key={card.title}
            className="rounded-lg bg-white p-5 shadow-sm border"
          >
            <p className="text-sm text-gray-500">
              {card.title} Bookings
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;