import { GET_COLLECTION_APPROVAL_DATA,DELETE_COLLECTION_ENTRIES } from '../../../constants/Transaction/collectionApproval/collectionApprovalConstant';
import axios from 'axios';

export const fetchCollectionApprovalData = async (selectedData) => {
  try {
    console.log('before fetching CollectionApprovalData');
    const response = await axios.post(GET_COLLECTION_APPROVAL_DATA, selectedData);
    console.log('after fetching CollectionApprovalData');
    console.log('axios CollectionApprovalData', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching CollectionApprovalData:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteCollectionEntries = async (recordsToDelete,CancelReason) => {
  try {
    console.log('before deleteCollectionEntries');
    const response = await axios.post(DELETE_COLLECTION_ENTRIES, {recordsToDelete,CancelReason});
    console.log('after deleteCollectionEntries');
    console.log('axios deleteCollectionEntries', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error deleteCollectionEntries:', error.response?.data || error.message);
    throw error;
  }
};
