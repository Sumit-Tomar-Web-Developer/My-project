import express from "express";
import { getReportData } from "../../controllers/report/adminReportController.js";
import { getUserLoginHistory } from "../../controllers/auth/authController.js";



const router = express.Router();

router.post("/getAdminReportData", getReportData);

router.post("/user-activity-log", getUserLoginHistory);



export default router;