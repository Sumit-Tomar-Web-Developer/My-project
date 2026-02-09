import axios from "axios";
import { FETCH_ALL_REPORT, GET_ALL_BILLBOOK_NOS, GET_AMC_REPORT, GET_BILLBOOK_USERS, GET_COLLECTION_PERCENTAGE_CHART, GET_COMMON_REPORT, GET_COUNTER_FOIL, GET_DAY_WISE_COLLECTION_REPORT,  GET_GETWAY_PAYMENT_REPORT, GET_TAX_COLLECTIONWISE_PAYMENTWISE_REPORT, GET_TAX_PERFORMANCE_REPORT, GET_TRANSACTION_CHALLAN_TRANSFER_FEE_REPORT, GET_WARD_WISE_DAILY_REPORT, GET_WARDWISE_USERWISE_INVOICE_REPORT } from "constants/collectionReportConstants/collectionReportConstants.js";


export const fetchAllBillBookList = async () => {
  try {
    const response = await axios.get(GET_ALL_BILLBOOK_NOS);
    return response.data;
  } catch (error) {
    console.error('Error in fetching bill book nos:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchBillBookUsers = async (billBookNo) => {
  try {
    const response = await axios.post(GET_BILLBOOK_USERS, {
      billBookNo
    });
    return response.data;
  } catch (error) {
    console.log(error, "error in fetching user for given bill book no")
  }
};

//All
export const fetchAllReport = async (payload) => {
  try {
    const response = await axios.post(FETCH_ALL_REPORT,payload);
    return response.data;
  } catch (error) {
    console.error(`Error calling:`, error.response?.data || error.message);
    throw error;
  }
};

   // COLLECTION REPORTS || AMC
export const fetchCollectionReportWithSubReportType = async (payload) => {
  try {
    const response = axios.post(GET_AMC_REPORT, payload);
    return response.data;
  } catch (error) {
    console.log(error, "error in fetching report")
    throw error;
  }
};

//6 common report
export const fetchCommonReport = async (payload) => {
  try {
    const response = axios.post(GET_COMMON_REPORT, payload);
    return response.data;

  } catch (error) {
    console.log(error, "error in fetching report")

    throw error;
  }
};

//Transaction/Challan/Transfer Fee Collection
export const fetchTransactionChallanTransferFeeReport = async (payload) => {
  try {
    const response = axios.post(GET_TRANSACTION_CHALLAN_TRANSFER_FEE_REPORT, payload);
    return response.data;

  } catch (error) {
    console.log(error, "error in fetching report")
    throw error;
  }
};

  // INVOICE / WARD REPORTS
export const fetchWardwiseUserwiseInvoiceReport = async (params) => {
  try {
    const response = axios.post(GET_WARDWISE_USERWISE_INVOICE_REPORT, payload);
    return response.data;
  } catch (error) {
    console.log(error, "error in fetching report")
    throw error;
  }
};

//Daywise
export const fetchDaywiseCollectionReport = async (payload) => {
  try {
    const response = axios.post(GET_DAY_WISE_COLLECTION_REPORT, payload);
    return response.data;
  } catch (error) {
    console.log(error, "error in fetching report")
    throw error;
  }
};


//PAYMENT / GATEWAY REPORTS
export const fetchGatewayPaymentReport = async (params) => {
  try {
    const response = axios.post(GET_GETWAY_PAYMENT_REPORT, payload);
    return response.data;
  } catch (error) {
    console.log(error, "error in fetching report")
    throw error;
  }
};


//TaxCollectionWise/PaymentWiseCollection
export const fetchTaxCollectionWisePaymentWiseReport = async (params) => {
  try {
    const response = axios.post(GET_TAX_COLLECTIONWISE_PAYMENTWISE_REPORT, payload);
    return response.data;
  } catch (error) {
    console.log(error, "error in fetching report")
    throw error;
  }
};


//Wardwise Daily Report
export const fetchWardwiseDailyReport = async (params) => {
  try {
    const response = axios.post(GET_WARD_WISE_DAILY_REPORT, payload);
    return response.data;
  } catch (error) {
    console.log(error, "error in fetching report")
    throw error;
  }
};


//CHART / ANALYTICS
export const fetchCollectionPercentageChartReport = async (params) => {
  try {
    const response = axios.post(GET_COLLECTION_PERCENTAGE_CHART, payload);
    return response.data;
  } catch (error) {
    console.log(error, "error in fetching report")
    throw error;
  }
};


 //tax performanace 
export const fetchTaxPerformanceReport = async (params) => {
  try {
    const response = axios.post(GET_TAX_PERFORMANCE_REPORT, payload);
    return response.data;
  } catch (error) {
    console.log(error, "error in fetching report")
    throw error;
  }
};

//tax performanace 
export const fetchCounterFoilReport = async (params) => {
  try {
    const response = axios.post(GET_COUNTER_FOIL, payload);
    return response.data;
  } catch (error) {
    console.log(error, "error in fetching report")
    throw error;
  }
};