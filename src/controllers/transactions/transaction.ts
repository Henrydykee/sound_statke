
import { Request, Response } from "express";
import { errorHandler } from "../../utils/errorHandler";
import {  getWalletBalance, fundWallet } from "../../services/transaction/wallet";
import { AuthRequest } from "../../types/types";
import { createTransaction, } from "../../services/transaction/transaction";
import { Transaction, TransactionType } from "../../models/transaction";
import { errorResponse, successResponse } from "../../utils/response";



export const getBalance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json(errorResponse("Unauthorized."));
    }

    const balance = await getWalletBalance(userId);
    res.status(200).json(successResponse("Balance fetched successfully.", { balance }));
  } catch (error) {
    console.error("Error fetching balance:", error);
    res.status(500).json(errorResponse("Server error. Please try again later."));
  }
};

export const fundUserWallet = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, currency } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json(errorResponse("Unauthorized."));
    }
    if (!amount || !currency) {
      return res.status(400).json(errorResponse("Amount and currency are required."));
    }

    const wallet = await fundWallet(userId, amount, currency);
    await createTransaction(userId, amount, currency, TransactionType.FUND);

    res.status(200).json(successResponse("Wallet funded successfully.", { wallet }));
  } catch (error) {
    console.error("Error funding wallet:", error);
    res.status(500).json(errorResponse("Server error. Please try again later."));
  }
};

export const getTransactionHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json(errorResponse("Unauthorized."));
    }

    const { page = 1, limit = 10, type } = req.query;

    const query: any = { userId };
    if (type && Object.values(TransactionType).includes(type as TransactionType)) {
      query.type = type;
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Transaction.countDocuments(query);

    res.status(200).json(successResponse("Transaction history fetched successfully.", {
      transactions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    }));
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json(errorResponse("Server error. Please try again later."));
  }
};
