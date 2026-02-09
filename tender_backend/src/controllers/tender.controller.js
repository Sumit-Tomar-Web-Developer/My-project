const { Op, NUMBER } = require('sequelize');
const {
  Tender, TenderBasicDetails, MasterExpenseType,
  TenderApprovalDetails, TenderClosureDetails, TenderCorrigendum, TenderFinancialClosure, TenderFinancialProgress,
  TenderPhysicalProgress, TenderCoverDetails, TenderFeeDetails, TenderEmdFeeDetails, TenderWorkItems,
  TenderCriticalDates, TenderStampDetails, TenderEligibilityCriteria, TenderDocument, TenderAdditionalDetails, TenderLZeroDetails,
  TenderSubmittedDocument, TenderSelectionDetails, TenderDocumentsForVerification, TenderL1ApprovalDetails, TenderSubmittedExpense,
  MasterDepartment
} = require('../models');
const { API_STATUS, USER_ROLES, TENDER_STATUS, TENDER_APPROVAL_STATUS, getCurrentDateTime, EXPENSE_STATUS } = require('../utilities/utils');

/**
 * @swagger
 * tags:
 *   - name: Tenders
 *     description: Tender lifecycle management
 *
 * /tenders:
 *   get:
 *     summary: List tenders
 *     tags: [Tenders]
 *     responses:
 *       200:
 *         description: List of tenders with their current status
 *   post:
 *     summary: Create a tender shell
 *     tags: [Tenders]
 *     responses:
 *       201:
 *         description: Tender created and returns the generated tender ID
 *
 * /tenders/get_search_filters:
 *   get:
 *     summary: Fetch tender filter map by department and location
 *     tags: [Tenders]
 *     responses:
 *       200:
 *         description: Filter map for tenders
 *
 * /tenders/get_expense_search_filters:
 *   get:
 *     summary: Fetch expense filter map by department and location
 *     tags: [Tenders]
 *     responses:
 *       200:
 *         description: Filter map for tender expenses
 *
 * /tenders/{id}/basic:
 *   post:
 *     summary: Add or update basic tender details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Basic details stored successfully
 *   get:
 *     summary: Retrieve basic tender details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Basic tender details
 *
 * /tenders/{id}/cover:
 *   post:
 *     summary: Add or update cover details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Cover details stored
 *   get:
 *     summary: Get tender cover details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Cover details
 *
 * /tenders/{id}/emd_fee:
 *   post:
 *     summary: Add or update EMD fee details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: EMD fee details stored
 *   get:
 *     summary: Get EMD fee details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: EMD fee details
 *
 * /tenders/{id}/tender_fee:
 *   post:
 *     summary: Add or update tender fee details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Tender fee details stored
 *   get:
 *     summary: Get tender fee details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Tender fee details
 *
 * /tenders/{id}/work_item:
 *   post:
 *     summary: Add or update work items
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Work items stored
 *   get:
 *     summary: Get work items
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Work items
 *
 * /tenders/{id}/critical_dates:
 *   post:
 *     summary: Add or update critical dates
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Critical dates stored
 *   get:
 *     summary: Get critical dates
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Critical dates
 *
 * /tenders/{id}/stamp:
 *   post:
 *     summary: Add or update stamp details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Stamp details stored
 *   get:
 *     summary: Get stamp details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Stamp details
 *
 * /tenders/{id}/eligibility:
 *   post:
 *     summary: Add or update eligibility criteria
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Eligibility criteria stored
 *   get:
 *     summary: Get eligibility criteria
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Eligibility criteria
 *
 * /tenders/{id}/additional:
 *   post:
 *     summary: Add or update additional details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Additional details stored
 *   get:
 *     summary: Get additional details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Additional details
 *
 * /tenders/{id}/documents:
 *   post:
 *     summary: Add tender documents
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Documents stored
 *   get:
 *     summary: Get tender documents
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Tender document list
 *
 * /tenders/{id}/finance_approval:
 *   post:
 *     summary: Add finance approval details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Finance approval details stored
 *
 * /tenders/{id}/tl_authorize:
 *   post:
 *     summary: Authorize technical lead
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Technical lead authorization stored
 *
 * /tenders/{id}/lzero_approval:
 *   post:
 *     summary: Record L0 approval details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: L0 approval stored
 *   get:
 *     summary: Get L0 acceptance details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: L0 acceptance details
 *
 * /tenders/{id}/save_tender_selection:
 *   post:
 *     summary: Save tender selection details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Tender selection stored
 *   get:
 *     summary: Get tender selection details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Tender selection details
 *
 * /tenders/{id}/da_doc_upload:
 *   post:
 *     summary: Upload DA documents for verification
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: DA documents saved
 *   get:
 *     summary: Get DA uploaded documents
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: DA uploaded document list
 *
 * /tenders/{id}/phy_doc_submission:
 *   post:
 *     summary: Record physical document submission
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Submission stored
 *   get:
 *     summary: Get submitted physical documents
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Physical submission list
 *
 * /tenders/{id}/l1_approval_details:
 *   post:
 *     summary: Record L1 approval details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: L1 approval stored
 *   get:
 *     summary: Get L1 approval details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: L1 approval data
 *
 * /tenders/{id}/physical_tracking_setup:
 *   post:
 *     summary: Configure physical tracking setup
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Physical tracking setup stored
 *   get:
 *     summary: Get physical tracking details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Physical tracking data
 *
 * /tenders/{id}/physical_tracking_progress:
 *   post:
 *     summary: Save physical tracking progress
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Physical progress stored
 *   get:
 *     summary: Get physical tracking progress
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Physical progress data
 *
 * /tenders/{id}/financial_tracking_progress:
 *   post:
 *     summary: Save financial tracking progress
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Financial progress stored
 *   get:
 *     summary: Get financial tracking progress
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Financial progress data
 *
 * /tenders/{id}/financial_closure:
 *   post:
 *     summary: Record financial closure details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Financial closure stored
 *   get:
 *     summary: Get financial closure details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Financial closure data
 *
 * /tenders/{id}/final_closure:
 *   post:
 *     summary: Record final closure details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Final closure stored
 *   get:
 *     summary: Get final closure details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Final closure data
 *
 * /tenders/save_expense:
 *   post:
 *     summary: Save expense details for a tender
 *     tags: [Tenders]
 *     responses:
 *       200:
 *         description: Expense stored
 *
 * /tenders/submit_tender_action:
 *   post:
 *     summary: Submit tender action for workflow
 *     tags: [Tenders]
 *     responses:
 *       200:
 *         description: Tender action processed
 *
 * /tenders/submit_expense_action:
 *   post:
 *     summary: Submit expense action for workflow
 *     tags: [Tenders]
 *     responses:
 *       200:
 *         description: Expense action processed
 *
 * /tenders/{id}/submit:
 *   post:
 *     summary: Submit a draft tender for review
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Tender submitted
 *
 * /tenders/{id}/get_tender_status:
 *   get:
 *     summary: Get the current tender status
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Tender status info
 *
 * /tenders/{id}/approval_details:
 *   get:
 *     summary: Get tender approval details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Approval details
 *
 * /tenders/{id}/da_uploaded_docs:
 *   get:
 *     summary: Get DA uploaded documents
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Uploaded DA documents
 *
 * /tenders/{id}/da_doc_submitted:
 *   get:
 *     summary: Get submitted physical documents
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Submitted document list
 *
 * /tenders/{id}/tender_selection_details:
 *   get:
 *     summary: Get tender selection details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Selection details
 *
 * /tenders/{id}/physical_tracking_details:
 *   get:
 *     summary: Get physical tracking setup and progress
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Physical tracking overview
 *
 * /tenders/{id}/financial_tracking_details:
 *   get:
 *     summary: Get financial tracking setup and progress
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Financial tracking overview
 *
 * /tenders/{id}/financial_closure_details:
 *   get:
 *     summary: Get financial closure details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Financial closure detail
 *
 * /tenders/{id}/final_closure_details:
 *   get:
 *     summary: Get final closure details
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Final closure detail
 *
 * /tenders/corrigendum_list:
 *   get:
 *     summary: List corrigendum entries
 *     tags: [Tenders]
 *     responses:
 *       200:
 *         description: Corrigendum list
 *
 * /tenders/{id}/expense_details:
 *   get:
 *     summary: Get expense details for a tender
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tender ID
 *     responses:
 *       200:
 *         description: Expense detail list
 *
 * /tenders/expense_list:
 *   get:
 *     summary: List expenses across tenders
 *     tags: [Tenders]
 *     responses:
 *       200:
 *         description: Expense list
 *
 * /tenders/expense_type_list:
 *   get:
 *     summary: List available expense types
 *     tags: [Tenders]
 *     responses:
 *       200:
 *         description: Expense type list
 *
 * /tenders/work_list_expense_count:
 *   get:
 *     summary: Get work list expense counts
 *     tags: [Tenders]
 *     responses:
 *       200:
 *         description: Work list expense counts
 *
 * /tenders/work_list_count:
 *   get:
 *     summary: Get work list counts
 *     tags: [Tenders]
 *     responses:
 *       200:
 *         description: Work list counts
 */


