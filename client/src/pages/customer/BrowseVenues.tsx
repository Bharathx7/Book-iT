import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVenues, type Venue } from "../../services/venue.api";
import { getVenueTimeSlots } from "../../services/timeslot.api";

function BrowseVenues() {
  const navigate = useNavigate();

  const [venues, setVenues] = useState<Venue[]>([]);
  const [location, setLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [availableVenueIds, setAvailableVenueIds] =
    useState<Set<string> | null>(null);

  const [loading, setLoading] = useState(true);
  const [checkingAvailability, setCheckingAvailability] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadVenues = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getVenues();
        setVenues(data);
      } catch (err) {
        console.error("Failed to load venues:", err);
        setError(
          "Failed to load venues. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadVenues();
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setAvailableVenueIds(null);
      return;
    }

    const checkVenueAvailability = async () => {
      try {
        setCheckingAvailability(true);
        setError("");

        const results = await Promise.all(
          venues.map(async (venue) => {
            const slots = await getVenueTimeSlots(
              venue.id
            );

            const hasSlotOnDate = slots.some((slot) => {
              const slotDate = new Date(
                slot.startTime
              )
                .toISOString()
                .split("T")[0];

              return slotDate === selectedDate;
            });

            return {
              venueId: venue.id,
              available: hasSlotOnDate,
            };
          })
        );

        const availableIds = new Set(
          results
            .filter((result) => result.available)
            .map((result) => result.venueId)
        );

        setAvailableVenueIds(availableIds);
      } catch (err) {
        console.error(
          "Failed to check venue availability:",
          err
        );

        setError(
          "Failed to check availability. Please try again."
        );
      } finally {
        setCheckingAvailability(false);
      }
    };

    if (venues.length > 0) {
      checkVenueAvailability();
    }
  }, [selectedDate, venues]);

  const filteredVenues = useMemo(() => {
    const search = location.trim().toLowerCase();

    return venues.filter((venue) => {
      const matchesLocation =
        !search ||
        (venue.address ?? "")
          .toLowerCase()
          .includes(search);

      const matchesDate =
        !selectedDate ||
        availableVenueIds === null ||
        availableVenueIds.has(venue.id);

      return matchesLocation && matchesDate;
    });
  }, [
    venues,
    location,
    selectedDate,
    availableVenueIds,
  ]);

  if (loading) {
    return (
      <div>
        <h1>Browse Venues</h1>
        <p>Loading venues...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Browse Venues</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Browse Venues
        </h1>

        <p className="mt-1 text-gray-600">
          Find a venue based on location and availability.
        </p>
      </div>

      <div className="mb-6 grid gap-4 rounded-lg border bg-white p-4 shadow-sm md:grid-cols-2">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>

          <input
            id="location"
            type="text"
            value={location}
            onChange={(event) =>
              setLocation(event.target.value)
            }
            placeholder="Search by location"
            className="mt-2 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>

          <input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(event) =>
              setSelectedDate(event.target.value)
            }
            className="mt-2 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {checkingAvailability && (
        <p className="mb-4 text-sm text-gray-600">
          Checking availability...
        </p>
      )}

      {filteredVenues.length === 0 ? (
        <p className="text-gray-600">
          No venues found for the selected filters.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="rounded-lg border bg-white p-5 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {venue.name}
              </h2>

              <p className="mt-2 text-gray-600">
                {venue.description ||
                  "No description available"}
              </p>

              <p className="mt-3 text-sm text-gray-600">
                Address:{" "}
                {venue.address || "Address not provided"}
              </p>

              <p className="mt-2 font-semibold text-gray-900">
                ₹{venue.pricePerHour} / hour
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(`/customer/venues/${venue.id}`)
                }
                className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                View Venue
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BrowseVenues;