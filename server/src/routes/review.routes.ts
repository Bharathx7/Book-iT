import { Router } from "express";
import {
  createReviewController,
  getVenueRatingController,
} from "../controllers/review.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post(
  "/",
  authenticate,
  asyncHandler(createReviewController)
);
router.get(
  "/:venueId/rating",
  asyncHandler(getVenueRatingController)
);

export default router;