import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import dotenv from "dotenv";
import User from "../models/User";
import Artist from "../models/Artist";

dotenv.config();

export const ArtistSignup = async (req: Request, res: Response) => {
    try {
      const { fullName, email, password, genres, profilePicture } = req.body;
  
      // Validate required fields
      if (!fullName || !email || !password || !genres) {
        return res.status(400).json({ message: "All required fields must be filled." });
      }
  
      // Check if artist already exists
      const existingArtist = await Artist.findOne({ email });
      if (existingArtist) {
        return res.status(400).json({ message: "Email already registered." });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new artist
      const newArtist = new Artist({
        fullName,
        email,
        password: hashedPassword,
        genres,
        profilePicture,
      });
  
      await newArtist.save();
  
      // Generate JWT token
      const token = jwt.sign({ id: newArtist._id, email: newArtist.email }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
      });
  
      res.status(201).json({ message: "Artist registered successfully", artist: newArtist, token });
    } catch (error) {
      console.error("Error signing up artist:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  };


  interface AuthRequest extends Request {
    user?: { id: string };
  }
  
  export const updateArtistProfile = async (req: AuthRequest, res: Response) => {
    try {
      const artistId = req.user?.id; // Authenticated artist ID
      const updateData = req.body;
  
      // Prevent email and password updates directly
      if (updateData.email || updateData.password) {
        return res.status(400).json({ message: "Email and password cannot be updated here." });
      }
  
      const updatedArtist = await Artist.findByIdAndUpdate(
        artistId,
        { $set: updateData },
        { new: true, runValidators: true, select: "-password" } // Exclude password
      );
  
      if (!updatedArtist) {
        return res.status(404).json({ message: "Artist not found." });
      }
  
      res.status(200).json({ message: "Profile updated successfully.", artist: updatedArtist });
    } catch (error) {
      console.error("Error updating artist profile:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  };