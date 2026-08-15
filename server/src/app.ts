import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import venueRoutes from "./routes/venue.routes.js";
import emailRoutes from "./routes/email.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import timeslotRoutes from "./routes/timeslot.routes.js";
import { swaggerSpec } from "./config/swagger.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "BookIt API is running",
  });
});

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/timeslots", timeslotRoutes);

app.use(errorMiddleware);

export default app;