import express from 'express';

import authRoute from './auth/authRoute.js';
import userRoute from './auth/userRoutes.js';
import commonRoute from './commonRoutes/commonRoute.js';

//Assessment Imports
import dataEntryRoute from './assessment/dataEntryRoute.js';
import MutationRoute from './assessment/mutationRoute.js';
import appealRoute from './assessment/appealRoute.js';
import zoningRoute from './assessment/zoningRoute.js';
import renterMutationRoute from './assessment/renterMutationRoute.js';
import totalValuation from './assessment/totalValuation.js';

//Master Imports
import applyTaxRoute from './master/applyTaxRoute.js';
import assessmentRuleRoute from './master/assessmentRuleRoutes.js';
import floorMasterRoute from './master/floorMasterRoute.js';
import constructionTypeMasterRoute from './master/constructionTypeMasterRoute.js';
import depreciationMasterRoute from './master/depreciationMasterRoute.js';
import factorMasterRoute from './master/factorRoute.js';
import applyTaxPrimeMaster from './master/applyTaxMasterPrime.js';
import TypeOfUsePrimeRoute from './master/TypeOfUsePrimeRoute.js';
import TypeOfUseRoute from './master/TypeOfUseRoute.js';
import typeOfUsePrimeMasterRoute from './master/typeOfUsePrimeMasterRoute.js';
import zoneMaster from './master/zoneMaster.js';
import applyPenaltyTaxMasterRoute from './master/applyPenaltyTaxMasterRoute.js';
import maintenanceRoute from './master/maintenanceRoute.js';
import taxNameMasterRoute from './master/taxNameMasterRoute.js';
import propertTypeRoute from './master/propertyTypeRoute.js';
import openPlotRateRoute from './master/openPlotRateRoute.js';
import taxMasterRoute from './master/taxMasterRoute.js';
import rateMasterRoute from './master/rateMasterRoute.js';
import bankMasterRoute from './master/bankMasterRoute.js';
import activeTaxMasterRoute from './master/activeTaxMasterRoute.js';
import activeYearMasterRoute from './master/activeYearMasterRoute.js';
import zoneSectionMasterRoute from './master/zoneSectionRoute.js';
import councilInfoRoute from './master/councilDetailsRoute.js';
import transYearRoute from './master/transYearMastRoute.js';

//utility imports
import addTaxesRoute from './utility/addTaxesRoute.js';
import setPoliciesRoute from './utility/setPoliciesRoute.js';
import autowardRoute from './utility/autowardRoute.js';
import dataEntrySameAsRoute from './utility/dataEntrySameAsRoute.js';
import updatePropertyDetails from './utility/updatePropertyDetailsRoute.js';
import wardAllocation from './utility/wardAllocationRoute.js';
import getPropertyImages from './utility/imageDownloader.js';

//report

import qcRoute from './report/autoQc/qcRoute.js';
import wardWiseRoute from './report/wardWise/wardWiseRoute.js';
import propertyWiseRoute from './report/PropertyWiseRoutes.js';
import qualityControlRoute from './report/autoQc/qualityControlRoute.js';

// amc
import advancePayment from './amc/advancePayment/advancePayment.js';
import reportEngineRoute from './amc/reportEngine/reportEngineRoute.js';
import defaluterListAmcAccountsRoute from './amc/defaulterListAMCAccounts/defaluterListAmcAccountsRoute.js';
import UserRoleRoutes from './amc/UserRoleRoutes.js';
import billBookEntryRoute from './amc/billBookEntryRoute.js';
import customTaxesRoute from './amc/setCustomTaxesRoute.js';
import fetchYearBillBookRoutes from './amc/setRemarkInvoice/setRemarkInvoiceRoutes.js';
import deleteAccessPropertyRoutes from './utility/deleteAccessPropertyRoutes.js';
import taxPayment from './amc/taxPayment/taxPaymentRoute.js';
//admin

import PageNameRoute from './admin/pageNameMasterRoute.js';
import LockPropertyRoute from './admin/lockPropertyRoute.js';
import PenaltyOwnerIdWiseRoute from './admin/penaltyOwnerIdWiseRoutes.js';
import PageLevelAceessRoute from './admin/pageLevelAccessRoutes.js';
import ManagePageLevelAccessRoute from './admin/managePageLevelAccessoutes.js';
import DiscountSlabMaster from './admin/discountSlabMaster.js';
import AutoHearting from './admin/autoHearingAppealCommRoute.js';
//common password
import commonOperationPasswordRoutes from './commonRoutes/commonOperationPasswordRoutes.js';

// Report
import adminReportRoutes from './report/adminReportRoute.js';
import mutationHistoryRoutes from './report/mutationHistoryRoute.js';
import dailyCollectionRoutes from './report/dailyCollectionRoute.js';
import propertyClassification from './report/autoQc/propertyClassification/propertyClassification.js';
import demandAnalysis from './report/demandAnalysisRoute.js';
import collectionReportRoutes from './report/collectionReportRoute.js';


