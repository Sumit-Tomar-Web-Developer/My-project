import axios from 'axios';
import { FETCH_RENTER_MUTATION_DETAILS, SAVE_RENTER_MUTATION_DETAILS } from 'constants/AssessmentConstants/renterMutationConstants';

// Function to get renter mutation data by OwnerID
export const getRenterMutationDataByOwnerID = async (ownerId) => {
  console.log(ownerId);
  try {
    const response = await axios.post(`${FETCH_RENTER_MUTATION_DETAILS}`, {
      OwnerID: ownerId
    });
    console.log(response.data, 'getjointdata');
    return response.data;
  } catch (error) {
    console.error('Error fetching renter mutation data:', error);
    throw error;
  }
};

// Function to save renter mutation information
export const saveRenterMutationInfo = async (renterInfo) => {
  try {
    const response = await axios.post(`${SAVE_RENTER_MUTATION_DETAILS}`, {
      RenterInfo: renterInfo
    });
    console.log(response.data, 'postjointdata');
    return response.data;
  } catch (error) {
    console.error('Error saving renter mutation info:', error);
    throw error;
  }
};
