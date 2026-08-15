import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import {
  createBooking,
  getUserBookings,
  getProviderBookings,
  getBookingById,
  cancelBooking,
  confirmBooking,
  completeBooking,
} from "../services/booking.service.js";

export const getProviderBookingsController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const providerId = req.user?.id;

  if (!providerId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const bookings = await getProviderBookings(providerId);

  return res.status(200).json({
    bookings,
  });
};

export const completeBookingController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: "Valid booking id is required",
    });
  }

  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const booking = await completeBooking(
    id,
    req.user.id,
    req.user.role
  );

  return res.status(200).json({
    message: "Booking completed successfully",
    booking,
  });
};

export const createBookingController = async (
  req: Request,
  res: Response
) => {
  const { venueId, startTime, endTime } = req.body;

  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const booking = await createBooking({
    userId,
    venueId,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
  });

  return res.status(201).json({
    message: "Booking created successfully",
    booking,
  });
};

export const getUserBookingsController = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const bookings = await getUserBookings(userId);

  return res.status(200).json({
    bookings,
  });
};

export const getBookingByIdController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: "Valid booking id is required",
    });
  }

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const booking = await getBookingById(id, userId);

  return res.status(200).json({
    booking,
  });
};

export const cancelBookingController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: "Valid booking id is required",
    });
  }

  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const booking = await cancelBooking(
    id,
    req.user.id,
    req.user.role
  );

  return res.status(200).json({
    message: "Booking cancelled successfully",
    booking,
  });
};

export const confirmBookingController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: "Valid booking id is required",
    });
  }

  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const booking = await confirmBooking(
    id,
    req.user.id,
    req.user.role
  );

  return res.status(200).json({
    message: "Booking confirmed successfully",
    booking,
  });
};