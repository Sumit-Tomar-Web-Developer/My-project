import {
  APPEAL_MAST_COLUMNS,
  BILL_BOOK_COLUMNS,
  FETCH_ADVANCE_COLLECTION,
  FETCH_APPEAL_DATA,
  FETCH_CURRENT_COLLECTION,
  FETCH_CURRENT_DEMAND,
  FETCH_GHOSEHWARA,
  FETCH_MISCELLANEOUS_FEE,
  FETCH_OLD_PROPERTY_DATA,
  FETCH_OUTSTANDING_CURRENT_BALANCE,
  FETCH_OUTSTANDING_PENDING_BALANCE,
  FETCH_OUTSTANDING_TOTAL_BALANCE,
  FETCH_PENDING_COLLECTION,
  FETCH_PENDING_DEMAND,
  FETCH_PROPERTY_DETAILS_NEW_DATA,
  FETCH_PROPERTY_MAST_COLUMNS_BY_OWNER,
  FETCH_TOTAL_COLLECTION,
  FETCH_TOTAL_DEMAND,
  OLD_PROPERTY_MAST_COLUMNS,
  OWNERID_LIST_FOR_REPORT_GEN,
  PROPERTY_DETAILS_NEW_COLUMNS,
  PROPERTY_MAST_COLUMNS,
  TAX_PENDING_COLUMNS,
  TRANS_MAST_COLUMNS
} from 'constants/Report/propertyConstants/propertyWiseConstants.js';
import axios from 'axios';

export const fetchPropertyMastList = async () => {
  try {
    const response = await axios.get(PROPERTY_MAST_COLUMNS);
    return response;
  } catch (error) {
    console.error('Error fetching PROPERTY_MAST_COLUMNS:', error);
    throw error;
  }
};
export const fetchOldPropertyMastList = async () => {
  try {
    const response = await axios.get(OLD_PROPERTY_MAST_COLUMNS);
    return response;
  } catch (error) {
    console.error('Error fetching OLD_PROPERTY_MAST_COLUMNS:', error);
    throw error;
  }
};

export const fetchPropertyDetaisNewList = async () => {
  try {
    const response = await axios.get(PROPERTY_DETAILS_NEW_COLUMNS);
    return response;
  } catch (error) {
    console.error('Error fetching PROPERTY_DETAILS_NEW_COLUMNS:', error);
    throw error;
  }
};

export const fetchAppealMastList = async () => {
  try {
    const response = await axios.get(APPEAL_MAST_COLUMNS);
    return response;
  } catch (error) {
    console.error('Error fetching APPEAL_MAST_COLUMNS:', error);
    throw error;
  }
};

export const fetchTransMastList = async () => {
  try {
    const response = await axios.get(TRANS_MAST_COLUMNS);
    return response;
  } catch (error) {
    console.error('Error fetching TRANS_MAST_COLUMNS:', error);
    throw error;
  }
};

export const fetchBillBookList = async () => {
  try {
    const response = await axios.get(BILL_BOOK_COLUMNS);
    return response;
  } catch (error) {
    console.error('Error fetching BILL_BOOK_COLUMNS:', error);
    throw error;
  }
};

export const fetchTaxPendingList = async () => {
  try {
    const response = await axios.get(TAX_PENDING_COLUMNS);
    return response;
  } catch (error) {
    console.error('Error fetching TAX_PENDING_COLUMNS :', error);
    throw error;
  }
};

export const fetchOwnerIdListForReportGen = async (data) => {
  console.log(data, 'data in service');
  try {
    const response = await axios.post(OWNERID_LIST_FOR_REPORT_GEN, data);
    console.log(response, 'response');
    return response;
  } catch (error) {
    console.error('Error fetching OWNERID_LIST_FOR_REPORT_GEN:', error);
    throw error;
  }
};

// 🟢 Current Demand
export const fetchCurrentDemand = async (data) => {
  console.log(data, 'current da');
  try {
    const response = await axios.post(FETCH_CURRENT_DEMAND, { OwnerID: data.ownerIDList, p_Year: data.p_Year });
    return response;
  } catch (error) {
    console.error('Error fetching _CURRENT_DEMAND:', error);
    throw error;
  }
};

// 🟠 Pending Demand
export const fetchPendingDemand = async (data) => {
  console.log(data, 'data in service for pending demand');
  try {
    const response = await axios.post(FETCH_PENDING_DEMAND, {
      OwnerID: data.ownerIDList,
      p_Year: data.p_Year
    });
    return response;
  } catch (error) {
    console.error('Error fetching PENDING_DEMAND:', error);
    throw error;
  }
};

// 🟣 Total Demand
export const fetchTotalDemand = async (data) => {
  console.log(data, 'data in service for total demand');
  try {
    const response = await axios.post(FETCH_TOTAL_DEMAND, {
      OwnerID: data.ownerIDList,
      p_Year: data.p_Year
    });
    return response;
  } catch (error) {
    console.error('Error fetching TOTAL_DEMAND:', error);
    throw error;
  }
};

// 🔵 Current Collection
export const fetchCurrentCollection = async (data) => {
  try {
    console.log(data, 'data in service current collection');

    const response = await axios.post(FETCH_CURRENT_COLLECTION, {
      OwnerIDList: data.OwnerIDList,
      p_Year: data.p_Year,
      p_from_date: data.p_from_date,
      p_to_date: data.p_to_date
    });
    console.log(response, 'response');
    return response;
  } catch (error) {
    console.error('Error fetching CURRENT_COLLECTION:', error);
    throw error;
  }
};

