import axios from 'axios';
import {
  GET_LOCKED_UNLOCKED_PROPERTIES,
  LOCK_PROPERTIES_BY_OWNERID,
  UNLOCK_PROPERTIES_BY_OWNERID
} from '../../../constants/AdminConstants/LockPropertyConstants';

export const getLockedUnlockedProperties = async (wardNo, from, to) => {
  try {
    console.log(wardNo, from, to);
    const response = await axios.post(`${GET_LOCKED_UNLOCKED_PROPERTIES}`, { wardNo, fromPropertyNo: from, toPropertyNo: to });
    console.log(response.data, 'API Response');
    return response.data;
  } catch (error) {
    console.error('Error fetching property range:', error);
    throw error;
  }
};

// export const saveLockedProperties = async (ownerIds) => {
//   try {
//     const res = await axios.post(LOCK_PROPERTIES_BY_OWNERID, { ownerIds });
//     const message = res.data.message;
//     const status = res.status;
//     console.log(message, status, res.data);
//     return { message, status, res };
//   } catch (error) {
//     console.error('Error in saving lock status :', error);
//     throw error;
//   }
// };

// export const saveUnLockedProperties = async (ownerIds) => {
//   try {
//     const res = await axios.post(UNLOCK_PROPERTIES_BY_OWNERID, { ownerIds });
//     const message = res.data.message;
//     const status = res.status;
//     console.log(message, status, res.data);
//     return { message, status, res };
//   } catch (error) {
//     console.error('Error in saving lock status :', error);
//     throw error;
//   }
// };

export const saveLockedProperties = async ({ selectedWard, from, to, unLockedOwnerIds }) => {
  if (
    !selectedWard ||
    !from ||
    !to ||
    !Array.isArray(unLockedOwnerIds) ||
    unLockedOwnerIds.length === 0
  ) {
    throw new Error('Invalid input: selectedWard, selectedPropertyNoFrom, selectedPropertyNoTo, and unLockedOwnerIds are required.');
  }
  try {
    const res = await axios.post(LOCK_PROPERTIES_BY_OWNERID, {
      wardNo: selectedWard,
      fromPropertyNo: from,
      toPropertyNo: to,
      ownerIds: unLockedOwnerIds
    });

    console.log(res.data.message, res.status, res.data);

    return { data: res.data, status: res.status, message: res.data.message };
  } catch (error) {
    console.error('Error in saving locked properties:', error);
    throw error;
  }
};

export const saveUnLockedProperties = async ({ selectedWard, from, to, lockedOwnerIds }) => {
  if (!selectedWard || !from || !to || !Array.isArray(lockedOwnerIds) || lockedOwnerIds.length === 0) {
    throw new Error('Invalid input: wardNo, fromPropertyNo, toPropertyNo, and ownerIds are required.');
  }

  try {
    const res = await axios.post(UNLOCK_PROPERTIES_BY_OWNERID, {
      wardNo: selectedWard,
      fromPropertyNo: from,
      toPropertyNo: to,
      ownerIds: lockedOwnerIds
    });

    console.log(res.data.message, res.status, res.data);
    return { data: res.data, status: res.status, message: res.data.message };
  } catch (error) {
    console.error('Error in saving unlocked properties:', error);
    throw error;
  }
};
