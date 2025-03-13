

import mongoose, { Schema, Document } from "mongoose";

export interface IArtist extends Document {
  fullName: string;
  stageName?: string;
  email: string;
  password: string;
  phoneNumber?: string;
  genres: string[];
  biography?: string;
  profilePicture?: string;
  coverPhoto?: string;
  country?: string;
  city?: string;
  socialLinks?: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  governmentId?: string;
  kycStatus?: "pending" | "verified" | "rejected";
  twoFactorEnabled?: boolean;
}

const ArtistSchema = new Schema<IArtist>(
  {
    fullName: { type: String, required: true, trim: true },
    stageName: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, trim: true },

    genres: { type: [String], required: true },
    biography: { type: String, trim: true },
    profilePicture: { type: String, trim: true },
    coverPhoto: { type: String, trim: true },
    country: { type: String, trim: true },
    city: { type: String, trim: true },

    socialLinks: {
      spotify: { type: String, trim: true },
      appleMusic: { type: String, trim: true },
      youtube: { type: String, trim: true },
      instagram: { type: String, trim: true },
      twitter: { type: String, trim: true },
      tiktok: { type: String, trim: true },
    },

    governmentId: { type: String, trim: true },
    kycStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    twoFactorEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Artist = mongoose.model<IArtist>("Artist", ArtistSchema);

export default Artist;
