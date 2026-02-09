
// Function to save or update bank information
import axios from 'axios';
import { GET_BANK_MASTER,DELETE_BANK_MASTER,SAVE_AND_UPDATE_BANK_MASTER } from 'constants/constants';


export const saveOrUpdateBankInfo = async (bankData) => {
  try {
      const res = await axios.post(SAVE_AND_UPDATE_BANK_MASTER, bankData);
      const message = res.data.message;
      const status = res.data.status;
      return { message, status, res };
  } catch (error) {
      console.error('Error saving or updating bank information', error);
      throw error;
  }
};
  
  // Function to get bank information
  export const getBankInfo = async () => {
    try {
      const response = await axios.get(GET_BANK_MASTER);
      return response.data;
    } catch (error) {
      console.error('Error fetching bank information', error);
      throw error;
    }
  };
  
  export const deleteBankInfo = async (IDs) => {
    try {
      const res = await axios.post(DELETE_BANK_MASTER, {  IDs: IDs});
      const message = res.data.message;
      const status = res.data.status;
      return { message, status, res };
    } catch (error) {
      console.error('Error deleting bank information', error);
      throw error;
    }
  };