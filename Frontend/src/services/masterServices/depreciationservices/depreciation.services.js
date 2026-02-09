import axios from 'axios';
import {
  DELETE_DEPR_RATES,
  DELETE_SINGLE_RATE,
  GENERATE_RATE,
  GET_ALL_DEPR_DATA,
  GET_CONSTRUCTION_TYPES,
  GET_RANGE_VALUES,
  GET_YEARS
} from 'constants/MasterConstants/depreciationConstants/depreciation-constants';

// Function to get years
export const getYears = async () => {
  try {
    const response = await axios.get(GET_YEARS);
    return response.data;
  } catch (error) {
    console.error('Error fetching years:', error);
    throw error;
  }
};

// Function to fetch all depreciation masters
export const getAllDepreciationMasters = async () => {
  try {
    const response = await axios.get(GET_ALL_DEPR_DATA);
    return response.data;
  } catch (error) {
    console.error('Error fetching depreciation masters:', error);
    throw new Error('Error fetching depreciation masters');
  }
};

// Function to get years
export const getConstructionTypes = async () => {
  try {
    const response = await axios.get(GET_CONSTRUCTION_TYPES);
    return response.data;
  } catch (error) {
    console.error('Error fetching constructionTypes:', error);
    throw error;
  }
};

// Function to get range values
export const getRangeValues = async (year) => {
  try {
    const response = await axios.post(GET_RANGE_VALUES, { Year: year });
    console.log(response, 'resooooo');
    return response.data;
  } catch (error) {
    console.error('Error fetching range values:', error);
    throw error;
  }
};

// // Function to add range values
export const addUpdateRates = async (ratesArray) => {
  try {
    console.log(ratesArray, 'data to be sent to backend depr');
    const res = await axios.patch(`${GENERATE_RATE}`, ratesArray);

    console.log(res, 'generate rates in dep page');
    const message = res.data.message;
    const status = res.status;
    console.log(message, status, res.data);
    return { message, status, res };
  } catch (error) {
    console.error('API Errorrrrrrrr:', error); // Add for debugging
    throw error.response?.data || { message: 'Unexpected error occurred', status: 500 };
  }
};

export const deleteDeprRate = async (Year) => {
  if (!Year) {
    throw new Error('Year cannot be null');
  }

  try {
    const res = await axios.post(`${DELETE_DEPR_RATES}`, {
      Year: Year 
    });

    const message = res.data.message;
    const status = res.status;
    console.log(message, status, res.data);
    return { message, status, res };
  } catch (error) {
    console.error('Error deleting rate:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    }
    throw new Error('An error occurred while deleting rate');
  }
};

export const deleteDeprRateById = async (id) => {
  if (!id) {
    throw new Error('ID cannot be null');
  }

  try {
    const res = await axios.post(`${DELETE_SINGLE_RATE}`, {
      ID: id
    });

    const message = res.data.message;
    const status = res.status;
    console.log(message, status, res.data);
    return { message, status, res };
  } catch (error) {
    console.error('Error deleting rate by ID:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    }
    throw new Error('An error occurred while deleting rate by ID');
  }
}
