import axios from 'axios';
import { APPLY_APPEAL_COMM, GENERATE_APPEAL_TAX, GET_OWNER_FOR_AUTO_HEARING,APPLY_HEARING_APPEAL } from 'constants/AdminConstants/autoHearingAppealCommConstant';

export const applyAppealService = async (appealData) => {
  try {
    const response = await axios.post(APPLY_APPEAL_COMM, appealData);
    return response.data;
  } catch (error) {
    console.error('Error applying appeal:', error);
    throw new Error('Failed to apply appeal.');
  }
};

export const getOwnersForAutoHearingAppComm = async (isAutoHearing, newWardNo) => {
  try {
    const response = await axios.post(`${GET_OWNER_FOR_AUTO_HEARING}`, {
      isAutoHearing,
      newWardNo
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching OwnerIDs:', error);
    return { success: false, message: 'Error fetching data', error };
  }
};

export const getDemandAnalysisData = async (RangeValue) => {
  try {
    const response = await axios.post(GENERATE_APPEAL_TAX, { RangeValue });
    return response.data;
  } catch (error) {
    console.error('Error fetching demand analysis data:', error);
    throw error;
  }
};

export const applyAppealRatioWise = async (tableNewDmdAnalysis, selectOneForTax, selectOneForAppeal, loggedInUserRole) => {
  try {
    const response = await axios.post(APPLY_HEARING_APPEAL, { tableNewDmdAnalysis, selectOneForTax, selectOneForAppeal, loggedInUserRole });
    return response.data;
  } catch (error) {
    console.error('Error fetching demand analysis data:', error);
    throw error;
  }
}
