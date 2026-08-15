import {
  jest,
  describe,
  beforeEach,
  test,
  expect,
} from "@jest/globals";

type UserMock = {
  id: string;
  name: string;
  email: string;
};

type VenueMock = {
  id: string;
  name: string;
};

type TimeSlotMock = {
  id: string;
  venueId: string;
  startTime: Date;
  endTime: Date;
};

type BookingMock = {
  id: string;
  venueId: string;
  startTime: Date;
  endTime: Date;
  status: string;
};

type CreatedBookingMock = {
  id: string;
  userId: string;
  venueId: string;
  startTime: Date;
  endTime: Date;
  status: string;
  venue: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type CreateBookingArgs = {
  data: {
    userId: string;
    venueId: string;
    startTime: Date;
    endTime: Date;
    status: string;
  };
  include: {
    venue: boolean;
    user: {
      select: {
        id: boolean;
        name: boolean;
        email: boolean;
      };
    };
  };
};

const mockPrisma = {
  user: {
    findUnique: jest.fn<() => Promise<UserMock | null>>(),
  },

  venue: {
    findUnique: jest.fn<() => Promise<VenueMock | null>>(),
  },

  timeSlot: {
    findFirst: jest.fn<() => Promise<TimeSlotMock | null>>(),
  },

  booking: {
    findFirst: jest.fn<() => Promise<BookingMock | null>>(),

    create: jest.fn<
      (args: CreateBookingArgs) => Promise<CreatedBookingMock>
    >(),
  },
};

jest.unstable_mockModule("../src/config/prisma.js", () => ({
  default: mockPrisma,
}));

jest.unstable_mockModule("../src/sockets/socket.js", () => ({
  getIO: jest.fn(() => ({
    emit: jest.fn(),
  })),
}));

jest.unstable_mockModule("../src/services/email.service.js", () => ({
  sendBookingConfirmationEmail: jest.fn(),
  sendBookingCancellationEmail: jest.fn(),
}));

const { createBooking } = await import(
  "../src/services/booking.service.js"
);

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

    const createdBooking: CreatedBookingMock = {
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