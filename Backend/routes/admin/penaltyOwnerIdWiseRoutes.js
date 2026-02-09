import express from 'express';
import {
  ApplyPenaltyTaxByOwnerIdWise,
  getSearchedProperties,
} from '../../controllers/admin/penaltyOwnerIdWise/penaltyOwnerIdWiseController.js';

const router = express.Router();

router.post('/searched-properties', getSearchedProperties);
router.post('/penalty-owner-id-wise', ApplyPenaltyTaxByOwnerIdWise);

export default router;
