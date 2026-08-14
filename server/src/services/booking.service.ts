import prisma from "../config/prisma.js";
import { getIO } from "../sockets/socket.js";
import {
  sendBookingConfirmationEmail,
  sendBookingCancellationEmail,
} from "./email.service.js";

interface CreateBookingInput {
  userId: string;
  venueId: string;
  startTime: Date;
  endTime: Date;
}

export const createBooking = async ({
  userId,
  venueId,
  startTime,
  endTime,
}: CreateBookingInput) => {
  if (startTime >= endTime) {
    throw new Error("Start time must be before end time");
  }

  // Check user exists
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check venue exists
  const venue = await prisma.venue.findUnique({
    where: {
      id: venueId,
    },
  });

  if (!venue) {
    throw new Error("Venue not found");
  }

  // Check whether requested time is inside an available TimeSlot
  const timeSlot = await prisma.timeSlot.findFirst({
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

  if (!timeSlot) {
    throw new Error("Venue is not available for this time");
  }

  // Check overlapping bookings
  const overlappingBooking = await prisma.booking.findFirst({
    where: {
      venueId,
      status: {
        not: "CANCELLED",
      },
      startTime: {
        lt: endTime,
      },
      endTime: {
        gt: startTime,
      },
    },
  });

  if (overlappingBooking) {
    throw new Error("This time is already booked");
  }

  return prisma.booking.create({
    data: {
      userId,
      venueId,
      startTime,
      endTime,
      status: "PENDING",
    },
    include: {
      venue: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const getUserBookings = async (userId: string) => {
  return prisma.booking.findMany({
    where: {
      userId,
    },
    include: {
      venue: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getBookingById = async (
  bookingId: string,
  userId: string
) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId,
    },
    include: {
      venue: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
};

export const cancelBooking = async (
  bookingId: string,
  userId: string
) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId,
    },
    include: {
      user: true,
      venue: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status === "CANCELLED") {
    throw new Error("Booking is already cancelled");
  }

const updatedBooking = await prisma.booking.update({
  where: {
    id: bookingId,
  },
  data: {
    status: "CANCELLED",
  },
});

const io = getIO();

io.emit("bookingCancelled", {
  bookingId: updatedBooking.id,
  userId: updatedBooking.userId,
  venueId: updatedBooking.venueId,
  status: updatedBooking.status,
});

  await sendBookingCancellationEmail(
    booking.user.email,
    booking.user.name,
    booking.venue.name,
    booking.startTime,
    booking.endTime
  );

  return updatedBooking;
};


export const confirmBooking = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      user: true,
      venue: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status === "CANCELLED") {
    throw new Error("Cancelled booking cannot be confirmed");
  }

  const updatedBooking = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "CONFIRMED",
    },
  });

  const io = getIO();

io.emit("bookingConfirmed", {
  bookingId: updatedBooking.id,
  userId: updatedBooking.userId,
  venueId: updatedBooking.venueId,
  status: updatedBooking.status,
});

  await sendBookingConfirmationEmail(
    booking.user.email,
    booking.user.name,
    booking.venue.name,
    booking.startTime,
    booking.endTime
  );

  return updatedBooking;
};
export const completeBooking = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status === "CANCELLED") {
    throw new Error("Cancelled booking cannot be completed");
  }

  if (booking.status !== "CONFIRMED") {
    throw new Error("Only confirmed bookings can be completed");
  }

  const updatedBooking = await prisma.booking.update({
  where: {
    id: bookingId,
  },
  data: {
    status: "COMPLETED",
  },
});

const io = getIO();

io.emit("bookingCompleted", {
  bookingId: updatedBooking.id,
  userId: updatedBooking.userId,
  venueId: updatedBooking.venueId,
  status: updatedBooking.status,
});

return updatedBooking;

};