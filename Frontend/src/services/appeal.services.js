import axios from 'axios';
import { ALLAPPEALINFO, APPLY_POLICIES_INFO,FETCH_GET_APPLY_MAST,FETCH_GET_NET_RV,FETCH_GET_TAX_RATE,FETCH_GET_TOTAL_NET_RV,FETCH_OWNER_DETAILS, FINANCEYEAR, GETOWNERINFO, GETPROPERTYFROMWARD, GETWARDLIST, POLICIES_INFO, RETAINFACTORS, TAXNAME,FETCH_GET_PROPERTY_OWNER, DELETE_APPEAL_POLICE, FETCH_HEARING_RV, FETCH_COURT_RV, FETCH_RETAIN_RV, FETCH_APPEAL_RV} from '../constants/constants';

// Function to fetch property description
const fetchPoliciesInfo = async () => {
  try {
    const response = await axios.get(`${POLICIES_INFO}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching policies info:', error);
    throw error;
  }
};

const fetchTaxName = async () => {
  try {
    const response = await axios.get(`${TAXNAME}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Tax Name:', error);
    throw error;
  }
};
const fetchFinancialYear = async () => {
  try {
    const response = await axios.get(`${FINANCEYEAR}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Financial Year:', error);
    throw error;
  }
};

const fetchRetaintionFactors = async () => {
  try {
    const response = await axios.get(`${RETAINFACTORS}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Retaintion Factors:', error);
    throw error;
  }
};


const fetchAppealAllInfo = async (OwnerId) => {
  try {
    const response = await axios.get(`${ALLAPPEALINFO}/${OwnerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching All Appeal Info:', error);
    throw error;
  }
};

const fetchWardList = async () => {
  try {
    const response = await axios.get(`${GETWARDLIST}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching All Ward Info:', error);
    throw error;
  }
};

const fetchPropertyRange = async (wardNo, from, to) => {
  try {
    const response = await axios.get(`${GETPROPERTYFROMWARD}/${wardNo}`, {
      params: { from, to }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching property range:', error);
    throw error;
  }
};

const fetchOwnerId = async (wdNo, propNo, partNo) => {
  try {
    const response = await axios.get(`${GETOWNERINFO}`, {
      params: { wdNo, propNo, partNo }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Owner Info:', error);
    throw error;
  }
};
const applyPolicies = async (policiesInfo) => {
  try {
    const response = await axios.post(`${APPLY_POLICIES_INFO}`, policiesInfo);
    return response.data;
  } catch (error) {
    console.error("Error applying policies:", error);
    throw error;
  }
};
const fetchOwnerDetails = async (wardNo,property) => {
  try {
   const response = await axios.post(`${FETCH_OWNER_DETAILS}`,{
    data:{wardNo,property}
   })
   return response.data;
  } catch (error) {
    throw error
  }
}
export const getNetValuation = async (ownerId) => {
  try {
    const response = await axios.post(FETCH_GET_NET_RV, { OwnerID: ownerId });
    return response.data;
  } catch (error) {
    console.error("Error fetching Net Valuation:", error);
    throw error;
  }
};

export const fetchOwnerRateableValue = async (ownerId) => {
  if (!ownerId) throw new Error("OwnerID is required");

  try {
    const response = await axios.post(FETCH_GET_TOTAL_NET_RV, {
      OwnerID: ownerId
    });
    console.log("NetRV response:", response.data);

    return response.data; 
  } catch (error) {
    console.error("Error fetching total RateableValue:", error);
    throw error;
  }
};
export const fetchHearingRV = async (ownerId) => {
  if (!ownerId) throw new Error("OwnerID is required");

  try {
    const response = await axios.post(FETCH_HEARING_RV, {
      OwnerID: ownerId
    });
    console.log("HearingRV response:", response.data);

    return response.data; 
  } catch (error) {
    console.error("Error fetching total RateableValue:", error);
    throw error;
  }
};
export const fetchCourtRV = async (ownerId) => {
  if (!ownerId) throw new Error("OwnerID is required");

  try {
    const response = await axios.post(FETCH_COURT_RV, {
      OwnerID: ownerId
    });
    console.log("CourtRV response:", response.data);

    return response.data; 
  } catch (error) {
    console.error("Error fetching total RateableValue:", error);
    throw error;
  }
};

export const fetchRetainRV = async (ownerId) => {
  if (!ownerId) throw new Error("OwnerID is required");

  try {
    const response = await axios.post(FETCH_RETAIN_RV, {
      OwnerID: ownerId
    });
    console.log("Retain RV response:", response.data);

    return response.data; 
  } catch (error) {
    console.error("Error fetching total RateableValue:", error);
    throw error;
  }
};
export const fetchAppealRV = async (ownerId) => {
  if (!ownerId) throw new Error("OwnerID is required");

  try {
    const response = await axios.post(FETCH_APPEAL_RV, {
      OwnerID: ownerId
    });
    console.log("Appeal RV response:", response.data);

    return response.data; 
  } catch (error) {
    console.error("Error fetching total Appeal rv:", error);
    throw error;
  }
};

//tax amount from tax master
export const fetchTaxRateByAmount = async (amount, taxNameType) => {
  try {
    const response = await axios.post(FETCH_GET_TAX_RATE, { 
      amount, 
      taxNameType  // ✅ Include this to match backend
    });
    console.log("📥 Tax rate response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching tax rate:", error.response?.data || error.message);
    throw error;
  }
};

//  Fetch owner-wise applied taxes
export const fetchOwnerTaxes = async (ownerId) => {
  if (!ownerId) throw new Error("OwnerID is required");
  try {
    const response = await axios.post(`${FETCH_GET_APPLY_MAST}`, { ownerId }); // ✅ send in body
   console.log(response.data)
    return response.data; 
  } catch (error) {
    console.error("Error fetching owner taxes:", error.response?.data || error.message);
    throw error;
  }
};

// Function to check if propertyOwner exists by ward, property and partitionNo
export const fetchPropertyOwner = async (wardNo, propertyNo, partitionNo) => {
  try {
    const response = await axios.post(`${FETCH_GET_PROPERTY_OWNER}`, {
      data: {
        wardNo,
        propertyNo,
        partitionNo
      }
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching Property owner", error);
    throw error;
  }
};
//delete
export const resetAppealService = async (payload) => {
  try {
    const response = await axios.post(DELETE_APPEAL_POLICE, payload);
    return response.data;
  } catch (error) {
    console.error("Error in resetAppealService:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};


export {
  fetchPoliciesInfo, fetchTaxName, fetchFinancialYear,
  fetchRetaintionFactors, fetchAppealAllInfo, fetchWardList,
  fetchPropertyRange, fetchOwnerId, applyPolicies,fetchOwnerDetails
};
