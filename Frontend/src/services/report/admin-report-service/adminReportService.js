import axios from 'axios';
import { GET_ADMIN_REPORT_DATA } from '../../../constants/constants';
import { GET_USER_NAMES, } from 'constants/Utility/wardAllocationConstants/wardAllocationConstants';
import { GET_USER_ACTIVITY_LOG } from 'constants/Report/AdminConstants/adminConstants';


export const getAdminReportData = async (requestInfo) => {
  try {
    const response = await axios.post(`${GET_ADMIN_REPORT_DATA}`, { requestInfo });
    return response.data;
  } catch (error) {
    console.error('Error fetching Owner Info:', error);
    throw error;
  }
};


export const getUsersList=async()=>
{
  try {
    const response = await axios.get(`${GET_USER_NAMES}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Users List:', error);
    throw error;
  }
}



export const getUserLoginHistory = async ({ UserID, StartDate, EndDate }) => {
  try {
    const response = await axios.post(GET_USER_ACTIVITY_LOG, {
      UserID,
      StartDate,
      EndDate,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user login history:", error);
    throw error.response?.data?.message || "Server error";
  }
};