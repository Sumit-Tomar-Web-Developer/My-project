import express from 'express';
import {
  addUserAdmin,
  getUsers,
} from '../../controllers/auth/newUserController.js';

const router = express.Router();

router.post('/user-admin', addUserAdmin);
router.get('/user-admin', getUsers);
export default router;
