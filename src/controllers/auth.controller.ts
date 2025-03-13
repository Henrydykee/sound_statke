import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import dotenv from "dotenv";
import User from "../models/User";
import Artist from "../models/Artist";
dotenv.config();

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, username, dob, nationality, preferredCurrency, password } = req.body;

    // Validate input fields
    if (!name || !email || !username || !dob || !nationality || !preferredCurrency || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check for valid currency selection
    if (!["NGN", "USD"].includes(preferredCurrency)) {
      return res.status(400).json({ message: "Preferred currency must be NGN or USD." });
    }

    // Check if email or username is already in use
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: "Email or username is already in use." });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      username,
      dob,
      nationality,
      preferredCurrency,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        dob: newUser.dob,
        nationality: newUser.nationality,
        preferredCurrency: newUser.preferredCurrency,
      },
      token,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};





