import express from "express";
import { ArtistSignup as artistSignup, updateProfile } from "../controllers/artist.controller";
import { login, loginWithPasscode, setPasscode, signup } from "../controllers/auth.controller";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/user/signup", signup);
router.post("/login", login);
router.post("/login-passcode", loginWithPasscode);
router.post("/set-passcode", authenticateUser, setPasscode);
router.post("/artist-signup", artistSignup);
router.patch("/editprofile", authenticateUser, updateProfile);


export default router;
