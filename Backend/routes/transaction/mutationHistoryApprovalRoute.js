
import express from 'express';
import { createSendToApproval, getFerfarDocumentsByOwnerID, getMutationComparisonChanges, getMutationPendingRequests, saveApprovedRequest, saveDisApprovedRequest, searchMutationRequest, uploadMutationApprovalFerFarDocuments } from '../../controllers/transaction/mutationHistoryApprovalController.js';
import { uploadFerFarMutation } from '../../config/ferfarmulter.js';


const router=express.Router();

router.post('/approval-version', createSendToApproval);
router.get('/get-pending-requests', getMutationPendingRequests);
router.post('/mutation-comparision', getMutationComparisonChanges);
router.post('/upload-ferfar-mutation-doc',uploadFerFarMutation,uploadMutationApprovalFerFarDocuments);
router.post('/approved-request', saveApprovedRequest);
router.post('/disapproved-request', saveDisApprovedRequest);
router.post('/search-mutation-request',searchMutationRequest);
router.post("/get-ferfar-documents",getFerfarDocumentsByOwnerID);


export default router;


