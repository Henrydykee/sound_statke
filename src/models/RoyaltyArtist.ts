import mongoose, { Schema, Document } from "mongoose";

export interface IRoyaltyArtist extends Document {
  fullName: string; // The artist's real/full legal name
  stageName: string; // The artist's professional stage name
  email: string; // The artist's email for communication
  phoneNumber: string; // Contact number for the artist
  country: string; // The artist's country of residence
  biography: string; // A brief bio/description of the artist
  profilePicture: string; // URL to the artist's profile picture
  bannerImage?: string; // URL to the artist's banner/header image

  // Verification Documents
  governmentID: string; // URL of the uploaded government-issued ID (e.g., Passport, National ID)
  proofOfAddress: string; // URL of an address verification document (e.g., Utility Bill)
  
  // Social Media Presence
  socialMediaLinks: {
    instagram?: string; // Instagram profile link
    twitter?: string; // Twitter/X profile link
    youtube?: string; // YouTube channel link
    tiktok?: string; // TikTok profile link
  };

  // Music Distribution & Performance Data
  musicLinks: {
    spotify?: string; // Spotify profile link
    appleMusic?: string; // Apple Music artist profile link
    soundcloud?: string; // SoundCloud profile link
    audiomack?: string; // Audiomack profile link
  };
  distributor?: string; // Name of the artist's music distributor (e.g., TuneCore, DistroKid)
  streamingAnalytics?: string; // URL or document showing streaming performance analytics
  pastRevenueReports?: string; // URL of past revenue statements from streaming platforms

  // Investment & Royalty Details
  royaltyGoal: number; // Target amount of money the artist wants to raise through royalties
  royaltyDuration: number; // Duration (in months) for which investors earn royalties
  revenueSharePercentage: number; // Percentage of revenue that will be shared with investors
  fundingStatus: "pending" | "active" | "completed" | "failed"; // Status of the royalty funding process

  // Legal & Copyright Documents
  copyrightOwnershipProof?: string; // URL of document proving ownership of music rights
  labelOrDistributorContracts?: string; // URL of contracts with record labels or music distributors

  createdAt: Date; // Timestamp for when the artist was added
  updatedAt: Date; // Timestamp for when artist details were last updated
}

const RoyaltyArtistSchema = new Schema<IRoyaltyArtist>(
  {
    fullName: { type: String, required: true },
    stageName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    country: { type: String, required: true },
    biography: { type: String, required: true },
    profilePicture: { type: String, required: true },
    bannerImage: { type: String },

    // Verification
    governmentID: { type: String, required: true },
    proofOfAddress: { type: String, required: true },
    
    // Social Media
    socialMediaLinks: {
      instagram: { type: String },
      twitter: { type: String },
      youtube: { type: String },
      tiktok: { type: String },
    },

    // Music Data
    musicLinks: {
      spotify: { type: String },
      appleMusic: { type: String },
      soundcloud: { type: String },
      audiomack: { type: String },
    },
    distributor: { type: String },
    streamingAnalytics: { type: String },
    pastRevenueReports: { type: String },

    // Royalty Info
    royaltyGoal: { type: Number, required: true },
    royaltyDuration: { type: Number, required: true },
    revenueSharePercentage: { type: Number, required: true },
    fundingStatus: {
      type: String,
      enum: ["pending", "active", "completed", "failed"],
      default: "pending",
    },

    // Legal Documents
    copyrightOwnershipProof: { type: String },
    labelOrDistributorContracts: { type: String },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const RoyaltyArtist = mongoose.model<IRoyaltyArtist>("RoyaltyArtist", RoyaltyArtistSchema);

export default RoyaltyArtist;
