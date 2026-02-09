import axios from 'axios';

import { GET_APPROVAL_ALLOCATION_HISTORY, UPSERT_APPROVAL_ALLOCATION_HISTORY } from "constants/adminPanel/approvalAllocationConstant";


export const getApprovalAllocationHistory = async () => {
    try {
      const response = await axios.get(GET_APPROVAL_ALLOCATION_HISTORY);
      return response.data;
    } catch (error) {
      console.error('Error fetching approval allocation history:', error);
      throw error;
    }
  };
  
  // 2️⃣ Upsert allocation (insert/update)
  export const upsertApprovalAllocationHistory = async (payload) => {
    try {
      const response = await axios.post(UPSERT_APPROVAL_ALLOCATION_HISTORY, payload);
      return response.data;
    } catch (error) {
      console.error('Error upserting approval allocation:', error);
      throw error;
    }
  };