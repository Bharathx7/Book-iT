import { Router } from "express";

import {
  getAdminDashboardController,
  getAdminBookingsController,
  getAdminUsersController,
  getAdminVenuesController,
} from "../controllers/admin.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard statistics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
  "/dashboard",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(getAdminDashboardController)
);

/**
 * @swagger
 * /api/admin/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
  "/bookings",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(getAdminBookingsController)
);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
  "/users",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(getAdminUsersController)
);

/**
 * @swagger
 * /api/admin/venues:
 *   get:
 *     summary: Get all venues
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all venues
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
  "/venues",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(getAdminVenuesController)
);

export default router;