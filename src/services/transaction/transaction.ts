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

  // // Simulate processing logic (e.g., checking balance, external API call)
  // try {
  //   if (type === TransactionType.WITHDRAW) {
  //     const hasFunds = await checkUserBalance(userId, amount);
  //     if (!hasFunds) {
  //       transaction.status = TransactionStatus.FAILED;
  //       await transaction.save();
  //       return transaction;
  //     }
  //   }

  //   // Process the transaction successfully
  //   transaction.status = TransactionStatus.COMPLETED;
  //   await transaction.save();
  // } catch (error) {
  //   transaction.status = TransactionStatus.FAILED;
  //   await transaction.save();
  // }

  return transaction;
};


export const getTransactionHistory = async (userId: string, limit = 10) => {
  return await Transaction.find({ userId }).sort({ createdAt: -1 }).limit(limit);
};
