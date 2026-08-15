import { useEffect, useState } from "react";
import api from "../../services/api";

interface AdminProvider {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

function AdminProviders() {
  const [providers, setProviders] = useState<AdminProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await api.get("/admin/users");

        const providerUsers = response.data.users.filter(
          (user: AdminProvider) => user.role === "PROVIDER"
        );

        setProviders(providerUsers);
      } catch (err: any) {
        console.error("Failed to load providers:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load providers"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Providers
        </h1>

        <p className="mt-4 text-gray-600">
          Loading providers...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Providers
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
          Providers
        </h1>

        <p className="mt-1 text-gray-600">
          View all registered venue providers.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Name
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Email
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Role
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Joined
                </th>
              </tr>
            </thead>

            <tbody className="divide-y bg-white">
              {providers.map((provider) => (
                <tr key={provider.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {provider.name}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {provider.email}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {provider.role}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {new Date(
                      provider.createdAt
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {providers.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No providers found.
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

export default AdminProviders;