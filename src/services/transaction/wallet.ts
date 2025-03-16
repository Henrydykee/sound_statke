import { Wallet } from "../../models/transaction";
import { convertCurrency } from "../../utils/curencyConverter";
import { redisClient } from "../../utils/redisClient";



export const getWalletBalance = async (userId: string) => {
  const cacheKey = `wallet:${userId}`;
  
  const cachedBalance = await redisClient.get(cacheKey);
  if (cachedBalance) {
    return JSON.parse(cachedBalance);
  }


  let wallet = await Wallet.findOne({ userId });

  if (!wallet) {
    wallet = new Wallet({
      userId,
      balanceUSD: 0,
    });
    await wallet.save();
  }

  const balance = {
    balanceUSD: wallet.balanceUSD,
    balanceNGN: convertCurrency(wallet.balanceUSD, "USD", "NGN"),
  };

  await redisClient.setex(cacheKey, 300, JSON.stringify(balance));

  return balance;
};


export const fundWallet = async (userId: string, amount: number, currency: string) => {
  const cacheKey = `wallet:${userId}`;

  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = await Wallet.create({ userId, balanceUSD: 0, balanceNGN: 0 });
  }

  if (currency === "USD") {
    wallet.balanceUSD += amount;
    wallet.balanceNGN += convertCurrency(amount, "USD", "NGN");
  } else if (currency === "NGN") {
    wallet.balanceNGN += amount;
    wallet.balanceUSD += convertCurrency(amount, "NGN", "USD");
  } else {
    throw new Error("Invalid currency");
  }

  await wallet.save();

  // Update Redis Cache
  const newBalance = {
    balanceUSD: wallet.balanceUSD,
    balanceNGN: convertCurrency(wallet.balanceUSD, "USD", "NGN"),
  };
  await redisClient.setex(cacheKey, 300, JSON.stringify(newBalance));

  return wallet;
};
