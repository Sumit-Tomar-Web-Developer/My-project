import express from 'express';
import { getRoleById } from '../../controllers/amc/userRole.js';
import { getYear } from '../../controllers/amc/billBookEntry/transYearMastBill.js';


const router = express.Router();
router.get('/role', getRoleById);
router.get('/yearTrans', getYear);


export default router;