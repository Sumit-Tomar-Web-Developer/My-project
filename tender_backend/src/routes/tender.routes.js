const r = require('express').Router();
const c = require('../controllers/tender.controller');
const { authenticate } = require('../middlewares/auth.middleware');


// POST APIs for adding details
r.post('/:id/basic', authenticate, c.addBasicDetail);
r.post('/:id/cover', authenticate, c.addCoverDetails);
r.post('/:id/emd_fee', authenticate, c.addEmdFeeDetails);
r.post('/:id/tender_fee', authenticate, c.addTenderFeeDetails);
r.post('/:id/work_item', authenticate, c.addWorkItems);
r.post('/:id/critical_dates', authenticate, c.addCriticalDates);
r.post('/:id/stamp', authenticate, c.addStampDetails);
r.post('/:id/eligibility', authenticate, c.addEligibilityCriteria);
r.post('/:id/additional', authenticate, c.addAdditionalDetails);
r.post('/:id/documents', authenticate, c.addDocumentDetails);
r.post('/:id/finance_approval', authenticate, c.saveFinanceApproval);
r.post('/:id/tl_authorize', authenticate, c.saveTLAuthorize);
r.post('/:id/lzero_approval', authenticate, c.saveL0Details);
r.post('/:id/save_tender_selection', authenticate, c.saveTenderSelectionDetails);
r.post('/:id/da_doc_upload', authenticate, c.saveDaUploadedDocuments);
r.post('/:id/phy_doc_submission', authenticate, c.saveSubmittedDocuments);
r.post('/:id/l1_approval_details', authenticate, c.saveL1ApprovalDetails);
r.post('/:id/physical_tracking_setup', authenticate, c.savePhyTrackingSetup);
r.post('/:id/physical_tracking_progress', authenticate, c.savePhyTrackingProgress);
r.post('/:id/financial_tracking_progress', authenticate, c.saveFinTrackingProgress);
r.post('/:id/financial_closure', authenticate, c.saveFinancialClosure);
r.post('/:id/final_closure', authenticate, c.saveFinalClosure);
r.post('/:id/save_corrigendum', authenticate, c.saveCorrigendumData);
r.post('/save_expense', authenticate, c.saveExpenseData);
r.post('/:id/submit', authenticate, c.submit);
r.post('/submit_tender_action', authenticate, c.submitTenderAction);
r.post('/submit_expense_action', authenticate, c.submitExpenseAction);
r.post('/', authenticate, c.createTender);

// GET APIs for fetching details
r.get('/get_search_filters', authenticate, c.getSearchFilterMap);
r.get('/get_expense_search_filters', authenticate, c.getExpenseSearchFilterMap);
r.get('/:id/get_tender_status', authenticate, c.getTenderStatus);
r.get('/:id/basic', authenticate, c.getBasicDetail);
r.get('/:id/cover', authenticate, c.getCoverDetails);
r.get('/:id/emd_fee', authenticate, c.getEmdFeeDetails);
r.get('/:id/tender_fee', authenticate, c.getTenderFeeDetails);
r.get('/:id/work_item', authenticate, c.getWorkItems);
r.get('/:id/critical_dates', authenticate, c.getCriticalDates);
r.get('/:id/stamp', authenticate, c.getStampDetails);
r.get('/:id/eligibility', authenticate, c.getEligibilityCriteria);
r.get('/:id/additional', authenticate, c.getAdditionalDetails);
r.get('/:id/approval_details', authenticate, c.getApprovalDetails);
r.get('/:id/da_uploaded_docs', authenticate, c.getDaUploadedDocumentDetails);
r.get('/:id/da_doc_submitted', authenticate, c.getDaSubmittedDocumentDetails);
r.get('/:id/tender_selection_details', authenticate, c.getTenderSelectonDetails);
r.get('/:id/l0_acceptance_details', authenticate, c.getL0AcceptanceDetails);
r.get('/:id/l1_approval_details', authenticate, c.getL1ApprovalDetails);
r.get('/:id/documents', authenticate, c.getDocumentDetails);
r.get('/:id/physical_tracking_details', authenticate, c.getPhysicalTrackingDetails);
r.get('/:id/financial_tracking_details', authenticate, c.getFinancialTrackingDetails);
r.get('/:id/financial_closure_details', authenticate, c.getFinancialClosureDetails);
r.get('/:id/final_closure_details', authenticate, c.getFinalClosureDetails);
r.get('/corrigendum_list', authenticate, c.getCorrigendumList);
r.get('/:id/expense_details', authenticate, c.getExpenseDetails);
r.get('/expense_list', authenticate, c.getExpenseList);
r.get('/expense_type_list', authenticate, c.getExpenseTypeList);
r.get('/work_list_expense_count', authenticate, c.workListExpenseCount);
r.get('/work_list_count', authenticate, c.workListCount);
r.get('/', authenticate, c.list);



module.exports = r;