import express from "express";
import { getTaxNameList , postTaxNameList, deleteTaxName } from "../../controllers/master/taxNameMasterController.js";

const router = express.Router();

router.get("/fetchTaxNameList", getTaxNameList);
router.patch("/addUpdateTaxNameList", postTaxNameList);
router.delete("/deleteTaxNameList", deleteTaxName);

export default router;
