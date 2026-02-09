import express from 'express';
import { deleteFactorInfo, getFactorInfo, saveFactorInfo } from '../../controllers/master/factorController.js';

const router = express.Router();
router.get('/factorInfoList', getFactorInfo);
router.post('/savefactorInfo', saveFactorInfo);
router.post('/deletefactorInfo', deleteFactorInfo);
export default router;
