import prisma from "../config/prisma.js";

interface CreateVenueInput {
  name: string;
  description?: string;
  category?: string;
  address?: string;
  pricePerHour?: number;
}

export const createVenue = async (
  data: CreateVenueInput,
  ownerId: string
) => {
  const venue = await prisma.venue.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      category: data.category ?? "Other",
      address: data.address ?? null,
      pricePerHour: data.pricePerHour ?? 0,
      ownerId,
    },
  });

  return venue;
};

export const getVenues = async () => {
  const venues = await prisma.venue.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return venues;
};

export const getMyVenues = async (ownerId: string) => {
  const venues = await prisma.venue.findMany({
    where: {
      ownerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return venues;
};

export const getVenueById = async (id: string) => {
  const venue = await prisma.venue.findUnique({
    where: {
      id,
    },
  });

  return venue;
};

interface UpdateVenueInput {
  name?: string;
  description?: string;
  category?: string;
  address?: string;
  pricePerHour?: number;
};

export const updateVenue = async (
  id: string,
  ownerId: string,
  isAdmin: boolean,
  data: UpdateVenueInput
) => {
  const venue = await prisma.venue.findUnique({
    where: {
      id,
    },
  });

  if (!venue) {
    return null;
  }

  if (!isAdmin && venue.ownerId !== ownerId) {
    return null;
  }

  const updatedVenue = await prisma.venue.update({
    where: {
      id,
    },
    data,
  });

  return updatedVenue;
};

export const deleteVenue = async (
  id: string,
  ownerId: string,
  isAdmin: boolean
) => {
  const venue = await prisma.venue.findUnique({
    where: {
      id,
    },
  });

  if (!venue) {
    return null;
  }

  if (!isAdmin && venue.ownerId !== ownerId) {
    return null;
  }

  const deletedVenue = await prisma.venue.delete({
    where: {
      id,
    },
  });

  return deletedVenue;
};