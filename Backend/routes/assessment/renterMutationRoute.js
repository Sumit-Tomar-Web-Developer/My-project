import express from 'express';
import {
  getRenterMutationDataByOwnerID,
  saveRenterMutationInfo,
} from '../../controllers/assessment/renterMutationController.js';

const router = express.Router();
router.post('/renter-mutation-details', getRenterMutationDataByOwnerID);
router.post('/save-renter-mutation-details', saveRenterMutationInfo);

export default router;
