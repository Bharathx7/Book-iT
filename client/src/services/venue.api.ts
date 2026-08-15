import api from "./api";

export interface Venue {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  pricePerHour: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface GetVenuesResponse {
  venues: Venue[];
}

export const getVenues = async (): Promise<Venue[]> => {
  const response = await api.get<GetVenuesResponse>("/venues");

  return response.data.venues;
};

export const getMyVenues = async (): Promise<Venue[]> => {
  const response = await api.get<GetVenuesResponse>("/venues/my");

  return response.data.venues;
};

export const getVenueById = async (
  venueId: string
): Promise<Venue> => {
  const response = await api.get<{ venue: Venue }>(
    `/venues/${venueId}`
  );

  return response.data.venue;
};

export interface CreateVenueRequest {
  name: string;
  description?: string;
  address?: string;
  pricePerHour: number;
}

export const createVenue = async (
  data: CreateVenueRequest
): Promise<Venue> => {
  const response = await api.post<{ venue: Venue }>(
    "/venues",
    data
  );

  return response.data.venue;
};

export interface UpdateVenueRequest {
  name?: string;
  description?: string;
  address?: string;
  pricePerHour?: number;
}

export const updateVenue = async (
  venueId: string,
  data: UpdateVenueRequest
): Promise<Venue> => {
  const response = await api.put<{ venue: Venue }>(
    `/venues/${venueId}`,
    data
  );

  return response.data.venue;
};

export const deleteVenue = async (
  venueId: string
): Promise<void> => {
  await api.delete(`/venues/${venueId}`);
};