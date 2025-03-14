
import { Request, Response } from "express";
import { errorHandler } from "../../utils/errorHandler";
import {  getWalletBalance, fundWallet } from "../../services/transaction/wallet";
import { AuthRequest } from "../../types/types";
import { createTransaction, TransactionType } from "../../services/transaction/transaction";
import { Transaction } from "../../models/transaction";



export const getBalance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const balance = await getWalletBalance(userId ?? "");

    res.status(200).json({ message: "Balance fetched successfully", balance });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const fundUserWallet = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, currency } = req.body;
    const userId = req.user?.id;

    const wallet = await fundWallet(userId ?? "", amount, currency);

    await createTransaction(userId ?? "", amount, currency, TransactionType.FUND);

    res.status(200).json({ message: "Wallet funded successfully", wallet });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getTransactionHistory = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id; // Ensure auth middleware attaches user
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const { page = 1, limit = 10, type } = req.query;
  
      const query: any = { userId };
  
      if (type && Object.values(TransactionType).includes(type as TransactionType)) {
        query.type = type;
      }
  
      const transactions = await Transaction.find(query)
        .sort({ createdAt: -1 }) // Newest transactions first
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));
  
      const total = await Transaction.countDocuments(query);
  
      res.status(200).json({
        transactions,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  };
