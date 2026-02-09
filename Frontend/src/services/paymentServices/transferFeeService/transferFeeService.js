import axios from 'axios';
import { BILL_BOOK_FOR_TRANSFER, EMAIL_MOBILE, FETCH_OWNER_IS_WISE_BILL_TRANSC, INVOICE_FRO_TRANSFER, SEARCH_TRNANSFER_FEE_RENTER, UPASERT_TRNANSFER } from 'constants/payment/transferFeeConstant/transferFeeConstant';

// Fetch all distinct Bill Books
export const fetchBillBooks = async () => {
  try {
    const response = await axios.get(BILL_BOOK_FOR_TRANSFER);
    return response.data; // returns array of BillBookNo
  } catch (error) {
    console.error('Error fetching bill books:', error);
    throw error;
  }
};

// Fetch invoices for a selected Bill Book
export const fetchInvoicesByBillBook = async (billBookNo)  => { 
  try {
      const response = await axios.post(INVOICE_FRO_TRANSFER, { billBookNo });
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoices for ${billBookNo}:`, error);
      throw error;
    }
  };
  
  export const fetchEmailMobileFetch = async ({ ownerId }) => {
    try {
      const response = await axios.post(EMAIL_MOBILE, { ownerId });
      return response.data;
    } catch (error) {
      console.error(`Error fetching email/mobile for ownerId ${ownerId}:`, error);
      throw error;
    }
  };
  export const searchTransferFeeRenter = async (searchData) => {
    try {
      const response = await axios.post(SEARCH_TRNANSFER_FEE_RENTER, searchData);
      return response.data; 
    } catch (err) {
      console.error("Error in searchTransferFeeRenter:", err);
      if (err.response) {
        return { error: err.response.data.message || "Server Error" };
      }
      return { error: err.message || "Network Error" };
    }
  };

  export const upsertTransferTransaction = async (payload) => {
    try {
      const response = await axios.post(UPASERT_TRNANSFER, payload);
  
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("Upsert Transfer Transaction Error:", error);
  
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          "Failed to save transfer transaction"
      };
    }
  };

  export const fetchOwnerWiseBillTransactions = async (ownerId) => {
    try {
      if (!ownerId) {
        console.warn("OwnerID missing while fetching bill transactions");
        return [];
      }
  
      const response = await axios.post(
        FETCH_OWNER_IS_WISE_BILL_TRANSC,
        {
          OwnerID: ownerId   // 🔥 backend-friendly key
          // ownerId: ownerId  // (optional, agar future-proof chahiye)
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
  
      // 🔹 Always return array
      return response?.data?.data || [];
  
    } catch (error) {
      console.error(
        "Error fetching owner-wise bill transactions:",
        error?.response?.data || error.message
      );
      return [];
    }
  };
  