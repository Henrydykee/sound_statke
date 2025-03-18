import { Transaction, TransactionStatus, TransactionType } from "../../models/transaction";




export const createTransaction = async (
  userId: string,
  amount: number,
  currency: string,
  type: TransactionType
) => {
  const transaction = await Transaction.create({
    userId,
    amount,
    currency,
    type,
    status: TransactionStatus.PENDING, // Default to pending
  });
  return transaction;
};


export const getTransactionHistory = async (userId: string, limit = 10) => {
  return await Transaction.find({ userId }).sort({ createdAt: -1 }).limit(limit);
};
