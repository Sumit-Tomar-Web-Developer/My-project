import axios from 'axios';
import {
  ADD_UPDATE_ZONE_SECTION_MASTER,
  DELETE_ZONE_SECTION_MASTER,
  ZONE_SECTION_MASTER_LIST,
  ZONE_SECTION_DETAILS,
  ADD_ZONE_DETAILS
} from '../../../constants/MasterConstants/zone-section-master-constants/zone-section-master.constants';

export const fetchZoneSectionMasterList = async () => {
  try {
    const res = await axios.get(ZONE_SECTION_MASTER_LIST);
    return res;
  } catch (error) {
    console.error('Error Occurred in Fetching Zone Section Master Services');
    throw error;
  }
};

export const fetchZoneSectionDetailsList = async () => {
  try {
    const res = await axios.get(ZONE_SECTION_DETAILS);
    return res;
  } catch (error) {
    console.error('Error Occurred in Fetching Zone Section Details Services');
    throw error;
  }
};

export const postAddUpdateZoneSectionMasterList = async (zoneSectionMasterData) => {
  try {
    const res = await axios.post(ADD_UPDATE_ZONE_SECTION_MASTER, zoneSectionMasterData);
    const message = res.data.message;
    const status = res.status;
    return { message, status };
  } catch (error) {
    console.error('Error in Adding / Updating Zone Section Master List:', error);
    throw error;
  }
};

export const postAddZoneDetails = async (zoneDetails) => {
  console.log(zoneDetails,'in axios');
  try {
    const res = await axios.post(ADD_ZONE_DETAILS, zoneDetails);
    const message = res.data.message;
    const status = res.status;
    return { message, status };
  } catch (error) {
    console.error('Error in Adding Zone Details', error);
    throw error;
  }
};

export const deleteZoneSectionMasterList = async (zoneSectionMasterId) => {
  try {
    const res = await axios.delete(`${DELETE_ZONE_SECTION_MASTER}`, { data: zoneSectionMasterId });
    const message = res.data.message;
    const status = res.status;

    return { message, status };
  } catch (error) {
    console.error('Error in Fetching Zone Section Services', error);
    throw error;
  }
};
