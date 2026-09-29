import { ObjectId } from "mongodb";

export default function createRepository(collection) {
  async function find(filter = {}) {
    return await collection.find(filter).toArray();
  }

  async function findOne(id) {
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  async function insertOne(data) {
    const { insertedId } = await collection.insertOne(data);
    return { _id: insertedId, ...data };
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
      _id: new ObjectId(id),
    });
    return deletedCount ? { id } : null;
  }

  return { find, findOne, insertOne, update, remove };
}
