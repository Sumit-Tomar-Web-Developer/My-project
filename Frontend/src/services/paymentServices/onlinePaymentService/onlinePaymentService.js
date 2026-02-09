
import axios from 'axios';
import { ONLINE_PAYMENT_FAILED, PAY_ONLINE_PAYMENT, SEARCH_PROPERTY_ONLINE_PAYMENT, VERIFY_ONLINE_PAYMENT } from 'constants/payment/onlinePaymentConstants/onlinePaymentConstants.js';


// 🔍 Search Property
export const searchPropertyOnlinePayment = async (payload) => {
  try {
    const response = await axios.post(SEARCH_PROPERTY_ONLINE_PAYMENT, payload);
    return response.data;
  } catch (error) {
    console.log('error in getting details', error);
    throw error;
  }
};



export const payOnlinePayment = async (payload) => {
  try {
    const response = await axios.post(PAY_ONLINE_PAYMENT, payload);
    return response.data;
  } catch (error) {
    console.log('error in getting details', error);
    throw error;
  }
};
export const verifyOnlinePayment = async (payload) => {
  try {
    const response = await axios.post(VERIFY_ONLINE_PAYMENT, payload);
    return response.data;
  } catch (error) {
    console.log('error in verify payment', error);
    throw error;
  }
};

export const markOnlinePaymentFailed = async (payload) => {
  try {
    const response = await axios.post(ONLINE_PAYMENT_FAILED, payload);
    return response.data;
  } catch (error) {
    console.log('error in verify payment', error);
    throw error;
  }
};