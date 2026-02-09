import express from 'express';
import { deleteFloorType, deleteOldType, fetchFloors, floorMaster, floorMasterOld, oldfetchFloors } from '../../controllers/master/floorMaster.js';
const router = express.Router();
//new
router.post('/floor-master-new', floorMaster);
router.get('/floors-new', fetchFloors);
router.post('/floors-new-delete', deleteFloorType);
//old floorMasterOld
router.post('/floor-master-old', floorMasterOld);
router.get('/floors-old', oldfetchFloors);
router.post('/floors-old-delete', deleteOldType);
export default router;