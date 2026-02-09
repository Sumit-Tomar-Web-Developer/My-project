import express from "express";
import { getMutationReportData } from "../../controllers/report/mutationHistoryController.js";



const router = express.Router();

router.post("/getMutationHistoryData", getMutationReportData);



export default router;