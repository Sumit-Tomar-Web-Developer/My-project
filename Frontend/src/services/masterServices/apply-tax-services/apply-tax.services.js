import axios from 'axios';
import {
  WARD_LIST,
  PROPERTY_RANGE,
  APPLIED_TAX_OWNER_ID,
  APPLY_TAXES_TO_ALL,
  GET_ALL_OWNER_IDS,
  SAVE_ALL_WARD_TAX,
  FETCH_ALL_WARD_TAX
} from '../../../constants/constants';

// Function to fetch ward list
const fetchWards = async () => {
  try {
    const response = await axios.get(WARD_LIST);
    console.log('ward', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching Wards:', error);
    throw error;
  }
};

// Function to fetch property range within a ward
const fetchPropertyRange = async (wardNo, from, to) => {
  try {
    const response = await axios.get(`${PROPERTY_RANGE}/${wardNo}`, {
      params: { from, to }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching property range:', error);
    throw error;
  }
};

// Function to fetch applied taxes for a specific owner ID
const fetchAppliedTaxes = async (ownerID) => {
  try {
    const response = await axios.get(`${APPLIED_TAX_OWNER_ID}/${ownerID}`);
    return response.data;
  } catch (error) {
    console.error('Error in fetching applied taxes for owner ID:', error);
    throw error;
  }
};

// Function to fetch all owner IDs
const fetchAllOwnerIDs = async () => {
  try {
    const response = await axios.get(GET_ALL_OWNER_IDS);
    return response.data;
  } catch (error) {
    console.error('Error in fetching all owner IDs:', error);
    throw error;
  }
};

const saveAppliedTaxes = async (taxValues) => {
  try {
    const res = await axios.post(APPLY_TAXES_TO_ALL, taxValues);
    const message = res.data.message;
    const status = res.status;
    console.log(message, status, res.data, 'hhh');

    // Return the response object
    return { message, status };
  } catch (error) {
    console.error('Error applying taxes:', error);
    throw error;
  }
};
const fetchAllApplyTaxes = async (OwnerID) => {
  try {
    const response = await axios.post(FETCH_ALL_WARD_TAX, {
      OwnerID
    });
        return response.data;
  } catch (error) {
    console.error('Error in fetching applied taxes for owner ID:', error);
    throw error;
  }
};

export { fetchWards, fetchPropertyRange, fetchAllApplyTaxes,fetchAppliedTaxes, fetchAllOwnerIDs, saveAppliedTaxes };
