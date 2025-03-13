import express from "express";
import { ArtistSignup as artistSignup, updateArtistProfile } from "../controllers/artist.controller";
import { login, setPasscode, signup } from "../controllers/auth.controller";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/user/signup", signup);
router.post("/login", login);
router.post("/set-passcode", authenticateUser, setPasscode);
router.post("/artist/signup", artistSignup);
router.patch("/editprofile", authenticateUser, updateArtistProfile);


export default router;
