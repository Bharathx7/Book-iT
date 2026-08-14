import transporter from "../config/email.js";

export async function sendTestEmail(to: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "BookIt Email Test",
    text: "This is a test email from your BookIt backend.",
  });
}

export async function sendBookingConfirmationEmail(
  to: string,
  userName: string,
  venueName: string,
  startTime: Date,
  endTime: Date
) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "BookIt - Booking Confirmed",
    text: `
Hello ${userName},

Your booking has been confirmed.

Venue: ${venueName}
Start Time: ${startTime.toLocaleString()}
End Time: ${endTime.toLocaleString()}

Thank you for using BookIt.
    `,
  });
}

export async function sendBookingCancellationEmail(
  to: string,
  userName: string,
  venueName: string,
  startTime: Date,
  endTime: Date
) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "BookIt - Booking Cancelled",
    text: `
Hello ${userName},

Your booking has been cancelled.

Venue: ${venueName}
Start Time: ${startTime.toLocaleString()}
End Time: ${endTime.toLocaleString()}

If you did not request this cancellation, please contact support.

Thank you for using BookIt.
    `,
  });
}

export async function sendBookingReminderEmail(
  to: string,
  userName: string,
  venueName: string,
  startTime: Date,
  endTime: Date
) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "BookIt - Booking Reminder",
    text: `
Hello ${userName},

This is a reminder that you have a booking today.

Venue: ${venueName}
Start Time: ${startTime.toLocaleString()}
End Time: ${endTime.toLocaleString()}

Thank you for using BookIt.
    `,
  });
}