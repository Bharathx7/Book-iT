import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getVenueById, type Venue } from "../../services/venue.api";
import {
  getVenueTimeSlots,
  type TimeSlot,
} from "../../services/timeslot.api";
import { createBooking } from "../../services/booking.api";

function VenueDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Invalid venue.");
      setLoading(false);
      return;
    }

    const loadVenue = async () => {
      try {
        setLoading(true);
        setError("");

        const [venueData, slotsData] = await Promise.all([
          getVenueById(id),
          getVenueTimeSlots(id),
        ]);

        setVenue(venueData);
        setTimeSlots(slotsData);
      } catch (err) {
        console.error("Failed to load venue:", err);
        setError("Failed to load venue details.");
      } finally {
        setLoading(false);
      }
    };

    loadVenue();
  }, [id]);

  const handleBook = async (slot: TimeSlot) => {
    if (!id) {
      return;
    }

    try {
      setBooking(true);
      setError("");
      setSuccess("");

      await createBooking({
        venueId: id,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });

      setSuccess("Booking created successfully!");

      // Remove the booked slot from the available list
      setTimeSlots((currentSlots) =>
        currentSlots.filter((currentSlot) => currentSlot.id !== slot.id)
      );
    } catch (err) {
      console.error("Booking failed:", err);
      setError("Failed to create booking. The slot may no longer be available.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading venue...</p>
      </div>
    );
  }

  if (error && !venue) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>

        <button
          type="button"
          onClick={() => navigate("/customer/venues")}
          className="mt-4 rounded bg-gray-800 px-4 py-2 text-white"
        >
          Back to Venues
        </button>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="p-6">
        <p>Venue not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        type="button"
        onClick={() => navigate("/customer/venues")}
        className="mb-6 rounded border px-4 py-2"
      >
        ← Back to Venues
      </button>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">{venue.name}</h1>

        <p className="mt-2 text-gray-600">
          {venue.description || "No description provided."}
        </p>

        <p className="mt-4">
          <strong>Address:</strong>{" "}
          {venue.address || "Address not provided"}
        </p>

        <p className="mt-2">
          <strong>Price:</strong> ₹{venue.pricePerHour} / hour
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Available Time Slots</h2>

        {success && (
          <p className="mt-4 rounded bg-green-100 p-3 text-green-700">
            {success}
          </p>
        )}

        {error && (
          <p className="mt-4 rounded bg-red-100 p-3 text-red-700">
            {error}
          </p>
        )}

        {timeSlots.length === 0 ? (
          <p className="mt-4 text-gray-600">
            No available time slots for this venue.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {timeSlots.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm"
              >
                <div>
                  <p className="font-medium">
                    {new Date(slot.startTime).toLocaleString()}
                  </p>

                  <p className="text-sm text-gray-500">
                    to {new Date(slot.endTime).toLocaleString()}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleBook(slot)}
                  disabled={booking}
                  className="rounded bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {booking ? "Booking..." : "Book Now"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VenueDetails;