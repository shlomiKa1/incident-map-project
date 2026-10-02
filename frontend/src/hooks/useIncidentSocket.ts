import { useEffect, useState } from "react";
import { createSocket } from "../socket/socket";
import { useIncidentStore } from "../store/incidents.store";
import { SOCKET_EVENTS } from "../config";
import { incidentApi } from "../api/incident.api";

export function useIcidentSocket(enabled: boolean) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const socket = createSocket();
    const { upsert, remove } = useIncidentStore.getState();

    // socket.on("connnect", () => setConnected(true));
    socket.on("connect", () => {
      setConnected(true);
      incidentApi.getAll().then(useIncidentStore.getState().setAll);
    });
    socket.on("disconnect", () => setConnected(false));

    socket.on(SOCKET_EVENTS.INCIDENT_CREATED, upsert);
    socket.on(SOCKET_EVENTS.INCIDENT_UPDATED, upsert);
    socket.on(SOCKET_EVENTS.INCIDENT_DELETED, ({ id }) => remove(id));

    socket.connect();
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [enabled]);

  return { connected };
}
