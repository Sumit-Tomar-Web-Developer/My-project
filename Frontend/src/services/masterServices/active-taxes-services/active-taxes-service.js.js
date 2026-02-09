import axios from 'axios';
import {
  DELETE_ACTIVE_TAXES,
  FETCH_ACTIVE_TAXES_LIST,
  SAVE_AND_UPDATE_ACTIVE_TAXES
} from '../../../constants/MasterConstants/active-taxesConstants/active-taxes-constants';

// Function to fetch the active master list
export const getActiveMasterList = async () => {
  try {
    const response = await axios.get(FETCH_ACTIVE_TAXES_LIST);
    return response.data;
  } catch (error) {
    console.error('Error fetching active master list:', error);
    throw error;
  }
};

// Function to save and update master
export const saveAndUpdateActiveTaxes = async (taxData) => {
  try {
    const res = await axios.post(SAVE_AND_UPDATE_ACTIVE_TAXES, taxData);
    const message = res.data.message;
    const status = res.status;
    console.log(message, status, res.data);
    return { message, status, res };
  } catch (error) {
    console.error('Error saving and updating master:', error);
    throw error;
  }
};

export const deleteActiveTaxes = async (IDs) => {
  try {
    console.log('Payload to deleteActiveTaxes:', { IDs });

    const res = await axios.post(`${DELETE_ACTIVE_TAXES}`, {
      Ids: IDs  
    });
    const message = res.data.message;
    const status = res.status;
    console.log(message, status, res.data);
    return { message, status, res };
  } catch (error) {
    throw new Error('Failed to delete  active taxonomy: ' + error.message);
  }
};
