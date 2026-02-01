const mongoose = require("mongoose");
const { env } = require("./env");
let MongoMemoryServer = null;
try {
  MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
} catch (_e) {
  MongoMemoryServer = null;
}

async function connectDb(mongoUri) {
  try {
    if (!mongoUri) {
      console.warn("MONGO_URI not provided, skipping local connection attempt.");
      throw new Error("MONGO_URI is required");
    }

    // Try connecting with a short timeout to fail fast if local DB is down
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log(`Connected to MongoDB at ${mongoUri}`);
    
  } catch (err) {
    if (env.nodeEnv === "development" && MongoMemoryServer) {
      try {
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
        console.log(`Connected to In-Memory MongoDB at: ${uri}`);
        return;
      } catch (_memErr) {
        throw err;
      }
    }
    throw err;
  }
}

module.exports = { connectDb };
