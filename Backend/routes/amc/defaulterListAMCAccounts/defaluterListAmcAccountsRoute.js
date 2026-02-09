import express from 'express';
import { fetchGetProperties,sendToAll,sendToSelected,exportToExcel,importFromExcel } from '../../../controllers/amc/defaluterListAMCAccounts/defaluterListAMCAccountsController.js';

const router = express.Router();

router.post('/fetch-get-Properties',fetchGetProperties);
router.post('/send-to-all',sendToAll);
router.post('/send-to-selected',sendToSelected);
router.get('/import-from-excel',importFromExcel);
router.post('/export-to-excel',exportToExcel);

export default router;
