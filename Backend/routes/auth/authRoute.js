import express from 'express';
import { forgotPassword, getUserLoginHistory, login, logoutUser, resetPassword } from '../../controllers/auth/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logoutUser);
router.post('/reset-password', resetPassword);
router.post('/forgot-password', forgotPassword);



export default router;
