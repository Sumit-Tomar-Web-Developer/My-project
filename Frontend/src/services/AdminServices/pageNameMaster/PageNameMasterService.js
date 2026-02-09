import axios from 'axios';
import { ADD_NEW_PAGE, DELETE_PAGE_INFO, GET_PAGE_NAMES } from '../../../constants/AdminConstants/newPageNameConstants';

export const fetchPageNames = async () => {
  try {
    const response = await axios.get(GET_PAGE_NAMES);
    console.log(response, 'new pages list');
    return response.data;
  } catch (error) {
    console.error(error, 'Error in fetching page names.');
    throw error;
  }
};

export const savePageNames = async (data) => {
  try {
    const res = await axios.post(ADD_NEW_PAGE, { pageInfo: data });
    const message = res.data.message;
    const status = res.status;
    console.log(message, status, res.data);
    return { message, status, res };
  } catch (error) {
    console.error('Error saving and updating master:', error);
    throw error;
  }
};

export const deletePageInfo = async (IDs) => {
  try {
    const res = await axios.post(`${DELETE_PAGE_INFO}`, { IDs });
    console.log(res, 'delete');
    return res;
  } catch (error) {
    throw new Error('Failed to delete pages: ' + error.message);
  }
};
