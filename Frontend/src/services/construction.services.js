import axios from 'axios';

import {
  SAVE_NEW_CONSTRUCTION_INFO,
  GET_NEW_CONSTRUCTION_INFO,
  GET_OLD_CONSTRUCTION_INFO,
  SAVE_OLD_CONSTRUCTION_INFO,
  DELETE_NEW_CONSTRUCTION_INFO,
  DELETE_OLD_CONSTRUCTION_INFO
} from '../constants/constants';

// Function to fetch  new Floor
const fetchConstructionType = async () => {
  try {
    const response = await axios.get(`${GET_NEW_CONSTRUCTION_INFO}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching new construction master:', error);
    throw error;
  }
};

// Function to add new Floor
const createNewConstruction = async (constructionValues) => {
  try {
    const res = await axios.post(`${SAVE_NEW_CONSTRUCTION_INFO}`, constructionValues);
    const message = res.data.message;
    const status = res.status;
    console.log(message, status, res.data, 'service response');
    return { message, status, res };  
  } catch (error) {
    console.error('Error in adding construction master:', error);
    throw error;
  }
};





export const deleteNewConstructionInfo = async (id) => {
  try {
    const res = await axios.post(
      DELETE_NEW_CONSTRUCTION_INFO,
      { CTMId: id }
    );

    return {
      message: res.data.message,
      status: res.status
    };

  } catch (error) {
    console.error("Error deleting new construction info:", error);
    return {
      message: error.response ? error.response.data.message : 'Unknown error occurred',
      status: error.response ? error.response.status : 500
    };
  }
};

const createOldConstruction = async (constructionValues) => {
  try {
    const res = await axios.post(`${SAVE_OLD_CONSTRUCTION_INFO}`, constructionValues);
    const message = res.data.message;
    const status = res.status;
    console.log(message, status, res.data, 'service response');
    return { message, status, res };  
  } catch (error) {
    console.error('Error in adding construction master:', error);
    throw error;
  }
};
//fetching old construction
const fetchOldConstructionTypes = async () => {
  try {
    const response = await axios.get(`${GET_OLD_CONSTRUCTION_INFO}`);
    return response.data;
  } catch (error) {
    console.error('Error in  fetching Old construction Types:', error);
    throw error;
  }
};

export const deleteOldConstructionInfo = async (id) => {
  try {
    const res = await axios.post(
      DELETE_OLD_CONSTRUCTION_INFO,
      { OldID: id }
    );

    return {
      message: res.data.message,
      status: res.status
    };

  } catch (error) {
    console.error("Error deleting old construction info:", error);
    return {
      message: error.response ? error.response.data.message : 'Unknown error occurred',
      status: error.response ? error.response.status : 500
    };
  }
};


export { fetchConstructionType,createNewConstruction, fetchOldConstructionTypes, createOldConstruction}
