import express from 'express';
import { getBillBooks, getBillTransactionsByOwner, getInvoicesByBillBook, getMobileEmail, getTransferPropertyInfo, getZoneByWardAndProperty, saveOrUpdateBillTransaction, searchProperty } from '../../../controllers/payment/transferFee/transferFeeController.js';
const router = express.Router();
router.get('/billBookList', getBillBooks);
router.post('/invoiceFrombill',getInvoicesByBillBook)
router.post('/mobileEmail',getMobileEmail)
router.post('/filterName',getTransferPropertyInfo)
router.post('/upsertBillTrans',saveOrUpdateBillTransaction)
router.post('/zonelist',getZoneByWardAndProperty)
router.post('/SearchlistApproval',searchProperty)
router.post('/owner-is-wise-bill-trans',getBillTransactionsByOwner);

export default router;
