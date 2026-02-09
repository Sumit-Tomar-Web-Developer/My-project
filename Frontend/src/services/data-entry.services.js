import axios from 'axios';
import { JOINT_OWNER_DETAILS, PROPERTY_DESC, PROPERTY_MAST } from '../constants/constants';
import {
  DELETE_PROPERTY_ENTRY,
  FLOOR_NO_OF_ROOM,
  GET_ALL_OWNER_IDS,
  GET_ALL_TABLE_DATA_BY_OWNER_ID,
  GET_WARD_LIST,
  ROOM_SHAPES,
  SAVE_DATA_ENTRY_PROPERTIES,
  SAVE_DATA_ENTRY_PROPERTIES_AMC
} from 'constants/AssessmentConstants/dataEntryConstants';

// Function to fetch property description
const fetchPropertyDescription = async () => {
  try {
    const response = await axios.get(`${PROPERTY_DESC}`);
    console.log(response, 'property description');
    return response.data;
  } catch (error) {
    console.error('Error fetching property description:', error);
    throw error;
  }
};

// Function to fetch property mast
const fetchPropertyMast = async () => {
  try {
    const response = await axios.get(`${PROPERTY_MAST}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching property mast:', error);
    throw error;
  }
};

// Function to fetch property mast
const fetchJointOwnerList = async () => {
  try {
    const response = await axios.get(`${JOINT_OWNER_DETAILS}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching owner details:', error);
    throw error;
  }
};

const fetchAllTableInfo = async (OwnerId) => {
  try {
    const response = await axios.post(`${GET_ALL_TABLE_DATA_BY_OWNER_ID}`, { OwnerID: OwnerId });
    return response.data;
  } catch (error) {
    console.error('Error fetching All Appeal Info:', error);
    throw error;
  }
};

// Function to fetch property description
export const fetchOwnerIDs = async (page = 1, limit = 1000) => {
  try {
    const response = await axios.get(`${GET_ALL_OWNER_IDS}`, {
      params: {
        page,
        limit
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching OwnerIDs:', error);
    throw error;
  }
};

const fetchWardList = async () => {
  try {
    const response = await axios.get(`${GET_WARD_LIST}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching All Ward Info:', error);
    throw error;
  }
};

const savePropertyInfo = async (propertyInfo) => {
  try {
    const response = await axios.post(`${SAVE_DATA_ENTRY_PROPERTIES}`, propertyInfo);
    const message = response.data.message;
    const status = response.status;
    console.log(message, status, response, 'service response');
    return { message, status, response };
  } catch (error) {
    console.error('Error saving property information:', error);
    throw error.response ? error.response.data : new Error('Failed to save property information');
  }
};
//amc login
const savePropertyInfoAmc = async (propertyInfo) => {
  try {
    const response = await axios.post(`${SAVE_DATA_ENTRY_PROPERTIES_AMC}`, propertyInfo);
    const message = response.data.message;
    const status = response.status;
    console.log(message, status, response, 'service response');
    return { message, status, response };
  } catch (error) {
    console.error('Error saving property information:', error);
    throw error.response ? error.response.data : new Error('Failed to save property information');
  }
};
const deleteProperty = async (ownerId) => {
  try {
    const response = await axios.post(`${DELETE_PROPERTY_ENTRY}`, ownerId);
    const message = response.data.message;
    const status = response.status;
    return { message, status, response };
  } catch (error) {
    console.error('Error In Deleting Property');
  }
};

// Function to fetch property mast
const fetchFloorRoomNo = async () => {
  try {
    const response = await axios.get(`${FLOOR_NO_OF_ROOM}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching floor rooms:', error);
    throw error;
  }
};

// Function to fetch property mast
const fetchRoomShapes = async () => {
  try {
    const response = await axios.get(`${ROOM_SHAPES}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};

export {
  fetchPropertyDescription,
  savePropertyInfo,
  fetchAllTableInfo,
  fetchWardList,
  fetchPropertyMast,
  fetchJointOwnerList,
  deleteProperty,
  fetchFloorRoomNo,
  fetchRoomShapes,
  savePropertyInfoAmc
};
