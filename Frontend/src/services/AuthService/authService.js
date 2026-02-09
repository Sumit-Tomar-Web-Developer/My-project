import axios from "axios";
import { FORGOT_PASSWORD, LOG_OUT_USER, RESET_PASSWORD } from "constants/authConstant/authConstant.js";

export const logoutUserService = async (userId) => {

    console.log("Logging out user with ID:", userId);
  try {
    const res = await axios.post( LOG_OUT_USER, {userId: userId} );
    return res.data;
  } catch (err) {
    console.error("Logout API error:", err);
    throw err;
  }
};


export const resetPassword = async ({ identifier, newPassword }) => {
  const res = await axios.post(RESET_PASSWORD, {
    identifier,
    newPassword
  });
  return res.data;
};

// Forgot password service
export const forgotPasswordService = async (email) => {
  try {
    const response = await axios.post(FORGOT_PASSWORD, { email });
    return response.data;
  } catch (error) {
    console.error('Forgot password API error:', error);
    throw error.response?.data || { error: 'Something went wrong' };
  }
};