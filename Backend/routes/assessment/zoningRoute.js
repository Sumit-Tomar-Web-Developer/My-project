import express from 'express';
import { getOwnerDetailsByID, updatePropertyZone, updatePropertyZoneYearWise } from '../../controllers/assessment/zoningController.js';

const router = express.Router();
router.post('/updateZone', updatePropertyZone)
router.post('/updateYearWiseZone', updatePropertyZoneYearWise)
router.post('/owneridWiseWard', getOwnerDetailsByID)


export default router;