import axios from 'axios';
import { ADD_RATE_MASTER_LIST, DELETE_RATE_MASTER_LIST, FETCH_RANGE_FOR_TYPE, POST_GETTING_INFORM_RATE_MASTER_LIST, RATE_MASTER_LIST } from '../../../constants/MasterConstants/rate-master-constants/rate-master.constants';
import { FETCH_TYPE_OF_USE_PRIME_MASTER } from 'constants/MasterConstants/active-taxesConstants/active-taxes-constants';


export const fetchRateMasterList = async (yearZoneList) => {

  try {
    const res = await axios.get(RATE_MASTER_LIST, { params: yearZoneList });
    return res;
  } catch (error) {
    console.error('Error Occurred in Fetching Tax Master Services');
    throw error;
  }
};

export const postUpdateRateMasterList = async (rateMasterData) => {
  try {
    const res = await axios.post(ADD_RATE_MASTER_LIST, rateMasterData);
    const message = res.data.message;
    const status = res.status;
    return { message, status };
  } catch (error) {
    console.error('Error in updating Tax Master List:', error);
    throw error;
  }
};

export const deleteRateMasterList = async (data) => {
  console.log(data,'data')

  try {
    const { message, status } = await axios.delete(`${DELETE_RATE_MASTER_LIST}`, {data});
    return { message, status };
  } catch (error) {
    console.error('Error In Deleting Tax Master Services');
    throw error;
  }
};



export const fetchTypeOfUsePrime = async () => {
  try {
    const response = await axios.get(FETCH_TYPE_OF_USE_PRIME_MASTER);
    return response.data;
  } catch (error) {
    console.error('Error fetching Type of Use Prime:', error);
    throw error;
  }
};

//
export const getRateMasterInfo = async (Year, TypeOfUseID, ZoneNos) => {
  const payload = {
    Year,
    TypeOfUseID,
    ZoneNos: Array.isArray(ZoneNos) ? ZoneNos : [ZoneNos]
  };

  try {
    const result = await POST_GETTING_INFORM_RATE_MASTER_LIST(payload);
    console.log('Rate master data:', result);
    return result;
  } catch (err) {
    console.error('API Error:', err.message || err);
    throw err;
  }
};
export const fetchRateRangeForType = async () => {
  try {
    const response = await axios.get(FETCH_RANGE_FOR_TYPE)
    return response.data;
  } catch (error) {
    console.log(error)
    return error
  }
}

