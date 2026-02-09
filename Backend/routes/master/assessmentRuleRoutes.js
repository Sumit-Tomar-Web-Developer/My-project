import express from 'express';
import {
  addAssessmentRules,
  getAssessmentRules,
  saveNpprefix,
} from '../../controllers/master/assessmentRuleController.js';

const router = express.Router();

router.post('/add-assessment-rules', addAssessmentRules);
router.get('/save-npprefix', saveNpprefix);
router.get('/get-assessment-rules', getAssessmentRules);

export default router;
