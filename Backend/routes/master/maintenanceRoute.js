import express from "express";
import {
  deleteMaintenanceInfo,
  getMaintenanceInfo,
  saveMaintenanceInfo,
} from "../../controllers/master/maintenanceController.js";



const router = express.Router();

router.get("/fetchMaintenance", getMaintenanceInfo);
router.post("/saveMaintenance", saveMaintenanceInfo);
router.delete("/deleteMaintenance", deleteMaintenanceInfo);



export default router;
