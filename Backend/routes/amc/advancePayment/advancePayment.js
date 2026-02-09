import express from 'express';
import { getCurrentTaxes, saveAdvancePayment } from '../../../controllers/amc/advancePayment/advancePayment.js';

const router =express.Router();

router.post('/current-taxes',getCurrentTaxes);
router.post('/save-advance-payment', saveAdvancePayment);

export default router;