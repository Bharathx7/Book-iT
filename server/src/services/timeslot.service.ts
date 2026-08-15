import prisma from "../config/prisma.js";

interface CreateTimeSlotInput {
  venueId: string;
  startTime: Date;
  endTime: Date;
  userId: string;
  userRole: string;
}

export const createTimeSlot = async ({
  venueId,
  startTime,
  endTime,
  userId,
  userRole,
}: CreateTimeSlotInput) => {
  const venue = await prisma.venue.findUnique({
    where: {
      id: venueId,
    },
  });

  if (!venue) {
    throw new Error("Venue not found");
  }

  if (userRole !== "ADMIN" && venue.ownerId !== userId) {
    throw new Error("You do not have permission to manage this venue");
  }

  if (startTime >= endTime) {
    throw new Error("Start time must be before end time");
  }

  const overlappingSlot = await prisma.timeSlot.findFirst({
    where: {
      venueId,
      startTime: {
        lt: endTime,
      },
      endTime: {
        gt: startTime,
      },
    },
  });

  if (overlappingSlot) {
    throw new Error("Time slot overlaps with an existing slot");
  }

  return prisma.timeSlot.create({
    data: {
      venueId,
      startTime,
      endTime,
    },
  });
};

export const getVenueTimeSlots = async (venueId: string) => {
  const venue = await prisma.venue.findUnique({
    where: {
      id: venueId,
    },
  });

  if (!venue) {
    throw new Error("Venue not found");
  }

  return prisma.timeSlot.findMany({
    where: {
      venueId,
    },
    orderBy: {
      startTime: "asc",
    },
  });
};

export const deleteTimeSlot = async (
  id: string,
  userId: string,
  userRole: string
) => {
  const timeSlot = await prisma.timeSlot.findUnique({
    where: {
      id,
    },
    include: {
      venue: true,
    },
  });

  if (!timeSlot) {
    throw new Error("Time slot not found");
  }

  if (
    userRole !== "ADMIN" &&
    timeSlot.venue.ownerId !== userId
  ) {
    throw new Error("You do not have permission to manage this time slot");
  }

  return prisma.timeSlot.delete({
    where: {
      id,
    },
  });
};

export const checkAvailability = async (
  venueId: string,
  startTime: Date,
  endTime: Date
) => {
  if (startTime >= endTime) {
    throw new Error("Start time must be before end time");
  }

  const venue = await prisma.venue.findUnique({
    where: {
      id: venueId,
    },
  });

  if (!venue) {
    throw new Error("Venue not found");
  }

  const slot = await prisma.timeSlot.findFirst({
    where: {
      venueId,
      startTime: {
        lte: startTime,
      },
      endTime: {
        gte: endTime,
      },
    },
  });

  return {
    available: !!slot,
  };
};