import express from 'express';
import { deleteTaxMasterInfo, getTaxMasterInfo, saveTaxMasterInfo } from '../../controllers/master/taxMasterController.js';
const router = express.Router();
router.get('/fetchTaxMasterInfo', getTaxMasterInfo);
router.post('/saveTaxMasterInfo', saveTaxMasterInfo);
router.delete('/deleteTaxMasterInfo', deleteTaxMasterInfo);
export default router;
