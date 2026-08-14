import { Router } from "express";
import {
  createVenueController,
  getVenuesController,
  getVenueByIdController,
  updateVenueController,
  deleteVenueController,
} from "../controllers/venue.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createVenueSchema } from "../validators/venue.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
/**
 * @swagger
 * /api/venues:
 *   post:
 *     summary: Create a venue
 *     tags:
 *       - Venues
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - pricePerHour
 *             properties:
 *               name:
 *                 type: string
 *                 example: Test Turf
 *               description:
 *                 type: string
 *                 example: Football turf
 *               address:
 *                 type: string
 *                 example: Chennai
 *               pricePerHour:
 *                 type: number
 *                 example: 500
 *     responses:
 *       201:
 *         description: Venue created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createVenueSchema),
  asyncHandler(createVenueController)
);
/**
 * @swagger
 * /api/venues:
 *   get:
 *     summary: Get all venues
 *     tags:
 *       - Venues
 *     responses:
 *       200:
 *         description: List of venues
 */
router.get(
  "/",
  asyncHandler(getVenuesController)
);
/**
 * @swagger
 * /api/venues/{id}:
 *   get:
 *     summary: Get venue by ID
 *     tags:
 *       - Venues
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 2f21dd92-beec-4a71-9ba5-1b44f13e4ba2
 *     responses:
 *       200:
 *         description: Venue details
 *       404:
 *         description: Venue not found
 */
router.get(
  "/:id",
  asyncHandler(getVenueByIdController)
);
/**
 * @swagger
 * /api/venues/{id}:
 *   put:
 *     summary: Update a venue
 *     tags:
 *       - Venues
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               pricePerHour:
 *                 type: number
 *     responses:
 *       200:
 *         description: Venue updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Venue not found
 */
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(updateVenueController)
);
/**
 * @swagger
 * /api/venues/{id}:
 *   delete:
 *     summary: Delete a venue
 *     tags:
 *       - Venues
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Venue deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Venue not found
 */
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(deleteVenueController)
);

export default router;