import { MongoClient, Db } from "mongodb";
import { URI_MONGO } from "../config.js";

const client = new MongoClient(URI_MONGO);
let /**@type {Db | null}*/ db;

export function connectToMongo() {
  if (!db) {
    db = client
      .connect()
      .then(() => {
        console.log("Connected to mongoDB: space-incident");
        return client.db("space-incident");
      })
      .catch((error) => {
        db = null;
        throw new Error("Failed to connect to MongoDB", { cause: error });
      });
  }
  return db;
}

export async function closeMongo() {
  try {
    await client.close();
    db = null;
  } catch {
    console.log("Failed at close");
  }
  console.log("MongoDb closed success");
}
