import express from "express";
import { showReport } from "../../../controllers/amc/reportEngine/reportEngineController.js";

const router=express.Router();

router.use('/show-report',showReport);

export default router;