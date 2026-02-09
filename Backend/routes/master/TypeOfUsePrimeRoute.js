import express from 'express';
import { deletePrimeTypeOfUseInfo, getPrimeTypeOfUseInfo, savePrimeTypeOfUseInfo } from '../../controllers/master/TypeOfUsePrimeController.js';

const router = express.Router();
router.get('/fetchPrimeTypeOfUse', getPrimeTypeOfUseInfo);
router.post('/savePrimeTypeOfUse', savePrimeTypeOfUseInfo);
router.delete('/deletePrimeTypeOfUse', deletePrimeTypeOfUseInfo);
export default router;
