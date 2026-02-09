import express from 'express';
import {
  fetchAppealPropertyMastColumns,
  fetchBillBookColumns,
  fetchOldPropertyMastColumns,
  fetchPropertyDetailsNewColumns,
  fetchPropertyMastColumns,
  fetchTaxPendingColumns,
  fetchTransMastColumns,
  getAdvanceCollectionByOwner,
  getAppealDataByColumns,
  getCurrentCollectionByOwner,
  getCurrentDemandByOwner,
  getGhoshwaraOwnerwiseFull,
  getMiscellaneousFeeByOwner,
  getNewFloorDataByColumns,
  getOldPropertyDataByColumns,
  getOutstandingCurrentBalanceByOwner,
  getOutstandingPendingBalanceByOwner,
  getOutstandingTotalBalance,
  getOwnerIDsByWardAndPropertyType,
  getPendingCollectionByOwner,
  getPendingDemandByOwner,
  getPropertyMastColumnsByOwner,
  getTotalCollectionByOwner,
  getTotalDemandByOwner,
} from '../../controllers/report/propertyWiseController.js';

const router = express.Router();

router.get('/property-columns', fetchPropertyMastColumns);
router.get('/old-property-columns', fetchOldPropertyMastColumns);
router.get('/property-details-new-columns', fetchPropertyDetailsNewColumns);
router.get('/appeal-mast-columns', fetchAppealPropertyMastColumns);
router.get('/bill-book-columns', fetchBillBookColumns);
router.get('/trans-mast-columns', fetchTransMastColumns);
router.get('/tax-pending-columns', fetchTaxPendingColumns);
router.post('/ownerid-list-for-report-gen', getOwnerIDsByWardAndPropertyType);
router.post('/get-current-demand', getCurrentDemandByOwner);

router.post('/get-property-mast-coulmns', getPropertyMastColumnsByOwner);

router.post('/fetch-appeal-data', getAppealDataByColumns);
router.post('/fetch-old-property-data', getOldPropertyDataByColumns);
router.post('/fetch-property-details-new-data', getNewFloorDataByColumns);

router.post('/get-current-demand', getCurrentDemandByOwner);
router.post('/get-pending-demand', getPendingDemandByOwner);
router.post('/get-total-demand', getTotalDemandByOwner);

router.post('/get-current-collection', getCurrentCollectionByOwner);
router.post('/get-pending-collection', getPendingCollectionByOwner);
router.post('/get-total-collection', getTotalCollectionByOwner);

router.post(
  '/get-outstanding-current-balance',
  getOutstandingCurrentBalanceByOwner
);
router.post(
  '/get-outstanding-pending-balance',
  getOutstandingPendingBalanceByOwner
);

router.post('/get-outstanding-total-balance', getOutstandingTotalBalance);

router.post('/get-advance-collection', getAdvanceCollectionByOwner);

router.post('/get-miscellaneous-fee', getMiscellaneousFeeByOwner);

router.post('/get-ghosehwara', getGhoshwaraOwnerwiseFull);

export default router;
