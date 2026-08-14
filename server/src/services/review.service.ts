import prisma from "../config/prisma.js";

interface CreateReviewInput {
  userId: string;
  bookingId: string;
  rating: number;
  review?: string;
}

export const createReview = async ({
  userId,
  bookingId,
  rating,
  review,
}: CreateReviewInput) => {
  if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    throw new Error("Rating must be an integer between 1 and 5");
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status !== "COMPLETED") {
    throw new Error("You can review only after the booking is completed");
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      bookingId,
    },
  });

  if (existingReview) {
    throw new Error("This booking has already been reviewed");
  }

  return prisma.review.create({
    data: {
      userId,
      venueId: booking.venueId,
      bookingId,
      rating,
      review: review ?? null,
    },
    include: {
      venue: true,
      booking: true,
    },
  });
};

export const getVenueRating = async (venueId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      venueId,
    },
    select: {
      rating: true,
    },
  });

  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
    };
  }

  const totalRating = reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );

  const averageRating = totalRating / reviews.length;

  return {
    averageRating: Number(averageRating.toFixed(2)),
    totalReviews: reviews.length,
  };
};