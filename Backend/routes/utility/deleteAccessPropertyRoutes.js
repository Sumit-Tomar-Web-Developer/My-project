import express from 'express';
import { deleteAccessPropertyDetails } from '../../controllers/utility/deleteAccessPropertyController.js';

const router = express.Router();

router.post('/delete-access-property', deleteAccessPropertyDetails);


export default router;
