import api from "./api";

export interface BookingVenue {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  pricePerHour: string;
}

export interface Booking {
  id: string;
  userId: string;
  venueId: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  venue: BookingVenue;
}

interface GetBookingsResponse {
  bookings: Booking[];
}

interface CancelBookingResponse {
  message: string;
  booking: Booking;
}

export const getBookings = async (): Promise<Booking[]> => {
  const response = await api.get<GetBookingsResponse>("/bookings");

  return response.data.bookings;
};

export const cancelBooking = async (
  bookingId: string
): Promise<Booking> => {
  const response = await api.patch<CancelBookingResponse>(
    `/bookings/${bookingId}/cancel`
  );

  return response.data.booking;
};

interface CreateBookingRequest {
  venueId: string;
  startTime: string;
  endTime: string;
}

interface CreateBookingResponse {
  message: string;
  booking: Booking;
}

export const createBooking = async (
  data: CreateBookingRequest
): Promise<Booking> => {
  const response = await api.post<CreateBookingResponse>(
    "/bookings",
    data
  );

  return response.data.booking;
};

export const getProviderBookings = async (): Promise<Booking[]> => {
  const response = await api.get<GetBookingsResponse>(
    "/bookings/provider"
  );

  return response.data.bookings;
};

export const confirmBooking = async (
  bookingId: string
): Promise<Booking> => {
  const response = await api.patch<{
    message: string;
    booking: Booking;
  }>(`/bookings/${bookingId}/confirm`);

  return response.data.booking;
};

export const completeBooking = async (
  bookingId: string
): Promise<Booking> => {
  const response = await api.patch<{
    message: string;
    booking: Booking;
  }>(`/bookings/${bookingId}/complete`);

  return response.data.booking;
};