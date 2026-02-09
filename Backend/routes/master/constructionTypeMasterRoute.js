import express from 'express';
import { createConstructionType, deleteConstructionType, deleteOldConstructionType, getAllConstructionTypes, getAllConstructionTypesOld, oldCreateConstructionType } from '../../controllers/master/constructionTypeMasterController.js';

const router = express.Router();
//new
router.post('/construction-type-master', createConstructionType);
router.get('/fetch-constructions', getAllConstructionTypes);
router.post('/delete-new-construction', deleteConstructionType);

router.post('/old-construction-type', oldCreateConstructionType);
router.get('/old-constructions', getAllConstructionTypesOld);
router.post('/delete-old-construction', deleteOldConstructionType);

export default router;
