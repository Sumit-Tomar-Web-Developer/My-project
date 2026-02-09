import axios from 'axios';

import {
    GET_PROPERTY_DETAILS,
    GET_PROPERTY_DETAILS_WITH_OLD_DETAILS,
    REMOVE_ALL_APPEALS_DETAILS,
    REMOVE_APPEAL_COMMITTEE_DETAILS,
    REMOVE_REMISSION_DETAILS,
    REMOVE_HEARING_DETAILS,
    REMOVE_RETENTION_DETAILS,
    SAVE_LAST_ROW,
    APPLY_POLICY_DETAILS,
    DETAILS_FOR_SHORT_KEYS,
    APPLY_TAXES
} from 'constants/AssessmentConstants/totalValuation';

export const getpropertyDataFromNewDetails = async (NewWardNo, NewPropertyNo,NewPartitionNo) => {
    try {

        const response = await axios.post(GET_PROPERTY_DETAILS, { NewWardNo, NewPropertyNo,NewPartitionNo });

        return response.data;

    } catch (error) {
        console.log('Axios Error', error);
    }
}

export const getDetailsWithOldDetails = async (OldWardNo, OldPropertyNo) => {
    try {
        const response = await axios.post(GET_PROPERTY_DETAILS_WITH_OLD_DETAILS, { OldWardNo, OldPropertyNo });

        return response.data;
    }
    catch (error) {
        console.log('Axios error getting details with old details', error)
    }
}
export const removeAllAppealsDetails = async (OwnerID) => {
    try {
        const response = await axios.post(REMOVE_ALL_APPEALS_DETAILS, { OwnerID });
        return response;
    } catch (error) {
        return error.response.data;
    }
}
export const removeAppealCommitteeDetails = async (OwnerID) => {
    try {
        const response = await axios.post(REMOVE_APPEAL_COMMITTEE_DETAILS, { OwnerID });
        return response;
    } catch (error) {
        return error.response.data;
    }
}
export const removeRemissionDetails = async (OwnerID) => {
    try {
        const response = await axios.post(REMOVE_REMISSION_DETAILS, { OwnerID });
        return response;
    } catch (error) {
        return error.response.data;
    }
}
export const removeRetentionDetails = async (OwnerID) => {
    try {
        const response = await axios.post(REMOVE_RETENTION_DETAILS, { OwnerID });
        return response;
    } catch (error) {
        return error.response.data;
    }
}
export const removeHearingDetails = async (OwnerID) => {
    try {
        const response = await axios.post(REMOVE_HEARING_DETAILS, { OwnerID });
        return response;
    } catch (error) {
        return error.response.data;
    }
}
export const saveLastRow = async (data, selectedYear, ownerId) => {
    try {
        const response = await axios.post(SAVE_LAST_ROW, {
            data, selectedYear, ownerId
        })
        return response
    } catch (error) {
        console.log('Axios response in Save Last Row');
        return error
    }
}
export const applyPolicyDetails = async (ownerId, applicalePolicy) => {
    try {
        const response = await axios.post(`${APPLY_POLICY_DETAILS}`, {
            ownerId, applicalePolicy
        })
        return response
    } catch (error) {
        console.log('Axios error in apply policy details', error);
        return error.response
    }
}
export const detailsForShortKeys = async (ownerid) => {
    try {
        const response = await axios.post(`${DETAILS_FOR_SHORT_KEYS}`, { ownerid })
        return response
    } catch (error) {
        console.log('Axios error in fetching shorts keys details')
        return error.response
    }

}
export const changeApplyTaxes = async(ownerId,applyTaxes)=>{
     try {
        const response = await axios.post(`${APPLY_TAXES}`, { ownerId,applyTaxes })
        return response
    } catch (error) {
        console.log('Axios error in fetching shorts keys details')
        return error.response
    }
}