import express from "express";
import { getApprovalWardHistory, upsertApprovalWard } from "../../controllers/adminPanel/approvalAllocation/apprvalAllocation.js";



const router = express.Router();

router.get("/getAllocationhistory", getApprovalWardHistory);
router.post("/upsertallocationhistory", upsertApprovalWard);



export default router;