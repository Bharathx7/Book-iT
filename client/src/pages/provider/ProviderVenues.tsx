import { useEffect, useState } from "react";
import {
  createVenue,
  getMyVenues,
  updateVenue,
  deleteVenue,
  type Venue,
} from "../../services/venue.api";

function ProviderVenues() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingVenueId, setEditingVenueId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");

  const [saving, setSaving] = useState(false);
  const [deletingVenueId, setDeletingVenueId] = useState<string | null>(null);

  async function loadVenues() {
    try {
      setLoading(true);
      setError("");

      const data = await getMyVenues();
      setVenues(data);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to load your venues."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVenues();
  }, []);

  function resetForm() {
    setName("");
    setDescription("");
    setAddress("");
    setPricePerHour("");
    setEditingVenueId(null);
    setShowForm(false);
  }

  function handleAddVenue() {
    resetForm();
    setShowForm(true);
  }

  function handleEditVenue(venue: Venue) {
    setEditingVenueId(venue.id);
    setName(venue.name);
    setDescription(venue.description || "");
    setAddress(venue.address || "");
    setPricePerHour(venue.pricePerHour);
    setShowForm(true);
    setError("");
  }

  async function handleSubmitVenue(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const venueData = {
        name,
        description,
        address,
        pricePerHour: Number(pricePerHour),
      };

      if (editingVenueId) {
        await updateVenue(editingVenueId, venueData);
      } else {
        await createVenue(venueData);
      }

      resetForm();
      await loadVenues();
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to save venue."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteVenue(venueId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this venue?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingVenueId(venueId);
      setError("");

      await deleteVenue(venueId);

      await loadVenues();
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to delete venue."
      );
    } finally {
      setDeletingVenueId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Venues
          </h1>

          <p className="mt-2 text-gray-600">
            Create and manage your venues.
          </p>
        </div>

        <button
          type="button"
          onClick={showForm ? resetForm : handleAddVenue}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "+ Add Venue"}
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-8 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-bold">
            {editingVenueId ? "Edit Venue" : "Create Venue"}
          </h2>

          <form
            onSubmit={handleSubmitVenue}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm font-medium">
                Venue Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
                placeholder="Example: Chennai Football Turf"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
                placeholder="Describe your venue"
                rows={3}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Address
              </label>

              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
                placeholder="Venue address"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Price Per Hour
              </label>

              <input
                type="number"
                min="0"
                value={pricePerHour}
                onChange={(e) =>
                  setPricePerHour(e.target.value)
                }
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
                placeholder="500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingVenueId
                    ? "Update Venue"
                    : "Create Venue"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg bg-gray-200 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl bg-white p-6 shadow">
          Loading your venues...
        </div>
      ) : venues.length === 0 ? (
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-600">
            You haven't created any venues yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="rounded-xl bg-white p-6 shadow"
            >
              <h2 className="text-xl font-bold text-gray-900">
                {venue.name}
              </h2>

              <p className="mt-2 text-gray-600">
                {venue.description ||
                  "No description provided"}
              </p>

              <p className="mt-3 text-sm text-gray-500">
                Address:{" "}
                {venue.address ||
                  "Address not provided"}
              </p>

              <p className="mt-3 font-semibold text-gray-900">
                ₹{venue.pricePerHour} / hour
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleEditVenue(venue)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteVenue(venue.id)}
                  disabled={deletingVenueId === venue.id}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deletingVenueId === venue.id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProviderVenues;