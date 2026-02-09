import express from 'express';
import { getDemandAnalysisData, applyAppeal, getOwnersForAutoHearingAppComm,setAutoHearingAppealRatioWise } from '../../controllers/admin/autoHearingAppealComm/autoHearingAppealCommController.js';

const router = express.Router();

router.post('/demand-analysis', getDemandAnalysisData);
router.post('/getOwnersForAutoHearingAppComm', getOwnersForAutoHearingAppComm);
router.post('/apply-appeal', applyAppeal);
router.post('/apply-hearing-appeal',setAutoHearingAppealRatioWise)
export default router;
