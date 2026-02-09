const r = require('express').Router();
const reportcontroller = require('../controllers/report.controller');
const { authenticate } = require('../middlewares/auth.middleware');

r.get('/getProjectCountByStatus', authenticate, reportcontroller.getProjectCountByStatus);
r.get('/departmentAggregatedExpenseReport', authenticate, reportcontroller.getDepartmentExpenseReport);
r.get('/tenderAggregatedExpenseReport', authenticate, reportcontroller.getTenderAggregatedExpenseReport);
r.get('/tenderexpensereport', authenticate, reportcontroller.getTenderExpenseReport);
r.post('/tenderexpensereport', authenticate, reportcontroller.postTenderExpenseReport);
r.get('/tendermonitoringreport', authenticate, reportcontroller.getTenderMonitoringReport);
r.post('/tendermonitoringreport', authenticate, reportcontroller.postTenderMonitoringReport);

module.exports = r;
