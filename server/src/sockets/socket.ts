import type { Server } from "socket.io";

let io: Server;

export const initializeSocket = (socketServer: Server) => {
  io = socketServer;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized");
  }

  return io;
};