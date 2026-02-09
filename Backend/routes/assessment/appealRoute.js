import express from 'express';
import { getAppealInfoAll, getFinancialYear, getOwnerAppealRentalSum, getOwnerCourtRentalSum, getOwnerHearingRentalSum, getOwnerRateableSum, getOwnerRetainRentalSum, getOwnerTaxes, getPoliciesInfo, getRetaintionFactor, getTaxName , getTaxRateByRV, getValuationData, postAppealInfoAll, resetAppealMast } from '../../controllers/assessment/appealController.js';


const router = express.Router();
router.get('/policiesInfo', getPoliciesInfo);
router.get('/financialYear', getFinancialYear)
router.get('/retainFactors', getRetaintionFactor)
router.get('/appealInfoAll/:OwnerId', getAppealInfoAll)
router.get('/taxName', getTaxName)
router.post('/applyProliciesInfo' , postAppealInfoAll)
// router.get("/initial/:ownerId", getInitialInfo);
router.post('/getRate',getTaxRateByRV)
router.post('/ownerTaxes', getOwnerTaxes);

router.post('/rv',getOwnerRateableSum)
router.post('/getNetValuation', getValuationData);
router.post('/hearingRv', getOwnerHearingRentalSum)
router.post('/courtRv', getOwnerCourtRentalSum)
router.post('/RetainRv', getOwnerRetainRentalSum)
router.post('/appealRv', getOwnerAppealRentalSum)

router.post('/resetAppeal', resetAppealMast)

export default router;
