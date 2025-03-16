import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User";
import { AuthRequest } from "../types/types";


dotenv.config();

export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; 

    if (!token) {
      return res.status(401).json({ message: "No token provided. Access denied." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id).select("_id role");

    if (!user) {
      return res.status(404).json({ message: "User not found." }); // Changed to 404
    }
    req.user = { id: user._id, role: user.role }; // Attach user ID & role to request
    next(); // Proceed to next middleware
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

