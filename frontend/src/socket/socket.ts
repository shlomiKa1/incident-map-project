import { io, type Socket } from "socket.io-client";
import { API_URI, SOCKET_EVENTS } from "../config";
import type { Incident } from "../types/incident";

type ServerToClientEvents = {
  [SOCKET_EVENTS.INCIDENT_CREATED]: (incident: Incident) => void;
  [SOCKET_EVENTS.INCIDENT_UPDATED]: (incident: Incident) => void;
  [SOCKET_EVENTS.INCIDENT_DELETED]: (payload: { id: string }) => void;
};

type ClientToServerEvents = Record<string, never>;

export type IncidentSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function createSocket(): IncidentSocket {
  return io(API_URI, { autoConnect: false });
}
