
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  username: string;
  dob: Date;
  nationality: string;
  preferredCurrency: "NGN" | "USD";
  password: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    nationality: { type: String, required: true },
    preferredCurrency: { type: String, enum: ["NGN", "USD"], required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;

