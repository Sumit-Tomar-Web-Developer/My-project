import express from 'express';
import { createInvoice, getBillBookEntriesByYearRange, getBillBookYear, getInvoiceStatusByInvoiceNo } from '../../../controllers/amc/setRemarkInvoiceController/setRemmarkInvoiceController.js';

const router = express.Router();


// Route to get all bill book entries
router.get('/fetchYearRangeBillBook', getBillBookYear);
router.post('/fetchInvoiceStatus', getInvoiceStatusByInvoiceNo);

router.post('/billbook/yearReceiptNo', getBillBookEntriesByYearRange);
router.post('/insertCreateInvoice', createInvoice);
export default router;