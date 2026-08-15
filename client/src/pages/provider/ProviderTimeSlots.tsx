import { useEffect, useState } from "react";
import {
  getVenueTimeSlots,
  createTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
  type TimeSlot,
} from "../../services/timeslot.api";
import { getMyVenues, type Venue } from "../../services/venue.api";

function ProviderTimeSlots() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState("");

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingSlotId, setDeletingSlotId] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  async function loadVenues() {
    try {
      setLoading(true);
      setError("");

      const data = await getMyVenues();

      setVenues(data);

      if (data.length > 0) {
        setSelectedVenueId(data[0].id);
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to load your venues."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadTimeSlots(venueId: string) {
    if (!venueId) {
      setTimeSlots([]);
      return;
    }

    try {
      setLoadingSlots(true);
      setError("");

      const data = await getVenueTimeSlots(venueId);

      setTimeSlots(data);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to load time slots."
      );
    } finally {
      setLoadingSlots(false);
    }
  }

  useEffect(() => {
    loadVenues();
  }, []);

  useEffect(() => {
    if (selectedVenueId) {
      loadTimeSlots(selectedVenueId);
    }
  }, [selectedVenueId]);

  function resetForm() {
    setStartTime("");
    setEndTime("");
    setEditingSlotId(null);
  }

  async function handleSubmitTimeSlot(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!selectedVenueId) {
      setError("Please select a venue.");
      return;
    }

    if (!startTime || !endTime) {
      setError("Start time and end time are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const start = new Date(startTime);
      const end = new Date(endTime);

      if (start >= end) {
        setError("Start time must be before end time.");
        return;
      }

      if (editingSlotId) {
        await updateTimeSlot(editingSlotId, {
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        });
      } else {
        await createTimeSlot({
          venueId: selectedVenueId,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        });
      }

      resetForm();

      await loadTimeSlots(selectedVenueId);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to save time slot."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEditTimeSlot(slot: TimeSlot) {
    setEditingSlotId(slot.id);

    setStartTime(toDateTimeLocal(slot.startTime));
    setEndTime(toDateTimeLocal(slot.endTime));

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDeleteTimeSlot(slotId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this time slot?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingSlotId(slotId);
      setError("");

      await deleteTimeSlot(slotId);

      if (editingSlotId === slotId) {
        resetForm();
      }

      await loadTimeSlots(selectedVenueId);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to delete time slot."
      );
    } finally {
      setDeletingSlotId(null);
    }
  }

  function toDateTimeLocal(date: string) {
    const value = new Date(date);

    const year = value.getFullYear();
    const month = String(
      value.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      value.getDate()
    ).padStart(2, "0");
    const hours = String(
      value.getHours()
    ).padStart(2, "0");
    const minutes = String(
      value.getMinutes()
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  function formatDateTime(date: string) {
    return new Date(date).toLocaleString();
  }

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow">
        Loading your venues...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Time Slots
        </h1>

        <p className="mt-2 text-gray-600">
          Create and manage availability for your venues.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {venues.length === 0 ? (
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold text-gray-900">
            No venues found
          </h2>

          <p className="mt-2 text-gray-600">
            Create a venue first before adding time slots.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 rounded-xl bg-white p-6 shadow">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select Venue
            </label>

            <select
              value={selectedVenueId}
              onChange={(e) => {
                setSelectedVenueId(e.target.value);
                resetForm();
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
            >
              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-8 rounded-xl bg-white p-6 shadow">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingSlotId
                  ? "Edit Time Slot"
                  : "Create Time Slot"}
              </h2>

              {editingSlotId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form
              onSubmit={handleSubmitTimeSlot}
              className="grid gap-4 md:grid-cols-3"
            >
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Start Time
                </label>

                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) =>
                    setStartTime(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  End Time
                </label>

                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) =>
                    setEndTime(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingSlotId
                      ? "Update Time Slot"
                      : "Create Time Slot"}
                </button>
              </div>
            </form>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Existing Time Slots
            </h2>

            {loadingSlots ? (
              <div className="rounded-xl bg-white p-6 shadow">
                Loading time slots...
              </div>
            ) : timeSlots.length === 0 ? (
              <div className="rounded-xl bg-white p-6 shadow">
                <p className="text-gray-600">
                  No time slots created for this venue.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between rounded-xl bg-white p-5 shadow"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {formatDateTime(slot.startTime)}
                      </p>

                      <p className="mt-1 text-gray-600">
                        to {formatDateTime(slot.endTime)}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleEditTimeSlot(slot)
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteTimeSlot(slot.id)
                        }
                        disabled={
                          deletingSlotId === slot.id
                        }
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        {deletingSlotId === slot.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ProviderTimeSlots;