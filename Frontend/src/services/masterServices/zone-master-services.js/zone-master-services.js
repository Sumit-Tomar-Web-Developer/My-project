import axios from 'axios';
import {
  DELETE_ZONE_MASTER_BY_ID,
  GET_ZONE_MASTER_LIST,
  SAVE_AND_UPDATE_ZONE_MASTER
} from '../../../constants/MasterConstants/zone-master-constants/zone-master-constants';

// Service function to save or update zone master
export const saveOrUpdateZoneMaster = async (zoneMasterData) => {
  try {
    const res = await axios.post(`${SAVE_AND_UPDATE_ZONE_MASTER}`, zoneMasterData);
    const message = res.data.message;
    const status = res.status;
    return { message, status, res };
  } catch (error) {
    throw new Error('Failed to save or update zone master');
  }
};

// Service function to get zone master list
export const getZoneMasterList = async () => {
  try {
    const response = await axios.get(`${GET_ZONE_MASTER_LIST}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch zone master list');
  }
};

// Service function to delete zone master by ID
// export const deleteZoneMasterById = async (ID) => {
//   try {
//     const response = await axios.delete(`${DELETE_ZONE_MASTER_BY_ID}/${ID}`);
//     return response.data;
//   } catch (error) {
//     throw new Error('Failed to delete zone master');
//   }
// };

// export const deleteZoneMasterById = async (IDs) => {
//   try {
//     const res = await axios.delete(DELETE_ZONE_MASTER_BY_ID, {
//       data: { IDs: IDs },
//       headers: { 'Content-Type': 'application/json' } // Optional, if needed
//     });
//     return res.data;
//   } catch (error) {
//     console.error('Error deleting zone information:', error);
//     throw error;
//   }
// };


export const deleteZoneMasterById = async (ids) => {
  try {
    const response = await axios.post(DELETE_ZONE_MASTER_BY_ID, {
  IDs: ids 
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting zones:', error);
    throw error; // Optionally, rethrow the error to handle it in the calling code.
  }
};