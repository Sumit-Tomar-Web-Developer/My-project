
import axios from 'axios';
import { SAVE_AND_PROPERTY_LIST, SAVE_AND_UPDATE_AUTO_OBLIQUE, SAVE_AND_UPDATE_AUTO_WARD } from '../../../constants/Utility/autoWardConstant/autoWard.constant';

export const saveAndUpdateAutoWard = async (wardInfo) => {
    try {
      const res = await axios.post(SAVE_AND_UPDATE_AUTO_WARD, wardInfo);
      const message = res.data.message;
      const status = res.status;
      console.log(message, status, res.data);
      return { message, status, res };
    } catch (error) {
      console.error('There was an error saving/updating the  ward!', error);
      throw error;
    }
  };


  export const saveAndUpdateOblique = async (data) => {
    try {
      const res = await axios.post(SAVE_AND_UPDATE_AUTO_OBLIQUE, data);
      const message = res.data.message;
      const status = res.status;
      console.log(message, status, res.data);
      return { message, status, res };
    } catch (error) {
      console.error('There was an error saving/updating the  ward!', error);
      throw error;
    }
  };



// ✅ Service function
export const getPropertyListByWard = async (wardNo) => {
  try {
    const response = await axios.post(SAVE_AND_PROPERTY_LIST, { wardNo });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};
