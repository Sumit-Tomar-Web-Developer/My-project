import express from 'express'

import { getPropertyCountByDescription,getPropertyClassification } from '../../../../controllers/report/autoQC/propertyClassification/propertyClassification.js'

const router = express.Router()

router.post('/getPropertyCountByDescription',getPropertyCountByDescription)
router.post('/getPropertyClassification',getPropertyClassification)

export default router ;