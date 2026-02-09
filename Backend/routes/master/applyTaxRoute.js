import express from "express";
import {
  OwnerIdByWard,
  SaveOrUpdateAppliedTaxes,
  fetchAllOwnerIds,
  getApplyTaxesByOwner,
  getAssessmentIdForOwner,
} from "../../controllers/master/applyTaxController.js";

const router = express.Router();
router.post("/apply-taxes", SaveOrUpdateAppliedTaxes);
router.get("/all-owner-ids", fetchAllOwnerIds);
router.get("/assesment-id-for-owner", getAssessmentIdForOwner);
router.get("/ward-owner-id/:NewWardNo", OwnerIdByWard);
router.post("/fetch-apply-taxes", getApplyTaxesByOwner);

export default router;
