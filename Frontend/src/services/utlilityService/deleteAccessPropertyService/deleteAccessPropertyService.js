import { DELETE_ACCESS_PROPERTY_DETAILS } from "constants/Utility/deleteAccessProperty/deleteAccessPropertyConstant";
import axios from 'axios';


export const deletePropertyByOwnerId = async (ownerId) => {
    try {
      const response = await axios.post(DELETE_ACCESS_PROPERTY_DETAILS, { ownerId });
      return response.data;
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  };