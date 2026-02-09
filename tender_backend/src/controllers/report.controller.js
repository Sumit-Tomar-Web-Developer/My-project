const { Tender, TenderSubmittedExpense, TenderBasicDetails, MasterDepartment, MasterExpenseStatus, MasterExpenseType, User, TenderEmdFeeDetails, TenderFeeDetails, TenderCriticalDates, TenderFinancialProgress, MasterTenderStatus } = require('../models');
const bcrypt = require('bcryptjs');
const config = require('../config');
const { API_STATUS, generateRandomPassword, USER_ROLES, EXPENSE_STATUS } = require('../utilities/utils');

const sequelize = require('sequelize');

const { Op } = sequelize;

/**
 * @swagger
 * /report/getProjectCountByStatus:
 *   get:
 *     summary: Get project count grouped by status
 *     description: Retrieves the count of projects grouped by their status along with pagination.
 *     tags:
 *       - Reports
 *     parameters:
 *     responses:
 *       200:
 *         description: Successfully retrieved project counts grouped by status.
 *       500:
 *         description: Internal server error.
 */

/**
 * Retrieves the count of projects grouped by their status with pagination.
 *
 * @async
 * @function getProjectCountByStatus
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a JSON response with project counts grouped by status.
 */
exports.getProjectCountByStatus = async (req, res, next) => {
    try {
        const tenderCounts = await Tender.findAll({
            attributes: ['statusId', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
            group: ['statusId']
        });

        const totalCount = await Tender.count();

        const users = tenderCounts.map((tender) => ({
            status: tender.currentStatus,
            count: tender.dataValues.count,
        }));

        const count = totalCount;

        res.status(200).json({
            type: API_STATUS.SUCCESS,
            message: "",
            data: {
                countbystatus: users,
                total: count
            },
        });
    } catch (e) {
        next(e);
    }
};

const buildTenderExpenseQuery = (params) => {
    let { page = 0, size = 10, sort = 'createdAt', order = 'DESC', tenderId, expenseAmountStart, expenseAmountEnd, expenseSubmittedDateStart, expenseSubmittedDateEnd, userId, departmentId, expenseStatusId } = params;

    page = parseInt(page, 10);
    size = parseInt(size, 10);
    if (isNaN(page) || page < 0) page = 0;
    if (isNaN(size) || size <= 0) size = 10;

    const offset = page * size;
    const limit = size;
    const whereClause = {};

    const parsedTenderId = tenderId ? parseInt(tenderId, 10) : null;
    if (parsedTenderId) {
        whereClause.tenderId = parsedTenderId;
    }

    const amountFilters = {};
    let isValidAmount = false;
    const parsedAmountStart = expenseAmountStart ? parseFloat(expenseAmountStart) : null;
    const parsedAmountEnd = expenseAmountEnd ? parseFloat(expenseAmountEnd) : null;

    if (parsedAmountStart !== null && !isNaN(parsedAmountStart)) {
        amountFilters[sequelize.Op.gte] = parsedAmountStart;
        isValidAmount = true;
    }
    if (parsedAmountEnd !== null && !isNaN(parsedAmountEnd)) {
        amountFilters[sequelize.Op.lte] = parsedAmountEnd;
        isValidAmount = true;
    }
    if (isValidAmount) {
        whereClause.expenseamount = amountFilters;
    }

    const dateFilters = {};
    let isValidDate = false;
    if (expenseSubmittedDateStart) {
        dateFilters[sequelize.Op.gte] = new Date(expenseSubmittedDateStart);
        isValidDate = true;
    }
    if (expenseSubmittedDateEnd) {
        dateFilters[sequelize.Op.lte] = new Date(expenseSubmittedDateEnd);
        isValidDate = true;
    }

    if (isValidDate) {
        whereClause.createdAt = dateFilters;
    }

    if (userId) {
        whereClause.userId = userId;
    }

    const parsedExpenseStatusId = expenseStatusId ? parseInt(expenseStatusId, 10) : null;
    if (parsedExpenseStatusId) {
        whereClause.currentStatus = parsedExpenseStatusId;
    }

    const parsedDepartmentId = departmentId ? parseInt(departmentId, 10) : null;

    return {
        parsedDepartmentId,
        whereClause,
        offset,
        limit,
        page,
        sort,
        order,
    };
};

const buildTenderMonitoringFilters = (params = {}) => {
    const {
        tenderId,
        tenderStatusId,
        departmentId,
        tenderIdentifier,
        location,
        createdAtStart,
        createdAtEnd,
        publishDateStart,
        publishDateEnd,
        bidOpeningDateStart,
        bidOpeningDateEnd,
        downloadStartDateStart,
        downloadStartDateEnd,
        downloadEndDateStart,
        downloadEndDateEnd,
        clarificationStartDateStart,
        clarificationStartDateEnd,
        clarificationEndDateStart,
        clarificationEndDateEnd,
        submissionStartDateStart,
        submissionStartDateEnd,
        submissionEndDateStart,
        submissionEndDateEnd,
        extensionDateStart,
        extensionDateEnd,
        year
    } = params;

    const tenderWhere = {};
    const basicWhere = {};
    const criticalWhere = {};

    if (tenderId) {
        tenderWhere.id = parseInt(tenderId, 10);
    }

    if (tenderStatusId) {
        tenderWhere.currentStatus = parseInt(tenderStatusId, 10);
    }

    if (year) {
        tenderWhere[Op.and] = tenderWhere[Op.and] || [];
        tenderWhere[Op.and].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('Tender.createdAt')), parseInt(year, 10)));
    }

    if (createdAtStart || createdAtEnd) {
        tenderWhere.createdAt = {};
        if (createdAtStart) {
            tenderWhere.createdAt[Op.gte] = new Date(createdAtStart);
        }
        if (createdAtEnd) {
            tenderWhere.createdAt[Op.lte] = new Date(createdAtEnd);
        }
    }

    if (departmentId) {
        basicWhere.department = parseInt(departmentId, 10);
    }

    if (tenderIdentifier) {
        basicWhere.tenderIdText = tenderIdentifier;
    }

    if (location) {
        basicWhere.location = location;
    }

    const addDateFilter = (fieldName, start, end) => {
        if (start || end) {
            criticalWhere[fieldName] = {};
            if (start) {
                criticalWhere[fieldName][Op.gte] = new Date(start);
            }
            if (end) {
                criticalWhere[fieldName][Op.lte] = new Date(end);
            }
        }
    };

    addDateFilter('publishDate', publishDateStart, publishDateEnd);
    addDateFilter('bidOpeningDate', bidOpeningDateStart, bidOpeningDateEnd);
    addDateFilter('downloadStartDate', downloadStartDateStart, downloadStartDateEnd);
    addDateFilter('downloadEndDate', downloadEndDateStart, downloadEndDateEnd);
    addDateFilter('clarificationStartDate', clarificationStartDateStart, clarificationStartDateEnd);
    addDateFilter('clarificationEndDate', clarificationEndDateStart, clarificationEndDateEnd);
    addDateFilter('submissionStartDate', submissionStartDateStart, submissionStartDateEnd);
    addDateFilter('submissionEndDate', submissionEndDateStart, submissionEndDateEnd);
    addDateFilter('extensionDate', extensionDateStart, extensionDateEnd);

    return {
        tenderWhere,
        basicWhere,
        criticalWhere
    };
};

