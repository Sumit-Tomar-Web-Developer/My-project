import express from 'express';
import {
  calculateCurrentPenalty,
  calculatePendingPenalty,
  fetchOldOwnerIdsAndDetails,
  fetchOldWardBasedProperties,
  fetchOldWardNumbers,
  GetBankList,
  getBillBookNumbers,
  getDiscountPercentage,
  getMinorInfo,
  getNextInvoiceController,
  getOrderedTaxAliases,
  getOutstandingCurrentBalancePaymentDetails,
  getOutstandingPendingBalancePaymentDetails,
  GetPaymentModes,
  getPropertyInfo,
  getReceiptByOwner,
  saveBillTransactionDetails,
  saveMinorInfo,
  wardBasedProperties,
} from '../../../controllers/payment/offlinePayment/offlinePaymentController.js';

const router = express.Router();

router.post('/search-property-offline-payment', getPropertyInfo);
router.post('/minor-info-by-id', getMinorInfo);
router.post(
  '/current-balance-year-wise',
  getOutstandingCurrentBalancePaymentDetails
);
router.post('',wardBasedProperties)
router.post(
  '/pending-balance-year-wise',
  getOutstandingPendingBalancePaymentDetails
);
router.post('/ward-base-properties',wardBasedProperties)
router.post('/old-ward-base-properties',fetchOldWardBasedProperties)

router.get('/ordered-tax-aliases', getOrderedTaxAliases);
router.post("/save-minor-info", saveMinorInfo);
router.post("/billbook-numbers", getBillBookNumbers);
router.post('/save-payment-details',saveBillTransactionDetails)
router.post('/calculate-current-penalty', calculateCurrentPenalty);
router.post('/calculate-pending-penalty', calculatePendingPenalty);
router.post("/generate-invoice-no", getNextInvoiceController);
router.post("/get-offline-receipt", getReceiptByOwner);
router.post("/get-discount-percentage", getDiscountPercentage);
router.get("/get-payment-modes", GetPaymentModes);
router.get('/get-bank-names', GetBankList);

router.get('/old-wards', fetchOldWardNumbers);
router.post('/old-properties-by-old-ward', fetchOldOwnerIdsAndDetails);








export default router;
