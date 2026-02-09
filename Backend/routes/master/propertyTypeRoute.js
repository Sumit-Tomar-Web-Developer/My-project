import express from 'express'
import { deletePropertyTypeInfo, getPropertyTypeInfo, savePropertyTypeInfo } from '../../controllers/master/propertyTypeController.js';
const router = express.Router();
router.get('/fetchPropertyTypeInfo', getPropertyTypeInfo);
router.post('/savePropertyTypeInfo', savePropertyTypeInfo);
router.post('/deletePropertyTypeInfo', deletePropertyTypeInfo);
export default router