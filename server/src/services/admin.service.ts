import prisma from "../config/prisma.js";

export const getAdminDashboard = async () => {
  const [
    totalUsers,
    totalProviders,
    totalVenues,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        role: "USER",
      },
    }),

    prisma.user.count({
      where: {
        role: "PROVIDER",
      },
    }),

    prisma.venue.count(),

    prisma.booking.count(),

    prisma.booking.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.booking.count({
      where: {
        status: "CONFIRMED",
      },
    }),

    prisma.booking.count({
      where: {
        status: "COMPLETED",
      },
    }),

    prisma.booking.count({
      where: {
        status: "CANCELLED",
      },
    }),
  ]);

  return {
    users: totalUsers,
    providers: totalProviders,
    venues: totalVenues,
    bookings: totalBookings,

    bookingStats: {
      pending: pendingBookings,
      confirmed: confirmedBookings,
      completed: completedBookings,
      cancelled: cancelledBookings,
    },
  };
};

export const getAdminBookings = async () => {
  return prisma.booking.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      venue: {
        select: {
          id: true,
          name: true,
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

export const getAdminUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAdminVenues = async () => {
  return prisma.venue.findMany({
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          bookings: true,
          reviews: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
