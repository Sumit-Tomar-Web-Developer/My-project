import {  getSearchedPropertyInfo, markOnlinePaymentFailed, processOnlinePayment, verifyOnlinePayment } from "../../../controllers/payment/onlinePayment/onlinePaymentController.js";
import express from 'express';
const router = express.Router();

router.post('/search-property-online-payment', getSearchedPropertyInfo);
router.post('/pay-online', processOnlinePayment);
router.post('/varify-online-payment',verifyOnlinePayment)
router.post("/online-payment-failed", markOnlinePaymentFailed);


export default router;
