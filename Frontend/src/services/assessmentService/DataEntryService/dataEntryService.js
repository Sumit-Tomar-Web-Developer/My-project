import axios from 'axios';
import {
  GET_ALL_PROPERTY_TYPES,
  FETCH_PROPERTY_RANGE,
  GET_ALL_OWNER_IDS,
  GET_ALL_TABLE_DATA_BY_OWNER_ID,
  ROOM_SHAPES,
  FLOOR_NO_OF_ROOM,
  DELETE_PROPERTY_ENTRY,
  SAVE_DATA_ENTRY_PROPERTIES,
  GET_PROPERTY_IMAGE,
  SAVE_TAXABLE_NEW_PROPERTY,
  FETCH_ROOM_TYPE_MASTER,
  FETCH_TYPE_BASED_ON_DESCRIPTION,
  FETCH_GROUP_OF_ID,
  FETCH_TAP_SIZES,
  FETCH_VALUATION_DATA,
  GET_CONVERTED_IMG,
  FETCH_RETENTION_DATA,
  PDNID_CHECK,
  FSDID_CHECK,
  FSDMDID_CHECK,
  GET_PERMISSION_FOR_SUBMISSION,

  ADD_COMBINED_PROPERTIES,
  SAVE_LAST_ROW_APPEAL

} from 'constants/AssessmentConstants/dataEntryConstants';

