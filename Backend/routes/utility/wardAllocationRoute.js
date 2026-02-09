import express from 'express';
import {
  getUserInfoById,
  getUsernames,
  getUsersWithAllocatedWard,
  saveOrUpdateAllocatedWards,
} from '../../controllers/utility/wardAllocationController.js';

const router = express.Router();

router.get('/users-ward-allocations', getUsernames);
router.get('/user-info/:id', getUserInfoById);
router.get('/users-with-allocatedwrads', getUsersWithAllocatedWard);
router.post('/save-ward-allocations', saveOrUpdateAllocatedWards);

export default router;
