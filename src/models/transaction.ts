

import mongoose, { Schema, Document } from "mongoose";

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



interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number;
    currency: "USD" | "NGN";
    type: "deposit" | "withdrawal";
    createdAt: Date;
  }
  
  const TransactionSchema = new Schema<ITransaction>(
    {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      amount: { type: Number, required: true },
      currency: { type: String, enum: ["USD", "NGN"], required: true },
      type: { type: String, enum: ["deposit", "withdrawal"], required: true },
    },
    { timestamps: true }
  );
  
  export const Transaction = mongoose.model<ITransaction>("Transaction", TransactionSchema);
  