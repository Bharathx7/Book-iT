import { jest, describe, beforeEach, test, expect } from "@jest/globals";

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
  },
  venue: {
    findUnique: jest.fn(),
  },
  timeSlot: {
    findFirst: jest.fn(),
  },
  booking: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
};

jest.unstable_mockModule("../src/config/prisma.ts", () => ({
  default: mockPrisma,
}));

jest.unstable_mockModule("../src/sockets/socket.ts", () => ({
  getIO: jest.fn(() => ({
    emit: jest.fn(),
  })),
}));

jest.unstable_mockModule("../src/services/email.service.ts", () => ({
  sendBookingConfirmationEmail: jest.fn(),
  sendBookingCancellationEmail: jest.fn(),
}));

let createBooking: any;

beforeAll(async () => {
  const bookingService =
    await import("../src/services/booking.service.ts");

  createBooking = bookingService.createBooking;
});

describe("createBooking - booking conflict", () => {
  const userId = "user-1";
  const venueId = "venue-1";

  const startTime = new Date("2026-08-20T10:00:00.000Z");
  const endTime = new Date("2026-08-20T12:00:00.000Z");

  beforeEach(() => {
    jest.clearAllMocks();

    mockPrisma.user.findUnique.mockResolvedValue({
      id: userId,
      name: "Test User",
      email: "test@example.com",
    });

    mockPrisma.venue.findUnique.mockResolvedValue({
      id: venueId,
      name: "Test Venue",
    });

    mockPrisma.timeSlot.findFirst.mockResolvedValue({
      id: "slot-1",
      venueId,
      startTime: new Date("2026-08-20T09:00:00.000Z"),
      endTime: new Date("2026-08-20T18:00:00.000Z"),
    });
  });

  test("should reject an overlapping booking", async () => {
    mockPrisma.booking.findFirst.mockResolvedValue({
      id: "existing-booking",
      venueId,
      startTime: new Date("2026-08-20T11:00:00.000Z"),
      endTime: new Date("2026-08-20T13:00:00.000Z"),
      status: "CONFIRMED",
    });

    await expect(
      createBooking({
        userId,
        venueId,
        startTime,
        endTime,
      })
    ).rejects.toThrow("This time is already booked");

    expect(mockPrisma.booking.findFirst).toHaveBeenCalled();

    expect(mockPrisma.booking.create).not.toHaveBeenCalled();
  });

  test("should allow a non-overlapping booking", async () => {
    mockPrisma.booking.findFirst.mockResolvedValue(null);

    const createdBooking = {
      id: "booking-1",
      userId,
      venueId,
      startTime,
      endTime,
      status: "PENDING",
      venue: {
        id: venueId,
        name: "Test Venue",
      },
      user: {
        id: userId,
        name: "Test User",
        email: "test@example.com",
      },
    };

    mockPrisma.booking.create.mockResolvedValue(createdBooking);

    const result = await createBooking({
      userId,
      venueId,
      startTime,
      endTime,
    });

    expect(result).toEqual(createdBooking);

    expect(mockPrisma.booking.findFirst).toHaveBeenCalled();

    expect(mockPrisma.booking.create).toHaveBeenCalledWith({
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
  });
});