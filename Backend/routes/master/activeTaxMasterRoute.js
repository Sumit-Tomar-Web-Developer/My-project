import express from "express";
import {
  deleteActiveTaxesInfo,
  getActiveTaxesInfo,
  saveActiveTaxesInfo,
} from "../../controllers/master/activeTaxesController.js";



const router = express.Router();

router.get("/fetchActiveTaxes", getActiveTaxesInfo);
router.post("/saveActiveTaxes", saveActiveTaxesInfo);
router.post("/deleteActiveTaxes", deleteActiveTaxesInfo);



export default router;