import express from "express";
import { createDDChequeTransaction, getChequeHistoryData, getChequeTransactionData, getOwnerByZoneWard, getWardByZone, getZoneSectionList, updateChequeStatus } from "../../../controllers/transaction/ddChequeController/ddChequeController.js";
const router = express.Router();

router.get('/zoneSectionWard', getZoneSectionList);
router.post('/zoneSectionFetchWard', getWardByZone);
router.post('/wardWiseOwnerId', getOwnerByZoneWard);
router.post('/chequeAndDate', getChequeTransactionData);
router.post('/insertChequeAndDate', updateChequeStatus);

router.post('/ddChequeHistory', createDDChequeTransaction);

router.post('/ddChequeHistoryFetch', getChequeHistoryData);



export default router;