import express from 'express';
import { getAllTypes } from '../../controllers/master/rateMasterController.js';

const router = express.Router();

router.get('/typeofuseprime', getAllTypes);

export default router;