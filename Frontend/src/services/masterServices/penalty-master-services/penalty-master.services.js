import axios from 'axios'
import { PENALTY_LIST , PENALTY_ADD_UPDATE_LIST} from '../../../constants/MasterConstants/penalty-master-constants/penalty-masters.constants.js';


// Fetch Penalty List

export const fetchPenaltyList = async () => {
  try {
    const res = await axios.get(PENALTY_LIST);
    return res.data;
  } catch (error) {
    console.error('Error in Fetching List', error);
    throw error;
  }
};

// Post Updated Penalty List

export const postUpdatedPenaltyList = async (newList) => {
  try {
    const response = await axios.patch(PENALTY_ADD_UPDATE_LIST, newList);
    return response.data;
  } catch (error) {
    console.error('Error in Posting New List', error);
    throw new Error('Failed to post the updated tax list');
  }
};
