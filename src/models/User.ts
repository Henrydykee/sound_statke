

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  username: string;
  dob: Date;
  passcode : string;
  nationality: string;
  isPasscodeset : boolean;
  preferredCurrency: "NGN" | "USD";
  password: string;
  role: "user" | "artist"; // Distinguish between user types
  profilePicture?: string;
  coverPhoto?: string;
  phoneNumber?: string;
  socialLinks?: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  governmentId?: string;
  kycStatus?: "submitted" |"pending" | "verified" | "rejected";
  twoFactorEnabled?: boolean;
  artistDetails?: {
    stageName?: string;
    genres?: string[];
    biography?: string;
    city?: string;
  };
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    nationality: { type: String, required: true },
    preferredCurrency: { type: String, enum: ["NGN", "USD"], default: "USD" },
    isPasscodeset : { type: Boolean, default: false },
    passcode : { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "artist"], default: "user" },
    profilePicture: { type: String },
    coverPhoto: { type: String },
    phoneNumber: { type: String },
    socialLinks: {
      spotify: { type: String },
      appleMusic: { type: String },
      youtube: { type: String },
      instagram: { type: String },
      twitter: { type: String },
      tiktok: { type: String },
    },
    governmentId: { type: String },
    kycStatus: { type: String, enum: ["pending", "verified", "rejected" ,"submitted"], default: "pending" },
    twoFactorEnabled: { type: Boolean, default: false },
    artistDetails: {
      stageName: { type: String ,default: null},
      genres: {type : Array},
      biography: { type: String },
      city: { type: String },
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
