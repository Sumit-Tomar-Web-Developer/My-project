import axios from 'axios';
import { USER_ADMIN_ENDPOINT } from '../constants/constants';

// Function to fetch users
const fetchUsers = async () => {
  try {
    const response = await axios.get(`${USER_ADMIN_ENDPOINT}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Function to create a user
const createUser = async (userData) => {
  try {
    const response = await axios.post(`${USER_ADMIN_ENDPOINT}`, userData);
    return { data: response.data, status: response.status, message: response.data.message };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export { fetchUsers, createUser };
