import express from 'express';
import { deleteOldTypeOfUseInfo, deleteTypeOfUseInfo, getOldTypeOfUseInfo, getTypeOfUseInfo, saveOldTypeOfUseInfo, saveTypeOfUseInfo } from '../../controllers/master/TypeOfUseController.js';

const router = express.Router();
router.get('/fetchTypeOfUse', getTypeOfUseInfo);
router.post('/saveTypeOfUse', saveTypeOfUseInfo);
router.post('/deleteTypeOfUse', deleteTypeOfUseInfo);
//old
router.get('/fetchOldTypeOfUse', getOldTypeOfUseInfo);
router.post('/saveOldTypeOfUse', saveOldTypeOfUseInfo);
router.post('/deleteOldTypeOfUse', deleteOldTypeOfUseInfo);

export default router;
