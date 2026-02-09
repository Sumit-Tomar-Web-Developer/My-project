import express from "express";
import { getPropertyImages } from "../../controllers/utility/imageDownloader.js";

const router=express.Router();

router.get('/getPropertyImages',getPropertyImages);

export default router;