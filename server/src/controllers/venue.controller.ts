import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import {
  createVenue,
  getVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
  getMyVenues,
} from "../services/venue.service.js";

export const createVenueController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, description, address, pricePerHour } = req.body;

  const ownerId = req.user?.id;

  if (!ownerId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const venue = await createVenue(
    {
      name,
      description,
      address,
      pricePerHour,
    },
    ownerId
  );

  return res.status(201).json({
    message: "Venue created successfully",
    venue,
  });
};

export const getVenuesController = async (
  _req: AuthenticatedRequest,
  res: Response
) => {
  const venues = await getVenues();

  return res.status(200).json({
    venues,
  });
};

export const getMyVenuesController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const ownerId = req.user?.id;

  if (!ownerId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const venues = await getMyVenues(ownerId);

  return res.status(200).json({
    venues,
  });
};

export const getVenueByIdController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const id = req.params.id;

  if (typeof id !== "string") {
    return res.status(400).json({
      message: "Invalid venue ID",
    });
  }

  const venue = await getVenueById(id);

  if (!venue) {
    return res.status(404).json({
      message: "Venue not found",
    });
  }

  return res.status(200).json({
    venue,
  });
};

export const updateVenueController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const id = req.params.id;

  if (typeof id !== "string") {
    return res.status(400).json({
      message: "Invalid venue ID",
    });
  }

  const ownerId = req.user?.id;

  if (!ownerId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const { name, description, address, pricePerHour } = req.body;

  const venue = await updateVenue(id, ownerId, {
    name,
    description,
    address,
    pricePerHour,
  });

  return res.status(200).json({
    message: "Venue updated successfully",
    venue,
  });
};

export const deleteVenueController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const id = req.params.id;

  if (typeof id !== "string") {
    return res.status(400).json({
      message: "Invalid venue ID",
    });
  }

  const ownerId = req.user?.id;

  if (!ownerId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const venue = await deleteVenue(id, ownerId);

  if (!venue) {
    return res.status(403).json({
      message: "You are not authorized to delete this venue",
    });
  }

  return res.status(200).json({
    message: "Venue deleted successfully",
    venue,
  });
};