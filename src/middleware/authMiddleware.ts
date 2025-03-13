import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Artist from "../models/Artist";


dotenv.config();

interface AuthRequest extends Request {
  user?: { id: string };
}

export const authenticateArtist = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; 

    if (!token) {
      return res.status(401).json({ message: "No token provided. Access denied." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const artist = await Artist.findById(decoded.id).select("_id");

    if (!artist) {
      return res.status(401).json({ message: "Invalid token. Artist not found." });
    }

    req.user = { id: artist._id }; // Attach artist ID to request
    next(); // Proceed to next middleware
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