exports.createTender = async (req, res, next) => {
  try {
    if (![USER_ROLES.DATA_APPLICANT.id].includes(req.user.userRoleId)) return res.status(403).json({
      type: API_STATUS.ERROR,
      message: 'Access Denied. You are not allowed to perform this action',
    });

    const t = await Tender.create({ createdBy: req.user.userId });
    res.status(201).json({
      type: API_STATUS.SUCCESS,
      message: "Project Created Successfully",
      data: {
        "currentStatus": t.currentStatus,
        "projectID": t.id
      }
    });
  } catch (e) { next(e); }
};

exports.getExpenseSearchFilterMap = async (req, res, next) => {
  try {

    const basic_where = {};

    // Return only the departments for which the user belongs if role is not MD
    if (req.user.userRoleId !== USER_ROLES.MD.id) {
      basic_where.department = req.user.department;
    }

    const expense_records = await TenderSubmittedExpense.findAll({
      attributes: ['tenderId', 'currentStatus'],
      include: [{
        model: TenderBasicDetails,
        where: basic_where,
        attributes: ['location', 'department'],
        required: true,
        include: [
          {
            model: MasterDepartment,
            as: 'dep', // Use the alias from your association
            required: true
          }
        ]
      }],
    });

    // Build the map: { department1: { name: departmentName1, locDict: {location1 : {tenderId: currentStatus, ....} ... } ...} ...}

    const locationTenderMap = {};

    expense_records.forEach((rec) => {
      if (!rec.TenderBasicDetail.location) return;
      const depId = rec.TenderBasicDetail.department;
      const dep = rec.TenderBasicDetail.dep.departmentname.toUpperCase();
      const loc = rec.TenderBasicDetail.location.toUpperCase();

      if (!locationTenderMap[depId]) {
        locationTenderMap[depId] = { name: dep, locDict: {} };
      }

      if (!locationTenderMap[depId]['locDict'][loc]) {
        locationTenderMap[depId]['locDict'][loc] = {};
      }

      locationTenderMap[depId]['locDict'][loc][rec.tenderId] = rec.currentStatus;

    });

    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: 'Location to TenderId map fetched successfully',
      data: { filterMap: locationTenderMap }
    });
  } catch (e) {
    next(e);
  }
};

exports.getSearchFilterMap = async (req, res, next) => {
  try {

    const basic_where = {};

    // Return only the departments for which the user belongs if role is not MD
    if (req.user.userRoleId !== USER_ROLES.MD.id) {
      basic_where.department = req.user.department;
    }

    const records = await Tender.findAll({
      attributes: ['id', 'currentStatus'],
      include: [{
        model: TenderBasicDetails,
        where: basic_where,
        attributes: ['location', 'department'],
        required: true,
        include: [
          {
            model: MasterDepartment,
            as: 'dep', // Use the alias from your association
            required: true
          }
        ]
      }],
    });

    // Build the map: { department1: { name: departmentName1, locDict: {location1 : {tenderId: currentStatus, ....} ... } ...} ...}

    const locationTenderMap = {};
    records.forEach((rec) => {
      if (!rec.TenderBasicDetail.location) return;
      const depId = rec.TenderBasicDetail.department;
      const dep = rec.TenderBasicDetail.dep.departmentname.toUpperCase();
      const loc = rec.TenderBasicDetail.location.toUpperCase();

      if (!locationTenderMap[depId]) {
        locationTenderMap[depId] = { name: dep, locDict: {} };
      }

      if (!locationTenderMap[depId]['locDict'][loc]) {
        locationTenderMap[depId]['locDict'][loc] = {};
      }

      locationTenderMap[depId]['locDict'][loc][rec.id] = rec.currentStatus;

    });

    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: 'Location to TenderId map fetched successfully',
      data: { filterMap: locationTenderMap }
    });
  } catch (e) {
    next(e);
  }
};

const addDetailsToTable = async (req, res, next, modelName) => {
  try {
    const { id: tenderId } = req.params;
    const currentuser = req.user.userId;
    // Ensure tenderId is provided
    if (!tenderId) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Tender ID is required',
      });
    }

    const t = await Tender.findByPk(tenderId);

    switch (req.user.userRoleId) {
      case USER_ROLES.DATA_APPLICANT.id:
        if (t.currentStatus !== TENDER_STATUS.Draft.id) return res.status(403).json({
          type: API_STATUS.ERROR,
          message: 'Access Denied. You are not allowed to perform this action'
        });
        break;
      case USER_ROLES.TECH_TEAM.id:
        if (t.currentStatus !== TENDER_STATUS.Submitted.id) return res.status(403).json({
          type: API_STATUS.ERROR,
          message: 'Access Denied. You are not allowed to perform this action'
        });
        break;
      case USER_ROLES.DIRECTOR.id:
        if (t.currentStatus !== TENDER_STATUS.TechnicalApprovalDone.id) return res.status(403).json({
          type: API_STATUS.ERROR,
          message: 'Access Denied. You are not allowed to perform this action'
        });
        break;
      default:
        return res.status(403).json({
          type: API_STATUS.ERROR,
          message: 'Access Denied. You are not allowed to perform this action'
        });

    }

    // Check if a record exists for the given tenderId
    const existingRecord = await modelName.findByPk(tenderId);

    if (existingRecord) {
      // Update the existing record
      let updateData = { ...req.body, updatedBy: currentuser };
      await modelName.update(updateData, { where: { tenderId } });
      const updatedRecord = await modelName.findByPk(tenderId);;
      return res.status(200).json({
        type: API_STATUS.SUCCESS,
        message: 'Tender details updated successfully',
        data: updatedRecord,
      });
    } else {
      // Create is only allowed for userRoleId 3 i.e. DA
      if (req.user.userRoleId !== USER_ROLES.DATA_APPLICANT.id) return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied. You are not allowed to create new project',
      });
      // Create a new record

      const newRecord = await modelName.create({ ...req.body, tenderId, createdBy: currentuser });
      return res.status(201).json({
        type: API_STATUS.SUCCESS,
        message: 'Tender details created successfully',
        data: newRecord,
      });
    }
  } catch (e) {
    next(e);
  }
};

exports.getExpenseDetails = async (req, res, next) => {
  try {
    const { id: expenseId } = req.params;

    // Ensure tenderId is provided
    if (!expenseId) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Expense ID is required',
      });
    }

    // const record = await TenderSubmittedExpense.findByPk(tenderId);

    const record = await TenderSubmittedExpense.findByPk(expenseId, {
      include: [
        {
          model: TenderBasicDetails,
          required: true,
          include: [
            {
              model: MasterDepartment,
              as: 'dep', // Use the alias from your association
              required: true
            },
          ]
        },
        {
          model: MasterExpenseType,
          as: 'ExpenseType',
          attributes: ['expenseType'],
          required: true
        },
      ]
    });

    if (!record) {
      return res.status(404).json({
        type: API_STATUS.ERROR,
        message: 'Expense details not found',
      });
    }

    return res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: 'Expense details retrieved successfully',
      data: record,
    });
  } catch (e) {
    next(e);
  }
}

