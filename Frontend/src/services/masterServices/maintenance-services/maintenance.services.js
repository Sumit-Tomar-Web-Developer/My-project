import {
  MAINTENANCE_LIST,
  MAINTENANCE_UPDATE_LIST,
  MAINTENANCE_DELETE_LIST
} from '../../../constants/MasterConstants/maintenance-master-constants/maintenance-master-constants.constants.js';
import axios from 'axios';

const fetchMaintenanceList = async () => {
  try {
    const response = await axios.get(MAINTENANCE_LIST);
    return response.data;
  } catch (error) {
    console.error('Error in Fetching List');
    throw error;
  }
};

const updateMaintenanceList = async (data) => {
  try {
    const res = await axios.post(MAINTENANCE_UPDATE_LIST, data);
    const message = res.data.message;
    const status = res.status;
    return { message, status };
  } catch (error) {
    console.error('Error In Updating List');
    throw error;
  }
};

const deleteMaintenanceList = async (IDs) => {
  try {
    const res = await axios.delete(`${MAINTENANCE_DELETE_LIST}`, { data: { IDs } });
    console.log('Deleted successfully:');
  } catch (error) {
    console.error('Error deleting:', error);
    throw error;
  }
};
export { fetchMaintenanceList, updateMaintenanceList, deleteMaintenanceList };