import uploadPhotoAndPlan from './utility/uploadPhotoAndPlan.js';

//offline payment
import OfflinePaymentRoutes from './payment/offlinePayment/offlinePaymentRoutes.js';
import transferFeeRoute from './payment/transferFeeRoutes/transferFeeRoute.js'
import OnlinePaymentRoutes from './payment/onlinePayment/onlinePaymentRoutes.js';



//transaction
import collectionApprovalRoute from './transaction/collectionApprovalRoute.js';

import ddChequeApprovalRoute from './transaction/ddChequeRoutes/ddChequeApprovalRoute.js';

import generateReceiptRoute from './transaction/generateReceiptRoute.js';

import approveOnlineTransactionRoute from './transaction/approvalOnlineTransactionRoute.js';

import taxPaymentApprovalRoute from './transaction/taxPaymentApprovalRoute.js';
//admin panel
import approvalAllocationRouter from './approvalAllocation/approvalAllocationRouter.js'
import applicationSettingRouter from './adminPanel/applicationSettingRouter.js'


import mutationHistoryApprovalRoute from './transaction/mutationHistoryApprovalRoute.js';
import dataEntryApprovalRoute from './transaction/dataEntryApproval/dataEntryApprovalRoute.js'

const router = express.Router();

router.use('/', authRoute);
router.use('/', userRoute);
router.use('/', commonRoute);

//Assessment Routes
router.use('/', dataEntryRoute);
router.use('/', MutationRoute);
router.use('/', appealRoute);
router.use('/', zoningRoute);
router.use('/', renterMutationRoute);
router.use('/', totalValuation);

//Master Routes
router.use('/', activeTaxMasterRoute);
router.use('/', applyTaxRoute);
router.use('/', assessmentRuleRoute);
router.use('/', floorMasterRoute);
router.use('/', constructionTypeMasterRoute);
router.use('/', depreciationMasterRoute);
router.use('/', factorMasterRoute);
router.use('/', applyTaxPrimeMaster);
router.use('/', TypeOfUsePrimeRoute);
router.use('/', TypeOfUseRoute);
router.use('/', zoneMaster);
router.use('/', applyPenaltyTaxMasterRoute);
router.use('/', maintenanceRoute);
router.use('/', taxNameMasterRoute);
router.use('/', propertTypeRoute);
router.use('/', openPlotRateRoute);
router.use('/', taxMasterRoute);
router.use('/', rateMasterRoute);
router.use('/', bankMasterRoute);
router.use('/', activeYearMasterRoute);
router.use('/', activeTaxMasterRoute);
router.use('/', zoneSectionMasterRoute);
router.use('/', councilInfoRoute);
router.use('/', transYearRoute);
router.use('/', typeOfUsePrimeMasterRoute);

//report
router.use('/', qcRoute);
router.use('/', wardWiseRoute);
router.use('/', propertyWiseRoute);
router.use('/', propertyClassification);
router.use('/', qualityControlRoute);
router.use('/', collectionReportRoutes);


//utility routes
router.use('/', addTaxesRoute);
router.use('/', dataEntrySameAsRoute);
router.use('/', autowardRoute);
router.use('/', updatePropertyDetails);
router.use('/', deleteAccessPropertyRoutes);
router.use('/', wardAllocation);
router.use('/', setPoliciesRoute);
router.use('/', uploadPhotoAndPlan);
router.use('/', getPropertyImages);

// amc
router.use('/', advancePayment);
router.use('/', reportEngineRoute);
router.use('/', defaluterListAmcAccountsRoute);
router.use('/', UserRoleRoutes);
router.use('/', billBookEntryRoute);
router.use('/', customTaxesRoute);
router.use('/', fetchYearBillBookRoutes);
router.use('/', taxPayment);

//admin routes
router.use('/', PageNameRoute);
router.use('/', LockPropertyRoute);
router.use('/', PenaltyOwnerIdWiseRoute);
router.use('/', PageLevelAceessRoute);
router.use('/', ManagePageLevelAccessRoute);
router.use('/', DiscountSlabMaster);
router.use('/', AutoHearting)

//Password Level
router.use('/', commonOperationPasswordRoutes);

// Reports
router.use('/', adminReportRoutes);
router.use('/', mutationHistoryRoutes);
router.use('/', dailyCollectionRoutes);

//coffline payment route
router.use('/', OfflinePaymentRoutes);
router.use('/',transferFeeRoute)

router.use('/', OnlinePaymentRoutes);



//transaction routes
router.use('/', collectionApprovalRoute);
router.use('/', approveOnlineTransactionRoute);
router.use('/', ddChequeApprovalRoute)
router.use('/', generateReceiptRoute);
router.use('/', taxPaymentApprovalRoute);
router.use('/', mutationHistoryApprovalRoute);
router.use('/', dataEntryApprovalRoute);



//admin panel 
router.use('/', approvalAllocationRouter);
router.use('/', applicationSettingRouter)

export default router;
