import { connectToMongo } from "../db/db.js";
import createRepository from "./repository.js";

export async function userDAL(collection) {
  const base = createRepository(collection);

  async function findByEmail(email) {
    return await collection.findOne({ email });
  }
  
  return { ...base, findByEmail };
}

export default async function createUserDAL() {
  const db = await connectToMongo();
  return userDAL(db.collection("users"));
}
