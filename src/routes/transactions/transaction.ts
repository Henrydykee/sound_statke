

import express from "express";
import { authenticateUser } from "../../middleware/authMiddleware";
import { fundUserWallet, getBalance, getTransactionHistory } from "../../controllers/transactions/transaction";


const transactionRoutes = express.Router();

transactionRoutes.get("/wallet/balance", authenticateUser, getBalance);
transactionRoutes.post("/wallet/fund", authenticateUser, fundUserWallet);
transactionRoutes.get("", authenticateUser, getTransactionHistory);

export default transactionRoutes;
