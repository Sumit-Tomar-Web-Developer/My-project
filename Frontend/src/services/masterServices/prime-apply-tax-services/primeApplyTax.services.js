import axios from 'axios';
import { APPLY_TAX_LIST, APPLY_TAX_UPDATE,TYPE_OF_USE_MASTER_PRIME ,TYPE_OF_USE_MASTER} from 'constants/MasterConstants/prime-apply-tax-master-constants/prime-apply-tax-masters.constants';

// Fetch Tax List

export const fetchTaxList = async () => {
  try {
    const res = await axios.get(APPLY_TAX_LIST);
    console.log(res,'fetchTaxList')
    return res.data;
  } catch (error) {
    console.error('Error fetching Tax List (Services)', error);
    throw error;
  }
};

// Post Updated Tax List

export const postUpdatedTaxList = async (newList) => {
  try {
    const response = await axios.patch(APPLY_TAX_UPDATE, newList);
    return response.data;
  } catch (error) {
    console.error('Error in Posting New List', error);
    throw new Error('Failed to post the updated tax list');
  }
};
export const fetchTypeOfUseMasterPrime =async()=>{
  try {
    const res = await axios.get(TYPE_OF_USE_MASTER_PRIME);
    console.log(res,'typeOFUseMasterPrime')
    return res.data;
  } catch (error) {
    console.error('Error typeOFUseMasterPrime  (Services)', error);
    throw error;
  }
}
export const fetchTypeOfUseMaster =async()=>{
  try {
    const res = await axios.get(TYPE_OF_USE_MASTER);
    console.log(res,'typeOFUseMasterPrime')
    return res.data;
  } catch (error) {
    console.error('Error typeOFUseMasterPrime  (Services)', error);
    throw error;
  }
}

