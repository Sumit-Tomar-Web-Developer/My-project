import express from "express";
import { checkLevelPassword } from "../../controllers/commonOperationPassword.js";

const router = express.Router();
//common password
router.post("/password", checkLevelPassword);

export default router;