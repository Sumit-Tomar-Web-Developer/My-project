

import axios from 'axios';
import { SAVE_AND_UPDATE_ACTIVE_YEAR,GET_ACTIVE_YEAR,DELETE_ACTIVE_YEAR } from 'constants/constants';


const saveAndUpdateActiveYear = async (activeYearData) => {
  try {
    const res = await axios.post(SAVE_AND_UPDATE_ACTIVE_YEAR, activeYearData);
    const message = res.data.message;
    const status = res.status;
    console.log(message, status, res.data);
    return { message, status, res };
  } catch (error) {
    console.error('There was an error saving/updating the active year!', error);
    throw error;
  }
};

const getActiveYear = async () => {
  try {
    const response = await axios.get(GET_ACTIVE_YEAR);
    return response.data;
  } catch (error) {
    console.error('There was an error fetching the active year!', error);
    throw error;
  }
};

const deleteActiveYear = async (IDs) => {
  try {
    const res = await axios.post(DELETE_ACTIVE_YEAR, { IDs }); // send array directly
    const message = res.data.message;
    const status = res.data.status;
    return { message, status, res }; 
  } catch (error) {
    console.error('Error deleting active Year information', error);
    throw error;
  }
};


export { saveAndUpdateActiveYear, getActiveYear, deleteActiveYear };