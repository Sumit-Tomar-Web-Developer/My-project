import axios from 'axios';
import { JOINT_OWNER_SELECTED_LIST, MUTATION_TRANSFER_DETAILS , MUTATION_DETAILS_DATA_POST, MUTATION_DETAILS_UPDATED_DATA_POST, UPDATE_JOINT_OWNER_DETAIL_AND_PROPERTYMAST, UPLOAD_MUTATION_DOCUMENT, GET_NP_TITLE } from '../constants/constants';


const createNewOwnerDetails = async (newOwnerDetails) => {
  try {
      const response = await axios.post(`${MUTATION_DETAILS}`, newOwnerDetails);
      return response.data;
  } catch (error) {
      console.error('Error creating new Owner:', error);
      throw error;  
  }
};

const postOwnerID = async (OwnerID) => {
  try {
    const response = await axios.post(`${JOINT_OWNER_SELECTED_LIST}` , {OwnerID} );
    return response.data;
  } catch (error) {
    console.error('Error Sending data to backend:', error);
    throw error;
  }
};

const getJointOwnerSelectedList = async () => {
  try {
    const response = await axios.get(`${JOINT_OWNER_SELECTED_LIST}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching property and owner list:', error);
    throw error;
  }
};

const postMutationHistoryOwnerID = async (OwnerID) => {
  try {
    const response = await axios.post(`${MUTATION_TRANSFER_DETAILS}` , {OwnerID} );
    return response.data;
  } catch (error) {
    console.error('Error Sending data to backend mutation', error);
    throw error;
  }
};

const postMutationNewData = async (mutationData) => {
  try {
    const response = await axios.post(`${MUTATION_DETAILS_DATA_POST}` , {mutationData} );
    console.log(mutationData)
    return response.data;
  } catch (error) {
    console.error('Error Sending data to backend mutation', error);
    throw error;
  }
};

const postJointOwnerPropertymastDetails = async (mutationData) => {
  try {
    const response = await axios.post(`${UPDATE_JOINT_OWNER_DETAIL_AND_PROPERTYMAST}` , {mutationData} );
    console.log(mutationData)
    return response.data;
  } catch (error) {
    console.error('Error Sending data to backend mutation', error);
    throw error;
  }
};

const postMutationUpdatedData = async (fromData) => {
  try {
    const response = await axios.post(`${MUTATION_DETAILS_UPDATED_DATA_POST}` , {fromData} );
    console.log(fromData)
    return response.data;
  } catch (error) {
    console.error('Error Sending data to backend updated data', error);
    throw error;
  }
};
const uploadMutationDocument = async (formData) => {
  try {
    const response = await axios.post(UPLOAD_MUTATION_DOCUMENT, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
};


export const fetchNpTitle = async () => {
  try {
    const response = await axios.get(GET_NP_TITLE);
    return response.data; 
  } catch (error) {
    console.error("Error fetching NPTitle:", error);
    throw error;
  }
};


export { createNewOwnerDetails , postOwnerID , getJointOwnerSelectedList, postMutationHistoryOwnerID, postMutationNewData , postMutationUpdatedData, postJointOwnerPropertymastDetails ,uploadMutationDocument};
