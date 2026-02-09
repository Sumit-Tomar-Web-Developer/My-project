import axios from 'axios';
import { GET_MUTATION_HISTORY_REPORT_DATA } from '../../../constants/constants';

const getMutationHistoryReportData = async (requestInfo) => {
  try {
    const response = await axios.post(`${GET_MUTATION_HISTORY_REPORT_DATA}`, { requestInfo });
    return response.data;
  } catch (error) {
    console.error('Error fetching Mutation History Report Info:', error);
    throw error;
  }
};
export {
    getMutationHistoryReportData
};
