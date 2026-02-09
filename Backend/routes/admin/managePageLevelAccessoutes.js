import express from 'express';
import {
  getAccessLevels,
  getSavedPermissions,
  savePagePermissions,
} from '../../controllers/admin/managePageLevelAccess/managePageLevelAcessController.js';

const router = express.Router();

// User routes

router.get('/access-levels', getAccessLevels);
router.post('/saved-permissions', getSavedPermissions);
router.post('/save-pages-permissions', savePagePermissions);

export default router;
