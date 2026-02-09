import axios from 'axios';
import { GET_BILL_BOOK_ENTRY_LIST, GET_YEAR_TRANS_LIST, UPSET_BILL_BOOK_ENTRY } from '../../../constants/Amc/transYearMasterConstant';

export const getTransYear = async () => {
    try {
      const response = await axios.get(GET_YEAR_TRANS_LIST);
      return response.data;
    } catch (error) {
      console.error('Error fetching Trans year master:', error);
      throw error;
    }
  };
//fetching bill book entry table
  export const getBillBookList = async () => {
    try {
      const response = await axios.get(GET_BILL_BOOK_ENTRY_LIST);
      return response.data;
    } catch (error) {
      console.error('Error fetching bill book entry list:', error);
      throw error;
    }
  };

  //insert and update bill book enter
  export const createOrUpdateBillBookEntry = async (entryData) => {
    try {
        const response = await axios.post(UPSET_BILL_BOOK_ENTRY, entryData);
        const message = response.data.message;
        const status = response.status;
        console.log(message, status, response.data);
        return { message, status, response };
    } catch (error) {
        console.error('Error while creating/updating bill book entry:', error);
        throw error; 
    }
};