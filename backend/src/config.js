export const {
  URI_MONGO = "mongodb://mongo:27017",
  DB_NAME = "incident",
  PORT = 3000,
  CLIENT_ORIGIN = "http://localhost:5173",
  SECRET_JWT,
  EXPIRE_JWT = "1d",
} = process.env;

export const HASH_ROUNDS = 12;

export const SOCKET_EVENTS = {
  INCIDENT_CREATED: "incident:created",
  INCIDENT_UPDATED: "incident:updated",
  INCIDENT_DELETED: "incident:deleted",
};
