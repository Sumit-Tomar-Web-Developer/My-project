import express from 'express';
import { deleteYearInfo, getYearInfo, saveYearInfo } from '../../controllers/master/yearController.js';
const router = express.Router();
router.get('/fetchYearInfo', getYearInfo);
router.post('/saveYearInfo', saveYearInfo);
router.post('/deleteYearInfo', deleteYearInfo);
export default router;