// 🟢 Pending Collection
export const fetchPendingCollection = async (data) => {
  try {
    const response = await axios.post(FETCH_PENDING_COLLECTION, {
      OwnerIDList: data.OwnerIDList,
      p_Year: data.p_Year,
      p_from_date: data.p_from_date,
      p_to_date: data.p_to_date
    });
    return response;
  } catch (error) {
    console.error('Error fetching PENDING_COLLECTION:', error);
    throw error;
  }
};

// 🟣 Total Collection
export const fetchTotalCollection = async (data) => {
  try {
    console.log(data, 'Total collection');
    const response = await axios.post(FETCH_TOTAL_COLLECTION, {
      OwnerID: data.OwnerIDList,
      p_Year: data.p_Year,
      p_from_date: data.p_from_date,
      p_to_date: data.p_to_date
    });
    return response;
  } catch (error) {
    console.error('Error fetching TOTAL_COLLECTION:', error);
    throw error;
  }
};

// 🧾 Outstanding Current Balance
export const fetchOutstandingCurrentBalance = async (data) => {
  try {
    console.log(data, 'data in service');
    const response = await axios.post(FETCH_OUTSTANDING_CURRENT_BALANCE, {
      OwnerID: data.ownerIDList,
      p_Year: data.year
    });
    return response;
  } catch (error) {
    console.error('Error fetching OUTSTANDING_CURRENT_BALANCE:', error);
    throw error;
  }
};

// 🧾 Outstanding Pending Balance
export const fetchOutstandingPendingBalance = async (data) => {
  try {
    const response = await axios.post(FETCH_OUTSTANDING_PENDING_BALANCE, {
      OwnerID: data.ownerIDList,
      p_Year: data.year
    });
    return response;
  } catch (error) {
    console.error('Error fetching OUTSTANDING_PENDING_BALANCE:', error);
    throw error;
  }
};

// 🧾 Outstanding Total Balance
export const fetchOutstandingTotalBalance = async (data) => {
  try {
    const response = await axios.post(FETCH_OUTSTANDING_TOTAL_BALANCE, {
      OwnerID: data.ownerIDList,
      p_Year: data.year
    });
    return response;
  } catch (error) {
    console.error('Error fetching OUTSTANDING_TOTAL_BALANCE:', error);
    throw error;
  }
};

// ⚙️ Ghosehwara
export const fetchGhosehwara = async (data) => {
  try {
    const response = await axios.post(FETCH_GHOSEHWARA, data);
    return response.data;
  } catch (error) {
    console.error('Error fetching GHOSEHWARA:', error);
    throw error;
  }
};

// 💰 Advance Collection
export const fetchAdvanceCollection = async (data) => {
  try {
    console.log(data, 'data in service for advance collection');
    const response = await axios.post(FETCH_ADVANCE_COLLECTION, {
      ownerID: data.ownerIDList,
      FinanceYear: data.year
    });
    return response;
  } catch (error) {
    console.error('Error fetching ADVANCE_COLLECTION:', error);
    throw error;
  }
};

// 💵 Miscellaneous Fee
export const fetchMiscellaneousFee = async (data) => {
  try {
    console.log(data, 'data');
    const response = await axios.post(FETCH_MISCELLANEOUS_FEE, {
      ownerIDList: data.ownerIDList,
      year: data.year
    });
    return response;
  } catch (error) {
    console.error('Error fetching MISCELLANEOUS_FEE:', error);
    throw error;
  }
};

export const fetchPropertyMastColumnsByOwner = async (data) => {
  console.log(data, 'data in service');
  try {
    const response = await axios.post(FETCH_PROPERTY_MAST_COLUMNS_BY_OWNER, { ownerIDs: data.ownerIDs, columns: data.columns });
    console.log(response, 'response');
    return response;
  } catch (error) {
    console.error('Error fetching FETCH_PROPERTY_MAST_COLUMNS_BY_OWNER:', error);
    throw error;
  }
};

//independent od select demand
export const fetchAppealData = (requestData) => {
  console.log(requestData, 'requestData in service for appeal data');
  try {
    const response = axios.post(FETCH_APPEAL_DATA, {
      ownerIDs: requestData.ownerIDs,
      columns: requestData.columns
    });
    return response;
  } catch (error) {
    console.error('Error fetching APPEAL_DATA:', error);
    throw error;
  }
};

export const fetchOldPropertyData = (requestData) => {
  try {
    const response = axios.post(FETCH_OLD_PROPERTY_DATA, { ownerIDs: requestData.ownerIDs, columns: requestData.columns });
    return response;
  } catch (error) {
    console.error('Error fetching OLD_PROPERTY_DATA:', error);
    throw error;
  }
};

export const fetchPropertyDetailsNewData = (requestData) => {
  try {
    const response = axios.post(FETCH_PROPERTY_DETAILS_NEW_DATA, { ownerIDs: requestData.ownerIDs, columns: requestData.columns });
    return response;
  } catch (error) {
    console.error('Error fetching PROPERTY_DETAILS_NEW_DATA:', error);
    throw error;
  }
};
