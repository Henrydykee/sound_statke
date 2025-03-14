import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db";
import authRoutes from "./routes/auth/auth.route";

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Default Route
app.get("/", (req, res) => {
  res.send("🎵 SoundStake API is running...");
});

// Register routes
app.use("/api/auth", authRoutes);


const PORT = process.env.PORT || 5000;


if (process.env.NODE_ENV !== "test") {

  connectDB();
  app.listen(PORT, () => {
    console.log(`🎵 SoundStake API is running on port ${PORT}`);
  });
}

export default app; 