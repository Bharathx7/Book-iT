import { Router } from "express";

import {
  createTimeSlotController,
  getVenueTimeSlotsController,
  deleteTimeSlotController,
  checkAvailabilityController,
} from "../controllers/timeslot.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createTimeSlotSchema } from "../validators/timeslot.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "PROVIDER"),
  validate(createTimeSlotSchema),
  asyncHandler(createTimeSlotController)
);

router.get(
  "/venue/:venueId",
  asyncHandler(getVenueTimeSlotsController)
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN", "PROVIDER"),
  asyncHandler(deleteTimeSlotController)
);

router.get(
  "/venue/:venueId/availability",
  asyncHandler(checkAvailabilityController)
);

export default router;