

import axios from 'axios';
import { DELETE_YEAR_MASTER_BY_ID, GET_YEAR_MASTER_LIST, SAVE_AND_UPDATE_YEAR_MASTER } from '../../../constants/MasterConstants/yearMasterConstants/yearMaster.constants';

const saveAndUpdateYearMaster = async (yearInfo) => {
  try {
    const res = await axios.post(SAVE_AND_UPDATE_YEAR_MASTER, yearInfo);
    const message = res.data.message;
    const status = res.status;
    console.log(message, status, res.data);
    return { message, status, res };
  } catch (error) {
    console.error('There was an error saving/updating the  year!', error);
    throw error;
  }
};

const getYearMaster = async () => {
  try {
    const response = await axios.get(GET_YEAR_MASTER_LIST);
    return response.data;
  } catch (error) {
    console.error('There was an error fetching the  year!', error);
    throw error;
  }
};

// const deleteYearMaster = async (IDs) => {
//   try {
//     const res = await axios.delete(DELETE_YEAR_MASTER_BY_ID, { data: { IDs: IDs } });
//     const message = res.data.message;
//     const status = res.data.status;
//     return { message, status, res }; 
//    } catch (error) {
//     console.error('Error deleting  Year information', error);
//     throw error;
//   }
// };

const deleteYearMaster = async (IDs) => {
    try {
      const res = await axios.post(DELETE_YEAR_MASTER_BY_ID, { FinanceYears: IDs });
      const message = res.data.message;
      const status = res.data.status;
      return { message, status, res }; 
    } catch (error) {
      console.error('Error deleting Year information', error);
      throw error;
    }
  };

  
export { saveAndUpdateYearMaster, getYearMaster, deleteYearMaster };