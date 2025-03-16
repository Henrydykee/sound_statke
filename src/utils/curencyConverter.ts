
const EXCHANGE_RATE = 1500; // USD to NGN rate

export const convertCurrency = (amount: number, from: string, to: string): number => {
  if (from === "USD" && to === "NGN") {
    return amount * EXCHANGE_RATE;
  }
  if (from === "NGN" && to === "USD") {
    return amount / EXCHANGE_RATE;
  }
  return amount;
};
