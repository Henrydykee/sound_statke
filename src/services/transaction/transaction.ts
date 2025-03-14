import { Transaction } from "../../models/transaction";


export const createTransaction = async (userId: string, amount: number, currency: string, type: string) => {
  return await Transaction.create({ userId, amount, currency, type });
};

export const getTransactionHistory = async (userId: string, limit = 10) => {
  return await Transaction.find({ userId }).sort({ createdAt: -1 }).limit(limit);
};
