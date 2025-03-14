
import { Request, Response } from "express";
import { errorHandler } from "../../utils/errorHandler";
import {  getWalletBalance, fundWallet } from "../../services/transaction/wallet";
import { AuthRequest } from "../../types/types";
import { createTransaction } from "../../services/transaction/transaction";



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

    await createTransaction(userId ?? "", amount, currency, "deposit");

    res.status(200).json({ message: "Wallet funded successfully", wallet });
  } catch (error) {
    errorHandler(res, error);
  }
};
