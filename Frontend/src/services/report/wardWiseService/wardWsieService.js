import axios from 'axios';

import { FETCH_ADVANCE_COLLECTION, FETCH_BILL_COLLECTION, FETCH_BILL_PENDING_COLLECTION, FETCH_CURRENT_OUTSTANDING, FETCH_DESCRIPTION_WISE_WARD, FETCH_MISCELLANEOUS, FETCH_PENDING_OUTSTANDING, FETCH_PENDING__OWERNERID, FETCH_TRANS_OWNERID } from "constants/Report/wardWiseConstant/wardWiseConstant.js";


export const getOwnersByWardAndPropertyDesc = async ({ wardNo, propertyTypeID ,financialYear}) => {
  try {
    const response = await axios.post(FETCH_DESCRIPTION_WISE_WARD, {
      wardNo,
      propertyTypeID,financialYear
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching owners by ward and property description:', error);
    throw error;
  }
};
export const fetchTransByOwnerId = async (ownerID, financeYear) => {
  try {
    // Make sure ownerID is always an array for consistency
    const ownerIDList = Array.isArray(ownerID) ? ownerID : [ownerID];

    const response = await axios.post(FETCH_TRANS_OWNERID, { 
      OwnerID: ownerIDList,
      p_Year: financeYear
    });

    return response.data;   
  } catch (error) {
    console.error("Error fetching Trans by OwnerID:", error.response?.data || error.message);
    throw error;
  }
};
//pending demand
export const getPendingTaxByOwnerAndYear = async (ownerIDs, year) => {
  try {
    const response = await axios.post(FETCH_PENDING__OWERNERID, {
      ownerID: ownerIDs,   
      year: year
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pending tax:", error);
    throw error.response?.data || { message: "Server Error" };
  }
};


export const getCurrentCollection = async (ownerIDs, year) => {
  try {
    const response = await axios.post(FETCH_BILL_COLLECTION, {
      ownerID: ownerIDs,   
      year: year
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Current tax:", error);
    throw error.response?.data || { message: "Server Error" };
  }
};
export const getPendingCollection = async (ownerIDs, year) => {
  try {
    const response = await axios.post(FETCH_BILL_PENDING_COLLECTION, {
      ownerID: ownerIDs,    
      pendingYear: year    
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pending tax:", error);
    throw error.response?.data || { message: "Server Error" };
  }
};

//
export const fetchCurrentOutstanding = async ({ 
  OwnerID,
  p_Year,
  p_from_date = null,
  p_to_date = null,
}) => {
  try {
    const payload = {
      OwnerID: Array.isArray(OwnerID) ? OwnerID : [OwnerID],
      p_Year,
      p_from_date,
      p_to_date,
    };

    const response = await axios.post(FETCH_CURRENT_OUTSTANDING, payload);
    return response.data; // array of balances
  } catch (error) {
    console.error("Error fetching current outstanding:", error);
    throw error.response?.data || { message: "Server Error" };
  }
};
export const getPendingOutstanding = async (ownerIDs, year) => {
  try {
    const response = await axios.post(FETCH_PENDING_OUTSTANDING, {
      ownerID: ownerIDs,   
      pendingYear: year    
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pending tax:", error);
    throw error.response?.data || { message: "Server Error" };
  }
};
export const fetchMiscellaneousFee = async (ownerID, year) => {
  try {
    const response = await axios.post(FETCH_MISCELLANEOUS, {
      ownerID,
      year
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching miscellaneous fee:", error);
    throw error;
  }
};
export const fetchAdvanceCollection = async (ownerID, year) => {
  try {
    const response = await axios.post(FETCH_ADVANCE_COLLECTION, {
      ownerID, 
      FinanceYear: year 
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching miscellaneous fee:", error);
    throw error;
  }
};
