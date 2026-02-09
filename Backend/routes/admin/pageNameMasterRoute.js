import express from 'express';
import {
  deletePageInfo,
  getPageNames,
  savePageName,
} from '../../controllers/admin/pageNameMaster/pageNameMasterController.js';

const router = express.Router();
router.get('/get-page-names', getPageNames);
router.post('/add-page-name', savePageName);
router.post('/delete-page-name', deletePageInfo);
export default router;
