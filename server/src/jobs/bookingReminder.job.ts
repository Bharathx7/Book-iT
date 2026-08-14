import cron from "node-cron";
import prisma from "../config/prisma.js";
import { sendBookingReminderEmail } from "../services/email.service.js";

export function startBookingReminderJob() {
  cron.schedule("*/10 * * * *", async () => {
    try {
      const now = new Date();

      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);

      const bookings = await prisma.booking.findMany({
        where: {
          startTime: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: "CONFIRMED",
          reminderSent: false,
        },
        include: {
          user: true,
          venue: true,
        },
      });

      for (const booking of bookings) {
        await sendBookingReminderEmail(
          booking.user.email,
          booking.user.name,
          booking.venue.name,
          booking.startTime,
          booking.endTime
        );

        await prisma.booking.update({
          where: {
            id: booking.id,
          },
          data: {
            reminderSent: true,
          },
        });
      }

      console.log(
        `Booking reminder job completed. Processed ${bookings.length} booking(s).`
      );
    } catch (error) {
      console.error("Booking reminder job error:", error);
    }
  });

  console.log("Booking reminder job started.");
}