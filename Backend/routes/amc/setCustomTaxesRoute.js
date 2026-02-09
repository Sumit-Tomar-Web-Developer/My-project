import express from 'express';
import {
  getOwnerDetailsAndCustomTaxesByOwnerID,
  SaveCustomTaxes,
  GetPendingTaxStatus,
} from '../../controllers/amc/setCustomTaxes/setCustomTaxesController.js';

const router = express.Router();

router.post('/getCustomTaxesByOwnerId', getOwnerDetailsAndCustomTaxesByOwnerID);
router.post('/saveCustomTaxes', SaveCustomTaxes);
router.post('/getCustomTaxStatusByYear', GetPendingTaxStatus);
export default router;
