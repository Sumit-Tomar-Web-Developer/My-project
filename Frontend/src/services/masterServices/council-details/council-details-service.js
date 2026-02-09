import axios from 'axios';

import {
  FETCH_COUNCIL_LIST,
  SAVE_AND_UPDATE_COUNCIL_DETAILS
} from '../../../constants/MasterConstants/counsil-detailsConstants/council-details-constants';

// Function to fetch council
export const getCouncilList = async () => {
  try {
    const response = await axios.get(FETCH_COUNCIL_LIST);

    console.log('Fetched council list:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching council list:', error);
    throw error;
  }
};

// Function to save and update council details
// export const saveAndUpdateCouncilDetails = async (councilData) => {
//   try {
//     const res = await axios.post(SAVE_AND_UPDATE_COUNCIL_DETAILS, councilData);
//     const message = res.data.message;
//     const status = res.status;
//     console.log(message, status, res.data);
//     return { message, status, res };
//   } catch (error) {
//     console.error('Error saving and updating council details:', error);
//     throw error;
//   }
// };
// Function to save and update council details
// export const saveAndUpdateCouncilDetails = async (formData) => {
//   try {
//     const res = await axios.post(SAVE_AND_UPDATE_COUNCIL_DETAILS, formData, {
//       headers: { "Content-Type": "multipart/form-data" }, // always same
//     });

//     const message = res.data.message;
//     const status = res.status;
//     console.log(message, status, res.data);

//     return { message, status, res };
//   } catch (error) {
//     console.error("Error saving and updating council details:", error);
//     throw error;
//   }
// };
// Function to save and update council details
export const saveAndUpdateCouncilDetails = async (councilData) => {
  try {
    const isFormData = councilData instanceof FormData;
    console.log("📤 Sending data to API...");
    
    if (isFormData) {
      // log FormData keys and values
      for (let pair of councilData.entries()) {
        console.log("FormData:", pair[0], pair[1]);
      }
    } else {
      console.log("JSON Data:", councilData);
    }

    const res = await axios.post(SAVE_AND_UPDATE_COUNCIL_DETAILS, councilData, {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" } 
        : { "Content-Type": "application/json" },
    });

    console.log("✅ Response received from API:", res.data);

    const message = res.data.message;
    const status = res.status;

    return { message, status, res };
  } catch (error) {
    console.error("❌ Error saving and updating council details:", error);
    throw error;
  }
};
