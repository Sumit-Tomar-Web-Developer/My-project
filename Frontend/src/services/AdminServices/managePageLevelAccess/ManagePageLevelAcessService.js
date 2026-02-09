import { ADD_SECURITY_LAYER, DELETE_SECURITY_LAYER, GET_SECURITY_LAYER } from 'constants/AdminConstants/pageLevelAccessConstants';
import axios from 'axios';
import {
  FETCH_SAVED_PERMISSIONS,
  GET_ACCESS_LEVELS,
  GET_PAGE_ID,
  SAVE_PAGE_PERMISSIONS
} from 'constants/AdminConstants/managePageLevelAccessConstants';

export const getAccessLevels = async () => {
  try {
    const response = await axios.get(GET_ACCESS_LEVELS);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error, 'Error getting access levels');
  }
};
export const getSavedPermissions = async (layerID) => {
  try {
    const response = await axios.post(FETCH_SAVED_PERMISSIONS, { layerID });
    return response.data;
  } catch (error) {
    console.error(error, 'Error getting saved permissions');
  }
};

export const savePagesPermissions = async (permissions) => {
  try {
    // Ensure that `permissions` is an array, not an object with `permissions` key
    const response = await axios.post(SAVE_PAGE_PERMISSIONS, { permissions });
    return response.data;
  } catch (error) {
    console.error('Error saving page permissions:', error);
    throw error;
  }
};

export const getPageIDByPageName = async (pageName) => {
  try {
    const response = await axios.post(GET_PAGE_ID, { pageName });
    return response.data;
  } catch (error) {
    console.error('Error in getting page ID:', error);
    throw error;
  }
};
