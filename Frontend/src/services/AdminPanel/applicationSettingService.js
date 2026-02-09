import axios from 'axios';
import { GET_APPLICATION_SETTING, GET_OTP, GET_OTP_RESEND, GET_OTP_VERIFY, UPSERT_APPLICATION_SETTING } from 'constants/adminPanel/applicationSettingConstant';

// Send OTP service
export const sendOtpService = async (identifier, password) => {
  try {
    console.log(identifier,"identifier");
    const response = await axios.post(GET_OTP, { identifier, password });
    return response.data; 
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};
export const verifyOtpService = async (identifier, otp) => {
    try {
      const response = await axios.post(GET_OTP_VERIFY, { identifier, otp });
      return response.data;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  };
  export const resendOtpService = async (identifier) => {
    try {
      const response = await axios.post(GET_OTP_RESEND, { identifier });
      return response.data;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  };
  // 🔹 Get Application Setting
export const getApplicationSetting = async () => {
    try {
      const response = await axios.get(GET_APPLICATION_SETTING);
      return response.data; 
    } catch (err) {
      console.error('Error fetching application setting:', err);
      throw err;
    }
  };
// 🔹 Upsert Application Setting
export const upsertApplicationSetting = async (data) => {
    try {
      const response = await axios.post(UPSERT_APPLICATION_SETTING, data);
      return response.data; 
    } catch (err) {
      console.error('Error upserting application setting:', err);
      throw err;
    }
  };
  