const fetchTenderMonitoringReport = async (filters) => {
    const { tenderWhere, basicWhere, criticalWhere } = filters;

    const records = await Tender.findAll({
        attributes: [
            'id',
            [sequelize.col('status.name'), 'currentstatus'],
            [sequelize.col('TenderBasicDetail->dep.departmentname'), 'department'],
            [sequelize.col('TenderBasicDetail.tenderIdText'), 'tenderid'],
            [sequelize.col('TenderBasicDetail.location'), 'location'],
            [sequelize.col('Tender.createdAt'), 'TenderCreateddate'],
            [sequelize.col('TenderEmdFeeDetail.emdAmount'), 'emdAmount'],
            [sequelize.col('TenderEmdFeeDetail.exemptionEmd'), 'EmdFeeExempted'],
            [sequelize.col('TenderFeeDetail.tenderFee'), 'tenderFee'],
            [sequelize.col('TenderFeeDetail.processingFee'), 'processingFee'],
            [sequelize.col('TenderFeeDetail.exemptionTenderFee'), 'TenderFeeExempted'],
            [sequelize.col('TenderCriticalDate.publishDate'), 'publishDate'],
            [sequelize.col('TenderCriticalDate.bidOpeningDate'), 'bidOpeningDate'],
            [sequelize.col('TenderCriticalDate.downloadStartDate'), 'downloadStartDate'],
            [sequelize.col('TenderCriticalDate.downloadEndDate'), 'downloadEndDate'],
            [sequelize.col('TenderCriticalDate.clarificationStartDate'), 'clarificationStartDate'],
            [sequelize.col('TenderCriticalDate.clarificationEndDate'), 'clarificationEndDate'],
            [sequelize.col('TenderCriticalDate.submissionStartDate'), 'submissionStartDate'],
            [sequelize.col('TenderCriticalDate.submissionEndDate'), 'submissionEndDate'],
            [sequelize.col('TenderCriticalDate.extensionDate'), 'extensionDate'],
            [sequelize.col('TenderFinancialProgress.billSubmittedAmount'), 'billSubmittedAmount'],
            [sequelize.col('TenderFinancialProgress.billPaymentReceived'), 'billPaymentReceived'],
            [sequelize.col('TenderFinancialProgress.amountVarianceReason'), 'amountVarianceReason']
        ],
        include: [
            {
                model: MasterTenderStatus,
                as: 'status',
                attributes: [],
                required: false
            },
            {
                model: TenderBasicDetails,
                attributes: [],
                required: Object.keys(basicWhere).length > 0,
                where: basicWhere,
                include: [
                    {
                        model: MasterDepartment,
                        as: 'dep',
                        attributes: [],
                        required: false
                    }
                ]
            },
            {
                model: TenderEmdFeeDetails,
                attributes: [],
                required: false
            },
            {
                model: TenderFeeDetails,
                attributes: [],
                required: false
            },
            {
                model: TenderCriticalDates,
                attributes: [],
                required: Object.keys(criticalWhere).length > 0,
                where: criticalWhere
            },
            {
                model: TenderFinancialProgress,
                attributes: [],
                required: false
            }
        ],
        where: tenderWhere,
        raw: true
    });

    const aggregateddata = records.reduce((acc, record) => {
        acc.emdAmount += parseFloat(record.emdAmount || 0);
        acc.tenderFee += parseFloat(record.tenderFee || 0);
        acc.processingFee += parseFloat(record.processingFee || 0);
        acc.billSubmittedAmount += parseFloat(record.billSubmittedAmount || 0);
        acc.billPaymentReceived += parseFloat(record.billPaymentReceived || 0);
        return acc;
    }, {
        id: null,
        currentstatus: null,
        department: null,
        tenderid: null,
        location: null,
        TenderCreateddate: null,
        emdAmount: 0,
        EmdFeeExempted: null,
        tenderFee: 0,
        processingFee: 0,
        TenderFeeExempted: null,
        publishDate: null,
        bidOpeningDate: null,
        downloadStartDate: null,
        downloadEndDate: null,
        clarificationStartDate: null,
        clarificationEndDate: null,
        submissionStartDate: null,
        submissionEndDate: null,
        extensionDate: null,
        billSubmittedAmount: 0,
        billPaymentReceived: 0,
        amountVarianceReason: null
    });

    return {
        totalrow: records.length,
        aggregateddata,
        records
    };
};

