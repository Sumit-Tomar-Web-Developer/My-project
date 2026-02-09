import express from "express";
import { getDailyCollectionReportData } from "../../controllers/report/dailyCollectionController.js";



const router = express.Router();

router.post("/getDailyCollectionData", getDailyCollectionReportData);



export default router;