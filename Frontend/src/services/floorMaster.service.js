import axios from 'axios';
  import { DELETE_NEW_FLOOR_INFO, DELETE_OLD_FLOOR_INFO, GET_NEW_FLOOR_INFO, GET_OLD_FLOOR_INFO, SAVE_NEW_FLOOR_INFO, SAVE_OLD_FLOOR_INFO } from '../../src/constants/constants';
  // Function to fetch  new Floor
  const fetchNewFloor = async () => {
    try {
      const response = await axios.get(`${GET_NEW_FLOOR_INFO}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching new floor:', error);
      throw error;
    }
  };
  // Function to add new Floor
  const createNewFloor = async (floorValues) => {
    try {
      const res = await axios.post(`${SAVE_NEW_FLOOR_INFO}`, floorValues);
      const message = res.data.message;
      const status = res.status;
      console.log(message, status, res.data, 'service response');
      return { message, status, res };
    } catch (error) {
      console.error('Error in adding floor:', error);
      throw error;
    }
  };
  // Function to fetch  old Floor
  const fetchOldFloor = async () => {
    try {
      const response = await axios.get(`${GET_OLD_FLOOR_INFO}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching old Floor:', error);
      throw error;
    }
  };
  // Function to add old Floor
  const createOldFloor = async (floors) => {
    try {
      const res = await axios.post(`${SAVE_OLD_FLOOR_INFO}`, floors);
      const message = res.data.message;
      const status = res.status;
      console.log(message, status, res.data, 'service old');
      return { message, status, res };
    } catch (error) {
      console.error('Error in adding old floor:', error);
      throw error;
    }
  };
  const deleteNewFloor = async (id) => {
    try {
      const res = await axios.post(DELETE_NEW_FLOOR_INFO, {
        FMId: id
      });
      return {
        message: res.data.message,
        status: res.status
      };
    } catch (error) {
      return {
        message: error.response?.data?.message || 'Delete failed',
        status: error.response?.status || 500
      };
    }
  };
  const deleteOldFloor = async (id) => {
    try {
      const res = await axios.post(`${DELETE_OLD_FLOOR_INFO}?ID=${id}`);
      return {
        message: res.data.message,
        status: res.status
      };
    } catch (error) {
      console.error("Error deleting Old Floor info:", error);
      // Return error response if needed
      return {
        message: error.response ? error.response.data.message : 'Unknown error occurred',
        status: error.response ? error.response.status : 500
      };
    }
  };
  ;
  export { fetchNewFloor,deleteOldFloor,deleteNewFloor, createNewFloor, createOldFloor, fetchOldFloor };