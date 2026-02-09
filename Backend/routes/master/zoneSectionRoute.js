import express from "express";
import { addWardToZone, deleteZoneSectionInfo, getZoneSectionInfo, saveZoneSectionInfo , getZoneSectionDetails} from "../../controllers/master/zoneSectionMasterController.js";



const router = express.Router();

router.get("/fetchZoneSection", getZoneSectionInfo);
router.get("/fetchZoneDetails", getZoneSectionDetails);
router.post("/saveZoneSection", saveZoneSectionInfo);
router.delete("/deleteZoneSection", deleteZoneSectionInfo);
router.post("/addWardToZoneSection", addWardToZone);



export default router;