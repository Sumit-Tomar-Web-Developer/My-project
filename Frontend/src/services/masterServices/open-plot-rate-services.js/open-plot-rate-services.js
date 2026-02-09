import axios from 'axios';
import {
  DELETE_OPEN_PLOT_RATE,
  GET_OPEN_PLOT_RATE_LIST,
  SAVE_AND_UPDATE_OPEN_PLOT_RATE
} from '../../../constants/MasterConstants/open-plot-rateConstants/open-plot-rate';

export const saveAndUpdateOpenPlotRate = async (data) => {
  try {
    const res = await axios.post(SAVE_AND_UPDATE_OPEN_PLOT_RATE, data);
    const message = res.data.message;
    const status = res.status;
    return { message, status, res };
  } catch (error) {
    throw new Error(`Error saving and updating open plot rate: ${error.message}`);
  }
};

export const getOpenPlotRateList = async () => {
  try {
    const response = await axios.get(GET_OPEN_PLOT_RATE_LIST);
    return response.data;
  } catch (error) {
    throw new Error(`Error getting open plot rate list: ${error.message}`);
  }
};

// export const deleteOpenPlotRate = async (ID) => {
//   if (!ID) {
//     throw new Error('ID cannot be null');
//   }

//   try {
//     const response = await axios.delete(`${DELETE_OPEN_PLOT_RATE}`, {
//       data: { ID: ID }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting open plot rate:', error);
//     if (error.response && error.response.data) {
//       throw new Error(error.response.data.message);
//     }
//     throw new Error('An error occurred while deleting the open plot rate');
//   }
// };
export const deleteOpenPlotRate = async (IDs) => {
  try {
    const res = await axios.post(DELETE_OPEN_PLOT_RATE, { IDs: IDs } );
    const message = res.data.message;
    const status = res.data.status;
    return { message, status, res };
  } catch (error) {
    console.error('Error deleting bank information', error);
    throw error;
  }
};