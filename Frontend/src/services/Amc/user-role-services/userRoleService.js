import axios from 'axios';
import { GET_ROLE_LIST } from 'constants/Amc/userRoleConstant';

export const getUserRole = async () => {
    try {
      const response = await axios.get(GET_ROLE_LIST);
      return response.data;
    } catch (error) {
      console.error('Error fetching User Role:', error);
      throw error;
    }
  };