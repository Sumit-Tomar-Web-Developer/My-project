import express from 'express';
import { getAllBillBookNumbers, getAllReport, getAMCReport, getBillBookUserDetails, getCollectionPercentageChartReport,getCommonReport, getCounterFoilReport, getDayWiseCollectionReport, getGatewayPaymentReport, getTaxCollectionWisePaymentWiseReport, getTaxPerformanceReport, getTransactionChallanTransferfeeReport, getWardwiseDailyReport, getWardwiseUserwiseInvoiceReport } from '../../controllers/report/collectionReportController.js';

const router =express.Router();

router.get('/get-all-billbook-nos',getAllBillBookNumbers)

router.post('/get-users-for-billbookno',getBillBookUserDetails);

router.post('/get-all-report',getAllReport);

router.post('/amc-filter-report',getAMCReport);

router.post('/get-common-report',getCommonReport);

router.post('/get-transaction-challan-transfer-fee-report', getTransactionChallanTransferfeeReport);


router.post('/wardwise-userwise-invoice-report', getWardwiseUserwiseInvoiceReport);

router.post('/daywise-collection-report', getDayWiseCollectionReport);

router.post('/getway-payment-report', getGatewayPaymentReport);

router.post('/tax-collectionwise-paymentwise-report', getTaxCollectionWisePaymentWiseReport);

router.post('/ward-wise-daily-report', getWardwiseDailyReport);

router.post('/collection-percentage-chart-report', getCollectionPercentageChartReport);

router.post('/tax-performance-report', getTaxPerformanceReport);

router.post('/counter-foil-report', getCounterFoilReport);

export default router;