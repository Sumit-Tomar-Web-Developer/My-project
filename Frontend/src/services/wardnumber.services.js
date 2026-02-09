import axios from 'axios';
import { WARD_NO, WARD_NO_SELECTION, GET_PROPERTY_BY_OLD_WARD } from '../constants/constants';

// Function to fetch users
const fetchWardNo = async () => {
  try {
    const response = await axios.get(`${WARD_NO}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ward No.:', error);
    throw error;
  }
};


const postWardSelection = async (wardNo) => {
  try {
    const response = await axios.post(WARD_NO_SELECTION, { wardNo });
    return response.data;
  } catch (error) {
    console.error('Error Sending data to backend:', error);
    throw error;
  }
};

const getOwnerPropertyList = async () => {
  try {
    const response = await axios.get(`${WARD_NO_SELECTION}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching property and owner list:', error);
    throw error;
  }
};

export const getPropertyByOldWardNo = async (wardNo) => {
  try {
    const result = await axios.post(GET_PROPERTY_BY_OLD_WARD, { wardNo })
    console.log(result, 'axios result')
    return (result)
  } catch (error) {
    console.log('Axios Error in Getting Property By Old Ward No')
  }
}

export { fetchWardNo, postWardSelection, getOwnerPropertyList };


