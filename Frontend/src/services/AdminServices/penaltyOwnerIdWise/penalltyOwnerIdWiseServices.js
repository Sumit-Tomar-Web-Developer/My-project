import axios from 'axios';
import { APPLY_PENALTY_BY_OWNER_ID, GET_SEARCHED_PROPERTIES } from '../../../constants/AdminConstants/penaltyOwnerIdWiseConstants';

export const fetchSearchedProperties = async (wardNo, from, to) => {
  try {
    console.log(wardNo, from, to);
    const response = await axios.post(`${GET_SEARCHED_PROPERTIES}`, { wardNo, fromPropertyNo: from, toPropertyNo: to });
    console.log(response.data, 'API Response');
    return response.data;
  } catch (error) {
    console.error(error, 'Error in fetching serached properties..');
    throw error;
  }
};

export const savePenaltyByOwnerId = async (penaltyData) => {
  try {
    const response = await axios.post(APPLY_PENALTY_BY_OWNER_ID, { dataToUpdate: penaltyData });
    return { data: response.data, status: response.status, message: response.message };
  } catch (error) {
    console.error('Error in Posting New List', error);
    throw new Error('Failed to post the updated tax list');
  }
};
