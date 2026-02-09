import axios from 'axios';
import {
  GET_JOINT_OWNER_DETAILS,
  GET_OWNER_NAMES,
  GET_PROPERTY_RANGE_FROM_AND_TO,
  SAVE_ADDRESS_DETAILS,
  SAVE_COMMON_REMARK_DETAILS,
  SAVE_OWNER_NAMES,
  SAVE_PROPERTY_DESCRPITION_DETAILS,
  SAVE_ROAD_DETAILS,
  SAVE_SHOP_DETAILS,
  SAVE_WADH_GHAT_DETAILS
} from '../../../constants/Utility/updatePropertyDetailsConstants/updatePropertyDetailsConstant';

export const getPropertyRangeFromAndTo = async (wardNo, from, to) => {
  try {
    console.log(wardNo, from, to);
    const response = await axios.post(`${GET_PROPERTY_RANGE_FROM_AND_TO}`, { wardNo, fromPropertyNo: from, toPropertyNo: to });
    console.log(response.data, 'API Response');
    return response.data;
  } catch (error) {
    console.error('Error fetching property range:', error);
    throw error;
  }
};

export const getOwnerNames = async (wardNo, from, to) => {
  try {
    const response = await axios.post(`${GET_OWNER_NAMES}`, { wardNo, fromPropertyNo: from, toPropertyNo: to });
    console.log(response.data, 'API Response');
    return response.data;
  } catch (error) {
    console.error('Error fetching Owner names :', error);
    throw error;
  }
};

export const saveOwnerNames = async (requestData) => {
  try {
    const response = await axios.post(`${SAVE_OWNER_NAMES}`, { requestData });
    console.log(response.data, 'API Response');
    return response.data;
  } catch (error) {
    console.error('Error in saving Owner names :', error);
    throw error;
  }
};

export const getJointOwnerDetails = async (OwnerID) => {
  try {
    const response = await axios.post(`${GET_JOINT_OWNER_DETAILS}`, { OwnerID });
    console.log(response.data, 'API Response');
    return response.data;
  } catch (error) {
    console.error('Error fetching Joint Owner details:', error);
    throw error;
  }
};
//address
export const saveAddress = async (requestData) => {
  try {
    const res = await axios.post(`${SAVE_ADDRESS_DETAILS}`, { requestData });
    const message = res.data.message;
    const status = res.status;
    console.log(message, status, res.data);
    return { message, status, res };
  } catch (error) {
    console.error('Error in saving Address :', error);
    throw error;
  }
};

//road

export const saveRoad = async (requestData) => {
  try {
    console.log(requestData, 'request data to be save d in backend');
    const res = await axios.post(`${SAVE_ROAD_DETAILS}`, { requestData });
    const message = res.data.message;
    const status = res.status;
    console.log(message, status, res.data);
    return { message, status, res };
  } catch (error) {
    console.error('Error in saving Road Width:', error);
    throw error;
  }
};

//Property Descrpition
export const savePropertyDesc = async (requestData) => {
  try {
    const res = await axios.post(`${SAVE_PROPERTY_DESCRPITION_DETAILS}`, { requestData });
    const message = res.data.message;
    const status = res.status;
    console.log(message, status, res.data, 'lllllll');
    return { message, status, res };
  } catch (error) {
    console.error('Error in saving Property Desc. :', error);
    throw error;
  }
};

//shop tab
export const saveShop = async (requestData) => {
  try {
    const res = await axios.post(`${SAVE_SHOP_DETAILS}`, { requestData });
    const message = res.data.message;
    const status = res.status;
    console.log(message, status, res.data);
    return { message, status, res };
  } catch (error) {
    console.error('Error in saving Shop name :', error);
    throw error;
  }
};
//Common Remark
export const saveCommonRemark = async (requestData) => {
  try {
    const res = await axios.post(`${SAVE_COMMON_REMARK_DETAILS}`, { requestData });
    const message = res.data.message;
    const status = res.status;
    console.log(message, status, res.data);
    return { message, status, res };
  } catch (error) {
    console.error('Error in saving Common Remark :', error);
    throw error;
  }
};
//wadh Ghat
export const saveWadhGhat = async (requestData) => {
  try {
    const res = await axios.post(`${SAVE_WADH_GHAT_DETAILS}`, { requestData });
    const message = res.data.message;
    const status = res.status;
    console.log(message, status, res.data);
    return { message, status, res };
  } catch (error) {
    console.error('Error in saving wadh Ghat :', error);
    throw error;
  }
};
