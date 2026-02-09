import express from 'express';
import {
  getDistinctYears,
  getDepreciationRange,
  getConstructionType,
  addUpdateConstTypeRate,
  deleteDepData,
  getAllDeprMasterData,
  deleteDepDataById,
} from '../../controllers/master/depreciationController.js';

const router = express.Router();
router.get('/depreciation-year', getDistinctYears);
router.post('/depreciation-range', getDepreciationRange);
router.get('/construction-type', getConstructionType);
router.get('/depreciationmasters', getAllDeprMasterData);
router.patch('/add-update-rates', addUpdateConstTypeRate);
router.post('/delete-depreciation-rates', deleteDepData);
router.post('/delete-single-rate-range-wise', deleteDepDataById);

export default router;
