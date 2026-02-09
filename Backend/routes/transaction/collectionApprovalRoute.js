import express from "express";
const router = express.Router();
import { getCollectionApprovalData,deleteCollection } from "../../controllers/transaction/collectionApproval.js";

router.post('/collection-approvalData', getCollectionApprovalData);
router.post('/delete-collection', deleteCollection);
export default router;