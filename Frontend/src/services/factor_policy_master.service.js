import axios from 'axios';
import { DELETE_POLICY_FACTOR, GET_FACTOR_LIST, SAVE_AND_UPDATE_POLICY_FACTORS } from '../constants/constants';

export const saveAndUpdatePolicyFactors = async (data) => {
  try {
    const res = await axios.post(`${SAVE_AND_UPDATE_POLICY_FACTORS}`, data);
    const message = res.data.message;
    const status = res.status;
    console.log(message, status, res.data);
    return { message, status, res };
  } catch (error) {
    throw new Error(`Error saving and updating policy factors: ${error.message}`);
  }
};

export const getFactorList = async () => {
  try {
    const response = await axios.get(`${GET_FACTOR_LIST}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error getting factor list: ${error.message}`);
  }
};

// export const deletePolicyFactor = async (FacterID) => {
//   if (!FacterID) {
//     throw new Error('Factor ID cannot be null');
//   }

//   try {
//     const response = await axios.delete(`${DELETE_POLICY_FACTOR}`, {
//       data: { FacterID: FacterID }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting factor:', error);
//     if (error.response && error.response.data) {
//       throw new Error(error.response.data.message);
//     }
//     throw new Error('An error occurred while deleting the factor');
//   }
// };


export const deletePolicyFactor = async (IDs) => {
  try {
    const idArray = Array.isArray(IDs) ? IDs : [IDs];
    
    const res = await axios.post(DELETE_POLICY_FACTOR, {  FacterIDs: idArray });
    const message = res.data.message;
    const status = res.data.status;
    return { message, status, res }; 
  } catch (error) {
    console.error('Error deleting factor information', error);
    throw error;
  }
};
