import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import timeslotRoutes from "./routes/timeslot.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import { startBookingReminderJob } from "./jobs/bookingReminder.job.js";
import reviewRoutes from "./routes/review.routes.js";
import { initializeSocket } from "./sockets/socket.js";



app.use("/api/timeslots", timeslotRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);


const PORT = process.env.PORT || 5000;

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

initializeSocket(io);

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.emit("welcome", {
    message: "Connected to booking server",
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startBookingReminderJob();
});