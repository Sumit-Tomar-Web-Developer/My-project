import axios from "axios";
import { ZONE_LIST, ZONEWISE_WARD_LIST,PAYMENT_RESOURCE_LIST,SAVE_DISCOUNT_SLAB_ENTRIES } from 'constants/AdminConstants/discountSlabMasterConstant';

export const fetchZoneList = async () => {
    try {
    console.log('before fetching fetchZoneList');
    const response = await axios.post(ZONE_LIST);
    console.log('after fetching fetchZoneList');
    console.log('axios fetchZoneList', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchZoneList:', error.response?.data || error.message);
    throw error;
  } 
}

export const fetchZoneWiseWardList = async (zoneNo) => {
    try {
    console.log('before fetching fetchZoneWiseWardList');
    const response = await axios.post(ZONEWISE_WARD_LIST,{zoneNo});
    console.log('after fetching fetchZoneWiseWardList');
    console.log('axios fetchZoneWiseWardList', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchZoneWiseWardList:', error.response?.data || error.message);
    throw error;
  } 
}

export const fetchPaymentResourceList = async () => {
    try {
    console.log('before fetching fetchPaymentResourceList');
    const response = await axios.post(PAYMENT_RESOURCE_LIST);
    console.log('after fetching fetchPaymentResourceList');
    console.log('axios fetchPaymentResourceList', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchPaymentResourceList:', error.response?.data || error.message);
    throw error;
  } 
}

export const saveDiscountSlabEntries = async (discountData) => {
    try {
    console.log('before fetching saveDiscountSlabEntries');
    const response = await axios.post(SAVE_DISCOUNT_SLAB_ENTRIES,discountData);
    console.log('after fetching saveDiscountSlabEntries');
    console.log('axios saveDiscountSlabEntries', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching saveDiscountSlabEntries:', error.response?.data || error.message);
    throw error;
  } 
}