import axios from 'axios';
import {
  GET_USER_INFO_BY_ID,
  GET_USER_NAMES,
  GET_USERS_LIST,
  SAVE_ALLOCATED_WARDS
} from '../../../constants/Utility/wardAllocationConstants/wardAllocationConstants';

export const getUserInfoById = async (id) => {
  try {
    const response = await axios.get(`${GET_USER_INFO_BY_ID}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error.response?.data || { message: 'An error occurred while fetching user info.' };
  }
}; 
export const getUserNames = async () => {
  try {
    const response = await axios.get(`${GET_USER_NAMES}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user names:', error);
    throw error.response?.data || { message: 'An error occurred while fetching user info.' };
  }
};

export const getUsersWithAllocatedWards = async () => {
  try {
    const response = await axios.get(`${GET_USERS_LIST}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user names:', error);
    throw error.response?.data || { message: 'An error occurred while fetching user info.' };
  }
};

export const saveAllocatedWards = async (userData) => {
  try {
    console.log('Saving allocating', userData);
    const response = await axios.post(`${SAVE_ALLOCATED_WARDS}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error while saving user info:', error);
    throw error.response?.data || { message: 'An error occurred while fetching user info.' };
  }
};
