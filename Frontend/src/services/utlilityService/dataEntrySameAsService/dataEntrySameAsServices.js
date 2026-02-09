import axios from 'axios';
import { COPY_DATA_ENTRY_DETAILS, GET_PROPERTY_DETAILS_BY_WARD } from '../../../constants/Utility/dataEntrySameAs.constants/dataEntrySameConstants';

export const fetchPropertyRangeByWard = async (wardNo) => {
  try {
    const response = await axios.post(`${GET_PROPERTY_DETAILS_BY_WARD}`, { wardNo });
    console.log(response, 'ttpResponse');
    return response.data;
  } catch (error) {
    console.error('Error fetching property range:', error);
    throw error;
  }
};

export const saveDataEntryDetails = async (ownerIds, propertyMastData) => {
  try {
    const response = await axios.post(`${COPY_DATA_ENTRY_DETAILS}`, {
      data: { ownerIds, propertyMastData }
    });
    console.log(response, 'Property Response');
    const message = response.data.message;
    const status = response.status;
    return { message, status, response };
  } catch (error) {
    console.error('Error in copying data entry ', error);
    throw error;
  }
};
