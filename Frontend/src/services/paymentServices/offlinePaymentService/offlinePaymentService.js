import axios from 'axios';
import {
  BILL_BOOK_NO_LIST,
  CURRENT_BALANCE_OFFLINE_PAYMENT,
  CURRENT_PENALTY,
  GENERATE_INVOICE_URL,
 
  GET_BANK_LIST,
 
  GET_DISCOUNT_PERCENTAGE,
 
  GET_OFFLINE_RECEIPT,
 
 
  GET_OLD_PROPERTY_NO_LIST,
 
  GET_OLD_WARD_LIST,
 
  GET_PAYMENT_MODES,
 
  MINOR_INFO,
  ORDERED_TAX_ALIASES,
  PENDING_BALANCE_OFFLINE_PAYMENT,
  PENDING_PENALTY,
  PROCESS_PAYMENT,
  SAVE_MINOR_INFO,
  SEARCH_PROPERTY,
  WARD_SELECTION_URL
} from 'constants/payment/offlinePaymentConstants/offlinePaymentConstants.js';

// or your constant like BASE_URL

export const fetchOldWardNumbers = async () => {
  try {
    const response = await axios.get(GET_OLD_WARD_LIST);
    return response.data;
  } catch (error) {
    console.error('Error fetching old ward numbers:', error);
    throw error;
  }
};


export const fetchOldPropertiesByWard = async ({ wardNo }) => {
  try {
    console.log("old ward no service")
    const response = await axios.post(
     GET_OLD_PROPERTY_NO_LIST,
      { wardNo }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching old properties by ward:', error);
    throw error;
  }
};




// 🔍 Search Property
export const searchPropertyOfflinePayment = async (payload) => {
  try {
    const response = await axios.post(SEARCH_PROPERTY, payload);
    return response.data;
  } catch (error) {
    console.log('error in getting details', error);
    throw error;
  }
};




export const postWardSelectionService = async (wardNo) => {
  try {
    const res = await axios.post(WARD_SELECTION_URL, {wardNo});
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// 🧾 Minor Info
export const getMinorInfoById = async (OwnerID) => {
  try {
    const response = await axios.post(MINOR_INFO, OwnerID);
    return response.data;
  } catch (error) {
    console.log('error in getting minor details', error);
    throw error;
  }
};

// 💵 Current Balance Details
export const getCurrentBalanceDetails = async (payload) => {
  try {
        console.log(payload,"data current....")
    const response = await axios.post(CURRENT_BALANCE_OFFLINE_PAYMENT, payload);
    return response.data;
  } catch (error) {
    console.log('Error fetching current balance details:', error);
    throw error;
  }
};

// 🧾 Pending Balance Details
export const getPendingBalanceDetails = async (payload) => {
  try {
    console.log(payload,"data pending....")
    const response = await axios.post(PENDING_BALANCE_OFFLINE_PAYMENT, payload);
    return response.data;
  } catch (error) {
    console.log('Error fetching pending balance details:', error);
    throw error;
  }
};

// 📋 Ordered Tax Aliases
export const getOrderedTaxAliases = async () => {
  try {
    const response = await axios.get(ORDERED_TAX_ALIASES);
    console.log(response,"tax headers"); 
    return response.data;
  } catch (error) {
    console.log('Error fetching ordered tax aliases:', error);
    throw error;
  }
};


export const getBillBookNos = async (UserID) => {
  try {
    const response = await axios.post(BILL_BOOK_NO_LIST,{UserID});
    console.log(response,"fetched bill book no "); 
    return response.data;
  } catch (error) {
    console.log('Error fetching bill book no ', error);
    throw error;
  }
};

export const getNextInvoiceNo= async ({ userID,
        year,
        status}) => {
  try {

    console.log(userID,
        year,
        status,"data to be send for invoice")
    const response = await axios.post(GENERATE_INVOICE_URL,{ userID,
        year,
        status });
    console.log(response,"fetched invoice nos"); 
    return response.data;
  } catch (error) {
    console.log('Error fetching invoice nos ', error);
    throw error;
  }
};

export const processPaymentService = async (payload) => {
  try {
    const response = await axios.post(PROCESS_PAYMENT, payload);
    console.log('Payment response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};

export const getCurrentPenalty = async (payload) => {
  try {
    const response = await axios.post(CURRENT_PENALTY, payload);
    console.log('current penalty response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error processing current penalty:', error);
    throw error;
  }
};


export const getPendingPenalty = async (payload) => {
  try {
    const response = await axios.post(PENDING_PENALTY, payload);
    console.log('pending penalty response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error processing pending penalty:', error);
    throw error;
  }
};

export const getOfflineReceipt = async (OwnerID) => {
  try {
    console.log(OwnerID,"ownerid for current re receipt")
    const response = await axios.post(GET_OFFLINE_RECEIPT, {OwnerID});
    console.log('Get offline receipt', response.data);
    return response.data;
  } catch (error) {
    console.error('Error processing pending penalty:', error);
    throw error;
  }
};


export const updateMinorInfo = async (minorData) => {
  try {
    console.log(minorData,"data for save minor data")
    const response = await axios.post(SAVE_MINOR_INFO, {minorData});
    console.log('Get minorData response', response.data);
    return response.data;
  } catch (error) {
    console.error('Error saving minorData:', error);
    throw error;
  }
};

export const getDiscountPercentageService = async ({
  OwnerID,
  DiscountFinanceYear,
  DiscountPendingYear,
  PaymentType,
  TaxName,
  PaymentMode
}) => {
  try {
    const response = await axios.post(GET_DISCOUNT_PERCENTAGE, {
      OwnerID,
      DiscountFinanceYear,
      DiscountPendingYear,
      PaymentType,
      TaxName,
      PaymentMode
    });

    console.log("Discount Percentage Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching discount percentage:", error);
    throw error;
  }
};


// Fetch Payment Modes
export const getPaymentModes = async () => {
  try {
    const res = await axios.get(GET_PAYMENT_MODES);
    if (res.data.success) return res.data.paymentModes;
    return [];
  } catch (err) {
    console.error('Error fetching payment modes:', err);
    return [];
  }
};

// Fetch Bank List
export const getBankList = async () => {
  try {
    const res = await axios.get(GET_BANK_LIST);
    return res.data;
  } catch (err) {
    console.error('Error fetching bank list:', err);
    return [];
  }
};


