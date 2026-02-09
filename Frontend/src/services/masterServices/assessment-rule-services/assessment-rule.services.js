import { ADD_ASSESSMENT_RULES, GENERATE_ASSESSNO_NO, GET_ASSESSMENT_RULES } from '../../../constants/constants.js';
import axios from 'axios';

// Function to create a user
const SaveAssessmentRules = async (userData) => {
  try {
    const res = await axios.post(`${ADD_ASSESSMENT_RULES}`, userData);
    const message = res.data.message;
    const status = res.status;
    console.log(message, status, res.data);
    return { message, status, res };
  } catch (error) {
    console.error('Error in Adding Assessment Rules:', error);
    throw error;
  }
};

// Function to fetch council
export const getAssessmentData = async () => {
  try {
    const response = await axios.get(GET_ASSESSMENT_RULES);
    return response.data;
  } catch (error) {
    console.error('Error fetching Assessment Info:', error);
    throw error;
  }
};

// Function to create a user
const GenerateAssesmentNo = async () => {
  try {
    const res = await axios.get(`${GENERATE_ASSESSNO_NO}`);
    const message = res.data;
    const status = res.status;
    console.log(message, status, res.data, 'msg');
    return { message, status, res };
  } catch (error) {
    console.error('Error in generating Assessment  NPPrefix:', error);
    throw error;
  }
};

export { SaveAssessmentRules, GenerateAssesmentNo };
