import express from 'express';
import { FetchOwnerIdsAndOtherDetails } from '../../controllers/commonOperation.js';
import { postPropertyDetails } from '../../controllers/utility/DataEntrySameAsController.js';

const router = express.Router();

router.post(
  '/data-entry-same-as-property-details',
  FetchOwnerIdsAndOtherDetails
);
router.post('/apply-data-entry', postPropertyDetails);

export default router;