const getDetailsFromTable = async (req, res, next, modelName) => {
  try {
    const { id: tenderId } = req.params;

    // Ensure tenderId is provided
    if (!tenderId) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Tender ID is required',
      });
    }

    const record = await modelName.findByPk(tenderId);
    if (!record) {
      return res.status(404).json({
        type: API_STATUS.ERROR,
        message: 'Tender details not found',
      });
    }

    if (modelName === TenderBasicDetails) {
      if (req.user.userRoleId !== USER_ROLES.MD.id && record.department !== req.user.department) {
        return res.status(403).json({
          type: API_STATUS.ERROR,
          message: 'Your are not authorized to view!!',
        });
      }
    }

    return res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: 'Tender details retrieved successfully',
      data: record,
    });
  } catch (e) {
    next(e);
  }
}

/**
 * @swagger
 * /tenders/{id}/basic:
 *   post:
 *     summary: Add or Update basic details to a tender
 *     tags:
 *       - Tender
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the tender
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *                 description: The location of the tender
 *               tenderIdText:
 *                 type: string
 *                 description: The textual representation of the tender ID
 *               referenceNumber:
 *                 type: string
 *                 description: The reference number of the tender
 *               paymentMode:
 *                 type: string
 *                 enum: [Online, DD, FDR]
 *                 description: The payment mode for the tender
 *     responses:
 *       201:
 *         description: Tender basic details created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Tender details created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     tenderId:
 *                       type: integer
 *                       description: The ID of the tender
 *                     location:
 *                       type: string
 *                       description: The location of the tender
 *                     tenderIdText:
 *                       type: string
 *                       description: The textual representation of the tender ID
 *                     referenceNumber:
 *                       type: string
 *                       description: The reference number of the tender
 *                     paymentMode:
 *                       type: string
 *                       description: The payment mode for the tender
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
exports.addBasicDetail = async (req, res, next) => {
  try {
    req.body.department = req.user.department;
    addDetailsToTable(req, res, next, TenderBasicDetails);
  } catch (e) {
    next(e);
  }
};


/**
 * @swagger
 * /tenders/{id}/additional:
 *   post:
 *     summary: Add or Update additional details to a tender
 *     tags:
 *       - Tender
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the tender
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               referencedBy:
 *                 type: string
 *                 description: Reference information for the tender
 *               additionalFieldDict:
 *                 type: object
 *                 description: Additional fields in JSON format
 *     responses:
 *       201:
 *         description: Tender additional details created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Tender details created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     tenderId:
 *                       type: integer
 *                       description: The ID of the tender
 *                     referencedBy:
 *                       type: string
 *                       description: Reference information for the tender
 *                     additionalFieldDict:
 *                       type: object
 *                       description: Additional fields in JSON format
 *                       example: { list : [{ fieldName: "field1", fieldValue: "value1"}]}
 *       400:
 *         description: Bad request
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
exports.addCoverDetails = async (req, res, next) => {
  try {
    addDetailsToTable(req, res, next, TenderCoverDetails);
  } catch (e) {
    next(e);
  }
};

exports.addEmdFeeDetails = async (req, res, next) => {
  try {
    addDetailsToTable(req, res, next, TenderEmdFeeDetails);
  } catch (e) {
    next(e);
  }
};

exports.addTenderFeeDetails = async (req, res, next) => {
  try {
    addDetailsToTable(req, res, next, TenderFeeDetails);
  } catch (e) {
    next(e);
  }
};

exports.addWorkItems = async (req, res, next) => {
  try {
    addDetailsToTable(req, res, next, TenderWorkItems);
  } catch (e) {
    next(e);
  }
};

exports.addCriticalDates = async (req, res, next) => {
  try {
    addDetailsToTable(req, res, next, TenderCriticalDates);
  } catch (e) {
    next(e);
  }
};

exports.addStampDetails = async (req, res, next) => {
  try {
    addDetailsToTable(req, res, next, TenderStampDetails);
  } catch (e) {
    next(e);
  }
};

exports.addEligibilityCriteria = async (req, res, next) => {
  try {
    addDetailsToTable(req, res, next, TenderEligibilityCriteria);
  } catch (e) {
    next(e);
  }
};

exports.addAdditionalDetails = async (req, res, next) => {
  try {
    addDetailsToTable(req, res, next, TenderAdditionalDetails);
  } catch (e) {
    next(e);
  }
};

exports.addDocumentDetails = async (req, res, next) => {
  try {
    addDetailsToTable(req, res, next, TenderDocument);
  } catch (e) {
    next(e);
  }
};

exports.getTenderStatus = async (req, res, next) => {
  try {
    getDetailsFromTable(req, res, next, Tender);
  } catch (e) {
    next(e);
  }
};

exports.getBasicDetail = async (req, res, next) => {
  try {
    getDetailsFromTable(req, res, next, TenderBasicDetails);
  } catch (e) {
    next(e);
  }
};

exports.getCoverDetails = async (req, res, next) => {
  try {
    getDetailsFromTable(req, res, next, TenderCoverDetails);
  } catch (e) {
    next(e);
  }
};

exports.getEmdFeeDetails = async (req, res, next) => {
  try {
    getDetailsFromTable(req, res, next, TenderEmdFeeDetails);
  } catch (e) {
    next(e);
  }
};

exports.getTenderFeeDetails = async (req, res, next) => {
  try {
    getDetailsFromTable(req, res, next, TenderFeeDetails);
  } catch (e) {
    next(e);
  }
};

exports.getWorkItems = async (req, res, next) => {
  try {
    getDetailsFromTable(req, res, next, TenderWorkItems);
  } catch (e) {
    next(e);
  }
};

exports.getCriticalDates = async (req, res, next) => {
  try {
    getDetailsFromTable(req, res, next, TenderCriticalDates);
  } catch (e) {
    next(e);
  }
};

exports.getStampDetails = async (req, res, next) => {
  try {
    getDetailsFromTable(req, res, next, TenderStampDetails);
  } catch (e) {
    next(e);
  }
};

exports.getEligibilityCriteria = async (req, res, next) => {
  try {
    getDetailsFromTable(req, res, next, TenderEligibilityCriteria);
  } catch (e) {
    next(e);
  }
};

exports.getAdditionalDetails = async (req, res, next) => {
  try {
    getDetailsFromTable(req, res, next, TenderAdditionalDetails);
  } catch (e) {
    next(e);
  }
};

exports.getApprovalDetails = async (req, res, next) => {
  try {
    getDetailsFromTable(req, res, next, TenderApprovalDetails);
  } catch (e) {
    next(e);
  }
}

exports.getDaUploadedDocumentDetails = async (req, res, next) => {
  try {
    getDetailsFromTable(req, res, next, TenderDocumentsForVerification);
  } catch (e) {
    next(e);
  }
};

exports.getDaSubmittedDocumentDetails = async (req, res, next) => {
  try {
    getDetailsFromTable(req, res, next, TenderSubmittedDocument);
  } catch (e) {
    next(e);
  }
};

exports.getTenderSelectonDetails = async (req, res, next) => {
  try {
    getDetailsFromTable(req, res, next, TenderSelectionDetails);
  } catch (e) {
    next(e);
  }
};

exports.getL0AcceptanceDetails = async (req, res, next) => {
  try {
    getDetailsFromTable(req, res, next, TenderLZeroDetails);
  } catch (e) {
    next(e);
  }
};

exports.getL1ApprovalDetails = async (req, res, next) => {
  try {
    getDetailsFromTable(req, res, next, TenderL1ApprovalDetails);
  } catch (e) {
    next(e);
  }
};

exports.getPhysicalTrackingDetails = async (req, res, next) => {
  try {
    getDetailsFromTable(req, res, next, TenderPhysicalProgress);
  } catch (e) {
    next(e);
  }
}

exports.getFinancialTrackingDetails = async (req, res, next) => {
  try {
    getDetailsFromTable(req, res, next, TenderFinancialProgress);
  } catch (e) {
    next(e);
  }
};

exports.getFinancialClosureDetails = async (req, res, next) => {
  try {
    getDetailsFromTable(req, res, next, TenderFinancialClosure);
  } catch (e) {
    next(e);
  }
};

exports.getFinalClosureDetails = async (req, res, next) => {
  try {
    getDetailsFromTable(req, res, next, TenderClosureDetails);
  } catch (e) {
    next(e);
  }
};

exports.getDocumentDetails = async (req, res, next) => {
  try {
    getDetailsFromTable(req, res, next, TenderDocument);
  } catch (e) {
    next(e);
  }
};

const listTendersByRole = async (req, res, next, statusList) => {
  try {
    let { page = 0, size = 10, sort = 'createdAt', order = 'DESC',
      id = '', location = '', department = '', getAll = true } = req.query;
    page = parseInt(page, 10);
    size = parseInt(size, 10);
    if (isNaN(page) || page < 0) page = 0;
    if (isNaN(size) || size < 1) size = 10;

    const offset = (page) * size;

    const where = {};

    if (getAll === 'false') {
      where.currentStatus = { [Op.in]: statusList }; // Use Op.in to handle a list of statuses
    }

    const basic_where = {};
    if (id) {
      where.id = { [Op.like]: `%${id}%` };
    }
    if (location) {
      basic_where.location = location;
    }

    // Return only the departments for which the user belongs if role is not MD
    if (req.user.userRoleId !== USER_ROLES.MD.id) {
      basic_where.department = req.user.department;
    }
    else if (department) {
      basic_where.department = department;
    }

    const { rows: tenders, count } = await Tender.findAndCountAll({
      where,
      order: [[sort, order]],
      limit: +size,
      offset: parseInt(offset),
      include: [
        {
          model: TenderBasicDetails,
          where: basic_where,
          required: true,
          include: [
            {
              model: MasterDepartment,
              as: 'dep', // Use the alias from your association
              required: true
            }
          ]
        }
      ]
    });

    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: "",
      data: {
        tenderList: tenders,
        totalTenders: count,
        currentPage: parseInt(page),
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.list = (req, res, next) => {
  try {
    switch (req.user.userRoleId) {
      case USER_ROLES.DATA_APPLICANT.id:
        return listTendersByRole(req, res, next, [
          TENDER_STATUS.Draft.id,
          TENDER_STATUS.FinanceApprovalDone.id,
          TENDER_STATUS.PhysicalDocumentVerified.id,
          TENDER_STATUS.PhysicalDocumentSubmitted.id,
          TENDER_STATUS.L0Acceptance.id
        ]);
      case USER_ROLES.TECH_TEAM.id:
        return listTendersByRole(req, res, next, [
          TENDER_STATUS.Submitted.id,
          TENDER_STATUS.PhysicalDocumentUploaded.id,
          TENDER_STATUS.L1ApprovalDone.id,
          TENDER_STATUS.TrackingInProgress.id
        ]);
      case USER_ROLES.DIRECTOR.id:
        return listTendersByRole(req, res, next, [
          TENDER_STATUS.TechnicalApprovalDone.id,
          TENDER_STATUS.FinancialClosed.id
        ]);
      case USER_ROLES.FINANCE.id:
        return listTendersByRole(req, res, next, [
          TENDER_STATUS.DirectorApprovalDone.id,
          TENDER_STATUS.L1ApprovalReceived.id,
          TENDER_STATUS.PhysicalSetupDone.id,
          TENDER_STATUS.TrackingInProgress.id,
          TENDER_STATUS.L2L3ApprovalReceived.id,
          TENDER_STATUS.TrackingCompleted.id
        ]);
      case USER_ROLES.MD.id:
        return listTendersByRole(req, res, next, []);
      default:
        return res.status(403).json(
          {
            type: API_STATUS.ERROR,
            message: 'Access Denied. You are not allowed to perform this action'
          });
    }

  } catch (e) {
    next(e);
  }
};

const expenseListTendersByRole = async (req, res, next, statusList) => {
  try {
    let { page = 0, size = 10, sort = 'createdAt', order = 'DESC',
      id = '', location = '', department = '', getAll = true } = req.query;
    page = parseInt(page, 10);
    size = parseInt(size, 10);
    if (isNaN(page) || page < 0) page = 0;
    if (isNaN(size) || size < 1) size = 10;

    const offset = (page) * size;

    const where = {};

    if (getAll === 'false') {
      if (statusList.length === 0) {
        return res.status(200).json({
          type: API_STATUS.SUCCESS,
          message: "",
          data: {
            expenseList: [],
            totalExpenses: 0,
            currentPage: parseInt(page),
          },
        });
      }
      where.currentStatus = { [Op.in]: statusList }; // Use Op.in to handle a list of statuses
    }

    const basic_where = {};
    if (id) {
      where.tenderId = { [Op.like]: `%${id}%` };
    }
    if (location) {
      basic_where.location = location;
    }

    // Return only the departments for which the user belongs if role is not MD
    if (req.user.userRoleId !== USER_ROLES.MD.id) {
      basic_where.department = req.user.department;
    }
    else if (department) {
      basic_where.department = department;
    }

    // Return only the expense created by the user if role is DA
    if (req.user.userRoleId === USER_ROLES.DATA_APPLICANT.id) {
      where.createdBy = req.user.userId;
    }

    const { rows: expenses, count } = await TenderSubmittedExpense.findAndCountAll({
      where,
      order: [[sort, order]],
      limit: +size,
      offset: parseInt(offset),
      include: [
        {
          model: TenderBasicDetails,
          where: basic_where,
          required: true,
          include: [
            {
              model: MasterDepartment,
              as: 'dep', // Use the alias from your association
              required: true
            },
          ]
        },
        {
          model: MasterExpenseType,
          as: 'ExpenseType',
          attributes: ['expenseType'],
          required: true
        },
      ]
    });

    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: "",
      data: {
        expenseList: expenses,
        totalExpenses: count,
        currentPage: parseInt(page),
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.getExpenseList = (req, res, next) => {
  try {
    switch (req.user.userRoleId) {
      case USER_ROLES.DATA_APPLICANT.id:
        return expenseListTendersByRole(req, res, next, []);
      case USER_ROLES.TECH_TEAM.id:
        return expenseListTendersByRole(req, res, next, [
          EXPENSE_STATUS.Created.id
        ]);
      case USER_ROLES.DIRECTOR.id:
        return expenseListTendersByRole(req, res, next, [
          EXPENSE_STATUS.TechnicalApprovalDone.id
        ]);
      case USER_ROLES.FINANCE.id:
        return expenseListTendersByRole(req, res, next, [
          EXPENSE_STATUS.DirectorApprovalDone.id
        ]);
      case USER_ROLES.MD.id:
        return expenseListTendersByRole(req, res, next, []);
      default:
        return res.status(403).json(
          {
            type: API_STATUS.ERROR,
            message: 'Access Denied. You are not allowed to perform this action'
          });
    }

  } catch (e) {
    next(e);
  }
};

const workListCountExpenseTendersByRole = async (req, res, next, statusList) => {
  try {
    if (statusList.length === 0) {
      return res.status(200).json({
        type: API_STATUS.SUCCESS,
        message: "",
        data: 0,
      });
    }

    const where = { currentStatus: { [Op.in]: statusList } };// Use Op.in to handle a list of statuses

    const basic_where = {};
    basic_where.department = req.user.department;

    const records = await TenderSubmittedExpense.count({
      where,
      include: [
        {
          model: TenderBasicDetails,
          where: basic_where,
          required: true
        }
      ]
    });

    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: "",
      data: records,
    });

  } catch (e) {
    next(e);
  }
};

exports.workListExpenseCount = (req, res, next) => {
  try {
    switch (req.user.userRoleId) {
      case USER_ROLES.DATA_APPLICANT.id:
        return workListCountExpenseTendersByRole(req, res, next, []);
      case USER_ROLES.TECH_TEAM.id:
        return workListCountExpenseTendersByRole(req, res, next, [
          EXPENSE_STATUS.Created.id
        ]);
      case USER_ROLES.DIRECTOR.id:
        return workListCountExpenseTendersByRole(req, res, next, [
          EXPENSE_STATUS.TechnicalApprovalDone.id
        ]);
      case USER_ROLES.FINANCE.id:
        return workListCountExpenseTendersByRole(req, res, next, [
          EXPENSE_STATUS.DirectorApprovalDone.id
        ]);
      case USER_ROLES.MD.id:
        return workListCountExpenseTendersByRole(req, res, next, []);
      default:
        return res.status(403).json(
          {
            type: API_STATUS.ERROR,
            message: 'Access Denied. You are not allowed to perform this action'
          });
    }

  } catch (e) {
    next(e);
  }
};

const workListCountTendersByRole = async (req, res, next, statusList) => {
  try {
    if (statusList.length === 0) {
      return res.status(200).json({
        type: API_STATUS.SUCCESS,
        message: "",
        data: 0,
      });
    }


    const where = { currentStatus: { [Op.in]: statusList } };// Use Op.in to handle a list of statuses

    const basic_where = {};
    // Return only the departments for which the user belongs if role is not MD
    if (req.user.userRoleId !== USER_ROLES.MD.id) {
      basic_where.department = req.user.department;
    }

    const records = await Tender.count({
      where,
      include: [
        {
          model: TenderBasicDetails,
          where: basic_where,
          required: true
        }
      ]
    });

    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: "",
      data: records,
    });

  } catch (e) {
    next(e);
  }
};

exports.workListCount = (req, res, next) => {
  try {
    switch (req.user.userRoleId) {
      case USER_ROLES.DATA_APPLICANT.id:
        return workListCountTendersByRole(req, res, next, [
          TENDER_STATUS.Draft.id,
          TENDER_STATUS.FinanceApprovalDone.id,
          TENDER_STATUS.PhysicalDocumentVerified.id,
          TENDER_STATUS.PhysicalDocumentSubmitted.id,
          TENDER_STATUS.L0Acceptance.id
        ]);
      case USER_ROLES.TECH_TEAM.id:
        return workListCountTendersByRole(req, res, next, [
          TENDER_STATUS.Submitted.id,
          TENDER_STATUS.PhysicalDocumentUploaded.id,
          TENDER_STATUS.L1ApprovalDone.id,
          TENDER_STATUS.TrackingInProgress.id
        ]);
      case USER_ROLES.DIRECTOR.id:
        return workListCountTendersByRole(req, res, next, [
          TENDER_STATUS.TechnicalApprovalDone.id,
          TENDER_STATUS.FinancialClosed.id
        ]);
      case USER_ROLES.FINANCE.id:
        return workListCountTendersByRole(req, res, next, [
          TENDER_STATUS.DirectorApprovalDone.id,
          TENDER_STATUS.L1ApprovalReceived.id,
          TENDER_STATUS.PhysicalSetupDone.id,
          TENDER_STATUS.TrackingInProgress.id,
          TENDER_STATUS.L2L3ApprovalReceived.id,
          TENDER_STATUS.TrackingCompleted.id
        ]);
      case USER_ROLES.MD.id:
        return workListCountTendersByRole(req, res, next, []);
      default:
        return res.status(403).json(
          {
            type: API_STATUS.ERROR,
            message: 'Access Denied. You are not allowed to perform this action'
          });
    }

  } catch (e) {
    next(e);
  }
};

exports.getCorrigendumList = async (req, res, next) => {
  try {
    let { id = '' } = req.query;
    // Ensure tenderId is provided
    if (!id) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Project ID is required',
      });
    }

    const t = await Tender.findByPk(id);
    const records = await TenderCorrigendum.findAll({
      where: { tenderId: id },
    });

    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: "",
      data: {
        tenderStatus: t.currentStatus,
        corrigendumList: records,
      },
    });

  } catch (e) {
    next(e);
  }
}

exports.oldgetExpenseList = async (req, res, next) => {
  try {
    let { id = '' } = req.query;
    // Ensure tenderId is provided
    if (!id) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Project ID is required',
      });
    }

    const t = await Tender.findByPk(id);
    const records = await TenderSubmittedExpense.findAll({
      where: { tenderId: id },
      include: [{
        model: MasterExpenseType,
        as: 'ExpenseType',
        attributes: ['expenseType'],
        required: true
      }],
    });

    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: "",
      data: {
        tenderStatus: t.currentStatus,
        expenseList: records,
      },
    });

  } catch (e) {
    next(e);
  }
}

exports.getExpenseTypeList = async (req, res, next) => {
  try {
    const records = await MasterExpenseType.findAll();
    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: "",
      data: {
        expenseTypeList: records,
      },
    });

  } catch (e) {
    next(e);
  }
}

exports.submitExpenseAction = async (req, res, next) => {
  try {
    const { action, reason, expenseId } = req.body; // action can be 'approve', 'reject'
    let ad = await TenderSubmittedExpense.findByPk(expenseId);

    //tender cant be submitted by the current user or tender is not in the right state
    if ((action != TENDER_APPROVAL_STATUS.APPROVED.name && action != TENDER_APPROVAL_STATUS.REJECTED.name) ||
      (req.user.userRoleId === USER_ROLES.TECH_TEAM.id && ad.currentStatus !== EXPENSE_STATUS.Created.id) ||
      (req.user.userRoleId === USER_ROLES.DIRECTOR.id && ad.currentStatus !== EXPENSE_STATUS.TechnicalApprovalDone.id) ||
      (req.user.userRoleId === USER_ROLES.FINANCE.id && ad.currentStatus !== EXPENSE_STATUS.DirectorApprovalDone.id) ||
      (req.user.userRoleId !== USER_ROLES.TECH_TEAM.id && req.user.userRoleId !== USER_ROLES.DIRECTOR.id &&
        req.user.userRoleId !== USER_ROLES.FINANCE.id)) {
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied. You are not allowed to perform this action'
      });
    }
    let is_success = true;
    // Perform the action based on the user role and action type
    switch (action) {
      case TENDER_APPROVAL_STATUS.APPROVED.name:
        if (req.user.userRoleId === USER_ROLES.TECH_TEAM.id) {
          ad.currentStatus = EXPENSE_STATUS.TechnicalApprovalDone.id;
          ad.TechLeadApproval = TENDER_APPROVAL_STATUS.APPROVED.name;
          ad.TechLeadComments = reason; // Save the reason for the action
          ad.TechLeadApprover = req.user.userId;
          ad.TechLeadApprovedAt = getCurrentDateTime();
        }
        else if (req.user.userRoleId === USER_ROLES.DIRECTOR.id) {
          ad.currentStatus = EXPENSE_STATUS.DirectorApprovalDone.id;
          ad.DirectorApproval = TENDER_APPROVAL_STATUS.APPROVED.name;
          ad.DirectorComments = reason; // Save the reason for the action
          ad.DirectorApprover = req.user.userId;
          ad.DirectorApprovedAt = getCurrentDateTime();
        }
        else if (req.user.userRoleId === USER_ROLES.FINANCE.id) {
          const { FinancePaidAmount, FinanceTDSAmount, paymentProofFileGuid, paymentProofFileName, paymentDate } = req.body;

          ad.currentStatus = EXPENSE_STATUS.Completed.id;
          ad.FinanceApproval = TENDER_APPROVAL_STATUS.APPROVED.name;
          ad.FinanceComments = reason; // Save the reason for the action
          ad.FinanceApprover = req.user.userId;
          ad.FinanceApprovedAt = getCurrentDateTime();
          ad.FinancePaidAmount = FinancePaidAmount;
          ad.FinanceTDSAmount = FinanceTDSAmount;
          ad.paymentProofFileGuid = paymentProofFileGuid;
          ad.paymentProofFileName = paymentProofFileName;
          ad.paymentDate = paymentDate;
        }
        else {
          is_success = false;
        }
        break;
      case TENDER_APPROVAL_STATUS.REJECTED.name:
        if (req.user.userRoleId === USER_ROLES.TECH_TEAM.id) {
          ad.currentStatus = EXPENSE_STATUS.TechnicalRejectDone.id;
          ad.TechLeadApproval = TENDER_APPROVAL_STATUS.REJECTED.name;
          ad.TechLeadComments = reason; // Save the reason for the action
          ad.TechLeadApprover = req.user.userId;
          ad.TechLeadApprovedAt = getCurrentDateTime();
        }
        else if (req.user.userRoleId === USER_ROLES.DIRECTOR.id) {
          ad.currentStatus = EXPENSE_STATUS.DirectorRejectDone.id;
          ad.DirectorApproval = TENDER_APPROVAL_STATUS.REJECTED.name;
          ad.DirectorComments = reason; // Save the reason for the action
          ad.DirectorApprover = req.user.userId;
          ad.DirectorApprovedAt = getCurrentDateTime();
        }
        else if (req.user.userRoleId === USER_ROLES.FINANCE.id) {
          ad.currentStatus = EXPENSE_STATUS.FinanceRejectDone.id;
          ad.FinanceApproval = TENDER_APPROVAL_STATUS.REJECTED.name;
          ad.FinanceComments = reason; // Save the reason for the action
          ad.FinanceApprover = req.user.userId;
          ad.FinanceApprovedAt = getCurrentDateTime();
          ad.FinancePaidAmount = null;
          ad.FinanceTDSAmount = null;
          ad.paymentProofFileGuid = null;
          ad.paymentProofFileName = null;
          ad.paymentDate = null;
        }
        else {
          is_success = false;
        }
        break;
      default:
        is_success = false;
        break;
    }

    if (is_success) {
      await ad.save();
      return res.status(200).json({
        type: API_STATUS.SUCCESS,
        message: `Expense ${action} successfully`,
        data: ad,
      });
    }
    else {
      return res.status(500).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied. You are not allowed to perform this action'
      });
    }

  } catch (e) {
    next(e);
  }
};

exports.submit = async (req, res, next) => {
  const t = await Tender.findByPk(req.params.id);
  switch (req.user.userRoleId) {
    case USER_ROLES.DATA_APPLICANT.id:
      if (t.currentStatus !== 1) return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Invalid state'
      });
      t.currentStatus = 2;
      break;
    case USER_ROLES.TECH_TEAM.id:
      if (t.currentStatus !== 2) return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Invalid state'
      });
      t.currentStatus = 3;
      break;
    case USER_ROLES.DIRECTOR.id:
      if (t.currentStatus !== 3) return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Invalid state'
      });
      t.currentStatus = 4;
      break;
    default:
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied. You are not allowed to perform this action'
      });
  }
  await t.save();
  res.json(
    {
      type: API_STATUS.SUCCESS,
      message: 'Tender submitted successfully',
      data: t
    });
};

exports.submitTenderAction = async (req, res, next) => {
  try {
    const { action, reason, tenderId } = req.body; // action can be 'approve', 'reject'
    let t = await Tender.findByPk(tenderId);
    let approvalDetails = await TenderApprovalDetails.findByPk(tenderId);
    let isNewApproval = false;

    //approvalDetails doesnt exist
    if (!approvalDetails) {
      isNewApproval = true;
      approvalDetails = { createdBy: req.user.userId, tenderId: tenderId }
    }

    //tender doesnt exist
    if (!t) {
      return res.status(404).json({
        type: API_STATUS.ERROR,
        message: 'Tender not found',
      });
    }

    //tender cant be submitted by the current user or tender is not in the right state
    if ((action != TENDER_APPROVAL_STATUS.APPROVED.name && action != TENDER_APPROVAL_STATUS.REJECTED.name) ||
      (req.user.userRoleId === USER_ROLES.TECH_TEAM.id && t.currentStatus !== TENDER_STATUS.Submitted.id) ||
      (req.user.userRoleId === USER_ROLES.DIRECTOR.id && t.currentStatus !== TENDER_STATUS.TechnicalApprovalDone.id) ||
      (req.user.userRoleId !== USER_ROLES.TECH_TEAM.id && req.user.userRoleId !== USER_ROLES.DIRECTOR.id)) {
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied. You are not allowed to perform this action'
      });
    }

    // Perform the action based on the user role and action type
    switch (action) {
      case TENDER_APPROVAL_STATUS.APPROVED.name:
        if (req.user.userRoleId === USER_ROLES.TECH_TEAM.id) {
          t.currentStatus = TENDER_STATUS.TechnicalApprovalDone.id;
          approvalDetails.TechLeadApproval = TENDER_APPROVAL_STATUS.APPROVED.name;
          approvalDetails.TechLeadComments = reason; // Save the reason for the action
          approvalDetails.TechLeadApprover = req.user.userId;
          approvalDetails.TechLeadApprovedAt = getCurrentDateTime();
        }
        else if (req.user.userRoleId === USER_ROLES.DIRECTOR.id) {
          t.currentStatus = TENDER_STATUS.DirectorApprovalDone.id;
          approvalDetails.DirectorApproval = TENDER_APPROVAL_STATUS.APPROVED.name;
          approvalDetails.DirectorComments = reason; // Save the reason for the action
          approvalDetails.DirectorApprover = req.user.userId;
          approvalDetails.DirectorApprovedAt = getCurrentDateTime();
        }
        break;
      case TENDER_APPROVAL_STATUS.REJECTED.name:
        if (req.user.userRoleId === USER_ROLES.TECH_TEAM.id) {
          t.currentStatus = TENDER_STATUS.TechnicalRejectDone.id;
          approvalDetails.TechLeadApproval = TENDER_APPROVAL_STATUS.REJECTED.name;
          approvalDetails.TechLeadComments = reason; // Save the reason for the action
          approvalDetails.TechLeadApprover = req.user.userId;
          approvalDetails.TechLeadApprovedAt = getCurrentDateTime();
        }
        else if (req.user.userRoleId === USER_ROLES.DIRECTOR.id) {
          t.currentStatus = TENDER_STATUS.DirectorRejectDone.id;
          approvalDetails.DirectorApproval = TENDER_APPROVAL_STATUS.REJECTED.name;
          approvalDetails.DirectorComments = reason; // Save the reason for the action
          approvalDetails.DirectorApprover = req.user.userId;
          approvalDetails.DirectorApprovedAt = getCurrentDateTime();
        }
        break;
    }

    approvalDetails.updatedBy = req.user.userId; // Update the user who performed the action
    t.updatedBy = req.user.userId; // Update the user who performed the action

    if (isNewApproval) {
      await TenderApprovalDetails.create(approvalDetails);
    }
    else {
      await approvalDetails.save();
    }

    await t.save();

    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: `Tender ${action} successfully`,
      data: t,
    });
  } catch (e) {
    next(e);
  }
};

exports.saveTLAuthorize = async (req, res, next) => {
  try {
    const { id: tenderId } = req.params;
    const currentuser = req.user.userId;
    if (!tenderId) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Tender ID is required',
      });
    }

    const t = await Tender.findByPk(tenderId);
    if (!(req.user.userRoleId === USER_ROLES.TECH_TEAM.id &&
      t.currentStatus === TENDER_STATUS.PhysicalDocumentUploaded.id)) {
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied. You are not allowed to perform this action'
      });
    }

    // Update the status in the tender
    t.currentStatus = TENDER_STATUS.PhysicalDocumentVerified.id;
    t.updatedBy = currentuser; // Update the user who performed the action
    await t.save()

    return res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: 'Tender Authorized successfully',
      data: t,
    });

  } catch (e) {
    next(e);
  }
}

exports.saveTenderSelectionDetails = async (req, res, next) => {
  try {
    const { id: tenderId } = req.params;
    const currentuser = req.user.userId;

    // Ensure tenderId is provided
    if (!tenderId) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Tender ID is required',
      });
    }

    const t = await Tender.findByPk(tenderId);
    if (!t) {
      return res.status(404).json({
        type: API_STATUS.ERROR,
        message: 'Tender not found',
      });
    }

    if (!(req.user.userRoleId === USER_ROLES.DATA_APPLICANT.id && t.currentStatus === TENDER_STATUS.PhysicalDocumentSubmitted.id)) {
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied. You are not allowed to perform this action',
      });
    }

    const existingRecord = await TenderSelectionDetails.findByPk(tenderId);

    if (existingRecord) {
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'L0 detials already submitted.'
      });
    }
    // Prepare data for upsert
    const newRecord = await TenderSelectionDetails.create({ ...req.body, tenderId, updatedBy: currentuser, createdBy: currentuser });

    if (req.body.govStatus === "L1") {
      // Update the status in the tender
      t.currentStatus = TENDER_STATUS.L1ApprovalReceived.id;
    }
    else {
      // Update the status in the tender
      t.currentStatus = TENDER_STATUS.L2L3ApprovalReceived.id;
    }

    t.updatedBy = req.user.userId; // Update the user who performed the action
    await t.save()

    // Respond based on whether the record was created or updated
    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: 'Tender details saved successfully',
      data: newRecord,
    });
  } catch (e) {
    next(e);
  }
}

exports.saveL0Details = async (req, res, next) => {
  try {
    const { id: tenderId } = req.params;
    const currentuser = req.user.userId;

    // Ensure tenderId is provided
    if (!tenderId) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Tender ID is required',
      });
    }

    const t = await Tender.findByPk(tenderId);
    if (!t) {
      return res.status(404).json({
        type: API_STATUS.ERROR,
        message: 'Tender not found',
      });
    }

    if (!(req.user.userRoleId === USER_ROLES.FINANCE.id && t.currentStatus === TENDER_STATUS.L1ApprovalReceived.id)) {
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied. You are not allowed to perform this action',
      });
    }

    const existingRecord = await TenderLZeroDetails.findByPk(tenderId);

    if (existingRecord) {
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'L0 detials already submitted.'
      });
    }
    // Prepare data for upsert
    const newRecord = await TenderLZeroDetails.create({ ...req.body, tenderId, updatedBy: currentuser, createdBy: currentuser });

    // Update the status in the tender
    t.currentStatus = TENDER_STATUS.L0Acceptance.id;
    t.updatedBy = req.user.userId; // Update the user who performed the action
    await t.save()

    // Respond based on whether the record was created or updated
    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: 'Tender details saved successfully',
      data: newRecord,
    });
  } catch (e) {
    next(e);
  }
};

exports.saveFinanceApproval = async (req, res, next) => {
  try {
    const { id: tenderId } = req.params;
    const currentuser = req.user.userId;
    // Ensure tenderId is provided
    if (!tenderId) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Tender ID is required',
      });
    }

    const t = await Tender.findByPk(tenderId);
    if (!(req.user.userRoleId === USER_ROLES.FINANCE.id &&
      t.currentStatus === TENDER_STATUS.DirectorApprovalDone.id)) {
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied. You are not allowed to perform this action'
      });
    }

    // Check if a record exists for the given tenderId
    const existingRecord = await TenderBasicDetails.findByPk(tenderId);

    if (!existingRecord) {
      return res.status(404).json({
        type: API_STATUS.ERROR,
        message: 'Tender ID is Invalid.'
      });
    }

    // Update the existing record
    let updateData = { ...req.body, updatedBy: currentuser };
    await TenderBasicDetails.update(updateData, { where: { tenderId } });

    // Update the status in the tender
    t.currentStatus = TENDER_STATUS.FinanceApprovalDone.id;
    t.updatedBy = req.user.userId; // Update the user who performed the action
    await t.save()

    const updatedRecord = await TenderBasicDetails.findByPk(tenderId);
    return res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: 'Financial details updated successfully',
      data: updatedRecord,
    });

  } catch (e) {
    next(e);
  }
};

exports.saveSubmittedDocuments = async (req, res, next) => {
  try {
    const { id: tenderId } = req.params;
    const currentuser = req.user.userId;
    // Ensure tenderId is provided
    if (!tenderId) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Tender ID is required',
      });
    }

    const t = await Tender.findByPk(tenderId);
    if (!(req.user.userRoleId === USER_ROLES.DATA_APPLICANT.id &&
      t.currentStatus === TENDER_STATUS.PhysicalDocumentVerified.id)) {
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied. You are not allowed to perform this action'
      });
    }

    // Check if a record exists for the given tenderId
    const existingRecord = await TenderSubmittedDocument.findByPk(tenderId);

    if (existingRecord) {
      return res.status(404).json({
        type: API_STATUS.ERROR,
        message: 'Document already submitted.'
      });
    }

    // Prepare data for upsert
    const newRecord = await TenderSubmittedDocument.create({ ...req.body, tenderId, updatedBy: currentuser, createdBy: currentuser });

    // Update the status in the tender
    t.currentStatus = TENDER_STATUS.PhysicalDocumentSubmitted.id;
    t.updatedBy = req.user.userId; // Update the user who performed the action
    await t.save()

    // Respond based on whether the record was created or updated
    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: 'Tender details saved successfully',
      data: newRecord,
    });
  } catch (e) {
    next(e);
  }
};

exports.saveDaUploadedDocuments = async (req, res, next) => {
  try {
    const { id: tenderId } = req.params;
    const currentuser = req.user.userId;
    // Ensure tenderId is provided
    if (!tenderId) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Tender ID is required',
      });
    }

    const t = await Tender.findByPk(tenderId);
    if (!(req.user.userRoleId === USER_ROLES.DATA_APPLICANT.id &&
      t.currentStatus === TENDER_STATUS.FinanceApprovalDone.id)) {
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied. You are not allowed to perform this action'
      });
    }

    // Check if a record exists for the given tenderId
    const existingRecord = await TenderDocumentsForVerification.findByPk(tenderId);

    if (existingRecord) {
      return res.status(404).json({
        type: API_STATUS.ERROR,
        message: 'Document already submitted.'
      });
    }

    // Prepare data for upsert
    const newRecord = await TenderDocumentsForVerification.create({ ...req.body, tenderId, updatedBy: currentuser, createdBy: currentuser });

    // Update the status in the tender
    t.currentStatus = TENDER_STATUS.PhysicalDocumentUploaded.id;
    t.updatedBy = req.user.userId; // Update the user who performed the action
    await t.save()

    // Respond based on whether the record was created or updated
    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: 'Tender details saved successfully',
      data: newRecord,
    });
  } catch (e) {
    next(e);
  }
};

exports.saveL1ApprovalDetails = async (req, res, next) => {
  try {
    const { id: tenderId } = req.params;
    const currentuser = req.user.userId;

    // Ensure tenderId is provided
    if (!tenderId) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Tender ID is required',
      });
    }

    const t = await Tender.findByPk(tenderId);
    if (!(req.user.userRoleId === USER_ROLES.DATA_APPLICANT.id &&
      t.currentStatus === TENDER_STATUS.L0Acceptance.id)) {
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied. You are not allowed to perform this action'
      });
    }

    // Check if a record exists for the given tenderId
    const existingRecord = await TenderL1ApprovalDetails.findByPk(tenderId);

    if (existingRecord) {
      return res.status(404).json({
        type: API_STATUS.ERROR,
        message: 'L1 Approval details already submitted.'
      });
    }

    // Prepare data for upsert
    const newRecord = await TenderL1ApprovalDetails.create({ ...req.body, tenderId, updatedBy: currentuser, createdBy: currentuser });

    // Update the status in the tender
    t.currentStatus = TENDER_STATUS.L1ApprovalDone.id;
    t.updatedBy = req.user.userId; // Update the user who performed the action
    await t.save()

    // Respond based on whether the record was created or updated
    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: 'Tender details saved successfully',
      data: newRecord,
    });
  } catch (e) {
    next(e);
  }
}

exports.savePhyTrackingSetup = async (req, res, next) => {
  try {
    const { id: tenderId } = req.params;
    const currentuser = req.user.userId;

    // Ensure tenderId is provided
    if (!tenderId) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Tender ID is required',
      });
    }

    const t = await Tender.findByPk(tenderId);
    if (!(req.user.userRoleId === USER_ROLES.TECH_TEAM.id &&
      t.currentStatus === TENDER_STATUS.L1ApprovalDone.id)) {
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied. You are not allowed to perform this action'
      });
    }

    // Check if a record exists for the given tenderId
    const existingRecord = await TenderPhysicalProgress.findByPk(tenderId);

    if (existingRecord) {
      return res.status(404).json({
        type: API_STATUS.ERROR,
        message: 'Physical Tracking Setup is already done.'
      });
    }

    // Prepare data for create
    const newRecord = await TenderPhysicalProgress.create({ ...req.body, tenderId, updatedBy: currentuser, createdBy: currentuser });

    // Update the status in the tender
    t.currentStatus = TENDER_STATUS.PhysicalSetupDone.id;
    t.updatedBy = req.user.userId; // Update the user who performed the action
    await t.save()

    // Respond based on whether the record was created or updated
    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: 'Physical Tracking Setuped successfully',
      data: newRecord,
    });
  } catch (e) {
    next(e);
  }
}

const checkIfTrackingCompleted = async (tenderId) => {
  let isCompleted = true;
  const phyProgress = await TenderPhysicalProgress.findByPk(tenderId);
  const finProgress = await TenderFinancialProgress.findByPk(tenderId);
  if (phyProgress && finProgress) {
    for (let i = 0; i < phyProgress?.physicalTrackingSetUp?.length; i++) {
      if (phyProgress.physicalTrackingProgress && phyProgress.physicalTrackingProgress.length > i) {
        if (phyProgress.physicalTrackingSetUp[i].targetValue !== phyProgress.physicalTrackingProgress[i].fieldValue) {
          isCompleted = false;
          break;
        }
      }
      else {
        isCompleted = false;
        break;
      }
    }
    if (finProgress.billPaymentReceived !== finProgress.billSubmittedAmount) {
      isCompleted = false;
    }
  }
  else {
    isCompleted = false;
  }
  return isCompleted;
}

exports.savePhyTrackingProgress = async (req, res, next) => {
  try {
    const { id: tenderId } = req.params;
    const currentuser = req.user.userId;

    // Ensure tenderId is provided
    if (!tenderId) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Tender ID is required',
      });
    }

    const t = await Tender.findByPk(tenderId);
    if (!(req.user.userRoleId === USER_ROLES.TECH_TEAM.id && t.currentStatus === TENDER_STATUS.TrackingInProgress.id)) {
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied. You are not allowed to perform this action'
      });
    }

    const newRecord = await TenderPhysicalProgress.update(
      { ...req.body, updatedBy: currentuser },
      { where: { tenderId } }
    );

    let isCompleted = await checkIfTrackingCompleted(tenderId);
    if (isCompleted) {
      // Update the status in the tender
      t.currentStatus = TENDER_STATUS.TrackingCompleted.id;
      t.updatedBy = req.user.userId; // Update the user who performed the action
      await t.save();
    }

    // Respond based on whether the record was created or updated
    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: 'Physical Progress saved successfully',
      data: newRecord,
    });
  } catch (e) {
    next(e);
  }
}

exports.saveFinTrackingProgress = async (req, res, next) => {
  try {
    const { id: tenderId } = req.params;
    const currentuser = req.user.userId;

    // Ensure tenderId is provided
    if (!tenderId) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Tender ID is required',
      });
    }

    const t = await Tender.findByPk(tenderId);
    if (!(req.user.userRoleId === USER_ROLES.FINANCE.id && (
      t.currentStatus === TENDER_STATUS.PhysicalSetupDone.id || (
        t.currentStatus === TENDER_STATUS.TrackingInProgress.id)
    ))) {
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied. You are not allowed to perform this action'
      });
    }

    // Prepare data for upsert
    const upsertData = { ...req.body, tenderId, updatedBy: currentuser };

    // Perform upsert
    const [record, created] = await TenderFinancialProgress.upsert(upsertData, { returning: true });

    if (t.currentStatus === TENDER_STATUS.PhysicalSetupDone.id) {
      t.currentStatus = TENDER_STATUS.TrackingInProgress.id;
      t.updatedBy = req.user.userId; // Update the user who performed the action
      await t.save();
    }
    // if Tracking in progress then check if project is completed
    else if (t.currentStatus === TENDER_STATUS.TrackingInProgress.id) {
      let isCompleted = await checkIfTrackingCompleted(tenderId);
      if (isCompleted) {
        // Update the status in the tender
        t.currentStatus = TENDER_STATUS.TrackingCompleted.id;
        t.updatedBy = req.user.userId; // Update the user who performed the action
        await t.save();
      }
    }

    // Respond based on whether the record was created or updated
    res.status(created ? 201 : 200).json({
      type: API_STATUS.SUCCESS,
      message: created
        ? 'Financial Tracking created successfully'
        : 'Financial Progress updated successfully',
      data: record,
    });
  } catch (e) {
    next(e);
  }
}

exports.saveFinancialClosure = async (req, res, next) => {
  try {
    const { id: tenderId } = req.params;
    const currentuser = req.user.userId;

    // Ensure tenderId is provided
    if (!tenderId) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Tender ID is required',
      });
    }

    const t = await Tender.findByPk(tenderId);
    if (!(req.user.userRoleId === USER_ROLES.FINANCE.id &&
      (t.currentStatus === TENDER_STATUS.TrackingCompleted.id || t.currentStatus === TENDER_STATUS.L2L3ApprovalReceived.id))) {
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied. You are not allowed to perform this action'
      });
    }

    // Check if a record exists for the given tenderId
    const existingRecord = await TenderFinancialClosure.findByPk(tenderId);
    if (existingRecord) {
      return res.status(404).json({
        type: API_STATUS.ERROR,
        message: 'Financial Closure already submitted.'
      });
    }

    // Prepare data for upsert
    const newRecord = await TenderFinancialClosure.create({ ...req.body, tenderId, updatedBy: currentuser, createdBy: currentuser });

    // Update the status in the tender
    t.currentStatus = TENDER_STATUS.FinancialClosed.id;
    t.updatedBy = req.user.userId; // Update the user who performed the action
    await t.save()

    // Respond based on whether the record was created or updated
    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: 'Financial Closure saved successfully',
      data: newRecord,
    });
  } catch (e) {
    next(e);
  }
}

exports.saveFinalClosure = async (req, res, next) => {
  try {
    const { id: tenderId } = req.params;
    const currentuser = req.user.userId;

    // Ensure tenderId is provided
    if (!tenderId) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Tender ID is required',
      });
    }

    const t = await Tender.findByPk(tenderId);
    if (!(req.user.userRoleId === USER_ROLES.DIRECTOR.id && t.currentStatus === TENDER_STATUS.FinancialClosed.id)) {
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied. You are not allowed to perform this action'
      });
    }

    // Check if a record exists for the given tenderId
    const existingRecord = await TenderClosureDetails.findByPk(tenderId);
    if (existingRecord) {
      return res.status(404).json({
        type: API_STATUS.ERROR,
        message: 'Project already completed.'
      });
    }

    // Prepare data for upsert
    const newRecord = await TenderClosureDetails.create({ ...req.body, tenderId, updatedBy: currentuser, createdBy: currentuser });

    // Update the status in the tender
    t.currentStatus = TENDER_STATUS.ProjectCompleted.id;
    t.updatedBy = req.user.userId; // Update the user who performed the action
    await t.save()

    // Respond based on whether the record was created or updated
    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: 'Project Completed saved successfully',
      data: newRecord,
    });
  } catch (e) {
    next(e);
  }
}

exports.saveCorrigendumData = async (req, res, next) => {
  try {
    const { id: tenderId } = req.params;
    const currentuser = req.user.userId;
    // Ensure tenderId is provided
    if (!tenderId) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Project ID is required',
      });
    }

    const t = await Tender.findByPk(tenderId);
    if (req.user.userRoleId !== USER_ROLES.DATA_APPLICANT.id && (
      t.currentStatus < TENDER_STATUS.Submitted.id ||
      t.currentStatus >= TENDER_STATUS.ProjectCompleted.id)) {
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied. You are not allowed to perform this action'
      });
    }

    // Prepare data for upsert
    const newRecord = await TenderCorrigendum.create({ ...req.body, tenderId, updatedBy: currentuser, createdBy: currentuser });

    // Respond based on whether the record was created or updated
    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: 'Corrigendum Data saved successfully',
      data: newRecord,
    });
  } catch (e) {
    next(e);
  }
};

exports.saveExpenseData = async (req, res, next) => {
  try {
    const currentuser = req.user.userId;

    // Ensure tenderId is provided
    if (!req.body.tenderId) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Project ID is required',
      });
    }

    const t = await Tender.findByPk(req.body.tenderId);
    if (req.user.userRoleId !== USER_ROLES.DATA_APPLICANT.id && t.currentStatus >= TENDER_STATUS.ProjectCompleted.id) {
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied. You are not allowed to perform this action'
      });
    }

    // Prepare data for create
    const newRecord = await TenderSubmittedExpense.create({ ...req.body, userId: currentuser, updatedBy: currentuser, createdBy: currentuser });

    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: 'Expense Data Submitted successfully',
      data: newRecord,
    });
  } catch (e) {
    next(e);
  }
};