import { GET_INVOICE_WITH_YEAR, GET_YEAR_BILL_BOOK_ENTRY, GET_YEAR_WISE_RECEIPT_BILL_No } from "constants/Amc/setRemarkInvoiceConstant/setReamarkInvoiceConstant";
import axios from 'axios';
import { INSERT_SET_REMARK_INVOICE } from "../../../constants/Amc/setRemarkInvoiceConstant/setReamarkInvoiceConstant";

export const getBillBookYearRange = async () => {
    try {
      const response = await axios.get(GET_YEAR_BILL_BOOK_ENTRY);
      return response.data;
    } catch (error) {
      console.error('Error fetching  year Range  Bill book :', error);
      throw error;
    }
  };

  export const getYearRangeWiseReceiptBillNo = async (selectedYear) => {
    try {
      const response = await axios.post(GET_YEAR_WISE_RECEIPT_BILL_No, {yearRange: selectedYear});
      return response.data;
    } catch (error) {
      console.error('Error fetching  year Range wise Bill book No and Receipt range :', error);
      throw error;
    }
  };

  export const insertSetRemarkInvoice = async (invoiceData) => {
    try {
      const response = await axios.post(INSERT_SET_REMARK_INVOICE, invoiceData);
      const message = response.data.message;
      const status = response.status;
      console.log(message, status, response.data);
      return { message, status, response };
    } catch (error) {
      console.error('Error fetching  year Range wise Bill book No and Receipt range :', error);
      throw error;
    }
  };
  export const getInvoiceStatusWithYear = async (invoiceNo, year) => {
    try {
      const response = await axios.post(GET_INVOICE_WITH_YEAR, {
        invoiceNo,
        year,
      });
      return response.data; 
    } catch (error) {
      console.error('Error fetching invoice status:', error);
      throw error; 
    }
  };