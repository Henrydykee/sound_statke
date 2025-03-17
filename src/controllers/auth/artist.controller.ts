import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import dotenv from "dotenv";
import User from "../../models/User";
import { AuthRequest } from "../../types/types";
import { errorResponse, successResponse } from "../../utils/response";

dotenv.config();

// export const ArtistSignup = async (req: Request, res: Response) => {
//   try {
//       const { fullName, username, dob, nationality, email, password, genres, profilePicture  } = req.body;

//       if (!fullName || !username || !dob || !nationality || !email || !password || !genres) {
//           return res.status(400).json({ message: "All required fields must be filled." });
//       }

//       const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//       if (existingUser) {
//         return res.status(409).json({ message: "Email already registered or username already taken." });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       const newArtist = new User({
//           name: fullName,
//           username,
//           dob,
//           nationality,
//           password: hashedPassword,
//           email,
//           genres,
//           profilePicture,
//           role: "artist"
//       });

//       await newArtist.save();

//       const token = jwt.sign({ id: newArtist._id, email: newArtist.email }, process.env.JWT_SECRET as string, {
//           expiresIn: "7d",
//       });
//       res.status(201).json({ message: "Artist registered successfully", artist: newArtist, token });
//   } catch (error) {
//       console.error("Error signing up artist:", error);
//       res.status(500).json({ message: "Server error. Please try again later." });
//   }
// };
// export const updateProfile = async (req: AuthRequest, res: Response) => {
//   try {
//     const artistId = req.user?.id;
//     const updateData = req.body;

//     if (updateData.email || updateData.password) {
//       return res.status(400).json({ message: "Email and password cannot be updated here." });
//     }

//     const  user = await User.findByIdAndUpdate(
//       artistId,
//       { $set: updateData },
//       { new: true, runValidators: true }
//     );

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     res.status(200).json({ message: "Profile updated successfully.", data: user });

//   } catch (error) {
//     console.error("Error updating artist profile:", error);
//     res.status(500).json({ message: "Server error. Please try again later." });
//   }
// };

export const ArtistSignup = async (req: Request, res: Response) => {
  try {
    const { fullName, username, dob, nationality, email, password, genres, profilePicture } = req.body;

    if (!fullName || !username || !dob || !nationality || !email || !password || !genres) {
      return res.status(400).json(errorResponse("All required fields must be filled."));
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json(errorResponse("Email already registered or username already taken."));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newArtist = new User({
      name: fullName,
      username,
      dob,
      nationality,
      password: hashedPassword,
      email,
      genres,
      profilePicture,
      role: "artist",
    });

    await newArtist.save();

    const token = jwt.sign({ id: newArtist._id, email: newArtist.email }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    res.status(201).json(successResponse("Artist registered successfully", { artist: newArtist, token }));
  } catch (error) {
    console.error("Error signing up artist:", error);
    res.status(500).json(errorResponse("Server error. Please try again later."));
  }
};


