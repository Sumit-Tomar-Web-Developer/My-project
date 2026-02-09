import express from "express";
import { getCompareStatementResult } from "../../controllers/report/demandAnalysis.js";



const router = express.Router();

router.post("/getCompareStatementResult", getCompareStatementResult);



export default router;