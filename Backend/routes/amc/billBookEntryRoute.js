import express from 'express';
import { createOrUpdateBillBookEntry, deleteBillBookEntry, getBillBookEntries } from '../../controllers/amc/billBookEntry/billBookEntryController.js';

const router = express.Router();

// Route to create or update a bill book entry
router.post('/upsetBillBook', createOrUpdateBillBookEntry);

// Route to get all bill book entries
router.get('/fetchBillBookEntry', getBillBookEntries);

// Route to delete a specific bill book entry by ID
router.delete('/deleteBillBook/:id', deleteBillBookEntry);

export default router;
