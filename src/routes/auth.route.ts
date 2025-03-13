import express from "express";
import { ArtistSignup, updateArtistProfile } from "../controllers/artist.controller";
import { signup } from "../controllers/auth.controller";
import { authenticateArtist } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/user/signup", signup);
router.post("/Artist/signup", ArtistSignup);
router.patch("/editprofile", authenticateArtist, updateArtistProfile);


export default router;
