import axios from 'axios';
import { GET_FACTOR_INFO, SAVE_FACTOR_INFO,SAVE_MIN_RV_PARAMETER,APPLY_POLICY } from '../../../constants/Utility/setPoliciesConstants/setPoliciesConstants';

export const getFactorInfo = async () => {
  try {
    const response = await axios.get(GET_FACTOR_INFO);
    return response.data;
  } catch (error) {
    console.error('Error fetching factor info:', error);
    throw error;
  }
};

export const saveFactorInfo = async (factorData) => {
  try {
    const response = await axios.post(SAVE_FACTOR_INFO, {
      FacterID: factorData.FacterID,
      FromFactor: factorData.FromFactor,
      ToFactor: factorData.ToFactor,
      FactorValue: factorData.FactorValue
    });
    const message = response.message;
    const status = response.status;
    const responseData = response.data;

    return { message, status, responseData };
  } catch (error) {
    console.error('Error saving factor info:', error);
    throw error;
  }
};

export const setMinRVParameter = async (data)=>{
  try{
    const response = await axios.post(SAVE_MIN_RV_PARAMETER,data)
    return response
  }catch(error){
    console.log('Error in Axios saving Min RV Parameter ')
    return error
  }
}
export const funApplyPolicy = async (payload)=>{
  try{
    const response = await axios.post(APPLY_POLICY,payload)
    return response
  }catch(error){
    console.log('Error in Axios Apply Policy ')
    return error
  }
}

