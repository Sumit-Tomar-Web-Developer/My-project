import express from "express";
import { getApplyTaxPrimeList, patchApplyTaxPrime, getTypeOFUseMasterPrime,getTypeOFUseMaster } from "../../controllers/master/applyTaxMasterPrime.js";

const router = express.Router();
router.get("/apply-tax-prime-list", getApplyTaxPrimeList);
router.patch("/apply-tax-prime-update", patchApplyTaxPrime);
router.get('/type-of-use-master-prime', getTypeOFUseMasterPrime)
router.get('/type-of-use-master', getTypeOFUseMaster)
export default router;

