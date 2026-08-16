import { io } from "socket.io-client";

const socketUrl =
  import.meta.env.VITE_API_URL?.replace(/\/api$/, "") ||
  "http://localhost:5000";

export const socket = io(socketUrl);

socket.on("connect", () => {
  console.log("Connected to Socket.io:", socket.id);
});

socket.on("welcome", (data) => {
  console.log("Server message:", data.message);
});

socket.on("bookingConfirmed", (data) => {
  console.log("Booking confirmed event received:", data);
});

socket.on("bookingCancelled", (data) => {
  console.log("Booking cancelled event received:", data);
});

socket.on("bookingCompleted", (data) => {
  console.log("Booking completed event received:", data);
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.io");
});