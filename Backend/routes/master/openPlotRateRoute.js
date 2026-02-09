import express from 'express'
import { deleteOpenPlotRateInfo, getOpenPlotRateInfo, saveOpenPlotRateInfo } from '../../controllers/master/openPlotRateController.js';
const router = express.Router();
router.get('/fetchOpenPlotRate', getOpenPlotRateInfo);
router.post('/saveOpenPlotRate', saveOpenPlotRateInfo);
router.post('/deleteOpenPlotRate', deleteOpenPlotRateInfo);
export default router