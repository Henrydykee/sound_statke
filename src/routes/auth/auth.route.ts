import express from "express";
import { ArtistSignup as artistSignup,  } from "../../controllers/auth/artist.controller";
import { getUserProfile, login, loginWithPasscode, setPasscode, signup, updateUserProfile } from "../../controllers/auth/auth.controller";
import { authenticateUser } from "../../middleware/authMiddleware";

const authRoutes = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/login-passcode", loginWithPasscode);
authRoutes.post("/set-passcode", authenticateUser, setPasscode);
authRoutes.post("/artist-signup", artistSignup);
authRoutes.patch("/editprofile", authenticateUser, updateUserProfile);
authRoutes.get("/getUser" , authenticateUser , getUserProfile)


export default authRoutes;
