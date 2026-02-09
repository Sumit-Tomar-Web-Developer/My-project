import express from 'express';
import { deleteZone, fetchZones, zoneMaster } from '../../controllers/master/zoneMaster.js';
const router = express.Router();


router.post('/addZoneMaster', zoneMaster);
router.get('/fetchZones', fetchZones);
router.post('/deleteZone', deleteZone);
export default router;
