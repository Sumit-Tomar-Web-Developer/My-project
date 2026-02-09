import express from "express";
const router = express.Router()
import { getPaymentGatewayTransactionDetails, getPaymentGatewayAllTransactionDetails, approveTransaction, disApproveTransaction } from "../../controllers/transaction/approvalOnlineTransaction.js";
router.post('/GetPaymentGatewayTransactionDetails', getPaymentGatewayTransactionDetails);
router.post('/GetPaymentGatewayAllTransactionDetails', getPaymentGatewayAllTransactionDetails)
router.post('/approveTransaction', approveTransaction)
router.post('/disApproveTransaction', disApproveTransaction)

export default router;