const fetchTenderExpenseReport = async (filters) => {
    const { parsedDepartmentId, whereClause, offset, limit, page, sort, order } = filters;

    const expenses = await TenderSubmittedExpense.findAndCountAll({
        attributes: [
            'id',
            'tenderId',
            'expenseamount',
            'TechLeadApproval',
            'DirectorApproval',
            'FinanceApproval',
            'FinancePaidAmount',
            'FinanceTDSAmount',
            [sequelize.col('TenderSubmittedExpense.createdAt'), 'submittedDate'],
            [sequelize.col('status.name'), 'status'],
            [sequelize.col('ExpenseType.expenseType'), 'expenseType'],
            [sequelize.col('User.userId'), 'userId'],
            [sequelize.col('User->MasterDepartment.departmentname'), 'departmentName']
        ],
        include: [
            {
                model: MasterExpenseStatus,
                as: 'status',
                attributes: [],
            },
            {
                model: MasterExpenseType,
                as: 'ExpenseType',
                attributes: [],
            },
            {
                model: User,
                as: 'User',
                attributes: [],
                include: [
                    {
                        model: MasterDepartment,
                        attributes: [],
                    }
                ]
            },
            {
                model: TenderBasicDetails,
                attributes: [],
                required: !!parsedDepartmentId,
                where: parsedDepartmentId ? { department: parsedDepartmentId } : {}
            }
        ],
        where: whereClause,
        offset,
        limit,
        order: [[sort, order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']],
        raw: true
    });

    return {
        records: expenses.rows,
        total: expenses.count,
        currentPage: page,
        totalPages: Math.ceil(expenses.count / limit)
    };
};

/**
 * @swagger
 * /report/tenderexpensereport:
 *   get:
 *     summary: Get detailed tender expense report
 *     description: Retrieves tender expense records with optional filters and pagination. Each record includes `submittedDate` reflecting the expense submission timestamp.
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: query
 *         name: tenderId
 *         schema:
 *           type: integer
 *         description: Filter by tender ID. If omitted, all tenders are included.
 *       - in: query
 *         name: expenseAmountStart
 *         schema:
 *           type: number
 *         description: Minimum expense amount (inclusive). If omitted, no lower bound is applied.
 *       - in: query
 *         name: expenseAmountEnd
 *         schema:
 *           type: number
 *         description: Maximum expense amount (inclusive). If omitted, no upper bound is applied.
 *       - in: query
 *         name: expenseSubmittedDateStart
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for expense submission (inclusive). If omitted, no start date filter is applied.
 *       - in: query
 *         name: expenseSubmittedDateEnd
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for expense submission (inclusive). If omitted, no end date filter is applied.
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by the user who submitted the expense.
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: integer
 *         description: Filter by department owning the tender.
 *       - in: query
 *         name: expenseStatusId
 *         schema:
 *           type: integer
 *         description: Filter by expense status ID.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Page number for pagination (0-indexed).
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           default: DESC
 *           enum: [ASC, DESC]
 *         description: Sort order.
 *     responses:
 *       200:
 *         description: Successfully retrieved tender expense report.
 *       500:
 *         description: Internal server error.
 */

/**
 * Retrieves tender expense records with flexible filters and pagination.
 *
 * @async
 * @function getTenderExpenseReport
 * @param {Object} req - Express request object containing query filters.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a JSON response with paginated expense records.
 */
exports.getTenderExpenseReport = async (req, res, next) => {
    try {
        const filters = buildTenderExpenseQuery(req.query);
        const data = await fetchTenderExpenseReport(filters);

        res.status(200).json({
            type: API_STATUS.SUCCESS,
            message: "",
            data,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @swagger
 * /report/tenderexpensereport:
 *   post:
 *     summary: Get detailed tender expense report using request body
 *     description: Retrieves tender expense records with optional filters and pagination using a JSON body. Each record includes `submittedDate` reflecting the expense submission timestamp.
 *     tags:
 *       - Reports
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tenderId:
 *                 type: integer
 *                 description: Filter by tender ID. If omitted, all tenders are included.
 *               expenseAmountStart:
 *                 type: number
 *                 description: Minimum expense amount (inclusive). If omitted, no lower bound is applied.
 *               expenseAmountEnd:
 *                 type: number
 *                 description: Maximum expense amount (inclusive). If omitted, no upper bound is applied.
 *               expenseSubmittedDateStart:
 *                 type: string
 *                 format: date
 *                 description: Start date for expense submission (inclusive). If omitted, no start date filter is applied.
 *               expenseSubmittedDateEnd:
 *                 type: string
 *                 format: date
 *                 description: End date for expense submission (inclusive). If omitted, no end date filter is applied.
 *               userId:
 *                 type: string
 *                 description: Filter by the user who submitted the expense.
 *               departmentId:
 *                 type: integer
 *                 description: Filter by department owning the tender.
 *               expenseStatusId:
 *                 type: integer
 *                 description: Filter by expense status ID.
 *               page:
 *                 type: integer
 *                 default: 0
 *                 description: Page number for pagination (0-indexed).
 *               size:
 *                 type: integer
 *                 default: 10
 *                 description: Number of records per page.
 *               sort:
 *                 type: string
 *                 default: createdAt
 *                 description: Field to sort by.
 *               order:
 *                 type: string
 *                 default: DESC
 *                 enum: [ASC, DESC]
 *                 description: Sort order.
 *     responses:
 *       200:
 *         description: Successfully retrieved tender expense report.
 *       500:
 *         description: Internal server error.
 */
exports.postTenderExpenseReport = async (req, res, next) => {
    try {
        const filters = buildTenderExpenseQuery(req.body || {});
        const data = await fetchTenderExpenseReport(filters);

        res.status(200).json({
            type: API_STATUS.SUCCESS,
            message: "",
            data,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @swagger
 * /report/tendermonitoringreport:
 *   get:
 *     summary: Get tender monitoring report
 *     description: Retrieves tender monitoring data with flexible filters. Supports range filters on all date fields, tender identifiers, status, department, and location. Aggregated totals are returned in `aggregateddata` and the number of matched rows is provided as `totalrow`.
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: query
 *         name: tenderId
 *         schema:
 *           type: integer
 *         description: Filter by tender ID.
 *       - in: query
 *         name: tenderStatusId
 *         schema:
 *           type: integer
 *         description: Filter by tender status ID.
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: integer
 *         description: Filter by department ID.
 *       - in: query
 *         name: tenderIdentifier
 *         schema:
 *           type: string
 *         description: Filter by tender identifier text.
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by tender location.
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year of tender creation.
 *       - in: query
 *         name: createdAtStart
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tenders created on or after this date.
 *       - in: query
 *         name: createdAtEnd
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tenders created on or before this date.
 *       - in: query
 *         name: publishDateStart
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter publish dates on or after this date.
 *       - in: query
 *         name: publishDateEnd
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter publish dates on or before this date.
 *       - in: query
 *         name: bidOpeningDateStart
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter bid opening dates on or after this date.
 *       - in: query
 *         name: bidOpeningDateEnd
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter bid opening dates on or before this date.
 *       - in: query
 *         name: downloadStartDateStart
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter download start dates on or after this date.
 *       - in: query
 *         name: downloadStartDateEnd
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter download start dates on or before this date.
 *       - in: query
 *         name: downloadEndDateStart
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter download end dates on or after this date.
 *       - in: query
 *         name: downloadEndDateEnd
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter download end dates on or before this date.
 *       - in: query
 *         name: clarificationStartDateStart
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter clarification start dates on or after this date.
 *       - in: query
 *         name: clarificationStartDateEnd
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter clarification start dates on or before this date.
 *       - in: query
 *         name: clarificationEndDateStart
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter clarification end dates on or after this date.
 *       - in: query
 *         name: clarificationEndDateEnd
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter clarification end dates on or before this date.
 *       - in: query
 *         name: submissionStartDateStart
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter submission start dates on or after this date.
 *       - in: query
 *         name: submissionStartDateEnd
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter submission start dates on or before this date.
 *       - in: query
 *         name: submissionEndDateStart
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter submission end dates on or after this date.
 *       - in: query
 *         name: submissionEndDateEnd
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter submission end dates on or before this date.
 *       - in: query
 *         name: extensionDateStart
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter extension dates on or after this date.
 *       - in: query
 *         name: extensionDateEnd
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter extension dates on or before this date.
 *     responses:
 *       200:
 *         description: Successfully retrieved tender monitoring report.
 *       500:
 *         description: Internal server error.
 */
exports.getTenderMonitoringReport = async (req, res, next) => {
    try {
        const filters = buildTenderMonitoringFilters(req.query || {});
        const data = await fetchTenderMonitoringReport(filters);

        res.status(200).json({
            type: API_STATUS.SUCCESS,
            message: "",
            data
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @swagger
 * /report/tendermonitoringreport:
 *   post:
 *     summary: Get tender monitoring report with JSON body
 *     description: Retrieves tender monitoring data using filters supplied in the request body. Supports the same filters as the GET endpoint.
 *     tags:
 *       - Reports
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tenderId:
 *                 type: integer
 *                 description: Filter by tender ID.
 *               tenderStatusId:
 *                 type: integer
 *                 description: Filter by tender status ID.
 *               departmentId:
 *                 type: integer
 *                 description: Filter by department ID.
 *               tenderIdentifier:
 *                 type: string
 *                 description: Filter by tender identifier text.
 *               location:
 *                 type: string
 *                 description: Filter by tender location.
 *               year:
 *                 type: integer
 *                 description: Filter by year of tender creation.
 *               createdAtStart:
 *                 type: string
 *                 format: date
 *               createdAtEnd:
 *                 type: string
 *                 format: date
 *               publishDateStart:
 *                 type: string
 *                 format: date
 *               publishDateEnd:
 *                 type: string
 *                 format: date
 *               bidOpeningDateStart:
 *                 type: string
 *                 format: date
 *               bidOpeningDateEnd:
 *                 type: string
 *                 format: date
 *               downloadStartDateStart:
 *                 type: string
 *                 format: date
 *               downloadStartDateEnd:
 *                 type: string
 *                 format: date
 *               downloadEndDateStart:
 *                 type: string
 *                 format: date
 *               downloadEndDateEnd:
 *                 type: string
 *                 format: date
 *               clarificationStartDateStart:
 *                 type: string
 *                 format: date
 *               clarificationStartDateEnd:
 *                 type: string
 *                 format: date
 *               clarificationEndDateStart:
 *                 type: string
 *                 format: date
 *               clarificationEndDateEnd:
 *                 type: string
 *                 format: date
 *               submissionStartDateStart:
 *                 type: string
 *                 format: date
 *               submissionStartDateEnd:
 *                 type: string
 *                 format: date
 *               submissionEndDateStart:
 *                 type: string
 *                 format: date
 *               submissionEndDateEnd:
 *                 type: string
 *                 format: date
 *               extensionDateStart:
 *                 type: string
 *                 format: date
 *               extensionDateEnd:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Successfully retrieved tender monitoring report.
 *       500:
 *         description: Internal server error.
 */
exports.postTenderMonitoringReport = async (req, res, next) => {
    try {
        const filters = buildTenderMonitoringFilters(req.body || {});
        const data = await fetchTenderMonitoringReport(filters);

        res.status(200).json({
            type: API_STATUS.SUCCESS,
            message: "",
            data
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @swagger
 * /report/departmentAggregatedExpenseReport:
 *   get:
 *     summary: Get department Aggregated Expense Report
 *     description: Retrieves total submitted, disbursed, and rejected expenses for each department, filtered by year and optional department ID.
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year for which the report is requested (e.g., 2025).
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: integer
 *         description: Department ID to filter the report; if omitted, returns data for all departments.
 *     responses:
 *       200:
 *         description: Successfully retrieved expense summary.
 *       500:
 *         description: Internal server error.
 */

/**
 * Retrieves yearly expense summary grouped by department with optional filters for year and department.
 *
 * @async
 * @function getDepartmentExpenseReport
 * @param {Object} req - Express request object containing optional query parameters `year` and `departmentId`.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a JSON response with aggregated expense totals.
 */
exports.getDepartmentExpenseReport = async (req, res, next) => {
    try {
        const { year, departmentId } = req.query;
        const parsedYear = year ? parseInt(year, 10) : null;
        const parsedDepartmentId = departmentId ? parseInt(departmentId, 10) : null;

        const rejectionStatuses = [
            EXPENSE_STATUS.TechnicalRejectDone.id,
            EXPENSE_STATUS.DirectorRejectDone.id,
            EXPENSE_STATUS.FinanceRejectDone.id
        ];

        const whereClause = {};

        if (parsedYear) {
            whereClause[sequelize.Op.and] = [
                sequelize.where(
                    sequelize.fn('YEAR', sequelize.col('TenderSubmittedExpense.createdAt')),
                    parsedYear
                )
            ];
        }

        const report = await TenderSubmittedExpense.findAll({
            attributes: [
                [sequelize.col('TenderBasicDetail.department'), 'departmentId'],
                [sequelize.col('TenderBasicDetail->dep.departmentname'), 'departmentName'],
                [sequelize.fn('SUM', sequelize.col('TenderSubmittedExpense.expenseamount')), 'totalExpenseSubmitted'],
                [
                    sequelize.fn(
                        'SUM',
                        sequelize.literal(`CASE WHEN TenderSubmittedExpense.currentStatus = ${EXPENSE_STATUS.Completed.id} THEN TenderSubmittedExpense.expenseamount ELSE 0 END`)
                    ),
                    'totalExpenseDisbursed'
                ],
                [
                    sequelize.fn(
                        'SUM',
                        sequelize.literal(`CASE WHEN TenderSubmittedExpense.currentStatus IN (${rejectionStatuses.join(',')}) THEN TenderSubmittedExpense.expenseamount ELSE 0 END`)
                    ),
                    'totalExpensesRejected'
                ],
            ],
            include: [
                {
                    model: TenderBasicDetails,
                    attributes: [],
                    where: parsedDepartmentId ? { department: parsedDepartmentId } : {},
                    required: true,
                    include: [
                        {
                            model: MasterDepartment,
                            as: 'dep',
                            attributes: [],
                        }
                    ]
                }
            ],
            where: whereClause,
            group: ['TenderBasicDetail.department', 'TenderBasicDetail->dep.departmentname'],
            order: [[sequelize.col('TenderBasicDetail->dep.departmentname'), 'ASC']]
        });

        res.status(200).json({
            type: API_STATUS.SUCCESS,
            message: "",
            data: report,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * @swagger
 * /report/tenderAggregatedExpenseReport:
 *   get:
 *     summary: Get tender Aggregated Expense Report
 *     description: Retrieves total submitted, disbursed, and rejected expenses for each tender, filtered by year and optional department ID.
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year for which the report is requested (e.g., 2025).
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: integer
 *         description: Department ID to filter the report; if omitted, returns data for all departments.
 *     responses:
 *       200:
 *         description: Successfully retrieved tender aggregated expense summary.
 *       500:
 *         description: Internal server error.
 */

/**
 * Retrieves tender-level expense summary with optional filters for year and department.
 *
 * @async
 * @function getTenderAggregatedExpenseReport
 * @param {Object} req - Express request object containing optional query parameters `year` and `departmentId`.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a JSON response with aggregated expense totals by tender.
 */
exports.getTenderAggregatedExpenseReport = async (req, res, next) => {
    try {
        const { year, departmentId } = req.query;
        const parsedYear = year ? parseInt(year, 10) : null;
        const parsedDepartmentId = departmentId ? parseInt(departmentId, 10) : null;

        const rejectionStatuses = [
            EXPENSE_STATUS.TechnicalRejectDone.id,
            EXPENSE_STATUS.DirectorRejectDone.id,
            EXPENSE_STATUS.FinanceRejectDone.id
        ];

        const whereClause = {};

        if (parsedYear) {
            whereClause[sequelize.Op.and] = [
                sequelize.where(
                    sequelize.fn('YEAR', sequelize.col('TenderSubmittedExpense.createdAt')),
                    parsedYear
                )
            ];
        }

        const report = await TenderSubmittedExpense.findAll({
            attributes: [
                'tenderId',
                [sequelize.col('TenderBasicDetail.tenderIdText'), 'tenderIdentifier'],
                [sequelize.col('TenderBasicDetail->dep.departmentname'), 'departmentName'],
                [sequelize.fn('SUM', sequelize.col('TenderSubmittedExpense.expenseamount')), 'totalExpenseSubmitted'],
                [
                    sequelize.fn(
                        'SUM',
                        sequelize.literal(`CASE WHEN TenderSubmittedExpense.currentStatus = ${EXPENSE_STATUS.Completed.id} THEN TenderSubmittedExpense.expenseamount ELSE 0 END`)
                    ),
                    'totalExpenseDisbursed'
                ],
                [
                    sequelize.fn(
                        'SUM',
                        sequelize.literal(`CASE WHEN TenderSubmittedExpense.currentStatus IN (${rejectionStatuses.join(',')}) THEN TenderSubmittedExpense.expenseamount ELSE 0 END`)
                    ),
                    'totalExpensesRejected'
                ],
            ],
            include: [
                {
                    model: TenderBasicDetails,
                    attributes: [],
                    where: parsedDepartmentId ? { department: parsedDepartmentId } : {},
                    required: true,
                    include: [
                        {
                            model: MasterDepartment,
                            as: 'dep',
                            attributes: [],
                        }
                    ]
                }
            ],
            where: whereClause,
            group: ['TenderSubmittedExpense.tenderId', 'TenderBasicDetail.tenderIdText', 'TenderBasicDetail->dep.departmentname'],
            order: [[sequelize.col('TenderSubmittedExpense.tenderId'), 'ASC']]
        });

        res.status(200).json({
            type: API_STATUS.SUCCESS,
            message: "",
            data: report,
        });
    } catch (e) {
        next(e);
    }
};
