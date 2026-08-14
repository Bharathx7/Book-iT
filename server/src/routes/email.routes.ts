import { Router } from "express";
import { sendTestEmail } from "../services/email.service.js";

const router = Router();

router.post("/test", async (req, res, next) => {
  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({
        message: "Recipient email is required",
      });
    }

    await sendTestEmail(to);

    return res.status(200).json({
      message: "Test email sent successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;