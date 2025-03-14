import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import dotenv from "dotenv";
import User from "../models/User";
import { AuthRequest } from "../types/types";

dotenv.config();

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, username, dob, nationality, preferredCurrency, password } = req.body;
    if (!name || !email || !username || !dob || !nationality || !preferredCurrency || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (!["NGN", "USD"].includes(preferredCurrency)) {
      return res.status(400).json({ message: "Preferred currency must be NGN or USD." });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: "Email or username is already in use." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      username,
      dob,
      nationality,
      preferredCurrency,
      password: hashedPassword,
      role : "user"
    });

    await newUser.save();
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


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    if (!req.body.password || !req.body.email) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: "user",
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const setPasscode = async (req: AuthRequest, res: Response) => {
  try {
    const { passcode } = req.body;

    if (!passcode) {
      return res.status(400).json({ message: "Passcode is required." });
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash passcode before saving
    const salt = await bcrypt.genSalt(10);
    user.passcode = await bcrypt.hash(passcode, salt);
    user.isPasscodeset = true;

    await user.save();
    res.status(200).json({ message: "Passcode set successfully." });
  } catch (error) {
    console.error("Error setting passcode:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const loginWithPasscode = async (req: Request, res: Response) => {
  try {
    const { email, passcode } = req.body;

    if (!email || !passcode) {
      return res.status(400).json({ message: "Email and passcode are required." });
    }

    const user = await User.findOne({ email });

    if (!user || !user.passcode) {
      return res.status(404).json({ message: "User not found or passcode not set." });
    }

  
    const isMatch = await bcrypt.compare(passcode, user.passcode);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid passcode." });
    }


    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login with Passcode Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};





