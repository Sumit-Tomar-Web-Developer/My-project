import axios from 'axios';
import { GET_DAILY_COLLECTION_REPORT_DATA } from '../../../constants/constants';

const getDailyCollectionReportData = async (requestInfo) => {
  try {
    const response = await axios.post(`${GET_DAILY_COLLECTION_REPORT_DATA}`, { requestInfo });
    return response.data;
  } catch (error) {
    console.error('Error fetching Daily Collection Report Info:', error);
    throw error;
  }
};
export {
    getDailyCollectionReportData
};