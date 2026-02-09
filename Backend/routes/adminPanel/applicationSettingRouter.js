import express from 'express';
import { getApplicationSetting, resendOtp, saveApplicationSetting, sendOtp, verifyOtp } from '../../controllers/adminPanel/applicationSetting.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/upsertApplication', saveApplicationSetting);
router.get('/getApplication', getApplicationSetting);

export default router;