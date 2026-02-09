import express from "express";
import {getZoneList,fetchZoneWiseWardList,fetchPaymentResouceList,saveDiscountSlabEntries} from "../../controllers/admin/discountSlabMaster/discountSlabMaster.js";
const router=express.Router();

router.post("/zone-list",getZoneList);
router.post("/zonewise-ward-list",fetchZoneWiseWardList);
router.post("/payment-resource-list",fetchPaymentResouceList);
router.post("/save-discount-slab-entries",saveDiscountSlabEntries);
export default router;