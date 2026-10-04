import { Server } from "socket.io";
import { CLIENT_ORIGIN, SOCKET_EVENTS } from "../config.js";

let io = null;
export function initSocket(server) {
  io = new Server(server, { cors: { origin: CLIENT_ORIGIN } });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.on("disconnect", () =>
      console.log(`Socket disconnected: ${socket.id}`),
    );
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

export function createIncidentNotifer(getIo = getIO) {
  return {
    created: (incident) =>
      getIo().emit(SOCKET_EVENTS.INCIDENT_CREATED, incident),
    updated: (incident) =>
      getIo().emit(SOCKET_EVENTS.INCIDENT_UPDATED, incident),
    deleted: (id) => getIo().emit(SOCKET_EVENTS.INCIDENT_DELETED, { id }),
  };
}
// export function createIncidentNotifer(io) {
//   return {
//     created: (incident) => io.emit(SOCKET_EVENTS.INCIDENT_CREATED, incident),
//     updated: (incident) => io.emit(SOCKET_EVENTS.INCIDENT_UPDATED, incident),
//     deleted: (id) => io.emit(SOCKET_EVENTS.INCIDENT_DELETED, { id }),
//   };
// }
