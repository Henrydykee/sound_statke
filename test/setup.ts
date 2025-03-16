import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { closeRedis } from "../src/utils/redisClient";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
  await closeRedis();
});
