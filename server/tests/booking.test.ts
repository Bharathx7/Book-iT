import { jest } from "@jest/globals";

jest.unstable_mockModule("../src/sockets/socket.js", () => ({
  getIO: jest.fn(() => ({
    emit: jest.fn(),
    to: jest.fn(() => ({
      emit: jest.fn(),
    })),
  })),
  initializeSocket: jest.fn(),
}));

jest.unstable_mockModule("../src/services/email.service.js", () => ({
  sendBookingConfirmationEmail: jest.fn(),
  sendBookingCancellationEmail: jest.fn(),
  sendTestEmail: jest.fn(),
}));

const { default: request } = await import("supertest");
const { default: app } = await import("../src/app.js");
const { default: prisma } = await import("../src/config/prisma.js");
const { generateAccessToken } = await import("../src/utils/jwt.js");

jest.setTimeout(20000);

describe("Booking API", () => {
  let userToken: string;
  let adminToken: string;
  let userId: string;
  let adminId: string;
  let venueId: string;

  const unique = Date.now();

  const userEmail = `booking-user-${unique}@example.com`;
  const adminEmail = `booking-admin-${unique}@example.com`;
  const password = "Test@12345";

  beforeAll(async () => {
    // Create USER through API
    const userRegister = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Booking Test User",
        email: userEmail,
        password,
      });

    expect(userRegister.status).toBe(201);

    userId = userRegister.body.user.id;

    const userLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: userEmail,
        password,
      });

    expect(userLogin.status).toBe(200);

    userToken = userLogin.body.accessToken;

    // Create ADMIN directly in database
    const admin = await prisma.user.create({
      data: {
        name: "Booking Test Admin",
        email: adminEmail,
        passwordHash: "test-password-hash",
        role: "ADMIN",
      },
    });

    adminId = admin.id;

    // Generate ADMIN JWT
    adminToken = generateAccessToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    // Create Venue
    const venue = await prisma.venue.create({
      data: {
        name: `Booking Test Venue ${unique}`,
        description: "Venue created for booking tests",
        address: "Test Address",
        pricePerHour: 100,
        ownerId: adminId,
      },
    });

    venueId = venue.id;
  });

  afterAll(async () => {
    await prisma.booking.deleteMany({
      where: {
        OR: [
          { userId },
          { venueId },
        ],
      },
    });

    await prisma.timeSlot.deleteMany({
      where: {
        venueId,
      },
    });

    await prisma.venue.deleteMany({
      where: {
        id: venueId,
      },
    });

    await prisma.user.deleteMany({
      where: {
        id: adminId,
      },
    });

    await prisma.user.deleteMany({
      where: {
        id: userId,
      },
    });

    await prisma.$disconnect();
  });

  // 1. Create booking successfully
  it("should create a booking successfully", async () => {
    const startTime = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    startTime.setMinutes(15, 0, 0);

    const endTime = new Date(
      startTime.getTime() + 30 * 60 * 1000
    );

    // Create matching availability
    await prisma.timeSlot.create({
      data: {
        venueId,
        startTime: new Date(startTime.getTime() - 60 * 60 * 1000),
        endTime: new Date(endTime.getTime() + 60 * 60 * 1000),
      },
    });

    const response = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        venueId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe(
      "Booking created successfully"
    );

    expect(response.body.booking).toHaveProperty("id");
    expect(response.body.booking.userId).toBe(userId);
    expect(response.body.booking.venueId).toBe(venueId);
    expect(response.body.booking.status).toBe("PENDING");
  });

  // 2. Reject unauthenticated booking
  it("should reject booking without authentication", async () => {
    const startTime = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    startTime.setMinutes(120, 0, 0);

    const endTime = new Date(
      startTime.getTime() + 30 * 60 * 1000
    );

    const response = await request(app)
      .post("/api/bookings")
      .send({
        venueId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

    expect(response.status).toBe(401);
  });

  // 3. Reject invalid booking data
  it("should reject invalid booking data", async () => {
    const response = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        venueId: "invalid-venue-id",
        startTime: "invalid",
        endTime: "invalid",
      });

    expect(response.status).toBe(400);
  });

  // 4. Get user's bookings
  it("should get user's bookings", async () => {
    const response = await request(app)
      .get("/api/bookings")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("bookings");
    expect(Array.isArray(response.body.bookings)).toBe(true);
  });

  // 5. Get booking by ID
  it("should get booking by ID", async () => {
    const booking = await prisma.booking.findFirst({
      where: {
        userId,
        venueId,
      },
    });

    expect(booking).not.toBeNull();

    const response = await request(app)
      .get(`/api/bookings/${booking!.id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.booking.id).toBe(booking!.id);
  });

  // 6. Cancel booking
  it("should cancel a booking successfully", async () => {
    const startTime = new Date(
      Date.now() + 48 * 60 * 60 * 1000
    );

    startTime.setMinutes(15, 0, 0);

    const endTime = new Date(
      startTime.getTime() + 30 * 60 * 1000
    );

    const booking = await prisma.booking.create({
      data: {
        userId,
        venueId,
        startTime,
        endTime,
        status: "PENDING",
      },
    });

    const response = await request(app)
      .patch(`/api/bookings/${booking.id}/cancel`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Booking cancelled successfully"
    );
    expect(response.body.booking.status).toBe("CANCELLED");
  });

  // 7. Admin can confirm booking
  it("should allow ADMIN to confirm a booking", async () => {
    const startTime = new Date(
      Date.now() + 72 * 60 * 60 * 1000
    );

    startTime.setMinutes(15, 0, 0);

    const endTime = new Date(
      startTime.getTime() + 30 * 60 * 1000
    );

    const booking = await prisma.booking.create({
      data: {
        userId,
        venueId,
        startTime,
        endTime,
        status: "PENDING",
      },
    });

    const response = await request(app)
      .patch(`/api/bookings/${booking.id}/confirm`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Booking confirmed successfully"
    );
    expect(response.body.booking.status).toBe("CONFIRMED");
  });

  // 8. USER cannot confirm booking
  it("should reject USER from confirming a booking", async () => {
    const startTime = new Date(
      Date.now() + 96 * 60 * 60 * 1000
    );

    startTime.setMinutes(15, 0, 0);

    const endTime = new Date(
      startTime.getTime() + 30 * 60 * 1000
    );

    const booking = await prisma.booking.create({
      data: {
        userId,
        venueId,
        startTime,
        endTime,
        status: "PENDING",
      },
    });

    const response = await request(app)
      .patch(`/api/bookings/${booking.id}/confirm`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(403);
  });

  // 9. Admin can complete booking
  it("should allow ADMIN to complete a confirmed booking", async () => {
    const startTime = new Date(
      Date.now() + 120 * 60 * 60 * 1000
    );

    startTime.setMinutes(15, 0, 0);

    const endTime = new Date(
      startTime.getTime() + 30 * 60 * 1000
    );

    const booking = await prisma.booking.create({
      data: {
        userId,
        venueId,
        startTime,
        endTime,
        status: "CONFIRMED",
      },
    });

    const response = await request(app)
      .patch(`/api/bookings/${booking.id}/complete`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Booking completed successfully"
    );
    expect(response.body.booking.status).toBe("COMPLETED");
  });
});