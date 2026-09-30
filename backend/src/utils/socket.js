import { Server } from "socket.io";
import { CLIENT_ORIGIN, SOCKET_EVENTS } from "../config.js";

export function initSocket(server) {
  const io = new Server(server, { cors: { origin: CLIENT_ORIGIN } });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.on("disconnect", () =>
      console.log(`Socket disconnected: ${socket.id}`),
    );
  });

  return io;
}

export function createIncidentNotifer(io) {
  return {
    created: (incident) => io.emit(SOCKET_EVENTS.INCIDENT_CREATED),
    updated: (incident) => io.emit(SOCKET_EVENTS.INCIDENT_UPDATED),
    deleted: (id) => io.emit(SOCKET_EVENTS.INCIDENT_DELETED, { id }),
  };
}
