import { Router } from "express";
import {
  authenticate,
  type AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me", authenticate, (req, res) => {
  const authReq = req as AuthenticatedRequest;

  res.json({
    message: "Authentication successful",
    user: authReq.user,
  });
});

export default router;