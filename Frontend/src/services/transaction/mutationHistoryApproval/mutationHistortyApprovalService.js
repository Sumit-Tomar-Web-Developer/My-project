import axios from "axios";
import {  GET_COMPARISION_DATA,DOCUMENT_OWNERID_WISE, SAVE_FERFAR_DOCUMENTS, SEND_TO_APPROVAL_MUTATION, SAVE_DISAPPROVED_REQUEST, SEARCH_MUTATION_REQUEST, GET_PENDING_REQUESTS, SAVE_APPROVED_REQUEST } from "constants/Transaction/mutationHistortyApproval/mutationHistortyApprovalConstant";


// DD Cheque History upsert
  export const sendToApproval  = async (payload) => {
    try {

        console.log(payload,"mutation service payload")
      const response = await axios.post(SEND_TO_APPROVAL_MUTATION , payload );
      return response.data;
    } catch (error) {
      console.error("❌ Error posting send to approval mutation data", error);
      throw error;
    }
  };

//   export const uploadMutationFerfarDocument = async (formData) => {
//   try {
//     const response = await axios.post(
//     SAVE_FERFAR_DOCUMENTS,
//       formData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Upload mutation ferfar document error', error);
//     throw error;
//   }
// };

export const uploadMutationFerfarDocument = async (formData) => {
  try {
    const response = await axios.post(
      SAVE_FERFAR_DOCUMENTS,
      formData
    );
    return response.data;
  } catch (error) {
    console.error('Upload mutation ferfar document error', error);
    throw error;
  }
};

  export const fetchMutationPendingRequests  = async () => {
    try {
      const response = await axios.get(GET_PENDING_REQUESTS);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching mutation approval data:", error);
      throw error;
    }
  };

  
  export const fetchcomparisionData  = async (OwnerID) => {
    try {
      const response = await axios.post(GET_COMPARISION_DATA,{OwnerID:OwnerID });
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching mutation approval data:", error);
      throw error;
    }
  };


  export const saveApprovedRequest  = async (payload) => {
      try {
        console.log(payload,"payloas service approve request")
      const response = await axios.post(SAVE_APPROVED_REQUEST,payload);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching mutation approval data:", error);
      throw error;
    }
  }


  export const saveDisApprovedRequest  = async (payload) => {
      try {
      const response = await axios.post(SAVE_DISAPPROVED_REQUEST,payload);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching mutation approval data:", error);
      throw error;
    }
  }


  
  export const SearchMutationRequest  = async (payload) => {
      try {
      const response = await axios.post(SEARCH_MUTATION_REQUEST,payload);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching mutation approval data:", error);
      throw error;
    }
  }

    
  export const ShowDocumentsByOwnerID =async (OwnerID,UpdVersionID)=>{
      try {
        console.log(OwnerID,"idddd")
      const response = await axios.post(DOCUMENT_OWNERID_WISE, {OwnerID,UpdVersionID});

      console.log(response,"selcetd ownerid documnets")
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching mutation approval document data:", error);
      throw error;
    }
  }