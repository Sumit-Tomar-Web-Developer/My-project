import axios from 'axios';
import {
  TAX_NAME_MASTER_LIST,
  ADD_UPDATE_TAX_NAME_LIST,
  DELETE_TAX_NAME_MASTER
} from '../../../constants/MasterConstants/tax-name-master-constants/tax-name-master.constants';

export const getTaxList = async () => {
  try {
    const res = await axios.get(TAX_NAME_MASTER_LIST);
    return res;
  } catch (error) {
    console.error('Error in Fetching Tax Name List Services');
    throw error;
  }
};

export const postUpdateTaxList = async (taxNamedata) => {
  try {
    const res = await axios.patch(ADD_UPDATE_TAX_NAME_LIST, [taxNamedata]);
    const message = res.data.message
    const status = res.status
    return {message , status};
  } catch (error) {
    console.error('Error In Posting Tax Name Services');
    throw error;
  }
};

export const deleteTaxList = async (taxID) => {
  try {
    const res = await axios.delete(`${DELETE_TAX_NAME_MASTER}`, { data: taxID });
    return res
  } catch (error) {
    console.error('Error In deleting Tax List Services');
    throw error;
  }
};


