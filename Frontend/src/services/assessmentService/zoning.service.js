import axios from 'axios';
import { Fetch_OWNERID_WISE_WARD, UPDATE_YEAR_WISE_ZONE, UPDATE_ZONE } from 'constants/AssessmentConstants/zoning.constant';

// Function to update zone
export const updateZone = async (zoneData) => {
  try {
    const res = await axios.post(UPDATE_ZONE, zoneData);
    const message = res.data.message;
    const status = res.status;
    console.log(message, status, res.data);
    return { message, status, res };
  } catch (error) {
    console.error('Error updating zone:', error);
    throw error;
  }
};

// Function to update year-wise zone
export const updateYearWiseZone = async (yearWiseZoneData) => {
  try {
    const res = await axios.post(UPDATE_YEAR_WISE_ZONE, yearWiseZoneData);
    const message = res.data.message;
    const status = res.status;
    console.log(message, status, res.data);
    return { message, status, res };

  } catch (error) {
    console.error('Error updating year-wise zone:', error);
    throw error;
  }
};
export const OwnerIdWiseWard = async (ward) => {
  try {
    const res = await axios.post(Fetch_OWNERID_WISE_WARD, ward);
    const message = res.data.message;
    const status = res.status;
    console.log(message, status, res.data);
    return { message, status, res };

  } catch (error) {
    console.error('Error updating year-wise zone:', error);
    throw error;
  }
};
