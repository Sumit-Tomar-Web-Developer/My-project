import express from 'express';
import { uploadFolder, deleteImages, getImages } from '../../controllers/utility/uploadPhotoAndPlanController.js';

const router = express.Router();


router.post('/uploadPhotoAndPlan', uploadFolder);
router.post('/deletePhotoAndPlan', deleteImages);
router.post('/getPhotoAndPlan', getImages);
export default router;