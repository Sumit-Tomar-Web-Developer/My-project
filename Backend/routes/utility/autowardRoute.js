import express from "express";
import { getPropertyListByWard, saveAutoWard, saveAutoWardOblique } from "../../controllers/utility/autoWard.js";



const router = express.Router();

router.post("/autoWard", saveAutoWard);
router.post("/autoOblique", saveAutoWardOblique);

router.post("/list", getPropertyListByWard);


export default router;