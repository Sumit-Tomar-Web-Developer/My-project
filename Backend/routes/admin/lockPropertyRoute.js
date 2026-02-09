import express from 'express';
import {
  getLockedUnLockedProperties,
  PropertiesLockedByOwnerId,
  PropertiesUnLockedByOwnerId,
} from '../../controllers/admin/lockProperty/LockPropertyController.js';

const router = express.Router();
router.post('/get-locked-properties', getLockedUnLockedProperties);
router.post('/ownerIds-to-be-locked', PropertiesLockedByOwnerId);
router.post('/ownerIds-to-be-unlocked', PropertiesUnLockedByOwnerId);

export default router;
