import { Router } from "express";

import {
  createBookingController,
  getUserBookingsController,
  getBookingByIdController,
  getProviderBookingsController,
  cancelBookingController,
  confirmBookingController,
  completeBookingController,
} from "../controllers/booking.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createBookingSchema } from "../validators/booking.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - venueId
 *               - startTime
 *               - endTime
 *             properties:
 *               venueId:
 *                 type: string
 *                 example: "2f21dd92-beec-4a71-9ba5-1b44f13e4ba2"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-08-16T10:00:00.000Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-08-16T11:00:00.000Z"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 */

router.post(
  "/",
  authenticate,
  validate(createBookingSchema),
  asyncHandler(createBookingController)
);

/**
 * Get bookings created by the logged-in customer
 */
router.get(
  "/",
  authenticate,
  asyncHandler(getUserBookingsController)
);

/**
 * Get bookings for venues owned by the logged-in provider
 *
 * IMPORTANT:
 * This route must come before /:id
 */
router.get(
  "/provider",
  authenticate,
  authorize("PROVIDER"),
  asyncHandler(getProviderBookingsController)
);

/**
 * Get a specific booking
 */
router.get(
  "/:id",
  authenticate,
  asyncHandler(getBookingByIdController)
);

/**
 * Cancel booking
 *
 * Currently handled by the booking owner.
 */
router.patch(
  "/:id/cancel",
  authenticate,
  authorize("USER", "PROVIDER", "ADMIN"),
  asyncHandler(cancelBookingController)
);

/**
 * Confirm booking
 *
 * ADMIN can confirm any booking.
 * PROVIDER can confirm only their own venue's booking.
 *
 * Ownership is checked inside the service.
 */
router.patch(
  "/:id/confirm",
  authenticate,
  authorize("ADMIN", "PROVIDER"),
  asyncHandler(confirmBookingController)
);

/**
 * Complete booking
 *
 * ADMIN can complete any booking.
 * PROVIDER can complete only their own venue's booking.
 *
 * Ownership is checked inside the service.
 */
router.patch(
  "/:id/complete",
  authenticate,
  authorize("ADMIN", "PROVIDER"),
  asyncHandler(completeBookingController)
);

export default router;