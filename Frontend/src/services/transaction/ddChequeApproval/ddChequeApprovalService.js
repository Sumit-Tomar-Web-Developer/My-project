import axios from "axios";
import { GET_CHEQUE_AND_DATE, GET_CREATE_DD_CHEQUE_TRANSACTION, GET_DD_HISTORY, GET_INSERT_CHEQUE_AND_DATE, GET_WARD_OWNERID, GET_ZONE_SECTION_FETCH_WARD, GET_ZONE_SECTION_LIST } from "constants/Transaction/ddChequeApproval/ddChequeApprovalConstant";

// Zone list
export const fetchZoneSectionList = async () => {
    try {
      const response = await axios.get(GET_ZONE_SECTION_LIST );
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching ZoneSection:", error);
      throw error;
    }
  };

  // Ward by Zone
  export const fetchWardByZone = async (zoneNo) => {
    try {
      const response = await axios.post(GET_ZONE_SECTION_FETCH_WARD , { zoneNo });
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching ZoneSection Ward:", error);
      throw error;
    }
  };

// Owner by Ward
  export const fetchOwnerByWard  = async (wardNo) => {
    try {
      const response = await axios.post(GET_WARD_OWNERID , { wardNo });
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching Ward by OwnerId:", error);
      throw error;
    }
  };

// Cheque search 
export const fetchChequeData = async (payload) => {
  try {
    const response = await axios.post(GET_CHEQUE_AND_DATE, payload);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching cheque and date:", error);
    throw error;
  }
};
//insert
export const updateChequeStatus = async (payload) => {
  try {
    const response = await axios.post(GET_INSERT_CHEQUE_AND_DATE, payload);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating cheque status:", error);
    throw error;
  }
};

// DD Cheque History upsert
  export const saveDDChequeHistory  = async (payload) => {
    try {
      const response = await axios.post(GET_CREATE_DD_CHEQUE_TRANSACTION , { payload });
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching cheque and date Transaction:", error);
      throw error;
    }
  };

// DD Cheque History
  export const fetchDDChequeHistory  = async (payload) => {
    try {
      const response = await axios.post(GET_DD_HISTORY , payload );
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching cheque and date Transaction:", error);
      throw error;
    }
  };
