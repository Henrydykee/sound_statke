

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
  role: "user" | "admin"; // Distinguish between user types
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
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profilePicture: { type: String },
    phoneNumber: { type: String },
    socialLinks: {
      spotify: { type: String , default: null },
      appleMusic: { type: String , default: null },
      youtube: { type: String , default: null },
      instagram: { type: String, default: null },
      twitter: { type: String , default: null },
    },
    governmentId: { type: String ,default: null },
    kycStatus: { type: String, enum: ["pending", "verified", "rejected" ,"submitted"], default: "pending" },
  },
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
