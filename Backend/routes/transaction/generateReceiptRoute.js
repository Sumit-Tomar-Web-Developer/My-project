import express from "express";
const router = express.Router();

import { getYearlyBillBookList,getInvoiceList,getTransactionReceipt } from "../../controllers/transaction/generateReceipt.js";

router.post("/yearly-billbook-list", getYearlyBillBookList);
router.post("/invoice-list", getInvoiceList);
router.post("/transaction-receipt", getTransactionReceipt);
export default router;