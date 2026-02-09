import express from "express";
import { getOwnersByWardAndPropertyDesc, getCurrentDemandByOwner, getPendingTaxByOwnerAndYear, getCurrentCollectionByOwner, getPendingCollectionByOwner, getCurrentBalanceByOwner, getMiscellaneousFeesByOwner, getAdvanceCollectionByOwner, getPendingBalanceByOwner } from "../../../controllers/report/WardWise/wardWiseController.js";



const router = express.Router();

router.post("/getWardPropDesc", getOwnersByWardAndPropertyDesc);
router.post("/getTransMast", getCurrentDemandByOwner);
 router.post("/getTransMastByYear", getPendingTaxByOwnerAndYear);
 router.post("/getBillCollection", getCurrentCollectionByOwner);
router.post("/getPendingCollection",getPendingCollectionByOwner)
router.post("/OutstandingCurrent", getCurrentBalanceByOwner);
router.post("/OutstandingPending", getPendingBalanceByOwner);

router.post("/miscellaneous", getMiscellaneousFeesByOwner);
router.post("/advanceCollection", getAdvanceCollectionByOwner);

export default router;