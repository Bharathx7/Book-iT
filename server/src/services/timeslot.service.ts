import prisma from "../config/prisma.js";

interface CreateTimeSlotInput {
  venueId: string;
  startTime: Date;
  endTime: Date;
}

export const createTimeSlot = async ({
  venueId,
  startTime,
  endTime,
}: CreateTimeSlotInput) => {
  // Check venue exists
  const venue = await prisma.venue.findUnique({
    where: {
      id: venueId,
    },
  });

  if (!venue) {
    throw new Error("Venue not found");
  }

  // Validate time
  if (startTime >= endTime) {
    throw new Error("Start time must be before end time");
  }

  // Check for overlapping time slots
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

export const deleteTimeSlot = async (id: string) => {
  const timeSlot = await prisma.timeSlot.findUnique({
    where: {
      id,
    },
  });

  if (!timeSlot) {
    throw new Error("Time slot not found");
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