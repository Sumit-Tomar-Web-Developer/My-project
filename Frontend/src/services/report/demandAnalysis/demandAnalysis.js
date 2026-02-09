import axios from 'axios';
import { COMPARATATIVE_STATEMENT } from 'constants/Report/demandAnalysis/demandAnalysisConstant.js'; 


export const comparatativeStatement = async () => {
  try {
    console.log('before comparatativeStatement');
    const response = await axios.post(COMPARATATIVE_STATEMENT);
    console.log('after comparatativeStatement');
    console.log('axios comparatativeStatement', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error comparatativeStatement:', error.response?.data || error.message);
    throw error;
  }
};