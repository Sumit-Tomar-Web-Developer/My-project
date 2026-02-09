import express from 'express';

import {
  AddOrUpdateSecurityLayer,
  DeleteSecurityLayer,
  getSecurityLayer,
} from '../../controllers/admin/pageLevelAccess/pageLevelAccessController.js';

const router = express.Router();

router.post('/add-security-layer', AddOrUpdateSecurityLayer);
router.get('/get-security-layer', getSecurityLayer);
router.post('/delete-security-layer', DeleteSecurityLayer);
export default router;
