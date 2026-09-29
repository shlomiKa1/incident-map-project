import { MongoClient, Db } from "mongodb";
import { URI_MONGO } from "../config.js";

const client = new MongoClient(URI_MONGO);
let /**@type {Db}*/ db;

export async function connectToMongo() {
  if (!db) {
    try {
      await client.connect();
      db = client.db("space-incident");
      console.log("Connected to mongoDB...");
    } catch (error) {
      throw new Error(error.message);
    }
  } else {
    console.log("Already connected to MongoDB...");
  }
}
