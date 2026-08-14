import type { Request, Response } from "express";

import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  confirmBooking,
  completeBooking,
} from "../services/booking.service.js";

export const completeBookingController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: "Valid booking id is required",
    });
  }

  const booking = await completeBooking(id);

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

  const booking = await cancelBooking(id, userId);

  return res.status(200).json({
    message: "Booking cancelled successfully",
    booking,
  });
};

export const confirmBookingController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: "Valid booking id is required",
    });
  }

  const booking = await confirmBooking(id);

  return res.status(200).json({
    message: "Booking confirmed successfully",
    booking,
  });
};