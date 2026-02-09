import express from "express";
import {
  deleteActiveYearInfo,
  getActiveYearInfo,
  saveActiveYearInfo,
} from "../../controllers/master/activeYearController.js";



const router = express.Router();

router.get("/fetchActiveYear", getActiveYearInfo);
router.post("/saveActiveYear", saveActiveYearInfo);
router.post("/deleteActiveYear", deleteActiveYearInfo);



export default router;