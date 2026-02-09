import express from 'express';
const router = express.Router();
import { getPendingPayments, approvePayment, disapprovePayment,getPaymentProof,getFilterPaymentList } from '../../controllers/transaction/taxPaymentApproval.js';

router.get('/getPendingPayments', getPendingPayments);
router.post('/approvePayment', approvePayment);
router.post('/disapprovePayment', disapprovePayment);
router.post('/getPaymentProof', getPaymentProof);
router.post('/getFilteredPaymentList', getFilterPaymentList); // Reusing getPendingPayments for filtered list

export default router;                                         