export const {
  URI_MONGO,
  DB_NAME,
  PORT = 3000,
  CLIENT_ORIGIN = "http://localhost:5173",
  SECRET_JWT = "Enter_your_secret_T",
  EXPIRE_JWT = "1d",
} = process.env;

export const HASH_ROUNDS = 12;

export const SOCKET_EVENTS = {
  INCIDENT_CREATED: "incident:created",
  INCIDENT_UPDATED: "incident:updated",
  INCIDENT_DELETED: "incident:deleted",
};
