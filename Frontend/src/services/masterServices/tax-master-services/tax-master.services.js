import axios from 'axios';
import {
  ADD_UPDATE_TAX_MASTER_LIST,
  DELETE_TAX_MASTER_LIST,
  TAX_MASTER_LIST
} from '../../../constants/MasterConstants/tax-master-constants/tax-master.constants';

export const fetchTaxMasterList = async (data) => {
  try {
    const res = await axios.get(TAX_MASTER_LIST, { params: data });
    return res;
  } catch (error) {
    console.error('Error Occurred in Fetching Tax Master Services');
    throw error;
  }
};

export const postUpdateTaxMasterList = async (taxMasterData) => {
  try {
    const res = await axios.post(ADD_UPDATE_TAX_MASTER_LIST, taxMasterData);
    const message = res.data.message;
    const status = res.status;
    return { message, status };
  } catch (error) {
    console.error('Error in updating Tax Master List:', error);
    throw error;
  }
};

export const deleteTaxMasterList = async (taxMasterId) => {
  console.log(taxMasterId)
  try {
    const res = await axios.delete(`${DELETE_TAX_MASTER_LIST}`, { data: taxMasterId });
    return res;
  } catch (error) {
    console.error('Error In Deleting Tax Master Services');
    throw error;
  }
};
