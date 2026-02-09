import { ADD_SECURITY_LAYER, DELETE_SECURITY_LAYER, GET_SECURITY_LAYER } from '../../../constants/AdminConstants/pageLevelAccessConstants';
import axios from 'axios';
export const getSecurityLayer = async () => {
  try {
    const response = await axios.get(GET_SECURITY_LAYER);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error, 'Error getting security layer');
  }
};

export const AddOrUpdateSecurityLayer = async (securityObject) => {
  try {
    console.log(securityObject, 'security');
    const response = await axios.post(ADD_SECURITY_LAYER, { LayerObject: securityObject });
    return response.data;
  } catch (error) {
    console.error(error, 'Error in Adding security layer');
  }
};

export const DeleteSecurityLayer = (LayerID) => {
  try {
    const respons = axios.post(DELETE_SECURITY_LAYER, { LayerID });
    return respons.data;
  } catch (error) {
    console.error(error, 'Error deleting security layer');
  }
};
