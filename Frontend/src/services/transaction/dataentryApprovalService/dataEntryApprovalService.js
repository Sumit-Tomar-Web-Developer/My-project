import axios from "axios";
import { DEA_INSERT_DATA_ENTRY_APPROVAL_UUID } from "constants/AssessmentConstants/dataEntryConstants";
import { DOCUMENT_OWNERID_WISE_Fetch_DEA, FETCHING_DOCUMENTS_DATA_ENTRY, FETCH_CURRENT_TAX, FETCH_IMAGE, FETCH_STATUS_CHECK, GET_PENDING_REQUESTS_FOR_DEA, INSERT_DATA_ENTRY_APPROVAL_UUID, OLD_PROPERTY_MAST_HISTORY, OWNER_DETAILS_DATA_HISTORY, PENDING_TAX_HISTORY, PROPERTY_MAST_DATA_HISTORY, SAVE_APPROVED_REQUEST_DATA_ENTRY, SAVE_APPROVED_REQUEST_FOR_DEA, SAVE_DATAENTRY_FERFAR_DOCUMENTS, SAVE_DISAPPROVED_REQUEST_DATA_ENTRY, SAVE_DISAPPROVED_REQUEST_FOR_DEA, SEARCH_DATA_ENTRY_APPROVAL_REQUEST, SOCIAL_DETAILS_HISTORY, TRANS_MAST_YEAR_INSERT } from "constants/Transaction/dataEntryApprovalConstant/dataEntryApprovalConstant";

// 

export const sendDataEntryForApproval  = async (payload) => {
  try {

      console.log(payload,"data entry service payload")
    const response = await axios.post(DEA_INSERT_DATA_ENTRY_APPROVAL_UUID , payload );
    return response.data;
  } catch (error) {
    console.error("❌ Error posting send to approval data entry data", error);
    throw error;
  }
};
// export const sendDataEntryForApproval  = async (payload) => {
//   try {

//       console.log(payload,"data entry service payload")
//     const response = await axios.post(INSERT_DATA_ENTRY_APPROVAL_UUID , payload );
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error posting send to approval data entry data", error);
//     throw error;
//   }
// };
export const copyTransMastYear = async (payload) => {
  try {
    const res = await axios.post(TRANS_MAST_YEAR_INSERT, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
export const uploadDataEntryChangesDocument = async (formData) => {
  try {
    const response = await axios.post(
      SAVE_DATAENTRY_FERFAR_DOCUMENTS,
      formData
    );
    return response.data;
  } catch (error) {
    console.error('Upload data entry ferfar document error', error);
    throw error;
  }
};
//fetching address documnet
export const ShowDocumentsByOwnerID =async (OwnerID)=>{
  try {
    console.log(OwnerID,"get owner id")
  const response = await axios.post(DOCUMENT_OWNERID_WISE_Fetch_DEA, {OwnerID:OwnerID});

  console.log(response,"selcetd ownerid documnets")
  return response.data;
} catch (error) {
  console.error("❌ Error fetching DataEntry approval document data:", error);
  throw error;
}
}
//SEARCH data
export const SearchDataEntryRequest  = async (payload) => {
  try {
  const response = await axios.post(SEARCH_DATA_ENTRY_APPROVAL_REQUEST,payload);
  return response.data;
} catch (error) {
  console.error("❌ Error fetching DataEntry approval data:", error);
  throw error;
}
}
//disaprroval
export const saveDisApprovedDSERequest  = async (payload) => {
  try {
  const response = await axios.post(SAVE_DISAPPROVED_REQUEST_FOR_DEA,payload);
  return response.data;
} catch (error) {
  console.error("❌ Error fetching data entry  approval data:", error);
  throw error;
}
}
//aprroval
export const saveApprovedDSERequest  = async (payload) => {
  try {
  const response = await axios.post(SAVE_APPROVED_REQUEST_FOR_DEA,payload);
  return response.data;
} catch (error) {
  console.error("❌ Error fetching data entry  approval data:", error);
  throw error;
}
}
//pending req
export const fetchDataEntryAppPendingRequests  = async () => {
  try {
    const response = await axios.get(GET_PENDING_REQUESTS_FOR_DEA);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching mutation approval data:", error);
    throw error;
  }
};
//property mast
export const getPropertyMastDataHistory = async (payload) => {
  try {
    const res = await axios.post(PROPERTY_MAST_DATA_HISTORY, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
//JOIN oWNER dEATILS
export const getOwnerDetailsDataHistory = async (payload) => {
  try {
    const res = await axios.post(OWNER_DETAILS_DATA_HISTORY, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
//old property mast OLD_PROPERTY_MAST_HISTORY
export const getOldPropertyMastDataHistory = async (payload) => {
  try {
    const res = await axios.post(OLD_PROPERTY_MAST_HISTORY, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
//pending tax history 
export const getTaxPendingDataHistory = async (payload) => {
  try {
    const res = await axios.post(PENDING_TAX_HISTORY, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
//social tax 
export const getSocialDataHistory = async (payload) => {
  try {
    const res = await axios.post(SOCIAL_DETAILS_HISTORY, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}
//images 
export const ShowDocumentsByOwnerIDForDEA =async (OwnerID,selectedVersionID)=>{
  try {
    console.log(OwnerID,"idddd")
  const response = await axios.post(FETCHING_DOCUMENTS_DATA_ENTRY, {OwnerID:OwnerID,selectedVersionID});

  console.log(response,"selected ownerid documnets")
  return response.data;
} catch (error) {
  console.error("❌ Error fetching DataEntry approval document data:", error);
  throw error;
}
}
//approval 
export const SaveApprovalStatusForDEA = async (payload) => {
  try {
    const res = await axios.post(SAVE_APPROVED_REQUEST_DATA_ENTRY, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}
export const SaveDISApprovalStatusForDEA = async (payload) => {
  try {
    const res = await axios.post(SAVE_DISAPPROVED_REQUEST_DATA_ENTRY, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}
export const CurrentTaxes = async (payload) => {
  try {
    const res = await axios.post(FETCH_CURRENT_TAX, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}
//image
export const FetchImage = async (payload) => {
  try {
    const res = await axios.post(FETCH_IMAGE, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}
//status check
export const fetchStatusCheckService = async (payload) => {
  try {
    const response = await axios.post(FETCH_STATUS_CHECK, payload);
    return response.data;
  } catch (error) {
    console.error('Status Check API Error:', error);
    throw error;
  }
};