

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer | null = null;

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      console.log("🔄 Closing existing MongoDB connection...");
      await mongoose.disconnect();
    }

  
    if (process.env.NODE_ENV === "test") {
      if (mongoServer) {
        await mongoServer.stop();
        mongoServer = null;
      }
      
      // Create new memory server
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log("✅ Test DB Connected to Memory Server");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ Connection Error:", error);
    process.exit(1);
  }
};

export const closeDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
      mongoServer = null;
    }
    console.log("🛑 MongoDB Disconnected");
  } catch (error) {
    console.error("❌ Error during disconnection:", error);
  }
};

export default connectDB;