export const fetchAllPropertyTypes = async () => {
  try {
    const response = await axios.get(GET_ALL_PROPERTY_TYPES);
    console.log('response:', response);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchPropertyRange = async () => {
  try {
    const response = await axios.get(FETCH_PROPERTY_RANGE);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const fetchAllOwnerIDs = async () => {
  try {
    const response = await axios.get(GET_ALL_OWNER_IDS);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchAllTableDataByOwnerID = async (ownerID, PDNId, FSDId, FSDMDId) => {
  try {
    const body = { OwnerID: ownerID };
    if (PDNId) body.PDNId = PDNId;
    if (FSDId) body.FSDId = FSDId;
    if (FSDMDId) body.FSDMDId = FSDMDId;

    const response = await axios.post(GET_ALL_TABLE_DATA_BY_OWNER_ID, body);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


// Function to upload files in Base64 format
// export const saveDataEntryProperties = async (propertyInfo,uploadedFiles) => {
//   try {
//     const formData = new FormData();

//     for (const [key, fileData] of Object.entries(uploadedFiles)) {
//       if (!fileData.base64) continue;

//       // Convert base64 to Blob
//       const byteCharacters = atob(fileData.base64.split(',')[1]);
//       const byteArrays = [];
//       for (let i = 0; i < byteCharacters.length; i++) {
//         byteArrays.push(byteCharacters.charCodeAt(i));
//       }
//       const blob = new Blob([new Uint8Array(byteArrays)], { type: fileData.type });

//       // Append file to FormData
//       formData.append(key, blob, fileData.name);
//     }

//     const response = await axios.post(SAVE_DATA_ENTRY_PROPERTIES, formData,propertyInfo, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });

//     return response.data;
//   } catch (error) {
//     console.error('Error uploading:', error);
//   }
// };
export const savePropertyInfo = async (propertyInfo, uploadedFiles) => {
  console.log(' save property info axios ');
  console.log(' save property info axios ', uploadedFiles);
  try {
    const formData = new FormData();

    formData.append('PropertyInfo', JSON.stringify(propertyInfo));

    for (const [key, fileData] of Object.entries(uploadedFiles)) {
      if (!fileData.base64) continue;

      // Convert base64 to Blob
      const byteCharacters = atob(fileData.base64.split(',')[1]);
      const byteArrays = [];
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
      }
      const blob = new Blob([new Uint8Array(byteArrays)], { type: fileData.type });

      // Append file to FormData
      formData.append(key, blob, fileData.name);
    }
    console.log(formData);
    const response = await axios.post(SAVE_DATA_ENTRY_PROPERTIES, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const message = response.data.message;
    const status = response.status;
    console.log(message, status, response, 'service response');
    return { message, status, response };
  } catch (error) {
    console.error('Error saving property information:', error);
    throw error.response ? error.response.data : new Error('Failed to save property information');
  }
};

export const deletePropertyEntry = async () => {
  try {
    const response = await axios.post(DELETE_PROPERTY_ENTRY, {});
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchFloorNoOfRoomList = async () => {
  try {
    const response = await axios.get(FLOOR_NO_OF_ROOM);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchAllRoomShapeNames = async () => {
  try {
    const response = await axios.get(ROOM_SHAPES);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getPropertyImage = async (ownerId) => {
  try {
    const response = await axios.post(GET_PROPERTY_IMAGE, {
      ownerId
    });
    console.log('Axior Image Response ', response);
    return response.data;
  } catch (error) {
    console.error('Axios error');
    throw error;
  }
};

export const insertNonTaxableTypeOfUse = async (payload) => {
  try {
    const response = await axios.post(SAVE_TAXABLE_NEW_PROPERTY, payload);
    return response.data;
  } catch (error) {
    console.error('taxable error');

    throw error;
  }
};

// room type hall....
export const fetchRoomTypeMaster = async () => {
  try {
    const response = await axios.get(FETCH_ROOM_TYPE_MASTER);
    return response.data;
  } catch (error) {
    console.error('Error fetching room type master:', error);
    throw error;
  }
};
// Type Based Dercription
export const fetchTypeDescByGroupId = async () => {
  try {
    const response = await axios.get(FETCH_TYPE_BASED_ON_DESCRIPTION);

    return response.data;
  } catch (error) {
    console.error('Error fetching type descriptions by group ID:', error);
    throw error;
  }
};
//group id type table
export const fetchGroupList = async () => {
  try {
    const response = await axios.get(FETCH_GROUP_OF_ID);
    return response.data;
  } catch (error) {
    console.error('Error fetching type descriptions by group ID:', error);
    throw error;
  }
};

export const fetchTapSizes = async () => {
  try {
    const response = await axios.get(FETCH_TAP_SIZES);
    return response.data;
  } catch (error) {
    console.error('Error fetching Tap sizes:', error);
    throw error;
  }
};
export const fetchValuationData = async (OwnerID) => {
  try {
    console.log('Fetching valuation data for OwnerID in axios:', OwnerID);
    const response = await axios.post(FETCH_VALUATION_DATA, { OwnerID });
    return response.data;
  } catch (error) {
    console.error('Error fetching valuation data:', error);
    throw error;
  }
};


export const fetchRetentionData = async (OwnerID) => {
  try {
    const response = await axios.post(FETCH_RETENTION_DATA, { OwnerID });
    return response.data;
  } catch (error) {
    console.error('Error fetching retention data:', error);
    throw error;
  }
};


export const addCombineProperties = async (IDs, selectedOwnerID) => {
  try {
    const response = await axios.post(ADD_COMBINED_PROPERTIES, {
      IDs,
      selectedOwnerID
    });
    return response;
  } catch (error) {
    console.error('Error combining properties:', error);
    throw error;
  }
}

export const checkPDNIdForGenerating = async (newId) => {
  try {
    const response = await axios.post(PDNID_CHECK, { newId })
    return response.data.message
  } catch (error) {
    console.log(error, 'error in generating PDNId in Axios')
  }

}
export const checkFSDIdForGenerating = async (newId) => {
  try {
    const response = await axios.post(FSDID_CHECK, { newId })
    return response.data.message
  } catch (error) {
    console.log(error, 'error in generating PDNId in Axios')
  }

}
export const checkFSDMDIdForGenerating = async (newId) => {
  try {
    const response = await axios.post(FSDMDID_CHECK, { newId })
    return response.data.message
  } catch (error) {
    console.log(error, 'error in generating PDNId in Axios')
  }

}
export const premissionCheckForSubmission = async () => {
  try {
    const response = await axios.get(GET_PERMISSION_FOR_SUBMISSION);
    return response;
  } catch (error) {
    console.error('Error fetching permission for submission:', error);
    throw error;
  }
};
export const convertPlanImg = async (planFile) => {

  return axios.post(GET_CONVERTED_IMG, {
    base64Image: planFile
  });
};
//amc
export const saveOwnerTaxChange = async ({ OwnerID, Year, CreatedBy }) => {
  try {
    const payload = {
      OwnerID,
      Year,
      CreatedBy
    };

    const response = await axios.post(SAVE_LAST_ROW_APPEAL, payload);
    return response.data; // { message, beforeRow, afterRow }
  } catch (error) {
    console.error('Error saving owner tax change:', error);
    throw error;
  }
};