import { DELETE_PROPERTY_TYPE, GET_PROPERTY_TYPE_LIST, SAVE_AND_UPDATE_PROPERTY_TYPE } from "../../../constants/MasterConstants/property-typeConstant/propertyTypeConstant";

import axios from 'axios';


export const saveAndUpdatePropertyMaster = async (data) => {
  try {
    const response = await axios.post(SAVE_AND_UPDATE_PROPERTY_TYPE, data);
    const message = response.data.message;
    const status = response.status;
    return { message, status, response };  
  } catch (error) {
    throw new Error(`Error saving and updating type of use: ${error.message}`);
  }
};

export const getPropertyList = async () => {
  try {
    const response = await axios.get(GET_PROPERTY_TYPE_LIST);
    return response.data;
  } catch (error) {
    throw new Error(`Error getting type of use list: ${error.message}`);
  }
};


// export const deletePropertyMaster = async (PropertyTypeID) => {
//   if (!PropertyTypeID) {
//     throw new Error('Property Type ID cannot be null');
//   }

//   try {
//     console.log('Sending delete request for PropertyTypeID:', PropertyTypeID);
//     const response = await axios.delete(`${DELETE_PROPERTY_TYPE}`, {
//       data: { PropertyTypeID: PropertyTypeID } 
//     });
//     console.log('Delete request successful:', response.data); 
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting property:', error);
//     if (error.response && error.response.data) {
//       throw new Error(error.response.data.message);
//     }
//     throw new Error('An error occurred while deleting property');
//   }
// }

export const deletePropertyMaster = async (propertyTypeIDs) => {
  if (!Array.isArray(propertyTypeIDs) || !propertyTypeIDs.every(id => Number.isInteger(id) && id > 0)) {
    throw new Error('Property Type IDs must be an array of positive integers');
  }

  try {
    console.log('Sending delete request for PropertyTypeIDs:', propertyTypeIDs);
    const response = await axios.post(`${DELETE_PROPERTY_TYPE}`, {
       PropertyTypeIDs: propertyTypeIDs  
    });
    console.log('Delete request successful:', response.data); 
    return response.data;
  } catch (error) {
    console.error('Error deleting property:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    }
    throw new Error('An error occurred while deleting property');
  }
}
