import axios from 'axios';
import {
  DELETE_OLD_TYPE_OF_USE,
  DELETE_TYPE_OF_USE,
  GET_OLD_TYPE_OF_USE_LIST,
  GET_TYPE_OF_USE_LIST,
  SAVE_AND_UPDATE_OLD_TYPE_OF_USE,
  SAVE_AND_UPDATE_TYPE_OF_USE
} from 'constants/MasterConstants/typeOfUseConstant/typeOfUse.constant';
export const saveAndUpdateTypeOfUse = async (typeOfUseData) => {
  try {
    const res = await axios.post(SAVE_AND_UPDATE_TYPE_OF_USE, typeOfUseData);
    const message = res.data.message;
    const status = res.status;
    return { message, status, res };
  } catch (error) {
    throw new Error(`Error saving and updating type of use: ${error.message}`);
  }
};
export const getTypeOfUseList = async () => {
  try {
    const response = await axios.get(GET_TYPE_OF_USE_LIST);
    return response.data;
  } catch (error) {
    throw new Error(`Error getting type of use list: ${error.message}`);
  }
};
// export const deleteTypeOfUse = async (id) => {
//   try {
//     const response = await axios.delete(DELETE_TYPE_OF_USE, { data: { TypeofUseId: id } });
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting type of use information', error);
//     throw error;
//   }
// };
export const deleteTypeOfUse = async (ids) => {
  try {
    const res = await axios.post(DELETE_TYPE_OF_USE,{ IDs: ids } );
    const message = res.data.message;
    const status = res.status;
    return { message, status, res };
  } catch (error) {
    console.error('Error deleting type of use information', error);
    throw error;
  }
};
//old TYpe Of Use Master
export const getOldTypeOfUseList = async () => {
  try {
    const response = await axios.get(GET_OLD_TYPE_OF_USE_LIST);
    return response.data;
  } catch (error) {
    throw new Error(`Error getting Old type of use list: ${error.message}`);
  }
};
export const saveAndUpdateOldTypeOfUse = async (data) => {
  try {
    const res = await axios.post(SAVE_AND_UPDATE_OLD_TYPE_OF_USE, data);
    const message = res.data.message;
    const status = res.status;
    return { message, status, res };
  } catch (error) {
    throw new Error(`Error saving and updating  Old Type of Use: ${error.message}`);
  }
};
// export const deleteOldTypeOfUse = async (OldTypeOfUseID) => {
//   if (!OldTypeOfUseID) {
//     throw new Error('type of use ID cannot be null');
//   }
//   try {
//     const response = await axios.delete(`${DELETE_OLD_TYPE_OF_USE}`, {
//       data: { OldTypeOfUseID: OldTypeOfUseID }
//     });
//     console.log(response)
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting Old type of use:', error);
//     if (error.response && error.response.data) {
//       throw new Error(error.response.data.message);
//     }
//     throw new Error('An error occurred while deleting the type of use');
//   }
// };
export const deleteOldTypeOfUse = async (ids) => {
  try {
    const response = await axios.post(DELETE_OLD_TYPE_OF_USE, {
    IDs: ids
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting Old type of use:', error);
    throw new Error('An error occurred while deleting the type of use');
  }
};
