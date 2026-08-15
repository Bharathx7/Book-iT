import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import {
  getAdminDashboard,
  getAdminBookings,
  getAdminUsers,
  getAdminVenues,
} from "../services/admin.service.js";

export const getAdminDashboardController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const dashboard = await getAdminDashboard();

  return res.status(200).json({
    dashboard,
  });
};

export const getAdminBookingsController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const bookings = await getAdminBookings();

  return res.status(200).json({
    bookings,
  });
};

export const getAdminUsersController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const users = await getAdminUsers();

  return res.status(200).json({
    users,
  });
};

export const getAdminVenuesController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const venues = await getAdminVenues();

  return res.status(200).json({
    venues,
  });
};