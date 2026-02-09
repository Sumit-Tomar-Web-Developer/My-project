import axios from 'axios';
import { GET_CUSTOM_TAXES_BY_OWNERID, PENDING_TAX_STATUS, SAVE_CUSTOM_TAXES } from '../../../constants/Amc/setCustomTaxesConstants';

export const getCustomTaxesByOwnerID = async (ownerID) => {
  try {
    const response = await axios.post(`${GET_CUSTOM_TAXES_BY_OWNERID}`, { OwnerID: ownerID });
    return response.data;
  } catch (error) {
    console.error('Error fetching in fetching custom taxes:', error);
    throw error;
  }
};

export const saveCustomTax = async (taxDetails, OwnerID, taxType, finacialYear) => {
  try {
    const response = await axios.post(`${SAVE_CUSTOM_TAXES}`, {
      CustomTaxes: taxDetails,
      OwnerID,
      taxType,
      finacialYear
    });
    const message = response.data.message;
    const status = response.status;
    console.log(message, status, response.data);
    return { message, status, response };
  } catch (error) {
    console.error('Error saving custom taxes:', error);
    throw error;
  }
};

export const getPendingTaxStatusByYear = async (year, ownerId) => {
  try {
    // Ensure that both year and ownerId are sent in the request body
    const response = await axios.post(`${PENDING_TAX_STATUS}`, {
      year: year,
      ownerId: ownerId
    });

    const message = response.data.message;
    const status = response.status;

    // Log the message, status, and response data for debugging
    console.log('Message:', message);
    console.log('Status:', status);
    console.log('Response:', response.data);

    // Return the message, status, and response data
    return { message, status, data: response.data };
  } catch (error) {
    console.error('Error fetching pending tax status by year and ownerId:', error);

    // Throw the error to propagate it if needed elsewhere in your code
    throw error;
  }
};
