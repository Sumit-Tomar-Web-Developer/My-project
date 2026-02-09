import axios from 'axios';
import { DELETE_ACCESS_PROPERTY_DETAILS } from 'constants/Utility/deleteAccessProperty/deleteAccessPropertyConstant.js';


export const deleteAccessProperty = async ( ownerIds) => {
  try {
    const response = await axios.post(`${DELETE_ACCESS_PROPERTY_DETAILS}`, {
      // levelname,
      // password,
      OwnerID: ownerIds // Assuming `ownerIds` is an array
    });
    console.log('Delete API response:', response.data);

    // Return relevant information for the caller
    return {
      message: response.data.message,
      status: response.status,
      response: response.data,
    };
  } catch (error) {
    console.error('Error In Deleting Property:', error);
    throw error; // Rethrow the error to be handled by the calling component
  }
};
