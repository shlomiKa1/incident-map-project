import { connectToMongo } from "../db/db.js";
import createRepository from "./repository.js";

export default async function createIncidentDAL() {
  const db = await connectToMongo();
  return createRepository(db.collection("incident"));
}
