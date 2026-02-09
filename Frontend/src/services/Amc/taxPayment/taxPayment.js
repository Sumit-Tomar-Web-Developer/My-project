//import { ex } from '@fullcalendar/core/internal-common';
import axios from 'axios';
import {
  GET_COMBINED_OWNERDETAILS,
  GET_PENDING_TAXES,
  GET_INTEREST_AMOUNT,
  GET_BALANCESHEET_DATA,
  CANCEL_INVOICE_NO,
  CHECK_INVOICE_STATUS,
  CHECK_DUPLICATE_INVOICE,
  FETCH_ALL_BANKS,
  FETCH_PAYMENT_DETAILS,
  SAVE_TAX_PAYMENT,
  UPDATE_TAX_PAYMENT,
  DELETE_TAX_PAYMENT,
  FETCH_BILLBOOK_ENTRIES,
  SEND_FOR_APPROVAL
} from 'constants/Amc/taxPayment/taxPaymentConstant';

//fetching bill book entry table
export const fetchBillBookList = async () => {
  try {
    const response = await axios.post(FETCH_BILLBOOK_ENTRIES);
    console.log("fetchBillBookList", response)
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchBillBookList:', error.response?.data || error.message);
    throw error;
  }
};
//Fetch all CombinedOwnerDetails
export const getCombinedOwnerDetails = async (ownerID) => {
  try {
    const response = await axios.post(GET_COMBINED_OWNERDETAILS, {
      ownerID
    });
    console.log('axios response of getCombinedOwnerDetails', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in fetching CombinedOwnerDetails', error.message);
    throw error;
  }
};

export const getPendingTaxes = async (ownerId, year) => {
  try {
    console.log('Axios ownerId', ownerId);
    const response = await axios.post(GET_PENDING_TAXES, {
      ownerID: ownerId,
      year: year
    });
    console.log('Axios response getPendingTaxes', response.data);
    return response.data;
  } catch (error) {
    console.log('Axios Error Fetching Current Taxes', error);
  }
};

export const getInterestAmounts = async (ownerID, year, transactionDate) => {
  try {
    const response = await axios.post(GET_INTEREST_AMOUNT, {
      ownerId: ownerID,
      year: year,
      transactionDate
    });
    console.log('Axios response getInterestAmounts', response.data.data);
    return response.data.data;
  } catch (error) {
    console.log('Axios error fetching get advance paid maount', error);
  }
};

export const getBalanceSheetData = async (ownerID, year) => {
  try {
    const response = await axios.post(GET_BALANCESHEET_DATA, {
      ownerId: ownerID,
      year: year
    });
    console.log('Axios response getBalanceSheetData', response.data);
    return response.data;
  } catch (error) {
    console.log('Axios error fetching getBalanceSheetData', error);
  }
};

export const cancelInvoiceNo = async (year, billBookNo, invoiceNo, cancelReason) => {
  try {
    const response = await axios.post(CANCEL_INVOICE_NO, {
      year,
      billBookNo,
      invoiceNo,
      cancelReason
    });

    return {
      success: response.data.success,
      message: response.data.message,
      status: response.status
    };
  } catch (error) {
    console.error('Error cancelling invoice no', error);

    // Handle backend errors
    if (error.response && error.response.data) {
      return {
        success: false,
        message: error.response.data.message || 'Failed to cancel invoice',
        status: error.response.status
      };
    }

    // Network or unknown errors
    return {
      success: false,
      message: 'Network error or server unreachable',
      status: null
    };
  }
};

export const checkInvoiceStatus = async (year, billBookNo, invoiceNo) => {
  try {
    const response = await axios.post(CHECK_INVOICE_STATUS, {
      year,
      billBookNo,
      invoiceNo
    });

    return {
      success: response.data.success,
      message: response.data.message,
      status: response.status
    };
  } catch (error) {
    console.error('Error to check Invoice Status', error);

    // Handle backend errors
    if (error.response && error.response.data) {
      return {
        success: false,
        message: error.response.data.message || 'Failed to to check Invoice Status',
        status: error.response.status
      };
    }

    // Network or unknown errors
    return {
      success: false,
      message: 'Network error or server unreachable',
      status: null
    };
  }
};

export const checkDuplicateInvoice = async (combinedData) => {
  try {
    const response = await axios.post(CHECK_DUPLICATE_INVOICE, {
      combinedData
    });

    return {
      success: response.data.success,
      message: response.data.message,
      status: response.status
    };
  } catch (error) {
    console.error('Error to check Duplicate Invoice', error);

    // Handle backend errors
    if (error.response && error.response.data) {
      return {
        success: false,
        message: error.response.data.message,
        status: error.response.status
      };
    }

    // Network or unknown errors
    return {
      success: false,
      message: 'Network error or server unreachable',
      status: null
    };
  }
};

export const fetchAllBanks = async () => {
  try {
    const response = await axios.get(FETCH_ALL_BANKS);
    console.log('Axios response fetchAllBanks:', response);
    return response.data;
  } catch (error) {
    console.error('Axios error fetching banks:', error);
    throw error;
  }
};

export const fetchPaymentDetails = async (ownerID) => {
  try {
    const response = await axios.post(FETCH_PAYMENT_DETAILS, {
      ownerID: ownerID
    });
    console.log('Axios response fetchPaymentDetails', response);
    return response.data.paymentData;
  } catch (error) {
    console.log('Axios error fetching PaymentDetails', error);
  }
};
export const saveTaxPayment = async (combinedData) => {
  try {
    const response = await axios.post(SAVE_TAX_PAYMENT, combinedData);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error saving TaxPayment:', error);
    const backendMessage = error.response?.data?.message || 'Failed to save tax payment.';
    return {
      data: { success: false, message: backendMessage },
      status: error.response?.status || 500
    };
  }
};

export const saveUpdatedTaxPayment = async (combinedData) => {
  try {
    const response = await axios.post(UPDATE_TAX_PAYMENT, combinedData);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error to update taxPayment', error);
    const backendMessage = error.response?.data?.message || 'Failed to update tax payment.';
    return {
      data: { success: false, message: backendMessage },
      status: error.response?.status || 500
    };
  }
};
export const deleteTaxPayment = async (paymentData) => {
  try {
    const response = await axios.post(DELETE_TAX_PAYMENT, paymentData);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error to delete taxPayment', error);
    const backendMessage = error.response?.data?.message || 'Failed to delete tax payment.';
    return {
      data: { success: false, message: backendMessage },
      status: error.response?.status || 500
    };
  }
};
export const sendForApproval = async (paymentsToProcess,user) => {
  console.log('paymentsToProcess in service', paymentsToProcess);
  try {
    const response = await axios.post(SEND_FOR_APPROVAL, {
      headers: {
        "Content-Type": "application/pdf"
      }, data: paymentsToProcess, user: user
    });
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error to send for approval taxPayment', error);
    const backendMessage = error.response?.data?.message || 'Failed to send for approval .';
    return {
      data: { success: false, message: backendMessage },
      status: error.response?.status || 500
    };
  }
};
