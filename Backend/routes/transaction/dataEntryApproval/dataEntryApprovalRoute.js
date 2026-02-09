import express from "express";
import { copyTaxesToNextYear, createDataEntrySendToApproval, getDataEntryApprovPendingRequests, getFullRowHistoryByOwner, getOldPropertyDetailsHistory, getOldPropertyHistory, getOldTaxesHistory, getOwnerTaxCurrentBeforeAfter, getOwnerTaxPendingBeforeAfter, getPropertyHistoryByOwner, getPropertyImagesByOwner, getPropertyNewFloorDetailsHistory, getQuickApprovalStatus, getSocialDetailsHistory, getTaxPendingHistory, getTaxVersionHistory, getTransMastHistory, getWadhghatDocumentsByOwnerID, saveApprovedDataEntryRequest, saveDisApprovedDataEntryRequest, searchDataEntryApprovalRequest, uploadDataEntryApprovalDocuments } from "../../../controllers/transaction/dataEntryApproval/dataEntryApprovalController.js";
import { uploadDataEntryApproval } from "../../../config/dataEntryApprovalAmcMulter.js";
const router = express.Router()
router.post('/insert-data-entry-approval', createDataEntrySendToApproval);
router.post('/getTaxPending', getOwnerTaxPendingBeforeAfter);
router.post('/getTaxCurrent', getOwnerTaxCurrentBeforeAfter);
router.post('/changesTranstax', copyTaxesToNextYear);
router.post('/uploadDataEntryApprovaldoc',uploadDataEntryApproval,uploadDataEntryApprovalDocuments);
router.get('/get-pending-requests-data-entry', getDataEntryApprovPendingRequests);
router.post('/get-wadhghat-documents',getWadhghatDocumentsByOwnerID);
router.post('/approved-de-request', saveApprovedDataEntryRequest);
router.post('/disapproved-de-request', saveDisApprovedDataEntryRequest);
router.post('/search-dataEntryApproval-request',searchDataEntryApprovalRequest);

router.post('/get-property-mast-hist', getPropertyHistoryByOwner);
router.post('/get-join-details-hist', getFullRowHistoryByOwner);
router.post('/get-old-property-hist', getOldPropertyHistory);
router.post('/get-old-tax-hist', getOldTaxesHistory);
router.post('/get-social-details-hist', getSocialDetailsHistory);
router.post('/get-new-floor-hist', getPropertyNewFloorDetailsHistory);
router.post('/get-old-details-hist', getOldPropertyDetailsHistory);
router.post('/get-current-tax-hist', getTransMastHistory);
router.post('/get-pending-tax-hist', getTaxPendingHistory);
router.post('/transmastHistory',getTaxVersionHistory)
router.post('/image',getPropertyImagesByOwner)
router.post('/statusApproval',getQuickApprovalStatus)

export default router;