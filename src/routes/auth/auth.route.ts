import express from "express";
import { ArtistSignup as artistSignup, updateProfile } from "../../controllers/auth/artist.controller";
import { getUserProfile, login, loginWithPasscode, setPasscode, signup } from "../../controllers/auth/auth.controller";
import { authenticateUser } from "../../middleware/authMiddleware";

const authRoutes = express.Router();

authRoutes.post("/user/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/login-passcode", loginWithPasscode);
authRoutes.post("/set-passcode", authenticateUser, setPasscode);
authRoutes.post("/artist-signup", artistSignup);
authRoutes.patch("/editprofile", authenticateUser, updateProfile);
authRoutes.get("/getUser" , authenticateUser , getUserProfile)


export default authRoutes;
