import { Transaction } from "../../models/transaction";


export enum TransactionType {
  FUND = "fund",
  WITHDRAW = "withdraw",
  INVEST = "invest",
}

export const createTransaction = async (
  userId: string,
  amount: number,
  currency: string,
  type: TransactionType
) => {
  return await Transaction.create({ userId, amount, currency, type });
};

export const getTransactionHistory = async (userId: string, limit = 10) => {
  return await Transaction.find({ userId }).sort({ createdAt: -1 }).limit(limit);
};
