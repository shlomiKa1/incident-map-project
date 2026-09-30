import http from "http";
import { closeMongo, connectToMongo, ensureIndexes } from "./db/db.js";
import { createApp } from "./app.js";
import { PORT } from "./config.js";
import createUserDAL from "./DAL/user.dal.js";
import { createAuthService } from "./services/auth.service.js";
import createAuthController from "./controllers/auth.conroller.js";
import createIncidentsCtrl from "./controllers/incident.controller.js";
import createIncidentSerivce from "./services/incident.service.js";
import createIncidentsDAL from "./DAL/incidents.dal.js";

const start = async () => {
  try {
    await connectToMongo();
    await ensureIndexes();

    const userRepo = await createUserDAL();
    const authService = createAuthService(userRepo);
    const authController = createAuthController(authService);

    const incidentsRepo = await createIncidentsDAL();
    const incidentsService = createIncidentSerivce(incidentsRepo);
    const incidentsCtrl = createIncidentsCtrl(incidentsService);

    const app = createApp({ authController, incidentsCtrl });
    const server = http.createServer(app);
    server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  } catch (err) {
    console.log("Failed to start:", err);
    await closeMongo();
    process.exit(1);
  }
};

start();
