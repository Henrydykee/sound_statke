

import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  balanceUSD: number;
  balanceNGN: number;
}

const WalletSchema = new Schema<IWallet>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balanceUSD: { type: Number, default: 0 },
    balanceNGN: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Wallet = mongoose.model<IWallet>("Wallet", WalletSchema);



export enum TransactionType {
  FUND = "fund",
  WITHDRAW = "withdraw",
  INVEST = "invest",
}


export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export interface ITransaction extends Document {
  transactionId: string; // Unique transaction ID
  userId: mongoose.Types.ObjectId; // Reference to the user making the transaction
  amount: number; // Transaction amount
  currency: "USD" | "NGN"; // Currency of the transaction
  type: "fund" | "withdraw" | "invest"; // Type of transaction
  status: TransactionStatus; // Transaction status
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    transactionId: { 
      type: String, 
      unique: true, 
      default: () => uuidv4() // Generate a unique ID for each transaction
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ["USD", "NGN"], required: true },
    type: { type: String, enum: ["fund", "withdraw", "invest"], required: true },
    status: { type: String, enum: Object.values(TransactionStatus), default: TransactionStatus.PENDING },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>("Transaction", TransactionSchema);
  