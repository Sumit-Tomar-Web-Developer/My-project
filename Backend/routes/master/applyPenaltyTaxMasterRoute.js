import express from "express"
import { getApplyTaxPenaltyMasterList , patchApplyPenaltyTaxPrime } from "../../controllers/master/applyPenaltyTaxesMasterController.js"

const router = express.Router()
router.get('/apply-tax-penalty-list' , getApplyTaxPenaltyMasterList)
router.patch('/add-update-tax-penalty-list' , patchApplyPenaltyTaxPrime)

export default router