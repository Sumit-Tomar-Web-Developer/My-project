import express from "express";
import {
  fetchCombinedOwnerDetails,
  getPendingTaxes,
  getInterestAmounts,
  getBalancesheetData,
  cancelInvoiceNo,
  fetchAllBanks,
  fetchPaymentDetails,
  checkInvoiceStatus,
  checkDuplicateInvoice,
  saveTaxPayment,
  updateTaxPayment,
  deleteTaxPayment,
  fetchBillBookEntries,
  sendForApproval
} from "../../../controllers/amc/taxPayment/taxPayment.js";

const router = express.Router();

// Route to fetch OwnerDetails combined
router.post("/combinedOwnerDetails", fetchCombinedOwnerDetails);
router.post("/pending-taxes", getPendingTaxes);
router.post("/getInterestAmounts", getInterestAmounts);
router.post("/balancesheet-data", getBalancesheetData);
router.post("/cancel-invoice", cancelInvoiceNo);
router.get('/fetchAllBanks',fetchAllBanks);
router.post("/payment-details", fetchPaymentDetails);
router.post("/invoice-status",checkInvoiceStatus);
router.post("/duplicate-invoice",checkDuplicateInvoice);
router.post("/save-tax-payment", saveTaxPayment);
router.post("/update-tax-payment", updateTaxPayment);
router.post("/delete-tax-payment",deleteTaxPayment);
router.post("/bill-book-entries",fetchBillBookEntries);
router.post("/send-for-approval",sendForApproval);
export default router;
