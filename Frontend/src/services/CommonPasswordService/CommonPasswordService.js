import axios from 'axios';
import { SAVE_COMMON_PASSWORD } from 'constants/CommonPasswordConstant.js/commonPasswordConstant';

//common Password
export const levelPassword = async (levelname, password) => {
  try {
    const response = await axios.post(`${SAVE_COMMON_PASSWORD}`, {
      levelname,
      password,
    });
    const message = response.data.message;
    const status = response.status;
    console.log(message, status, response, "services")
    return { message, status, response };
  } catch (error) {
    throw error;
  }
};
