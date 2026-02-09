import express from 'express';
import {
  getFactorInfo,
  saveFactorInfo,
  saveMinRVParameter, applyPolicy
} from '../../controllers/utility/setPoliciesController.js';

const router = express.Router();

router.get('/getfactorinfo', getFactorInfo);
router.post('/updatefactorinfo', saveFactorInfo);
router.post('/saveMinRVParameter', saveMinRVParameter)
router.post('/applyPolicy', applyPolicy)
export default router;
