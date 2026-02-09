import axios from "axios";
import { FETCH_YEARLY_BILLBOOK_LIST, FETCH_INVOICE_LIST ,TRANSACTION_RECEIPT} from "constants/Transaction/generateReceipt/generateReceiptConstant.js";

export const fetchYearlyBillBookList = async (year) => {
   try {
    console.log('before fetching YearlyBillBookList');
    const response = await axios.post(FETCH_YEARLY_BILLBOOK_LIST, {year});
    console.log('after fetching YearlyBillBookList');
    console.log('axios YearlyBillBookList', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching YearlyBillBookList:', error.response?.data || error.message);
    throw error;
  }
}

export const fetchInvoiceList = async (billBookNo) => {
    try {
    console.log('before fetching InvoiceList');
    const response = await axios.post(FETCH_INVOICE_LIST, {billBookNo});
    console.log('after fetching InvoiceList');
    console.log('axios InvoiceList', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching InvoiceList:', error.response?.data || error.message);
    throw error;
  } 
}

export const transactionReceipt = async (filters) => {
    try {
    console.log('before fetching generateReceipt');
    const response = await axios.post(TRANSACTION_RECEIPT, filters);
    console.log('after fetching generateReceipt');
    console.log('axios generateReceipt', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching generateReceipt:', error.response?.data || error.message);
    throw error;
  } 
}