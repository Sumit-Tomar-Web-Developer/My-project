import express from 'express';
import { deleteRateMasterInfo, getRateMasterByYearTypeZones, getRateMasterInfo, saveRateMasterInfo ,fetchRangeForType} from '../../controllers/master/rateMasterController.js';

const router = express.Router();
router.get('/fetchRateMasterInfo', getRateMasterInfo);
 router.post('/saveRateMasterInfo', saveRateMasterInfo);
 router.delete('/deleteRateMasterInfo', deleteRateMasterInfo);
 router.post('/getRateMaster', getRateMasterByYearTypeZones);
 router.get('/fetchRangeForType',fetchRangeForType)

export default router;