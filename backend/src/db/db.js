import { MongoClient, Db } from "mongodb";
import { DB_NAME, URI_MONGO } from "../config.js";

const client = new MongoClient(URI_MONGO);
let /**@type {Promise<Db> | null}*/ db;

export function connectToMongo() {
  if (!db) {
    db = client
      .connect()
      .then(() => {
        console.log(`Connected to mongoDB: ${DB_NAME}`);
        return client.db(DB_NAME);
      })
      .catch((error) => {
        db = null;
        throw new Error("Failed to connect to MongoDB", { cause: error });
      });
  }
  return db;
}

export async function ensureIndexes() {
  const db = await connectToMongo();
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
}

export async function closeMongo() {
  try {
    await client.close();
    db = null;
    console.log("MongoDb closed success");
  } catch (err) {
    console.log("Failed at close", err.message);
  }
}
