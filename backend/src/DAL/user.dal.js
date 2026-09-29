import { ObjectId } from "mongodb";
import { connectToMongo } from "../db/db.js";

function repository(collection) {
  async function find(filter = {}) {
    return await collection.find(filter).toArray();
  }

  async function findOne(id) {
    await collection.findOne({ _id: new ObjectId(id) });
  }

  async function insertOne(data) {
    const { insertedId } = await collection.insertOne(data);
    return { id: insertedId, ...data };
  }

  async function update(id, data) {
    return await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: "after" },
    );
  }

  async function remove(id) {
    const { deletedCount } = await collection.deleteOne({
      id: new ObjectId(id),
    });
    return deletedCount;
  }

  return { find, findOne, insertOne, update, remove };
}

export default async function createRepository(name, collection = null) {
  if (!collection) {
    const db = await connectToMongo();
    collection = db.collection(name);
  }
  return repository(collection);
}
