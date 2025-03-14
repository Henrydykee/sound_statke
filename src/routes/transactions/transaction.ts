

import express from "express";
import { authenticateUser } from "../../middleware/authMiddleware";
import { fundUserWallet, getBalance } from "../../controllers/transactions/transaction";


const router = express.Router();

router.get("/wallet/balance", authenticateUser, getBalance);
router.post("/wallet/fund", authenticateUser, fundUserWallet);

export default router;
