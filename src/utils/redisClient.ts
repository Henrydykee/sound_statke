

import Redis from "ioredis";

export const redisClient = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  lazyConnect: true, // Prevents automatic connection
});

// Function to ensure Redis connects before using it
export const connectRedis = async () => {
  if (!redisClient.status || redisClient.status !== "ready") {
    await redisClient.connect();
  }
};

// // Function to monitor Redis connection status
// export const monitorRedis = () => {
//   redisClient.on("error", (err) => console.error("Redis connection error:", err));
//   redisClient.on("connect", () => console.log("Redis connected successfully."));
// };


// Function to properly close Redis
export const closeRedis = async () => {
  try {
    if (redisClient.status === "ready") {
      await redisClient.quit();
      console.log("Redis closed successfully.");
    }
  } catch (error) {
    console.error("Error closing Redis, forcing disconnect:", error);
    redisClient.disconnect();
  }
};
