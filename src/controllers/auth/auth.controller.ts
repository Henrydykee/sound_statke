import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import dotenv from "dotenv";
import User from "../../models/User";
import { AuthRequest } from "../../types/types";
import { errorResponse, successResponse } from "../../utils/response";

dotenv.config();

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, username, dob, nationality, preferredCurrency, password } = req.body;

    if (!name || !email || !username || !dob || !nationality || !preferredCurrency || !password) {
      return res.status(400).json(errorResponse("All fields are required."));
    }
    if (!["NGN", "USD"].includes(preferredCurrency)) {
      return res.status(400).json(errorResponse("Preferred currency must be NGN or USD."));
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json(errorResponse("Email or username is already in use."));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      username,
      dob,
      nationality,
      preferredCurrency,
      password: hashedPassword,
      isPasscodeset: false,
      role: "user",
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

    res.status(201).json(successResponse("User registered successfully.", {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
      dob: newUser.dob,
      role: newUser.role,
      nationality: newUser.nationality,
      preferredCurrency: newUser.preferredCurrency,
      token,
    }));
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json(errorResponse("Server error. Please try again later."));
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json(errorResponse("Email and password are required."));
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json(errorResponse("Invalid email or password."));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json(errorResponse("Invalid email or password."));
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

    res.status(200).json(successResponse("Login successful.", {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      token,
    }));
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json(errorResponse("Internal server error."));
  }
};

export const setPasscode = async (req: AuthRequest, res: Response) => {
  try {
    const { passcode } = req.body;

    if (!passcode) {
      return res.status(400).json(errorResponse("Passcode is required."));
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json(errorResponse("User not found."));
    }

    user.passcode = await bcrypt.hash(passcode, 10);
    user.isPasscodeset = true;
    await user.save();

    res.status(200).json(successResponse("Passcode set successfully."));
  } catch (error) {
    console.error("Error setting passcode:", error);
    res.status(500).json(errorResponse("Server error. Please try again later."));
  }
};

export const loginWithPasscode = async (req: Request, res: Response) => {
  try {
    const { email, passcode } = req.body;

    if (!email || !passcode) {
      return res.status(400).json(errorResponse("Email and passcode are required."));
    }

    const user = await User.findOne({ email });
    if (!user || !user.passcode) {
      return res.status(404).json(errorResponse("User not found or passcode not set."));
    }

    const isMatch = await bcrypt.compare(passcode, user.passcode);
    if (!isMatch) {
      return res.status(400).json(errorResponse("Invalid passcode."));
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

    res.status(200).json(successResponse("Login successful.", {
      id: user._id,
      email: user.email,
      role: user.role,
      token,
    }));
  } catch (error) {
    console.error("Login with Passcode Error:", error);
    res.status(500).json(errorResponse("Server error. Please try again later."));
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json(errorResponse("User not found."));
    }

    res.status(200).json(successResponse("User profile retrieved successfully.", {
      id: user._id,
      email: user.email,
      name: user.name,
      username: user.username,
      dob: user.dob,
      nationality: user.nationality,
      preferredCurrency: user.preferredCurrency,
      isPasscodeset: user.isPasscodeset,
      role: user.role,
      profilePicture: user.profilePicture,
    }));
  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).json(errorResponse("Server error. Please try again later."));
  }
};





