import {
  getAllWards,
  getOwnerIdByWardPropPartNo,
  getPropPartNoFromWard,
  getPropertyNoFromWard,
  postWardSelection,
  postOwnerIdSelection,
  getAssessmentInfo,
  fetchOwnerDetailsByWdAndProp,
  getPageIdByPageName,
  getOldPropertyNoByOldWard,fetchPropertyOwner
} from '../../controllers/commonOperation.js';

import express from 'express';

const router = express.Router();

router.get('/ward', getAllWards);
router.get('/property-range/:NewWardNo', getPropertyNoFromWard);
router.get('/prop-part/:NewWardNo', getPropPartNoFromWard);
router.get('/OwnerInfoByWdPropPartNo', getOwnerIdByWardPropPartNo);
router.post('/ward-selection', postWardSelection);
router.post('/mutation-details-history', postOwnerIdSelection);
router.get('/assessment-info', getAssessmentInfo);
router.post('/OwnerDetailsByWdAndProp', fetchOwnerDetailsByWdAndProp);
router.post('/pageId-by-pageName', getPageIdByPageName);
router.post('/getPropertyByOldWardNo', getOldPropertyNoByOldWard)
router.post('/fetchPropertyOwner',fetchPropertyOwner);


export default router;
