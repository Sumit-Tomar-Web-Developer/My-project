
import axios from 'axios';
import { ADD_UPDATE_PRIME_TYPE_USE, DELETE_PRIME_TYPE_USE, PRIME_TYPE_USE_LIST } from '../../../constants/MasterConstants/prime-type-of-use-master-constants/prime-type-of-use-master.constants';
const fetchPrimeTypeOfUseList = async () => {
  try {
    const res = await axios.get(PRIME_TYPE_USE_LIST);
    return res.data;
  } catch (error) {
    console.error('Error in Fetching Prime Type of Use List');
    throw error;
  }
};

const postPrimeTypeOfUse = async (newPrimeTypeUseList) => {
  try {
    const res = axios.post(ADD_UPDATE_PRIME_TYPE_USE, newPrimeTypeUseList);
  } catch (error) {
    console.error('Error in Adding / Updating List ');
    throw error;
  }
};

const deletePrimeTypeofUse = async (id) => {
  try {
    console.log(id, 'data services');
    const response = await axios.delete(`${DELETE_PRIME_TYPE_USE}`, { data: { IDs: id } });
    console.log('Deleted successfully:', response.id);
    return response.id;
  } catch (error) {
    console.error('Error deleting:', error);
    throw error;
  }
};

export { fetchPrimeTypeOfUseList, postPrimeTypeOfUse, deletePrimeTypeofUse };
