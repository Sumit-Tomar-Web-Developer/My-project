import express from "express";
import {
  deleteBankMasterInfo,
  getBankMasterInfo,
 saveBankMasterInfo,
} from "../../controllers/master/bankMasterController.js";



const router = express.Router();

router.get("/fetchBankInfo", getBankMasterInfo);
router.post("/saveBankInfo", saveBankMasterInfo);
router.post("/deleteBankInfo", deleteBankMasterInfo);



export default router;